import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Reflector } from '@nestjs/core'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { TenantGuard } from '../common/guards/tenant.guard'
import { User } from '../database/entities/user.entity'
import { Tenant } from '../database/entities/tenant.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User, Tenant])],
  controllers: [UsersController],
  providers: [UsersService, TenantGuard, Reflector],
  exports: [UsersService],
})
export class UsersModule {}
