import { Controller, Get, Param } from '@nestjs/common'
import { MessageService } from './message.service'

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}
  @Get(':userId')
  async getMessagesByUserId(@Param('userId') userId: string) {
    return this.messageService.getMessagesByUserId(userId)
  }
}
