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

  async findAllPaginated(
    tenantId: string,
    filters: { status?: LeadStatus; search?: string },
    pagination: { page: number; limit: number },
  ): Promise<{ data: Lead[]; total: number; page: number; limit: number }> {
    const { page, limit } = pagination
    const qb = this.leadRepo.createQueryBuilder('lead')
      .where('lead.tenantId = :tenantId', { tenantId })
      .orderBy('lead.updatedAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    if (filters.status) qb.andWhere('lead.status = :status', { status: filters.status })
    if (filters.search) {
      qb.andWhere('(lead.name ILIKE :q OR lead.phone ILIKE :q OR lead.serviceInterest ILIKE :q)', {
        q: `%${filters.search}%`,
      })
    }

    const [data, total] = await qb.getManyAndCount()
    return { data, total, page, limit }
  }

  async updateLead(id: string, tenantId: string, fields: Partial<Lead>): Promise<Lead> {
    await this.leadRepo.update({ id, tenantId }, fields)
    return this.leadRepo.findOne({ where: { id, tenantId } })
  }

  async deleteLead(id: string, tenantId: string): Promise<void> {
    await this.leadRepo.delete({ id, tenantId })
  }

  async getStats(tenantId: string): Promise<{
    total: number
    byStatus: Record<string, number>
    newToday: number
    conversionRate: number
  }> {
    const leads = await this.leadRepo.find({ where: { tenantId } })
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const byStatus: Record<string, number> = {}
    for (const s of Object.values(LeadStatus)) byStatus[s] = 0
    for (const l of leads) byStatus[l.status] = (byStatus[l.status] || 0) + 1

    const newToday = leads.filter(l => new Date(l.createdAt) >= today).length
    const converted = byStatus[LeadStatus.APPOINTMENT_GENERATED] + byStatus[LeadStatus.CLOSED]
    const conversionRate = leads.length > 0 ? Math.round((converted / leads.length) * 100) : 0

    return { total: leads.length, byStatus, newToday, conversionRate }
  }
}
