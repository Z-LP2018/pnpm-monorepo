import { Module, ValidationPipe } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
//读取env
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
//全局过滤器
import { ErrorFilter, MyErrorFilter } from 'src/filters/error'
//全局拦截器
import { FormatInterceptor } from 'src/interceptors/format/index'
//守卫-全局是否校验jwt
import { GuardValidateJwtGuard } from 'src/guards/validate-jwt'
//配置抽离
import { MyConfigModule } from 'src/config/my-config.module'
//认证授权模块
import { GuardValidateRoleGuard } from 'src/guards/validate-role'
import { MicroserviceClientModule } from 'src/microservices/client/microservice-client.module'
import { MicroserviceProxyModule } from 'src/microservices/proxy/microservice-proxy.module'
import { AuthModule } from './auth/auth.module'
import { UploadModule } from './upload/upload.module'
import { NacosModule } from './nacos/nacos.module'

@Module({
  imports: [
    //读取env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.development', '.env.production'],
    }),
    AuthModule,
    MyConfigModule,
    //微服务
    MicroserviceClientModule,
    MicroserviceProxyModule,
    //上传模块
    UploadModule,
    NacosModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      //全局的管道验证DTO
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      //全局的MyError异常过滤器
      provide: APP_FILTER,
      useClass: MyErrorFilter,
    },
    {
      //全局的异常过滤器
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
    {
      //全局的拦截器
      provide: APP_INTERCEPTOR,
      useClass: FormatInterceptor,
    },
    {
      //全局的是否校验jwt
      provide: APP_GUARD,
      useClass: GuardValidateJwtGuard,
    },
    {
      //全局的是否校验角色
      provide: APP_GUARD,
      useClass: GuardValidateRoleGuard,
    },
  ],
})
export class AppModule {}
