import { Injectable } from '@nestjs/common'
import { FileServiceProxy } from '../microservices/proxy/file-service.proxy'

@Injectable()
export class UploadService {
  constructor(private readonly fileServiceProxy: FileServiceProxy) {}
  async uploadFile(userId: string, file: Express.Multer.File) {
    return await this.fileServiceProxy.uploadFile(userId, file)
  }
  async deleteFile(userId: string, fileUrl: string): Promise<void> {
    return await this.fileServiceProxy.deleteFile(userId, fileUrl)
  }
  async deleteAll(userId: string): Promise<void> {
    return await this.fileServiceProxy.deleteAll(userId)
  }
}
