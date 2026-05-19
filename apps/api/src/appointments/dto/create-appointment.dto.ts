import { IsString, IsDateString, IsOptional } from 'class-validator'

export class CreateAppointmentDto {
  @IsString()
  leadId: string

  @IsDateString()
  scheduledAt: string

  @IsOptional()
  @IsString()
  service?: string
}
