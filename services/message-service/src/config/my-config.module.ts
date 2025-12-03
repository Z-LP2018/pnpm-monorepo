import { Global, Module } from '@nestjs/common'
import { MyConfigService } from './my-config.service'

@Global()
@Module({
  controllers: [],
  providers: [MyConfigService],
  exports: [MyConfigService],
})
export class MyConfigModule {}
