import { Module, ValidationPipe } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
//读取env
import { ConfigModule } from '@nestjs/config'
import { APP_PIPE } from '@nestjs/core'
import { MyConfigModule } from './config/my-config.module'
import { MinioModule } from './minio/minio.module'
import { UploadModule } from './upload/upload.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.development', '.env.production'],
    }),
    MyConfigModule,
    UploadModule,
    MinioModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      //全局的管道验证DTO
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
