import {
  Controller, Get, Patch, Param, Body, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { SkipTenantCheck } from '../common/decorators/skip-tenant-check.decorator'
import { UserRole } from '../database/entities/user.entity'
import { Tenant, TenantStatus } from '../database/entities/tenant.entity'
import { Lead } from '../database/entities/lead.entity'
import { User } from '../database/entities/user.entity'

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
@SkipTenantCheck()
@Controller('admin')
export class AdminController {
  constructor(
    @InjectRepository(Tenant) private tenantRepo: Repository<Tenant>,
    @InjectRepository(Lead) private leadRepo: Repository<Lead>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  @Get('tenants')
  async listTenants() {
    const tenants = await this.tenantRepo.find({ order: { createdAt: 'DESC' } })
    const result = await Promise.all(
      tenants.map(async (t) => {
        const [leadCount, userCount] = await Promise.all([
          this.leadRepo.count({ where: { tenantId: t.id } }),
          this.userRepo.count({ where: { tenantId: t.id } }),
        ])
        return { ...t, leadCount, userCount }
      }),
    )
    return result
  }

  @Get('tenants/:id')
  async getTenant(@Param('id') id: string) {
    const tenant = await this.tenantRepo.findOne({ where: { id } })
    const [leadCount, userCount] = await Promise.all([
      this.leadRepo.count({ where: { tenantId: id } }),
      this.userRepo.count({ where: { tenantId: id } }),
    ])
    return { ...tenant, leadCount, userCount }
  }

  @Patch('tenants/:id/status')
  @HttpCode(HttpStatus.OK)
  async updateTenantStatus(
    @Param('id') id: string,
    @Body('status') status: TenantStatus,
  ) {
    await this.tenantRepo.update({ id }, { status })
    return this.tenantRepo.findOne({ where: { id } })
  }

  @Get('metrics')
  async getPlatformMetrics() {
    const [totalTenants, activeTenants, trialTenants, suspendedTenants, totalLeads, totalUsers] = await Promise.all([
      this.tenantRepo.count(),
      this.tenantRepo.count({ where: { status: TenantStatus.ACTIVE } }),
      this.tenantRepo.count({ where: { status: TenantStatus.TRIAL } }),
      this.tenantRepo.count({ where: { status: TenantStatus.SUSPENDED } }),
      this.leadRepo.count(),
      this.userRepo.count(),
    ])
    return { totalTenants, activeTenants, trialTenants, suspendedTenants, totalLeads, totalUsers }
  }
}
