import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator'
import { TemplateType } from '../../database/entities/message-template.entity'

export class UpsertTemplateDto {
  @IsEnum(TemplateType)
  type: TemplateType

  @IsString()
  body: string

  @IsBoolean()
  @IsOptional()
  active?: boolean
}
