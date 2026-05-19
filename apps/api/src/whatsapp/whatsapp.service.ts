import { Injectable, Logger } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bullmq'
import { InjectRepository } from '@nestjs/typeorm'
import { Queue } from 'bullmq'
import { Repository } from 'typeorm'
import { Tenant } from '../database/entities/tenant.entity'
import { User, UserRole } from '../database/entities/user.entity'
import { Service } from '../database/entities/service.entity'
import { LeadsService } from '../leads/leads.service'
import { WhatsappApiService } from './whatsapp-api.service'
import { AiService } from '../ai/ai.service'
import { EmailService } from '../email/email.service'
import { FollowUpJob, FollowUpType, FollowUpStatus } from '../database/entities/follow-up-job.entity'
import { TemplateType } from '../database/entities/message-template.entity'
import { MessageDirection } from '../database/entities/message.entity'
import { WHATSAPP_QUEUE } from './whatsapp.processor'

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name)

  constructor(
    @InjectQueue(WHATSAPP_QUEUE) private waQueue: Queue,
    @InjectRepository(Tenant) private tenantRepo: Repository<Tenant>,
    @InjectRepository(FollowUpJob) private followUpRepo: Repository<FollowUpJob>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Service) private serviceRepo: Repository<Service>,
    private leadsService: LeadsService,
    private waApi: WhatsappApiService,
    private aiService: AiService,
    private emailService: EmailService,
  ) {}

  async handleIncomingMessage(tenantId: string, from: string, messageBody: string, waMessageId: string) {
    const tenant = await this.tenantRepo.findOne({ where: { id: tenantId } })
    if (!tenant) return

    const { lead, isNew } = await this.leadsService.findOrCreate(tenantId, from)

    await this.leadsService.saveMessage(lead.id, MessageDirection.INBOUND, messageBody, { waMessageId })

    await this.waApi.markAsRead(tenant.whatsappPhoneNumberId, tenant.whatsappAccessToken, waMessageId)

    if (isNew) {
      await this.sendWelcomeFlow(tenant, lead.id, from)

      // Notify clinic owner of new lead (fire-and-forget)
      this.notifyOwner(tenant, from)
    } else if (lead.botActive) {
      await this.sendAiResponse(tenant, lead.id, from)
    }
  }

  private async sendAiResponse(tenant: Tenant, leadId: string, phone: string) {
    try {
      const [messages, services] = await Promise.all([
        this.leadsService.getMessages(leadId),
        this.serviceRepo.find({ where: { tenantId: tenant.id, active: true } }),
      ])

      const aiResponse = await this.aiService.generateWhatsAppResponse(
        tenant.name,
        services.map(s => s.name),
        tenant.agendaLink,
        messages,
      )

      if (!aiResponse) return

      await this.waApi.sendText(
        tenant.whatsappPhoneNumberId,
        tenant.whatsappAccessToken,
        phone,
        aiResponse,
      )

      await this.leadsService.saveMessage(leadId, MessageDirection.OUTBOUND, aiResponse, {
        isAutomated: true,
      })

      this.logger.log(`AI response sent to ${phone} for lead ${leadId}`)
    } catch (err) {
      this.logger.error(`AI response failed for lead ${leadId}: ${err}`)
    }
  }

  private async notifyOwner(tenant: Tenant, leadPhone: string) {
    try {
      const owner = await this.userRepo.findOne({
        where: { tenantId: tenant.id, role: UserRole.OWNER, active: true },
        select: ['email'],
      })
      if (owner?.email) {
        await this.emailService.sendNewLeadNotification(owner.email, tenant.name, leadPhone)
      }
    } catch (err) {
      this.logger.error(`Failed to notify owner of tenant ${tenant.id}: ${err}`)
    }
  }

  private readonly retryOpts = {
    attempts: 3,
    backoff: { type: 'exponential' as const, delay: 5000 },
    removeOnComplete: true,
    removeOnFail: false,
  }

  private async sendWelcomeFlow(tenant: Tenant, leadId: string, phone: string) {
    const base = { tenantId: tenant.id, leadId, phone, phoneNumberId: tenant.whatsappPhoneNumberId, accessToken: tenant.whatsappAccessToken }
    const timings = tenant.followUpTimings ?? { followUp1Hours: 24, followUp2Hours: 48, followUp3Hours: 72 }

    await this.waQueue.add('send', { ...base, templateType: TemplateType.WELCOME }, { ...this.retryOpts, delay: 0 })
    await this.waQueue.add('send', { ...base, templateType: TemplateType.SERVICE_INFO }, { ...this.retryOpts, delay: 3000 })
    await this.waQueue.add('send', { ...base, templateType: TemplateType.AGENDA_LINK }, { ...this.retryOpts, delay: 6000 })

    await this.scheduleFollowUp(tenant, leadId, phone, FollowUpType.FOLLOW_UP_1, timings.followUp1Hours)
    await this.scheduleFollowUp(tenant, leadId, phone, FollowUpType.FOLLOW_UP_2, timings.followUp2Hours)
    await this.scheduleFollowUp(tenant, leadId, phone, FollowUpType.SOFT_CLOSE, timings.followUp3Hours)
  }

  private async scheduleFollowUp(tenant: Tenant, leadId: string, phone: string, type: FollowUpType, delayHours: number) {
    const delayMs = delayHours * 60 * 60 * 1000
    const templateType = this.followUpTypeToTemplate(type)

    const followUpRecord = await this.followUpRepo.save(
      this.followUpRepo.create({
        leadId,
        tenantId: tenant.id,
        type,
        status: FollowUpStatus.PENDING,
        scheduledAt: new Date(Date.now() + delayMs),
      }),
    )

    const job = await this.waQueue.add(
      'send',
      {
        tenantId: tenant.id,
        leadId,
        phone,
        phoneNumberId: tenant.whatsappPhoneNumberId,
        accessToken: tenant.whatsappAccessToken,
        templateType,
        followUpJobId: followUpRecord.id,
      },
      { ...this.retryOpts, delay: delayMs },
    )

    await this.followUpRepo.update(followUpRecord.id, { bullJobId: String(job.id) })
  }

  async scheduleAppointmentReminders(
    tenant: Tenant,
    leadId: string,
    phone: string,
    appointmentAt: Date,
  ): Promise<void> {
    const now = Date.now()
    const apptMs = appointmentAt.getTime()

    const reminders: Array<{ type: FollowUpType; offsetMs: number }> = [
      { type: FollowUpType.REMINDER_24H, offsetMs: 24 * 60 * 60 * 1000 },
      { type: FollowUpType.REMINDER_2H,  offsetMs: 2  * 60 * 60 * 1000 },
    ]

    for (const { type, offsetMs } of reminders) {
      const fireAt = apptMs - offsetMs
      const delayMs = fireAt - now
      if (delayMs <= 0) continue // appointment too soon

      await this.scheduleFollowUp(tenant, leadId, phone, type, delayMs / (60 * 60 * 1000))
    }
  }

  async cancelFollowUps(leadId: string): Promise<void> {
    const jobs = await this.followUpRepo.find({
      where: { leadId, status: FollowUpStatus.PENDING },
    })

    for (const job of jobs) {
      if (job.bullJobId) {
        try {
          const bullJob = await this.waQueue.getJob(job.bullJobId)
          if (bullJob) await bullJob.remove()
        } catch {
          // job may have already executed
        }
      }
      await this.followUpRepo.update(job.id, { status: FollowUpStatus.CANCELLED })
    }
  }

  private followUpTypeToTemplate(type: FollowUpType): TemplateType {
    const map: Record<FollowUpType, TemplateType> = {
      [FollowUpType.FOLLOW_UP_1]: TemplateType.FOLLOW_UP_1,
      [FollowUpType.FOLLOW_UP_2]: TemplateType.FOLLOW_UP_2,
      [FollowUpType.SOFT_CLOSE]: TemplateType.SOFT_CLOSE,
      [FollowUpType.REMINDER_24H]: TemplateType.REMINDER_24H,
      [FollowUpType.REMINDER_2H]: TemplateType.REMINDER_2H,
    }
    return map[type]
  }
}
