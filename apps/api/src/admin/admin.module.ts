import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Reflector } from '@nestjs/core'
import { AdminController } from './admin.controller'
import { Tenant } from '../database/entities/tenant.entity'
import { Lead } from '../database/entities/lead.entity'
import { User } from '../database/entities/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Tenant, Lead, User])],
  controllers: [AdminController],
  providers: [Reflector],
})
export class AdminModule {}
