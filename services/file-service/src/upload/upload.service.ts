import { PrismaService } from '@gulu/prisma'
import { Injectable } from '@nestjs/common'
import { MinioProxy } from 'src/minio/minio.proxy'
@Injectable()
export class UploadService {
  constructor(
    private readonly minioProxy: MinioProxy,
    private readonly prismaService: PrismaService
  ) {}
  async uploadFile(userId: string, file: Express.Multer.File) {
    const bucketName = `bucket-${userId}`
    await this.minioProxy.minioHasBucketOrCreate(bucketName)
    const fileUrl = await this.minioProxy.uploadFile(bucketName, file)
    await this.prismaService.file.create({
      data: {
        userId: userId,
        url: fileUrl,
        name: file.originalname,
      },
    })
    return fileUrl
  }
  async deleteFile(userId: string, fileUrl: string): Promise<any> {
    const bucketName = `bucket-${userId}`
    await this.minioProxy.deleteFile(bucketName, fileUrl)
    const file = await this.prismaService.file.findFirst({
      where: {
        url: fileUrl,
      },
    })
    if (!file) {
      return {
        data: null,
        message: '文件不存在',
      }
    } else {
      await this.prismaService.file.delete({
        where: {
          id: file?.id,
        },
      })
      return {
        data: null,
        message: '删除成功',
      }
    }
  }
  async deleteAll(userId: string): Promise<any> {
    const bucketName = `bucket-${userId}`
    await this.minioProxy.removeBucketWithContents(bucketName)
    const fileList = await this.prismaService.file.findMany({
      where: {
        userId: userId,
      },
    })
    for (const file of fileList) {
      await this.prismaService.file.delete({
        where: { id: file.id },
      })
    }
    return {
      data: null,
      message: '删除成功',
    }
  }
  async getFilesByUserId(userId: string): Promise<any> {
    const res = await this.prismaService.file.findMany({
      where: {
        userId: userId,
      },
    })
    const total = await this.prismaService.file.count({
      where: {
        userId: userId,
      },
    })
    return {
      list: res,
      total: total,
    }
  }
}
