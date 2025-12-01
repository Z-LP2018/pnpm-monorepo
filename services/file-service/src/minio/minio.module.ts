import { Global, Module } from '@nestjs/common'
import * as Minio from 'minio'
import { MyConfigService, PrivateName } from '../config/my-config.service'
import { MinioProxy } from './minio.proxy'
@Global()
@Module({
  providers: [
    {
      provide: PrivateName.MINIO,
      inject: [MyConfigService],
      useFactory: (configService: MyConfigService) => {
        const minioConfig = configService.getMinioConfig()[PrivateName.MINIO]
        return new Minio.Client(minioConfig)
      },
    },
    MinioProxy,
  ],
  exports: [MinioProxy],
})
export class MinioModule {}
