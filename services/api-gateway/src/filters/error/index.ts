import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common'
import { Response } from 'express'

class ValidatorError {
  response: {
    message: string[]
    error: string
    statusCode: number
  }
  status: number
  options: any
}

export class MyError {
  private message: string
  private code: HttpStatus
  constructor(message: string, code: HttpStatus = HttpStatus.BAD_REQUEST) {
    this.message = message
    this.code = code
  }
  getMessage(): string {
    return this.message
  }
  getCode(): HttpStatus {
    return this.code
  }
}
@Catch(MyError)
export class MyErrorFilter implements ExceptionFilter {
  catch(exception: MyError, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>()
    res.send({
      statusCode: exception.getCode(),
      message: exception.getMessage(),
      data: null,
      status: 'failed',
    })
  }
}
@Catch(Error)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: ValidatorError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    let message = 'error'
    if (exception.response?.message) {
      message = exception.response?.message[0]
    } else {
      message = (exception as any).message
    }
    response.send({
      statusCode: exception.status || HttpStatus.BAD_REQUEST,
      message: message,
      data: null,
      status: 'failed',
    })
  }
}
