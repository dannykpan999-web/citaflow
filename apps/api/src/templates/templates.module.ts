import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Reflector } from '@nestjs/core'
import { TemplatesController } from './templates.controller'
import { TenantGuard } from '../common/guards/tenant.guard'
import { MessageTemplate } from '../database/entities/message-template.entity'

@Module({
  imports: [TypeOrmModule.forFeature([MessageTemplate])],
  controllers: [TemplatesController],
  providers: [TenantGuard, Reflector],
})
export class TemplatesModule {}
