import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TenantsService } from './tenants.service'
import { Tenant } from '../database/entities/tenant.entity'
import { MessageTemplate } from '../database/entities/message-template.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Tenant, MessageTemplate])],
  providers: [TenantsService],
  exports: [TenantsService],
})
export class TenantsModule {}
