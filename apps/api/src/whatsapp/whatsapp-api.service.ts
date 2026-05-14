import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'

@Injectable()
export class WhatsappApiService {
  private readonly logger = new Logger(WhatsappApiService.name)

  constructor(private cfg: ConfigService) {}

  async sendText(phoneNumberId: string, accessToken: string, to: string, body: string): Promise<string | null> {
    try {
      const res = await axios.post(
        `${this.cfg.get('WHATSAPP_API_URL')}/${phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to,
          type: 'text',
          text: { body, preview_url: false },
        },
        { headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' } },
      )
      return res.data?.messages?.[0]?.id ?? null
    } catch (err: any) {
      this.logger.error(`Failed to send WhatsApp message to ${to}: ${err?.response?.data?.error?.message}`)
      return null
    }
  }

  async markAsRead(phoneNumberId: string, accessToken: string, messageId: string): Promise<void> {
    try {
      await axios.post(
        `${this.cfg.get('WHATSAPP_API_URL')}/${phoneNumberId}/messages`,
        { messaging_product: 'whatsapp', status: 'read', message_id: messageId },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      )
    } catch {
      // non-critical, ignore
    }
  }
}
