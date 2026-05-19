import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Anthropic from '@anthropic-ai/sdk'
import { Message, MessageDirection } from '../database/entities/message.entity'

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name)
  private client: Anthropic

  constructor(private cfg: ConfigService) {
    this.client = new Anthropic({ apiKey: this.cfg.get<string>('ANTHROPIC_API_KEY') })
  }

  async generateWhatsAppResponse(
    clinicName: string,
    services: string[],
    agendaLink: string | null,
    messages: Message[],
  ): Promise<string> {
    const servicesList = services.length > 0
      ? services.join(', ')
      : 'servicios de estética y bienestar'

    const agendaInfo = agendaLink
      ? `El link para agendar citas es: ${agendaLink}`
      : 'Para agendar citas, pide al lead que escriba para coordinar directamente.'

    const systemPrompt = `Eres un asistente virtual amable y profesional de la clínica "${clinicName}".
Tu trabajo es responder mensajes de WhatsApp de potenciales clientes (leads) en español LATAM, de forma cálida y concisa.

Servicios que ofrece la clínica: ${servicesList}.
${agendaInfo}

Reglas importantes:
- Responde SIEMPRE en español, máximo 2-3 oraciones.
- Sé cálido, profesional y empático. Usa emojis con moderación (1 como máximo).
- Si el lead pregunta por precios, da información general o pídeles que agenden para una valoración.
- Si el lead quiere agendar, proporciona el link de agenda o pide su disponibilidad.
- Si el lead dice que no le interesa o está molesto, agradece su tiempo con cortesía.
- NO inventes información que no tengas. NO hagas promesas médicas específicas.
- Nunca menciones que eres una IA — eres el asistente de la clínica.`

    const anthropicMessages = this.buildMessageHistory(messages)

    if (anthropicMessages.length === 0) {
      return ''
    }

    try {
      const response = await this.client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system: systemPrompt,
        messages: anthropicMessages,
      })

      const text = response.content.find(c => c.type === 'text')
      return text?.type === 'text' ? text.text.trim() : ''
    } catch (err) {
      this.logger.error(`AI generation failed: ${err}`)
      return ''
    }
  }

  private buildMessageHistory(messages: Message[]): Anthropic.MessageParam[] {
    const result: Anthropic.MessageParam[] = []

    for (const msg of messages) {
      const role: 'user' | 'assistant' =
        msg.direction === MessageDirection.INBOUND ? 'user' : 'assistant'
      const last = result[result.length - 1]

      if (last && last.role === role) {
        last.content += '\n' + msg.body
      } else {
        result.push({ role, content: msg.body })
      }
    }

    // Anthropic requires conversation to start with 'user'
    if (result.length > 0 && result[0].role !== 'user') {
      result.unshift({ role: 'user', content: '...' })
    }

    return result
  }
}
