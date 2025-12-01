// services/api-gateway/src/microservices/microservice-client.module.ts
import { Global, Module } from '@nestjs/common'
import { ClientsModule } from '@nestjs/microservices'
import { MICROSERVICE_CLIENTS, MyConfigService } from '../../config/my-config.service'

@Global()
@Module({
  imports: [
    //注册微服务
    ClientsModule.registerAsync([
      {
        inject: [MyConfigService],
        name: MICROSERVICE_CLIENTS.FILE_CONNECT,
        useFactory: (myConfigService: MyConfigService) => {
          console.log(`✅ 网关--->文件上传微服务连接成功`)
          return myConfigService.getMicroserviceConfig('FILE_CONNECT')
        },
      },
      {
        inject: [MyConfigService],
        name: MICROSERVICE_CLIENTS.REDIS_MIDDLEWARE,
        useFactory: (myConfigService: MyConfigService) => {
          console.log(`✅ 网关--->Redis微服务连接成功`)
          return myConfigService.getMicroserviceConfig('REDIS_MIDDLEWARE')
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class MicroserviceClientModule {}
