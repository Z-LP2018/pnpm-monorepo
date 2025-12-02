import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as Minio from 'minio'
import { MyConfigService, PrivateName } from 'src/config/my-config.service'

@Injectable()
export class MinioProxy {
  constructor(
    @Inject(PrivateName.MINIO) private readonly minioClient: Minio.Client,
    private readonly myConfigService: MyConfigService,
    private readonly configService: ConfigService
  ) {}
  //设置桶为公共访问
  private async setPublicPolicy(bucketName: string): Promise<void> {
    const policy = this.myConfigService.getMinioConfig()[PrivateName.SET_BUCKET_PUBLIC](bucketName)
    await this.minioClient.setBucketPolicy(bucketName, JSON.stringify(policy))
  }
  // 删除桶中的所有对象
  private async removeAllObjects(bucketName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const objectsList: string[] = []
      const objectsStream = this.minioClient.listObjects(bucketName, '', true)
      objectsStream.on('data', obj => {
        if (obj.name) {
          objectsList.push(obj.name)
        }
      })
      objectsStream.on('error', err => {
        reject(err)
      })
      objectsStream.on('end', async () => {
        if (objectsList.length === 0) {
          resolve()
          return
        }
        try {
          // 批量删除对象
          await this.minioClient.removeObjects(bucketName, objectsList)
          resolve()
        } catch (err) {
          reject(err)
        }
      })
    })
  }
  // 删除非空桶
  async removeBucketWithContents(bucketName: string): Promise<void> {
    const exists = await this.minioClient.bucketExists(bucketName)
    if (!exists) {
      return
    }
    // 1. 删除桶中的所有对象
    await this.removeAllObjects(bucketName)
    // 2. 删除桶
    await this.minioClient.removeBucket(bucketName)
  }
  //创建桶
  async minioHasBucketOrCreate(bucketName: string) {
    const res = await this.minioClient.bucketExists(bucketName)
    if (!res) {
      await this.minioClient.makeBucket(bucketName)
      await this.setPublicPolicy(bucketName)
    }
  }
  //上传文件
  async uploadFile(bucketName: string, file: Express.Multer.File) {
    const fileName = `${Date.now()}-${file.originalname}`
    await this.minioClient.putObject(bucketName, fileName, file.buffer, file.size, {
      'Content-Type': file.mimetype,
    })
    const fileUrl = `http://${this.configService.get('MINIO_END_POINT')}:${this.configService.get('MINIO_PORT')}/${bucketName}/${fileName}`
    return fileUrl
  }
  //删除文件
  async deleteFile(bucketName: string, url: string) {
    const fileName = url.split('/').pop() || ''
    await this.minioClient.removeObject(bucketName, fileName)
  }
}
