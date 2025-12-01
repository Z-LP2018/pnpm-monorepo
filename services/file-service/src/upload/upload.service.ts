import { Injectable } from '@nestjs/common'
import { MinioProxy } from 'src/minio/minio.proxy'

export interface UploadCredentials {
  accessKeyId: string
  accessKeySecret: string
  securityToken: string
  bucket: string
  region: string
  expiration: number
  uploadUrl: string
}

export interface FileInfo {
  url: string
  filename: string
  size: number
  mimeType: string
  uploadedAt: string
}

@Injectable()
export class UploadService {
  constructor(private readonly minioProxy: MinioProxy) {}
  async uploadFile(userId: string, file: Express.Multer.File) {
    const bucketName = `bucket-${userId}`
    await this.minioProxy.minioHasBucketOrCreate(bucketName)
    const fileUrl = await this.minioProxy.uploadFile(bucketName, file)
    return fileUrl
  }
  async getUploadCredentials(fileType: string): Promise<UploadCredentials> {
    throw new Error('Method not implemented.')
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    // TODO: 实现删除文件的逻辑
    throw new Error('Method not implemented.')
  }

  async getFileInfo(fileUrl: string): Promise<FileInfo> {
    // TODO: 实现获取文件信息的逻辑
    throw new Error('Method not implemented.')
  }
  async batchDeleteFiles(fileUrls: string[]): Promise<{ success: number; failed: number }> {
    // TODO: 实现批量删除文件的逻辑
    throw new Error('Method not implemented.')
  }
}
