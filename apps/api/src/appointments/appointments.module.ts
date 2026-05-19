import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Reflector } from '@nestjs/core'
import { AppointmentsController } from './appointments.controller'
import { AppointmentsService } from './appointments.service'
import { TenantGuard } from '../common/guards/tenant.guard'
import { WhatsappModule } from '../whatsapp/whatsapp.module'
import { Appointment } from '../database/entities/appointment.entity'
import { Lead } from '../database/entities/lead.entity'
import { Tenant } from '../database/entities/tenant.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, Lead, Tenant]),
    WhatsappModule,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService, TenantGuard, Reflector],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
