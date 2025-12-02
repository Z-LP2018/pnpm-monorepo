import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NacosNamingClient, NacosConfigClient } from 'nacos'
import { networkInterfaces } from 'os'

@Injectable()
export class NacosService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(NacosService.name)
  private serviceName: string
  private nacosServer: string
  private namespace: string
  private groupName: string
  private port: string
  private ip: string
  private instanceId: string

  constructor(private readonly configService: ConfigService) {
    this.serviceName = this.configService.get('SERVICE_NAME') || ''
    this.nacosServer = this.configService.get('NACOS_SERVER') || ''
    this.namespace = this.configService.get('NACOS_NAMESPACE') || ''
    this.groupName = this.configService.get('NACOS_GROUP') || 'DEFAULT_GROUP'
    this.port = this.configService.get('PORT') || '3000'
    this.ip = this.getLocalIP()
    this.instanceId = `${this.ip}#${this.port}#${Date.now()}`
  }

  private namingClient: NacosNamingClient
  private configClient: NacosConfigClient

  async onModuleInit() {
    if (!this.serviceName || !this.nacosServer) {
      this.logger.warn('Nacos 配置不完整，跳过服务注册')
      return
    }

    try {
      this.logger.log(`正在连接 Nacos 服务器: ${this.nacosServer}`)

      // 初始化命名客户端（服务注册发现）
      this.namingClient = new NacosNamingClient({
        logger: console as any,
        serverList: this.nacosServer,
        namespace: this.namespace,
      })

      // 初始化配置客户端
      this.configClient = new NacosConfigClient({
        serverAddr: this.nacosServer,
        namespace: this.namespace,
      })

      await this.registerService()
      this.logger.log(`服务注册成功: ${this.serviceName} (${this.ip}:${this.port})`)
    } catch (error) {
      this.logger.error(`Nacos 初始化失败: ${error.message}`, error.stack)
    }
  }

  async onModuleDestroy() {
    if (this.namingClient) {
      this.logger.log(`正在注销服务: ${this.serviceName}`)
      await this.deregisterService()
    }
    if (this.configClient) {
      this.configClient.close()
    }
  }
  // 注册服务
  async registerService() {
    await this.namingClient.ready()

    const instanceConfig = {
      ip: this.ip,
      port: Number(this.port),
      instanceId: this.instanceId,
      weight: 1,
      healthy: true,
      enabled: true,
      ephemeral: true,
    }

    await this.namingClient.registerInstance(this.serviceName, instanceConfig, this.groupName)
  }
  // 注销服务
  async deregisterService() {
    if (!this.namingClient) {
      return
    }
    try {
      await this.namingClient.deregisterInstance(
        this.serviceName,
        {
          ip: this.ip,
          port: Number(this.port),
          instanceId: this.instanceId,
          healthy: true,
          enabled: true,
        },
        this.groupName
      )
      this.logger.log(`服务注销成功: ${this.serviceName}`)
    } catch (error) {
      this.logger.error(`服务注销失败: ${error.message}`, error.stack)
    }
  }

  // 服务发现
  async getService(serviceName: string, groupName?: string) {
    if (!this.namingClient) {
      throw new Error('Nacos 命名客户端未初始化')
    }

    const targetGroup = groupName || this.groupName
    try {
      const instances = await this.namingClient.getAllInstances(serviceName, targetGroup)

      if (!instances || instances.length === 0) {
        throw new Error(`服务未找到: ${serviceName} (组: ${targetGroup})`)
      }

      // 过滤健康的实例
      const healthyInstances = instances.filter(instance => instance.healthy)

      if (healthyInstances.length === 0) {
        throw new Error(`没有健康的服务实例: ${serviceName} (组: ${targetGroup})`)
      }

      // 简单轮询负载均衡
      const instance = healthyInstances[Math.floor(Math.random() * healthyInstances.length)]
      const serviceUrl = `http://${instance.ip}:${instance.port}`
      this.logger.debug(`服务发现成功: ${serviceName} -> ${serviceUrl}`)
      return serviceUrl
    } catch (error) {
      this.logger.error(`服务发现失败: ${serviceName}`, error.stack)
      throw error
    }
  }

  // 获取配置
  async getConfig(dataId: string, group?: string): Promise<string> {
    if (!this.configClient) {
      throw new Error('Nacos 配置客户端未初始化')
    }

    const targetGroup = group || this.groupName
    try {
      const content = await this.configClient.getConfig(dataId, targetGroup)
      this.logger.debug(`获取配置成功: ${dataId} (组: ${targetGroup})`)
      return content
    } catch (error) {
      this.logger.error(`获取配置失败: ${dataId}`, error.stack)
      throw error
    }
  }

  // 监听配置变化
  subscribe(dataId: string, callback: (content: string) => void, group?: string) {
    if (!this.configClient) {
      throw new Error('Nacos 配置客户端未初始化')
    }

    const targetGroup = group || this.groupName
    this.configClient.subscribe({ dataId, group: targetGroup }, (content: string) => {
      this.logger.log(`配置更新: ${dataId} (组: ${targetGroup})`)
      callback(content)
    })
  }

  // 发布配置
  async publishConfig(dataId: string, content: string, group?: string): Promise<boolean> {
    if (!this.configClient) {
      throw new Error('Nacos 配置客户端未初始化')
    }

    const targetGroup = group || this.groupName
    try {
      const result = await this.configClient.publishSingle(dataId, targetGroup, content)
      this.logger.log(`发布配置${result ? '成功' : '失败'}: ${dataId} (组: ${targetGroup})`)
      return result
    } catch (error) {
      this.logger.error(`发布配置失败: ${dataId}`, error.stack)
      throw error
    }
  }

  // 删除配置
  async removeConfig(dataId: string, group?: string): Promise<boolean> {
    if (!this.configClient) {
      throw new Error('Nacos 配置客户端未初始化')
    }

    const targetGroup = group || this.groupName
    try {
      const result = await this.configClient.remove(dataId, targetGroup)
      this.logger.log(`删除配置${result ? '成功' : '失败'}: ${dataId} (组: ${targetGroup})`)
      return result
    } catch (error) {
      this.logger.error(`删除配置失败: ${dataId}`, error.stack)
      throw error
    }
  }

  // 获取本地IP
  private getLocalIP(): string {
    const nets = networkInterfaces()

    for (const name of Object.keys(nets)) {
      const netList = nets[name]
      if (!netList) continue

      for (const net of netList) {
        if (net.family === 'IPv4' && !net.internal) {
          return net.address
        }
      }
    }
    this.logger.warn('未找到本地 IP，使用 127.0.0.1')
    return '127.0.0.1'
  }
}
