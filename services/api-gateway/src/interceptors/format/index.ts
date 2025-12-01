import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import dayjs from 'dayjs'
import { map, Observable } from 'rxjs'

export class BaseReturn<T> {
  data: T | null = null
  message: string
  statusCode = HttpStatus.OK
  date_time = dayjs().format('YYYY-MM-DD HH:mm:ss')
  constructor(data: T, message: string = '') {
    this.data = data
    this.message = message
  }
}
@Injectable()
export class FormatInterceptor implements NestInterceptor {
  name = 'formatInterceptor'
  private readonly logger = new Logger(FormatInterceptor.name)
  @Inject()
  private configService: ConfigService
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: { data: any; message: string }) => {
        let res: BaseReturn<any>
        if (data.data) {
          //data被包了一层，也就是在data中会有data和message
          res = new BaseReturn(data.data, data.message)
        } else {
          res = new BaseReturn(data)
        }
        if (this.configService.get('LOG_RES')) {
          this.logger.log(res)
        }
        return res
      })
    )
  }
}
