import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Lead, LeadStatus } from '../database/entities/lead.entity'
import { Message, MessageDirection, MessageStatus, MessageType } from '../database/entities/message.entity'

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead) private leadRepo: Repository<Lead>,
    @InjectRepository(Message) private messageRepo: Repository<Message>,
  ) {}

  async findOrCreate(tenantId: string, phone: string, name?: string): Promise<{ lead: Lead; isNew: boolean }> {
    let lead = await this.leadRepo.findOne({ where: { tenantId, phone } })
    if (lead) return { lead, isNew: false }

    lead = await this.leadRepo.save(
      this.leadRepo.create({ tenantId, phone, name, status: LeadStatus.NEW, botActive: true }),
    )
    return { lead, isNew: true }
  }

  async findById(id: string, tenantId: string): Promise<Lead | null> {
    return this.leadRepo.findOne({ where: { id, tenantId } })
  }

  async updateStatus(id: string, tenantId: string, status: LeadStatus): Promise<void> {
    await this.leadRepo.update({ id, tenantId }, { status })
  }

  async pauseBot(id: string, tenantId: string, userId: string): Promise<void> {
    await this.leadRepo.update({ id, tenantId }, {
      botActive: false,
      status: LeadStatus.HUMAN_CONTROL,
      assignedToUserId: userId,
    })
  }

  async resumeBot(id: string, tenantId: string): Promise<void> {
    await this.leadRepo.update({ id, tenantId }, {
      botActive: true,
      status: LeadStatus.IN_CONVERSATION,
      assignedToUserId: null,
    })
  }

  async saveMessage(
    leadId: string,
    direction: MessageDirection,
    body: string,
    opts: { isAutomated?: boolean; waMessageId?: string; type?: MessageType } = {},
  ): Promise<Message> {
    return this.messageRepo.save(
      this.messageRepo.create({
        leadId,
        direction,
        body,
        type: opts.type ?? MessageType.TEXT,
        isAutomated: opts.isAutomated ?? false,
        waMessageId: opts.waMessageId,
      }),
    )
  }

  async getMessages(leadId: string): Promise<Message[]> {
    return this.messageRepo.find({
      where: { leadId },
      order: { sentAt: 'ASC' },
    })
  }

  async updateMessageStatus(waMessageId: string, status: MessageStatus): Promise<void> {
    await this.messageRepo.update({ waMessageId }, { status })
  }

  async findAll(tenantId: string, status?: LeadStatus): Promise<Lead[]> {
    const where: any = { tenantId }
    if (status) where.status = status
    return this.leadRepo.find({ where, order: { updatedAt: 'DESC' } })
  }
}
