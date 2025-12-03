import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Transport } from '@nestjs/microservices'
export enum MicroserviceName {
  File_SERVICE = 'fileService',
  REDIS_MIDDLEWARE = 'redisMiddleware',
}
export enum PrivateName {
  MINIO = 'minio',
  SET_BUCKET_PUBLIC = 'setBucketPublic',
  MYSQL_CONFIG = 'mysqlUrl',
}
@Injectable()
export class MyConfigService {
  constructor(private readonly configService: ConfigService) {}
  //微服务配置
  getMicroservicesConfig() {
    return {
      [MicroserviceName.File_SERVICE]: {
        transport: Transport.TCP,
        options: {
          port: this.configService.get('FILE_SERVICE_PORT'),
        },
      },
      [MicroserviceName.REDIS_MIDDLEWARE]: {
        transport: Transport.REDIS,
        options: {
          port: this.configService.get('REDIS_MIDDLEWARE_PORT'),
          db: this.configService.get('REDIS_MIDDLEWARE_DB'),
          password: this.configService.get('REDIS_MIDDLEWARE_PASSWORD'),
        },
      },
    }
  }
  //minio配置
  getMinioConfig() {
    return {
      [PrivateName.MINIO]: {
        endPoint: this.configService.get('MINIO_END_POINT'),
        port: this.configService.get('MINIO_PORT'),
        useSSL: this.configService.get('MINIO_USE_SSL') === 'true',
        accessKey: this.configService.get('MINIO_ACCESS_KEY'),
        secretKey: this.configService.get('MINIO_SECRET_KEY'),
      },
      [PrivateName.SET_BUCKET_PUBLIC]: bucketName => {
        return {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: { AWS: ['*'] },
              Action: ['s3:GetBucketLocation', 's3:ListBucket'],
              Resource: [`arn:aws:s3:::${bucketName}`],
            },
            {
              Effect: 'Allow',
              Principal: { AWS: ['*'] },
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${bucketName}/*`],
            },
          ],
        }
      },
    }
  }
  getMysqlConfig() {
    return {
      [PrivateName.MYSQL_CONFIG]: {
        datasourceUrl: this.configService.get('MYSQL_CONFIG_URL'),
      },
    }
  }
}
