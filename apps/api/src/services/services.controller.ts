import {
  Controller, Get, Post, Patch, Delete, Param, Body,
  UseGuards, HttpCode, HttpStatus, NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { TenantGuard } from '../common/guards/tenant.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { User } from '../database/entities/user.entity'
import { Service } from '../database/entities/service.entity'
import { UpsertServiceDto } from './dto/upsert-service.dto'

@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('services')
export class ServicesController {
  constructor(
    @InjectRepository(Service) private serviceRepo: Repository<Service>,
  ) {}

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.serviceRepo.find({
      where: { tenantId: user.tenantId },
      order: { createdAt: 'ASC' },
    })
  }

  @Post()
  create(@CurrentUser() user: User, @Body() dto: UpsertServiceDto) {
    const service = this.serviceRepo.create({ ...dto, tenantId: user.tenantId })
    return this.serviceRepo.save(service)
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() dto: Partial<UpsertServiceDto>,
  ) {
    const service = await this.serviceRepo.findOne({ where: { id, tenantId: user.tenantId } })
    if (!service) throw new NotFoundException('Service not found')
    await this.serviceRepo.update({ id }, dto)
    return this.serviceRepo.findOne({ where: { id } })
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    const service = await this.serviceRepo.findOne({ where: { id, tenantId: user.tenantId } })
    if (!service) throw new NotFoundException('Service not found')
    await this.serviceRepo.delete({ id })
  }
}
