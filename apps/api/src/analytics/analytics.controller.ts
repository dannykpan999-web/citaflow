import { Controller, Get, UseGuards } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { TenantGuard } from '../common/guards/tenant.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { User } from '../database/entities/user.entity'
import { Lead, LeadStatus } from '../database/entities/lead.entity'
import { Message, MessageDirection } from '../database/entities/message.entity'
import { Appointment } from '../database/entities/appointment.entity'

@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(
    @InjectRepository(Lead) private leadRepo: Repository<Lead>,
    @InjectRepository(Message) private messageRepo: Repository<Message>,
    @InjectRepository(Appointment) private appointmentRepo: Repository<Appointment>,
  ) {}

  @Get('kpis')
  async getKpis(@CurrentUser() user: User) {
    const tenantId = user.tenantId
    const now = new Date()
    const startOfToday = new Date(now); startOfToday.setHours(0, 0, 0, 0)
    const startOf30Days = new Date(now); startOf30Days.setDate(now.getDate() - 30)
    const startOfPrev30 = new Date(now); startOfPrev30.setDate(now.getDate() - 60)

    const [allLeads, todayLeads, monthLeads, prevMonthLeads, appointments, messages] = await Promise.all([
      this.leadRepo.find({ where: { tenantId } }),
      this.leadRepo.createQueryBuilder('l').where('l.tenantId = :tenantId AND l.createdAt >= :d', { tenantId, d: startOfToday }).getCount(),
      this.leadRepo.createQueryBuilder('l').where('l.tenantId = :tenantId AND l.createdAt >= :d', { tenantId, d: startOf30Days }).getCount(),
      this.leadRepo.createQueryBuilder('l').where('l.tenantId = :tenantId AND l.createdAt >= :d AND l.createdAt < :e', { tenantId, d: startOfPrev30, e: startOf30Days }).getCount(),
      this.appointmentRepo.find({ where: { tenantId } }),
      this.messageRepo.createQueryBuilder('m')
        .innerJoin('m.lead', 'l')
        .where('l.tenantId = :tenantId', { tenantId })
        .andWhere('m.direction = :dir', { dir: MessageDirection.OUTBOUND })
        .andWhere('m.sentAt >= :d', { d: startOf30Days })
        .getCount(),
    ])

    const byStatus: Record<string, number> = {}
    for (const s of Object.values(LeadStatus)) byStatus[s] = 0
    for (const l of allLeads) byStatus[l.status]++

    const converted = (byStatus[LeadStatus.APPOINTMENT_GENERATED] || 0) + (byStatus[LeadStatus.CLOSED] || 0)
    const conversionRate = allLeads.length > 0 ? Math.round((converted / allLeads.length) * 100) : 0
    const prevConversionRate = prevMonthLeads > 0 ? Math.round((converted / prevMonthLeads) * 100) : 0

    const upcomingAppts = appointments.filter(a => new Date(a.scheduledAt) >= now).length

    return {
      totalLeads: allLeads.length,
      newToday: todayLeads,
      newThisMonth: monthLeads,
      newPrevMonth: prevMonthLeads,
      conversionRate,
      prevConversionRate,
      byStatus,
      totalAppointments: appointments.length,
      upcomingAppointments: upcomingAppts,
      messagesSent: messages,
      humanControl: byStatus[LeadStatus.HUMAN_CONTROL] || 0,
    }
  }

  @Get('chart')
  async getChart(@CurrentUser() user: User) {
    const tenantId = user.tenantId
    const days: { label: string; leads: number; appointments: number }[] = []

    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i); d.setHours(0, 0, 0, 0)
      const next = new Date(d); next.setDate(d.getDate() + 1)

      const [leads, appointments] = await Promise.all([
        this.leadRepo.createQueryBuilder('l')
          .where('l.tenantId = :tenantId AND l.createdAt >= :d AND l.createdAt < :n', { tenantId, d, n: next })
          .getCount(),
        this.appointmentRepo.createQueryBuilder('a')
          .where('a.tenantId = :tenantId AND a.createdAt >= :d AND a.createdAt < :n', { tenantId, d, n: next })
          .getCount(),
      ])

      days.push({
        label: d.toLocaleDateString('es-MX', { weekday: 'short' }),
        leads,
        appointments,
      })
    }

    return days
  }
}
