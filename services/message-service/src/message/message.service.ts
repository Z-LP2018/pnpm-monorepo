import { Injectable } from '@nestjs/common'
import { PrismaService } from '@gulu/prisma'

@Injectable()
export class MessageService {
  constructor(private readonly prismaService: PrismaService) {}
  async getMessagesByUserId(userId: string) {
    console.log(userId, 'webscoket message')
  }
}
