// services/api-gateway/src/microservices/microservice-proxy.module.ts
import { Module } from '@nestjs/common'
import { FileServiceProxy } from './file-service.proxy'
import { MessageServiceProxy } from './message-service.proxy'

@Module({
  providers: [FileServiceProxy, MessageServiceProxy],
  exports: [FileServiceProxy, MessageServiceProxy],
})
export class MicroserviceProxyModule {}
