export namespace GuluMicroserviceFileTypes {
  export interface MicroserviceName {
    File_SERVICE: 'fileService'
    REDIS_MIDDLEWARE: 'redisMiddleware'
  }
  export interface PrivateName {
    MINIO: 'minio'
    SET_MINIO_BUCKET_PUBLIC: 'setMinioBucketPublic'
  }
  export interface UploadFileByMicroserviceType {
    fieldname: string
    originalname: string
    encoding: string
    mimetype: string
    buffer: string
    size: number
  }
}
