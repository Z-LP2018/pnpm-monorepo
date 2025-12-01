import { SetMetadata } from '@nestjs/common'

export const DecoratorJumpAuth = () => SetMetadata('jump-auth', true)
