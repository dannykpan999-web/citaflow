import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { Job } from 'bullmq'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { WhatsappApiService } from './whatsapp-api.service'
import { LeadsService } from '../leads/leads.service'
import { TenantsService } from '../tenants/tenants.service'
import { FollowUpJob, FollowUpStatus, FollowUpType } from '../database/entities/follow-up-job.entity'
import { Lead } from '../database/entities/lead.entity'
import { MessageDirection } from '../database/entities/message.entity'
import { TemplateType } from '../database/entities/message-template.entity'

export const WHATSAPP_QUEUE = 'whatsapp-send'

export interface SendMessageJobData {
  tenantId: string
  leadId: string
  phone: string
  phoneNumberId: string
  accessToken: string
  templateType: TemplateType
  followUpJobId?: string
}

@Processor(WHATSAPP_QUEUE)
export class WhatsappProcessor extends WorkerHost {
  private readonly logger = new Logger(WhatsappProcessor.name)

  constructor(
    private waApi: WhatsappApiService,
    private leadsService: LeadsService,
    private tenantsService: TenantsService,
    @InjectRepository(FollowUpJob) private followUpRepo: Repository<FollowUpJob>,
    @InjectRepository(Lead) private leadRepo: Repository<Lead>,
  ) {
    super()
  }

  async process(job: Job<SendMessageJobData>): Promise<void> {
    const { tenantId, leadId, phone, phoneNumberId, accessToken, templateType, followUpJobId } = job.data

    const lead = await this.leadRepo.findOne({ where: { id: leadId } })
    if (!lead?.botActive) {
      this.logger.log(`Skipping job for lead ${leadId} — bot is paused`)
      if (followUpJobId) {
        await this.followUpRepo.update(followUpJobId, { status: FollowUpStatus.CANCELLED })
      }
      return
    }

    const body = await this.tenantsService.getTemplate(tenantId, templateType)
    const waMessageId = await this.waApi.sendText(phoneNumberId, accessToken, phone, body)

    await this.leadsService.saveMessage(leadId, MessageDirection.OUTBOUND, body, {
      isAutomated: true,
      waMessageId: waMessageId ?? undefined,
    })

    if (followUpJobId) {
      await this.followUpRepo.update(followUpJobId, {
        status: waMessageId ? FollowUpStatus.SENT : FollowUpStatus.FAILED,
      })
    }

    this.logger.log(`Sent ${templateType} to ${phone} — waId: ${waMessageId}`)
  }
}
