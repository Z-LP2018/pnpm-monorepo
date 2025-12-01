import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { JwtGuardService } from 'src/auth/jwt-guard.service'
import { MyError } from 'src/filters/error'

@Injectable()
export class GuardValidateJwtGuard implements CanActivate {
  constructor(
    private readonly jwtGuardService: JwtGuardService,
    private readonly reflector: Reflector
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>()
    const jumpAuth = this.reflector.getAllAndOverride('jump-auth', [
      context.getClass(),
      context.getHandler(),
    ])
    if (jumpAuth) {
      return true
    } else {
      const token = req.headers.authorization as string
      if (!token) {
        throw new MyError('请先登录', HttpStatus.UNAUTHORIZED) //
      }
      try {
        await this.jwtGuardService.canActivate(context)
      } catch (error) {
        const message = error.message || '登录过期，请重新登陆'
        throw new MyError(message, HttpStatus.UNAUTHORIZED) //
      }
      return true
    }
  }
}
