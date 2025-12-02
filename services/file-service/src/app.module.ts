import { Module, ValidationPipe } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
//读取env
import { ConfigModule } from '@nestjs/config'
import { APP_PIPE } from '@nestjs/core'
import { MyConfigModule } from './config/my-config.module'
import { MinioModule } from './minio/minio.module'
import { UploadModule } from './upload/upload.module'
import { PrismaModule } from '@gulu/prisma'
import { MyConfigService, PrivateName } from './config/my-config.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.development', '.env.production'],
    }),
    MyConfigModule,
    UploadModule,
    MinioModule,
    PrismaModule.forRootAsync({
      isGlobal: true,
      useFactory: (configService: MyConfigService) => {
        const data = configService.getMysqlConfig()[PrivateName.MYSQL_CONFIG]
        return { ...data }
      },
      inject: [MyConfigService],
    }),
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
