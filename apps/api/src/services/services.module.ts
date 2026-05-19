import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Reflector } from '@nestjs/core'
import { ServicesController } from './services.controller'
import { TenantGuard } from '../common/guards/tenant.guard'
import { Service } from '../database/entities/service.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Service])],
  controllers: [ServicesController],
  providers: [TenantGuard, Reflector],
})
export class ServicesModule {}
