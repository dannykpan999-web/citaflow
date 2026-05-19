import { Controller, Get, Post, Body, Query, Res, HttpStatus, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Response } from 'express'
import { WhatsappService } from './whatsapp.service'
import { LeadsService } from '../leads/leads.service'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Tenant } from '../database/entities/tenant.entity'
import { MessageStatus } from '../database/entities/message.entity'

interface WhatsappWebhookBody {
  object: string
  entry: Array<{
    id: string
    changes: Array<{
      value: {
        messaging_product: string
        metadata: { phone_number_id: string }
        messages?: Array<{
          id: string
          from: string
          type: string
          text?: { body: string }
          timestamp: string
        }>
        statuses?: Array<{
          id: string
          status: string
          recipient_id: string
        }>
      }
    }>
  }>
}

@Controller('whatsapp')
export class WhatsappController {
  private readonly logger = new Logger(WhatsappController.name)

  constructor(
    private whatsappService: WhatsappService,
    private leadsService: LeadsService,
    private cfg: ConfigService,
    @InjectRepository(Tenant) private tenantRepo: Repository<Tenant>,
  ) {}

  // Meta webhook verification
  @Get('webhook')
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
    @Res() res: Response,
  ) {
    if (mode === 'subscribe' && token === this.cfg.get('WHATSAPP_VERIFY_TOKEN')) {
      this.logger.log('WhatsApp webhook verified successfully')
      return res.status(HttpStatus.OK).send(challenge)
    }
    return res.status(HttpStatus.FORBIDDEN).send('Verification failed')
  }

  // Receive incoming messages
  @Post('webhook')
  async receiveWebhook(@Body() body: WhatsappWebhookBody, @Res() res: Response) {
    res.status(HttpStatus.OK).send('EVENT_RECEIVED')

    if (body.object !== 'whatsapp_business_account') return

    for (const entry of body.entry ?? []) {
      for (const change of entry.changes ?? []) {
        const { value } = change
        const phoneNumberId = value.metadata?.phone_number_id

        // Incoming messages
        for (const message of value.messages ?? []) {
          if (message.type !== 'text') continue

          const tenant = await this.tenantRepo.findOne({
            where: { whatsappPhoneNumberId: phoneNumberId },
          })
          if (!tenant) {
            this.logger.warn(`No tenant found for phone number ID: ${phoneNumberId}`)
            continue
          }

          await this.whatsappService.handleIncomingMessage(
            tenant.id,
            message.from,
            message.text?.body ?? '',
            message.id,
          )
        }

        // Delivery status updates
        for (const statusUpdate of value.statuses ?? []) {
          const metaStatus = statusUpdate.status
          let msgStatus: MessageStatus | null = null
          if (metaStatus === 'sent')      msgStatus = MessageStatus.SENT
          else if (metaStatus === 'delivered') msgStatus = MessageStatus.DELIVERED
          else if (metaStatus === 'read')  msgStatus = MessageStatus.READ
          else if (metaStatus === 'failed') msgStatus = MessageStatus.FAILED

          if (msgStatus) {
            await this.leadsService.updateMessageStatus(statusUpdate.id, msgStatus)
            this.logger.debug(`Message ${statusUpdate.id} → ${msgStatus}`)
          }
        }
      }
    }
  }
}
