import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import type { Request } from 'express'
import { UploadService } from './upload.service'

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    })
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    // 调试信息
    console.log('Content-Type:', req.headers['content-type'])
    console.log('Request body:', req.body)
    console.log('Request files:', (req as any).files)
    console.log('Uploaded file:', file)

    if (!file) {
      throw new BadRequestException(
        '文件上传失败：请确保使用 multipart/form-data 格式，字段名为 "file"'
      )
    }

    const userId = (req.body?.userId as string) || ''
    return this.uploadService.uploadFile(userId, file)
  }
  @Get('info')
  async getFileInfo(@Query('fileUrl') fileUrl: string) {
    if (!fileUrl) {
      throw new BadRequestException('文件URL不能为空')
    }
    return this.uploadService.getFileInfo(fileUrl)
  }
}
