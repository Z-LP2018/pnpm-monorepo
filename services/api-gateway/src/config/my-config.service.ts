import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Transport } from '@nestjs/microservices'
import { ExtractJwt } from 'passport-jwt'

export const MICROSERVICE_CLIENTS = {
  REDIS_MIDDLEWARE: 'redisMiddleware',
  FILE_CONNECT: 'fileConnect',
} as const
export type MicroserviceName = keyof typeof MICROSERVICE_CLIENTS
@Injectable()
export class MyConfigService {
  constructor(private readonly configService: ConfigService) {}
  //jwt配置
  getJwtModuleConfig() {
    return {
      secret: this.configService.get('JWT_SECRET') || 'gulu',
      signOptions: { expiresIn: this.configService.get('JWT_TOKEN_EXPIRES_IN') || '15m' },
    }
  }
  //passport-jwt配置
  getJwtStrategyConfig() {
    return {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: this.configService.get('JWT_SECRET') || 'gulu',
    }
  }

  //微服务配置
  getMicroservicesConfig(): Record<MicroserviceName, any> {
    return {
      REDIS_MIDDLEWARE: {
        transport: Transport.REDIS,
        options: {
          port: this.configService.get('REDIS_MIDDLEWARE_PORT'),
          db: this.configService.get('REDIS_MIDDLEWARE_DB'),
          password: this.configService.get('REDIS_MIDDLEWARE_PASSWORD'),
          retryAttempts: 3,
          retryDelay: 5000,
        },
        timeout: 5000,
      },
      FILE_CONNECT: {
        transport: Transport.TCP,
        options: {
          port: this.configService.get('FILE_CONNECT_PORT'),
          retryAttempts: 3,
          retryDelay: 3000,
        },
        timeout: 3000,
      },
    }
  }
  // 单个服务配置
  getMicroserviceConfig(serviceName: MicroserviceName) {
    const configs = this.getMicroservicesConfig()
    const config = configs[serviceName]
    if (!config) {
      throw new Error(`网关--->没有配置连接 ${serviceName}`)
    }
    return config
  }
}
