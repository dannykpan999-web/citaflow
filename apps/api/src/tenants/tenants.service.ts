import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Tenant, TenantStatus } from '../database/entities/tenant.entity'
import { MessageTemplate } from '../database/entities/message-template.entity'
import { TemplateType } from '../database/entities/message-template.entity'

const DEFAULT_TEMPLATES: Record<TemplateType, string> = {
  [TemplateType.WELCOME]:
    '¡Hola! 👋 Gracias por escribirnos. Soy el asistente de {{business_name}}. ¿En qué te puedo ayudar hoy?',
  [TemplateType.SERVICE_INFO]:
    'Te comparto información sobre nuestros servicios:\n\n{{services_list}}\n\n¿Te gustaría agendar una cita?',
  [TemplateType.AGENDA_LINK]:
    '¡Perfecto! Puedes agendar tu cita aquí 👇\n📅 {{agenda_link}}\n\nElige el horario que más te convenga.',
  [TemplateType.FOLLOW_UP_1]:
    'Hola {{lead_name}} 😊 Quería saber si pudiste revisar la información que te enviamos. ¿Tienes alguna pregunta o te gustaría agendar?',
  [TemplateType.FOLLOW_UP_2]:
    'Hola de nuevo {{lead_name}} 👋 Solo quería asegurarme de que no te quedó ninguna duda. Estamos aquí para ayudarte cuando lo necesites.',
  [TemplateType.SOFT_CLOSE]:
    'Hola {{lead_name}}, entendemos que quizás no es el momento ideal. Si en algún momento te interesa agendar, aquí estaremos. ¡Que tengas un excelente día! 🌟',
  [TemplateType.REMINDER_24H]:
    '🔔 Recordatorio: Tienes una cita mañana en {{business_name}}.\n📅 {{appointment_date}} a las {{appointment_time}}\n\nSi necesitas cancelar o reprogramar, escríbenos.',
  [TemplateType.REMINDER_2H]:
    '⏰ Tu cita en {{business_name}} es en 2 horas.\n📅 Hoy a las {{appointment_time}}\n\n¡Te esperamos!',
}

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant) private tenantRepo: Repository<Tenant>,
    @InjectRepository(MessageTemplate) private templateRepo: Repository<MessageTemplate>,
  ) {}

  async findById(id: string): Promise<Tenant> {
    const tenant = await this.tenantRepo.findOne({ where: { id } })
    if (!tenant) throw new NotFoundException('Negocio no encontrado')
    return tenant
  }

  async findAll(): Promise<Tenant[]> {
    return this.tenantRepo.find({ order: { createdAt: 'DESC' } })
  }

  async create(data: Partial<Tenant>): Promise<Tenant> {
    const tenant = this.tenantRepo.create({
      ...data,
      followUpTimings: data.followUpTimings ?? {
        followUp1Hours: 24,
        followUp2Hours: 48,
        followUp3Hours: 72,
      },
    })
    const saved = await this.tenantRepo.save(tenant)
    await this.seedDefaultTemplates(saved.id)
    return saved
  }

  async update(id: string, data: Partial<Tenant>): Promise<Tenant> {
    await this.findById(id)
    await this.tenantRepo.update(id, data)
    return this.findById(id)
  }

  async setStatus(id: string, status: TenantStatus): Promise<void> {
    await this.tenantRepo.update(id, { status })
  }

  async getTemplate(tenantId: string, type: TemplateType): Promise<string> {
    const template = await this.templateRepo.findOne({
      where: { tenantId, type, active: true },
    })
    return template?.body ?? DEFAULT_TEMPLATES[type]
  }

  private async seedDefaultTemplates(tenantId: string): Promise<void> {
    const templates = Object.entries(DEFAULT_TEMPLATES).map(([type, body]) =>
      this.templateRepo.create({ tenantId, type: type as TemplateType, body }),
    )
    await this.templateRepo.save(templates)
  }
}
