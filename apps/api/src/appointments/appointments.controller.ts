import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common'
import { AppointmentsService } from './appointments.service'
import { CreateAppointmentDto } from './dto/create-appointment.dto'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { TenantGuard } from '../common/guards/tenant.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { User } from '../database/entities/user.entity'

@Controller('appointments')
@UseGuards(JwtAuthGuard, TenantGuard)
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateAppointmentDto) {
    return this.appointmentsService.create(user.tenantId, dto)
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.appointmentsService.findAll(user.tenantId)
  }

  @Get(':id')
  findOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.appointmentsService.findOne(id, user.tenantId)
  }

  @Delete(':id')
  remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.appointmentsService.remove(id, user.tenantId)
  }
}
