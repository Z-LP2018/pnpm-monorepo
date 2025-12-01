// services/api-gateway/src/microservices/proxies/file-service.proxy.ts
import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { MICROSERVICE_CLIENTS } from '../../config/my-config.service'
import { MicroserviceProxyBase } from './microservice-proxy.base'
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
export class FileServiceProxy extends MicroserviceProxyBase {
  constructor(
    // @Inject(MICROSERVICE_CLIENTS.FILE_CONNECT)
    @Inject(MICROSERVICE_CLIENTS.REDIS_MIDDLEWARE)
    client: ClientProxy
  ) {
    super(client, 10000) // 文件服务超时 10s
  }
  async uploadFile(data: any): Promise<UploadCredentials> {
    return this.send<UploadCredentials>('upload.create', { data })
  }
  async deleteFile(fileUrl: string): Promise<boolean> {
    return this.send<boolean>('upload.delete', { fileUrl })
  }
  async getFileInfo(fileUrl: string): Promise<FileInfo> {
    return this.send<FileInfo>('upload.getInfo', { fileUrl })
  }
  async batchDeleteFiles(fileUrls: string[]): Promise<{ success: number; failed: number }> {
    return this.send('upload.batchDelete', { fileUrls })
  }
}
