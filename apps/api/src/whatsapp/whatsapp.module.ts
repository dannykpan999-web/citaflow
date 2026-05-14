import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import { TypeOrmModule } from '@nestjs/typeorm'
import { WhatsappController } from './whatsapp.controller'
import { WhatsappService } from './whatsapp.service'
import { WhatsappApiService } from './whatsapp-api.service'
import { WhatsappProcessor, WHATSAPP_QUEUE } from './whatsapp.processor'
import { LeadsModule } from '../leads/leads.module'
import { TenantsModule } from '../tenants/tenants.module'
import { Tenant } from '../database/entities/tenant.entity'
import { FollowUpJob } from '../database/entities/follow-up-job.entity'
import { Lead } from '../database/entities/lead.entity'

@Module({
  imports: [
    BullModule.registerQueue({ name: WHATSAPP_QUEUE }),
    TypeOrmModule.forFeature([Tenant, FollowUpJob, Lead]),
    LeadsModule,
    TenantsModule,
  ],
  controllers: [WhatsappController],
  providers: [WhatsappService, WhatsappApiService, WhatsappProcessor],
  exports: [WhatsappService],
})
export class WhatsappModule {}
