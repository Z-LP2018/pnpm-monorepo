export namespace GuluErrorTypes {
  export class ServiceValidatorError {
    response: {
      message: string[]
      error: string
      statusCode: number
    }
    status: number
    options: any
  }
  export class MyError<T> {
    private message: string
    private code: T
    constructor(message: string, code: T) {
      this.message = message
      this.code = code
    }
  }
  export class BaseReturn<T> {
    data: T | null = null
    message: string
    statusCode: number
    date_time: string
    constructor(data: T, message: string = '', statusCode: number, date_time: string) {
      this.data = data
      this.message = message
      this.statusCode = statusCode
      this.date_time = date_time
    }
  }
}
