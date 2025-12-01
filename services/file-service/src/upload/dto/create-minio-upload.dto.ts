import { IsNotEmpty } from 'class-validator'

export class CreateMinioUploadDto {
  @IsNotEmpty()
  userId: string
  file: Express.Multer.File
}
