import { Injectable, Logger } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bullmq'
import { InjectRepository } from '@nestjs/typeorm'
import { Queue } from 'bullmq'
import { Repository } from 'typeorm'
import { Tenant } from '../database/entities/tenant.entity'
import { LeadsService } from '../leads/leads.service'
import { WhatsappApiService } from './whatsapp-api.service'
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
    private leadsService: LeadsService,
    private waApi: WhatsappApiService,
  ) {}

  async handleIncomingMessage(tenantId: string, from: string, messageBody: string, waMessageId: string) {
    const tenant = await this.tenantRepo.findOne({ where: { id: tenantId } })
    if (!tenant) return

    const { lead, isNew } = await this.leadsService.findOrCreate(tenantId, from)

    await this.leadsService.saveMessage(lead.id, MessageDirection.INBOUND, messageBody, { waMessageId })

    await this.waApi.markAsRead(tenant.whatsappPhoneNumberId, tenant.whatsappAccessToken, waMessageId)

    if (isNew) {
      await this.sendWelcomeFlow(tenant, lead.id, from)
    }
  }

  private async sendWelcomeFlow(tenant: Tenant, leadId: string, phone: string) {
    const base = { tenantId: tenant.id, leadId, phone, phoneNumberId: tenant.whatsappPhoneNumberId, accessToken: tenant.whatsappAccessToken }
    const timings = tenant.followUpTimings ?? { followUp1Hours: 24, followUp2Hours: 48, followUp3Hours: 72 }

    // Immediate welcome
    await this.waQueue.add('send', { ...base, templateType: TemplateType.WELCOME }, { delay: 0 })

    // Service info after 3 seconds
    await this.waQueue.add('send', { ...base, templateType: TemplateType.SERVICE_INFO }, { delay: 3000 })

    // Agenda link after 6 seconds
    await this.waQueue.add('send', { ...base, templateType: TemplateType.AGENDA_LINK }, { delay: 6000 })

    // Schedule follow-ups
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
      { delay: delayMs },
    )

    await this.followUpRepo.update(followUpRecord.id, { bullJobId: String(job.id) })
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
