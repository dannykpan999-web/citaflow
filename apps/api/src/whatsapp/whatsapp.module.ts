import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import { TypeOrmModule } from '@nestjs/typeorm'
import { WhatsappController } from './whatsapp.controller'
import { WhatsappService } from './whatsapp.service'
import { WhatsappApiService } from './whatsapp-api.service'
import { WhatsappProcessor, WHATSAPP_QUEUE } from './whatsapp.processor'
import { LeadsModule } from '../leads/leads.module'
import { TenantsModule } from '../tenants/tenants.module'
import { AiModule } from '../ai/ai.module'
import { EmailModule } from '../email/email.module'
import { Tenant } from '../database/entities/tenant.entity'
import { FollowUpJob } from '../database/entities/follow-up-job.entity'
import { Lead } from '../database/entities/lead.entity'
import { User } from '../database/entities/user.entity'
import { Service } from '../database/entities/service.entity'

@Module({
  imports: [
    BullModule.registerQueue({ name: WHATSAPP_QUEUE }),
    TypeOrmModule.forFeature([Tenant, FollowUpJob, Lead, User, Service]),
    LeadsModule,
    TenantsModule,
    AiModule,
    EmailModule,
  ],
  controllers: [WhatsappController],
  providers: [WhatsappService, WhatsappApiService, WhatsappProcessor],
  exports: [WhatsappService],
})
export class WhatsappModule {}
