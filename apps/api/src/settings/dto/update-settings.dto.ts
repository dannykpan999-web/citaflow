import { IsString, IsOptional, IsObject, IsNumber, Min, Max } from 'class-validator'

export class UpdateSettingsDto {
  @IsString()
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  city?: string

  @IsString()
  @IsOptional()
  workingHours?: string

  @IsString()
  @IsOptional()
  agendaLink?: string

  @IsString()
  @IsOptional()
  welcomeMessage?: string

  @IsString()
  @IsOptional()
  whatsappPhoneNumberId?: string

  @IsString()
  @IsOptional()
  whatsappAccessToken?: string

  @IsObject()
  @IsOptional()
  followUpTimings?: {
    followUp1Hours: number
    followUp2Hours: number
    followUp3Hours: number
  }
}
