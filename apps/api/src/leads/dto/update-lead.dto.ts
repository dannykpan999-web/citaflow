import { IsEnum, IsOptional, IsString } from 'class-validator'
import { LeadStatus } from '../../database/entities/lead.entity'

export class UpdateLeadDto {
  @IsEnum(LeadStatus)
  @IsOptional()
  status?: LeadStatus

  @IsString()
  @IsOptional()
  internalNotes?: string

  @IsString()
  @IsOptional()
  serviceInterest?: string

  @IsString()
  @IsOptional()
  name?: string
}
