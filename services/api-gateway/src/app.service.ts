import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
@Injectable()
export class AppService {
  constructor(private readonly jwtService: JwtService) {}
  async getHello() {
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
