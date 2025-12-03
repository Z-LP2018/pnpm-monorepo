import { Controller } from '@nestjs/common'
import { MessageService } from './message.service'
import { MessagePattern, Payload } from '@nestjs/microservices'

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @MessagePattern('message.getMessagesByUserId')
  async getMessagesByUserId(@Payload() data: { userId: string }) {
    return await this.messageService.getMessagesByUserId(data.userId)
  }
}
