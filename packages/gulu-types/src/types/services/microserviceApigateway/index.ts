export namespace GuluMicroserviceApigatewayTypes {
  export interface MicroserviceConfig {
    transport: any
    options: Record<string, any>
    timeout: number
  }
  export interface MicroserviceClients {
    REDIS_MIDDLEWARE: 'redisMiddleware'
    FILE_CONNECT: 'fileConnect'
  }
  export type MicroserviceName = keyof MicroserviceClients
}
