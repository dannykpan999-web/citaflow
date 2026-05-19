import { IsString, IsOptional, MinLength } from 'class-validator'

export class UpdateProfileDto {
  @IsString() @IsOptional()
  name?: string

  @IsString() @IsOptional()
  clinicName?: string
}

export class ChangePasswordDto {
  @IsString()
  oldPassword: string

  @IsString() @MinLength(8)
  newPassword: string
}
