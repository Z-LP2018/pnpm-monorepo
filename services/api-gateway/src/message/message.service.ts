import { Injectable } from '@nestjs/common'
import { MessageServiceProxy } from 'src/microservices/proxy/message-service.proxy'

@Injectable()
export class MessageService {
  constructor(private readonly messageServiceProxy: MessageServiceProxy) {}
  async getMessagesByUserId(userId: string) {
    return await this.messageServiceProxy.getMessagesByUserId(userId)
  }
}
