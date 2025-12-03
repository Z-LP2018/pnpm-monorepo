import { Module } from '@nestjs/common'
import { MessageController } from './message.controller'
import { MessageService } from './message.service'
import { MicroserviceProxyModule } from 'src/microservices/proxy/microservice-proxy.module'

@Module({
  imports: [MicroserviceProxyModule],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
