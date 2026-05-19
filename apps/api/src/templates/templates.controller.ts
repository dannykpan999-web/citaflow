import {
  Controller, Get, Put, Param, Body, UseGuards, NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { TenantGuard } from '../common/guards/tenant.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { User } from '../database/entities/user.entity'
import { MessageTemplate, TemplateType } from '../database/entities/message-template.entity'
import { UpsertTemplateDto } from './dto/upsert-template.dto'

@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('templates')
export class TemplatesController {
  constructor(
    @InjectRepository(MessageTemplate) private templateRepo: Repository<MessageTemplate>,
  ) {}

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.templateRepo.find({
      where: { tenantId: user.tenantId },
      order: { type: 'ASC' },
    })
  }

  @Put(':type')
  async upsert(
    @Param('type') type: TemplateType,
    @CurrentUser() user: User,
    @Body() dto: UpsertTemplateDto,
  ) {
    let template = await this.templateRepo.findOne({
      where: { tenantId: user.tenantId, type },
    })
    if (template) {
      await this.templateRepo.update({ id: template.id }, { body: dto.body, active: dto.active ?? true })
      return this.templateRepo.findOne({ where: { id: template.id } })
    }
    template = this.templateRepo.create({ tenantId: user.tenantId, type, body: dto.body, active: dto.active ?? true })
    return this.templateRepo.save(template)
  }
}
