import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator'

export class UpsertServiceDto {
  @IsString()
  name: string

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number

  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  @IsOptional()
  promo?: string

  @IsBoolean()
  @IsOptional()
  requiresHuman?: boolean

  @IsBoolean()
  @IsOptional()
  active?: boolean
}
