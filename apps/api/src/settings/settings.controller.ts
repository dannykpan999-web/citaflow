import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { TenantGuard } from '../common/guards/tenant.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { User } from '../database/entities/user.entity'
import { Tenant } from '../database/entities/tenant.entity'
import { UpdateSettingsDto } from './dto/update-settings.dto'

@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('settings')
export class SettingsController {
  constructor(
    @InjectRepository(Tenant) private tenantRepo: Repository<Tenant>,
  ) {}

  @Get()
  async getSettings(@CurrentUser() user: User) {
    return this.tenantRepo.findOne({ where: { id: user.tenantId } })
  }

  @Patch()
  async updateSettings(@CurrentUser() user: User, @Body() dto: UpdateSettingsDto) {
    await this.tenantRepo.update({ id: user.tenantId }, dto as any)
    return this.tenantRepo.findOne({ where: { id: user.tenantId } })
  }
}
