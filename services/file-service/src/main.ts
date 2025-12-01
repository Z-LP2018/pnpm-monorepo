import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
//读取env
import { ConfigService } from '@nestjs/config'
import { NestExpressApplication } from '@nestjs/platform-express'
import { MyConfigService } from 'src/config/my-config.service'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const configService = app.get(ConfigService)

  //静态资源
  app.useStaticAssets('public')
  //跨域
  app.enableCors()

  // 启动多个微服务监听器（服务器端，监听来自网关或其他服务的连接）
  const myConfigService = app.get(MyConfigService)
  const microserviceConfigs = myConfigService.getMicroservicesConfig()
  for (const microserviceKey in microserviceConfigs) {
    const config = microserviceConfigs[microserviceKey]
    app.connectMicroservice(config)
    console.log(`✅ 文件服务--->向外提供 ${config.options.port} 端口`)
  }
  await app.startAllMicroservices()
  //监听HTTP端口
  const port = configService.get('PORT')
  await app.listen(port)
  console.log(`✅ 文件服务器运行在 http://127.0.0.1:${port}`)
}
bootstrap()
