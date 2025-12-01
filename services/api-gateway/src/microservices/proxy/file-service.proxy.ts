// services/api-gateway/src/microservices/proxies/file-service.proxy.ts
import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { MICROSERVICE_CLIENTS } from '../../config/my-config.service'
import { MicroserviceProxyBase } from './microservice-proxy.base'
@Injectable()
export class FileServiceProxy extends MicroserviceProxyBase {
  constructor(
    // @Inject(MICROSERVICE_CLIENTS.FILE_CONNECT)
    @Inject(MICROSERVICE_CLIENTS.REDIS_MIDDLEWARE)
    client: ClientProxy
  ) {
    super(client, 10000) // 文件服务超时 10s
  }
  async uploadFile(userId: string, file: Express.Multer.File): Promise<void> {
    // 将 Buffer 转换为 base64 字符串以便通过微服务传递
    const serializedFile = {
      fieldname: file.fieldname,
      originalname: file.originalname,
      encoding: file.encoding,
      mimetype: file.mimetype,
      buffer: file.buffer.toString('base64'),
      size: file.size,
    }
    return this.send('upload.create', { userId, file: serializedFile })
  }
  async deleteFile(userId: string, fileUrl: string): Promise<void> {
    return this.send('upload.delete', { userId, fileUrl })
  }
  async deleteAll(userId: string): Promise<void> {
    return this.send('upload.deleteAll', { userId })
  }
}
