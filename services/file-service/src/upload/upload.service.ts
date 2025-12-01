import { Injectable } from '@nestjs/common'
import { MinioProxy } from 'src/minio/minio.proxy'
@Injectable()
export class UploadService {
  constructor(private readonly minioProxy: MinioProxy) {}
  async uploadFile(userId: string, file: Express.Multer.File) {
    const bucketName = `bucket-${userId}`
    await this.minioProxy.minioHasBucketOrCreate(bucketName)
    const fileUrl = await this.minioProxy.uploadFile(bucketName, file)
    return fileUrl
  }
  async deleteFile(userId: string, fileUrl: string): Promise<boolean> {
    const bucketName = `bucket-${userId}`
    await this.minioProxy.deleteFile(bucketName, fileUrl)
    return true
  }
  async deleteAll(userId: string): Promise<boolean> {
    const bucketName = `bucket-${userId}`
    await this.minioProxy.removeBucketWithContents(bucketName)
    return true
  }
}
