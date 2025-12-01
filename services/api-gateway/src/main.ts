import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
//读取env
import { ConfigService } from '@nestjs/config'
import { NestExpressApplication } from '@nestjs/platform-express'
import path from 'path'
async function bootstrap() {
  //使用 Express
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  //获取env
  const configService = app.get(ConfigService)
  //静态资源
  app.useStaticAssets(path.join(__dirname, '..', 'public'), {
    prefix: '/public/',
  })
  //跨域
  app.enableCors()
  //监听端口
  const port = configService.get('PORT')
  const local = process.env.NODE_ENV === 'development' ? '127.0.0.1' : '0.0.0.0'
  await app.listen(port, local)
  console.log(`✅ 网关运行在 http://127.0.0.1:${port}`)
}
bootstrap()
