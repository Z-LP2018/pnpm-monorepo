import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { WebscoketService } from './webscoket/webscoket.service'
@Injectable()
export class AppService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly webscoketService: WebscoketService
  ) {}
  async getHello() {
    this.webscoketService.test()
    return 'hello'
  }
  test(): any {
    const token = this.jwtService.sign({
      userId: 1,
      username: 'admin',
      roles: ['admin'],
    })
    return token
  }
}
