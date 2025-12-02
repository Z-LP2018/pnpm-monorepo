import { Module, DynamicModule, Global, Provider } from '@nestjs/common'
import { PrismaService, PrismaServiceOptions } from './prisma.service'

export interface PrismaModuleOptions extends PrismaServiceOptions {
  isGlobal?: boolean
}

export interface PrismaModuleAsyncOptions {
  isGlobal?: boolean
  useFactory: (...args: any[]) => Promise<PrismaServiceOptions> | PrismaServiceOptions
  inject?: any[]
}

@Global()
@Module({})
export class PrismaModule {
  /**
   * 同步注册
   */
  static forRoot(options?: PrismaModuleOptions): DynamicModule {
    const providers: Provider[] = [
      {
        provide: PrismaService,
        useFactory: () => new PrismaService(options),
      },
    ]

    return {
      global: options?.isGlobal ?? true,
      module: PrismaModule,
      providers,
      exports: [PrismaService],
    }
  }

  /**
   * 异步注册
   */
  static forRootAsync(options: PrismaModuleAsyncOptions): DynamicModule {
    const providers: Provider[] = [
      {
        provide: 'PRISMA_MODULE_OPTIONS',
        useFactory: options.useFactory,
        inject: options.inject || [],
      },
      {
        provide: PrismaService,
        useFactory: (prismaOptions: PrismaServiceOptions) => {
          return new PrismaService(prismaOptions)
        },
        inject: ['PRISMA_MODULE_OPTIONS'],
      },
    ]

    return {
      global: options?.isGlobal ?? true,
      module: PrismaModule,
      providers,
      exports: [PrismaService],
    }
  }
}
