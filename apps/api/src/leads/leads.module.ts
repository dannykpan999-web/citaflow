import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LeadsService } from './leads.service'
import { Lead } from '../database/entities/lead.entity'
import { Message } from '../database/entities/message.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Lead, Message])],
  providers: [LeadsService],
  exports: [LeadsService],
})
export class LeadsModule {}
