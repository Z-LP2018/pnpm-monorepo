import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { UploadService } from './upload.service'
@Controller()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  @MessagePattern('upload.create')
  async uploadFile(@Payload() data: { data: { userId: string; file: Express.Multer.File } }) {
    return this.uploadService.uploadFile(data.data.userId, data.data.file)
  }
  /**
   * 删除文件
   */
  @MessagePattern('upload.delete')
  async deleteFile(@Payload() data: { fileUrl: string }) {
    return this.uploadService.deleteFile(data.fileUrl)
  }

  /**
   * 获取文件信息
   */
  @MessagePattern('upload.getInfo')
  async getFileInfo(@Payload() data: { fileUrl: string }) {
    return this.uploadService.getFileInfo(data.fileUrl)
  }

  /**
   * 批量删除文件
   */
  @MessagePattern('upload.batchDelete')
  async batchDeleteFiles(@Payload() data: { fileUrls: string[] }) {
    return this.uploadService.batchDeleteFiles(data.fileUrls)
  }
}
