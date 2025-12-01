import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { UploadService } from './upload.service'
@Controller()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  @MessagePattern('upload.create')
  async uploadFile(@Payload() data: { userId: string; file: any }) {
    // 将 base64 字符串转换回 Buffer
    const file: Express.Multer.File = {
      fieldname: data.file.fieldname,
      originalname: data.file.originalname,
      encoding: data.file.encoding,
      mimetype: data.file.mimetype,
      buffer: Buffer.from(data.file.buffer, 'base64'), // 从 base64 转换回 Buffer
      size: data.file.size,
    } as Express.Multer.File
    return await this.uploadService.uploadFile(data.userId, file)
  }
  @MessagePattern('upload.delete')
  async deleteFile(@Payload() data: { userId: string; fileUrl: string }) {
    return await this.uploadService.deleteFile(data.userId, data.fileUrl)
  }
  @MessagePattern('upload.deleteAll')
  async deleteAll(@Payload() data: { userId: string }) {
    return await this.uploadService.deleteAll(data.userId)
  }
}
