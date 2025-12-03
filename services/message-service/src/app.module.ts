import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { MyConfigModule } from './config/my-config.module'
import { PrismaModule } from '@gulu/prisma'
import { MyConfigService, PrivateName } from './config/my-config.service'
import { MessageModule } from './message/message.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.development', '.env.production'],
    }),
    MyConfigModule,
    PrismaModule.forRootAsync({
      isGlobal: true,
      useFactory: (configService: MyConfigService) => {
        const data = configService.getMysqlConfig()[PrivateName.MYSQL_CONFIG]
        return { ...data }
      },
      inject: [MyConfigService],
    }),
    MessageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
