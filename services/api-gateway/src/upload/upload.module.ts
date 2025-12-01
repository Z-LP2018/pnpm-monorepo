import { Module } from '@nestjs/common'
import { MicroserviceProxyModule } from '../microservices/proxy/microservice-proxy.module'
import { UploadController } from './upload.controller'
import { UploadService } from './upload.service'

@Module({
  imports: [MicroserviceProxyModule],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
