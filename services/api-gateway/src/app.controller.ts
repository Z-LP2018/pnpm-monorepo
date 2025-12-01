import { Controller, Get, Post } from '@nestjs/common'
import { DecoratorJumpAuth } from 'src/decorators/jump-auth'
import { Role } from 'src/decorators/role'
import { AppService } from './app.service'
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Role('admin')
  getHello() {
    return this.appService.getHello()
  }
  @DecoratorJumpAuth()
  @Post('test')
  test(): string {
    return this.appService.test()
  }
}
