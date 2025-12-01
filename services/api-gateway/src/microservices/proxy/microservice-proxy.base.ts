// services/api-gateway/src/microservices/base/microservice-proxy.base.ts
import { HttpException, HttpStatus } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { catchError, firstValueFrom, timeout } from 'rxjs'

export abstract class MicroserviceProxyBase {
  constructor(
    protected readonly client: ClientProxy,
    protected readonly defaultTimeout: number = 5000
  ) {}

  /**
   * 发送请求并等待响应
   */
  protected async send<T>(pattern: string, data: any = {}, timeoutMs?: number): Promise<T> {
    try {
      return await firstValueFrom(
        this.client.send<T>(pattern, data).pipe(
          timeout(timeoutMs || this.defaultTimeout),
          catchError(err => {
            console.error(`网关--->发送消息${pattern}`, err)
            throw err
          })
        )
      )
    } catch (error) {
      // 超时错误
      if (error.name === 'TimeoutError') {
        throw new HttpException(
          {
            statusCode: HttpStatus.REQUEST_TIMEOUT,
            message: `Service timeout for ${pattern}`,
            error: 'Request Timeout',
          },
          HttpStatus.REQUEST_TIMEOUT
        )
      }

      // RPC 异常（来自微服务）
      if (error.error && error.message) {
        throw new HttpException(
          {
            statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            message: error.message,
            error: error.error,
          },
          error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
        )
      }

      // 未知错误
      throw new HttpException(
        {
          statusCode: HttpStatus.SERVICE_UNAVAILABLE,
          message: 'Microservice unavailable',
          error: 'Service Unavailable',
        },
        HttpStatus.SERVICE_UNAVAILABLE
      )
    }
  }

  /**
   * 发送事件（不等待响应）
   */
  protected emit(pattern: string, data: any = {}): void {
    this.client.emit(pattern, data)
  }
}
