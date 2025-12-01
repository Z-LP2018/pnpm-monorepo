import { PartialType } from '@nestjs/mapped-types'
import { CreateMinioUploadDto } from './create-minio-upload.dto'

export class UpdateMinioUploadDto extends PartialType(CreateMinioUploadDto) {}
