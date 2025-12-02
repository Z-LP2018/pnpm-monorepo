import {
  BadRequestException,
  Controller,
  Delete,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import type { Request } from 'express'
import { UploadService } from './upload.service'
import { DecoratorJumpAuth } from 'src/decorators/jump-auth'
@DecoratorJumpAuth()
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    const userId = (req.body?.userId as string) || ''
    return this.uploadService.uploadFile(userId, file)
  }
  @Delete()
  async deleteFile(@Query('userId') userId: string, @Query('url') fileUrl: string) {
    if (!fileUrl) {
      throw new BadRequestException('文件URL不能为空')
    }
    return this.uploadService.deleteFile(userId, fileUrl)
  }
  @Delete('deleteAll')
  async deleteAll(@Query('userId') userId: string) {
    return this.uploadService.deleteAll(userId)
  }
}
