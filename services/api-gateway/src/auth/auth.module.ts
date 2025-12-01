import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { JwtGuardService } from 'src/auth/jwt-guard.service'
import { JwtStrategyService } from 'src/auth/jwt-strategy.service'
import { MyConfigService } from 'src/config/my-config.service'

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true, // ✅ 放在外层，编译时就能读取
      useFactory: (myConfigService: MyConfigService) => {
        return myConfigService.getJwtModuleConfig()
      },
      inject: [MyConfigService],
    }),
  ],
  providers: [JwtStrategyService, JwtGuardService],
  exports: [JwtGuardService],
})
export class AuthModule {}
