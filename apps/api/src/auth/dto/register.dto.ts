import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator'
import { UserRole } from '../../database/entities/user.entity'

export class RegisterDto {
  @IsString()
  name: string

  @IsEmail()
  email: string

  @IsString()
  @MinLength(8)
  password: string

  @IsString()
  tenantId: string

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole
}
