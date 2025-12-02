export namespace GuluRequestTypes {
  export enum HttpErrorCode {
    SUCCESS = 200,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
  }
  export interface HttpBaseResponse<T = any> {
    data: T
    code: number
    msg: string
  }
  export interface QueueItem<T> {
    config: T
    resolve: (value: any) => void
    reject: (reason?: any) => void
  }
  export type Environment = 'development' | 'production'
}
