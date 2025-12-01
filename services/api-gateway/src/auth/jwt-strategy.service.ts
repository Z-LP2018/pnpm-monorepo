import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-jwt'
import { MyConfigService } from 'src/config/my-config.service'

@Injectable()
export class JwtStrategyService extends PassportStrategy(Strategy) {
  constructor(private readonly myConfigService: MyConfigService) {
    super(myConfigService.getJwtStrategyConfig())
  }

  // 验证通过后会把这个对象挂到 request.user
  async validate(payload: any) {
    return {
      userId: payload.userId,
      username: payload.username,
      roles: payload.roles || [],
    }
  }
}
declare module 'express' {
  interface Request {
    user: {
      userId: number | string
      username: string
      roles: string[]
    } | null
  }
}
