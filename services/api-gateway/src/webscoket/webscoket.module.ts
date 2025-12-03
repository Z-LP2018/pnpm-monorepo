import { Global, Module } from '@nestjs/common'
import { WebscoketService } from './webscoket.service'
import { WebscoketGateway } from './webscoket.gateway'
import { MicroserviceProxyModule } from 'src/microservices/proxy/microservice-proxy.module'

@Global()
@Module({
  imports: [MicroserviceProxyModule],
  providers: [WebscoketGateway, WebscoketService],
  exports: [WebscoketService],
})
export class WebscoketModule {}
