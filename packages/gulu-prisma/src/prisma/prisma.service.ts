import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
  type OnApplicationShutdown,
} from '@nestjs/common'
import { PrismaClient } from '.prisma/client'
import type { INestApplication } from '@nestjs/common'

export interface PrismaServiceOptions {
  datasourceUrl?: string
  logging?: boolean
  logQueries?: boolean
}

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy, OnApplicationShutdown
{
  private readonly logger = new Logger(PrismaService.name)

  constructor(options?: PrismaServiceOptions) {
    const logLevel: ('query' | 'info' | 'warn' | 'error')[] = options?.logging
      ? ['query', 'info', 'warn', 'error']
      : ['error']

    if (options?.datasourceUrl) {
      process.env.DATABASE_URL = options.datasourceUrl
    }

    super({
      log: logLevel,
      errorFormat: 'pretty',
    })

    if (options?.logQueries) {
      // @ts-ignore
      this.$on('query', (e: any) => {
        this.logger.debug(`Query: ${e.query}`)
        this.logger.debug(`Params: ${e.params}`)
        this.logger.debug(`Duration: ${e.duration}ms`)
      })
    }
  }

  async onModuleInit() {
    try {
      await this.$connect()
      this.logger.log('✅ Successfully connected to database')
    } catch (error) {
      this.logger.error('❌ Failed to connect to database', error)
      throw error
    }
  }

  async onModuleDestroy() {
    await this.$disconnect()
    this.logger.log('👋 Disconnected from database')
  }

  async onApplicationShutdown(signal?: string) {
    this.logger.log(`🛑 Application shutdown (${signal})`)
    await this.$disconnect()
  }

  async enableShutdownHooks(app: INestApplication) {
    // @ts-ignore
    this.$on('beforeExit', async () => {
      await app.close()
    })
  }

  /**
   * 健康检查
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`
      return true
    } catch (error) {
      this.logger.error('Health check failed', error)
      return false
    }
  }

  /**
   * 清理数据库（仅用于测试环境）
   */
  async cleanDatabase(): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('❌ Cannot clean database in production')
    }

    const models = Reflect.ownKeys(this).filter(
      key => typeof key === 'string' && key[0] !== '_' && key[0] !== '$'
    ) as string[]

    await this.$transaction(
      models.map(modelKey => {
        const model = (this as any)[modelKey]
        if (model && typeof model.deleteMany === 'function') {
          return model.deleteMany()
        }
        return Promise.resolve()
      })
    )

    this.logger.warn('🗑️  Database cleaned')
  }

  /**
   * 软删除辅助方法
   */
  async softDelete(model: string, id: string) {
    const modelInstance = (this as any)[model]
    if (!modelInstance) {
      throw new Error(`Model ${model} not found`)
    }

    return modelInstance.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  }

  /**
   * 恢复软删除
   */
  async restore(model: string, id: string) {
    const modelInstance = (this as any)[model]
    if (!modelInstance) {
      throw new Error(`Model ${model} not found`)
    }

    return modelInstance.update({
      where: { id },
      data: { deletedAt: null },
    })
  }
}
