import { Injectable } from '@nestjs/common'
import { FileInfo, FileServiceProxy } from '../microservices/proxy/file-service.proxy'

@Injectable()
export class UploadService {
  constructor(private readonly fileServiceProxy: FileServiceProxy) {}
  async uploadFile(userId: string, file: Express.Multer.File): Promise<any> {
    const res = await this.fileServiceProxy.uploadFile({ userId, file })
    return res
  }
  /**
   * 删除文件
   */
  async deleteFile(fileUrl: string): Promise<boolean> {
    return this.fileServiceProxy.deleteFile(fileUrl)
  }

  /**
   * 获取文件信息
   */
  async getFileInfo(fileUrl: string): Promise<FileInfo> {
    return this.fileServiceProxy.getFileInfo(fileUrl)
  }

  /**
   * 批量删除文件
   */
  async batchDeleteFiles(fileUrls: string[]): Promise<{ success: number; failed: number }> {
    return this.fileServiceProxy.batchDeleteFiles(fileUrls)
  }
}
