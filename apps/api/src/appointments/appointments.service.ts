import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Appointment } from '../database/entities/appointment.entity'
import { Lead } from '../database/entities/lead.entity'
import { Tenant } from '../database/entities/tenant.entity'
import { WhatsappService } from '../whatsapp/whatsapp.service'
import { CreateAppointmentDto } from './dto/create-appointment.dto'

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment) private apptRepo: Repository<Appointment>,
    @InjectRepository(Lead)        private leadRepo: Repository<Lead>,
    @InjectRepository(Tenant)      private tenantRepo: Repository<Tenant>,
    private whatsappService: WhatsappService,
  ) {}

  async create(tenantId: string, dto: CreateAppointmentDto): Promise<Appointment> {
    const lead = await this.leadRepo.findOne({ where: { id: dto.leadId, tenantId } })
    if (!lead) throw new NotFoundException('Lead not found')

    const scheduledAt = new Date(dto.scheduledAt)
    if (scheduledAt <= new Date()) throw new BadRequestException('Appointment must be in the future')

    const existing = await this.apptRepo.findOne({ where: { leadId: dto.leadId } })
    if (existing) {
      await this.apptRepo.update(existing.id, {
        scheduledAt,
        service: dto.service,
        reminder24hSent: false,
        reminder2hSent: false,
      })
      const updated = await this.apptRepo.findOne({ where: { id: existing.id } })

      await this.rescheduleReminders(tenantId, lead, updated!)
      return updated!
    }

    const appt = await this.apptRepo.save(
      this.apptRepo.create({ tenantId, leadId: dto.leadId, scheduledAt, service: dto.service }),
    )

    await this.rescheduleReminders(tenantId, lead, appt)
    return appt
  }

  async findAll(tenantId: string): Promise<Appointment[]> {
    return this.apptRepo.find({
      where: { tenantId },
      order: { scheduledAt: 'ASC' },
      relations: ['lead'],
    })
  }

  async findOne(id: string, tenantId: string): Promise<Appointment> {
    const appt = await this.apptRepo.findOne({ where: { id, tenantId }, relations: ['lead'] })
    if (!appt) throw new NotFoundException('Appointment not found')
    return appt
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const appt = await this.apptRepo.findOne({ where: { id, tenantId } })
    if (!appt) throw new NotFoundException('Appointment not found')
    await this.apptRepo.remove(appt)
  }

  private async rescheduleReminders(tenantId: string, lead: Lead, appt: Appointment): Promise<void> {
    const tenant = await this.tenantRepo.findOne({ where: { id: tenantId } })
    if (!tenant || !lead.phone) return

    await this.whatsappService.scheduleAppointmentReminders(
      tenant,
      lead.id,
      lead.phone,
      appt.scheduledAt,
    )
  }
}
