import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Reflector } from '@nestjs/core'
import { SettingsController } from './settings.controller'
import { TenantGuard } from '../common/guards/tenant.guard'
import { Tenant } from '../database/entities/tenant.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],
  controllers: [SettingsController],
  providers: [TenantGuard, Reflector],
})
export class SettingsModule {}
