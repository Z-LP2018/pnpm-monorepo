// services/api-gateway/src/microservices/microservice-proxy.module.ts
import { Module } from '@nestjs/common'
import { FileServiceProxy } from './file-service.proxy'

@Module({
  providers: [FileServiceProxy],
  exports: [FileServiceProxy],
})
export class MicroserviceProxyModule {}
