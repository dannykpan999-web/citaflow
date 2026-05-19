import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Reflector } from '@nestjs/core'
import { AnalyticsController } from './analytics.controller'
import { TenantGuard } from '../common/guards/tenant.guard'
import { Lead } from '../database/entities/lead.entity'
import { Message } from '../database/entities/message.entity'
import { Appointment } from '../database/entities/appointment.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Lead, Message, Appointment])],
  controllers: [AnalyticsController],
  providers: [TenantGuard, Reflector],
})
export class AnalyticsModule {}
