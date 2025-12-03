import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Transport } from '@nestjs/microservices'
export enum MicroserviceName {
  MESSAGE_SERVICE = 'messageService',
  REDIS_MIDDLEWARE = 'redisMiddleware',
}
export enum PrivateName {
  MYSQL_CONFIG = 'mysqlUrl',
}
@Injectable()
export class MyConfigService {
  constructor(private readonly configService: ConfigService) {}
  //微服务配置
  getMicroservicesConfig() {
    return {
      [MicroserviceName.MESSAGE_SERVICE]: {
        transport: Transport.TCP,
        options: {
          port: this.configService.get('FILE_SERVICE_PORT'),
        },
      },
      [MicroserviceName.REDIS_MIDDLEWARE]: {
        transport: Transport.REDIS,
        options: {
          port: this.configService.get('REDIS_MIDDLEWARE_PORT'),
          db: this.configService.get('REDIS_MIDDLEWARE_DB'),
          password: this.configService.get('REDIS_MIDDLEWARE_PASSWORD'),
        },
      },
    }
  }
  getMysqlConfig() {
    return {
      [PrivateName.MYSQL_CONFIG]: {
        datasourceUrl: this.configService.get('MYSQL_CONFIG_URL'),
      },
    }
  }
}
