import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server } from 'socket.io'
import { MessageServiceProxy } from 'src/microservices/proxy/message-service.proxy'

@WebSocketGateway()
export class WebscoketGateway {
  @WebSocketServer()
  readonly server: Server

  constructor(private readonly messageServiceProxy: MessageServiceProxy) {}

  @SubscribeMessage('test')
  create(@MessageBody() createWebscoketDto) {
    return {
      event: 'test',
      data: '测试成功',
    }
  }
  @SubscribeMessage('message')
  async handleMessage(@MessageBody() data: any) {
    const jsonData = JSON.parse(data)
    const { type, payload } = jsonData
    await this.messageServiceProxy.getMessagesByUserId(payload.userId)
    this.server.emit('message', {
      event: 'message',
      data: '成功',
    })
  }
  postMessage(event: string, message: any) {
    this.server.emit(event, message)
  }
}
