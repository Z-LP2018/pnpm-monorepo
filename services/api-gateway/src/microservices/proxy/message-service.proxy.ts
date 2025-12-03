// services/api-gateway/src/microservices/proxies/file-service.proxy.ts
import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { MICROSERVICE_CLIENTS } from '../../config/my-config.service'
import { MicroserviceProxyBase } from './microservice-proxy.base'
@Injectable()
export class MessageServiceProxy extends MicroserviceProxyBase {
  constructor(
    // @Inject(MICROSERVICE_CLIENTS.MESSAGE_CONNECT)
    @Inject(MICROSERVICE_CLIENTS.REDIS_MIDDLEWARE)
    client: ClientProxy
  ) {
    super(client, 10000) // 文件服务超时 10s
  }
  async getMessagesByUserId(userId: string): Promise<void> {
    return this.emit('message.getMessagesByUserId', { userId })
  }
}
