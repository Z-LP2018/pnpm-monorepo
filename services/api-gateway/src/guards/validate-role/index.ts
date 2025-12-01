import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { Observable } from 'rxjs'

@Injectable()
export class GuardValidateRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<Request>()
    const requiredRoles = this.reflector.getAllAndOverride('role', [
      context.getClass(),
      context.getHandler(),
    ]) as string[]
    if (requiredRoles && requiredRoles.length > 0) {
      const user = req.user
      if (!user) {
        return false
      } else {
        return requiredRoles.every(role => user.roles.includes(role))
      }
    } else {
      return true
    }
  }
}
