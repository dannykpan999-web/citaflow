import {
  Controller, Get, Patch, Post, Delete, Param, Body,
  Query, UseGuards, HttpCode, HttpStatus, NotFoundException,
} from '@nestjs/common'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { TenantGuard } from '../common/guards/tenant.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { User } from '../database/entities/user.entity'
import { LeadsService } from './leads.service'
import { LeadStatus } from '../database/entities/lead.entity'
import { UpdateLeadDto } from './dto/update-lead.dto'

@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('leads')
export class LeadsController {
  constructor(private leadsService: LeadsService) {}

  @Get()
  findAll(
    @CurrentUser() user: User,
    @Query('status') status?: LeadStatus,
    @Query('search') search?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.leadsService.findAllPaginated(
      user.tenantId,
      { status, search },
      { page: parseInt(page), limit: parseInt(limit) },
    )
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: User) {
    const lead = await this.leadsService.findById(id, user.tenantId)
    if (!lead) throw new NotFoundException('Lead not found')
    return lead
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() dto: UpdateLeadDto,
  ) {
    const lead = await this.leadsService.findById(id, user.tenantId)
    if (!lead) throw new NotFoundException('Lead not found')
    return this.leadsService.updateLead(id, user.tenantId, dto)
  }

  @Post(':id/pause-bot')
  @HttpCode(HttpStatus.OK)
  async pauseBot(@Param('id') id: string, @CurrentUser() user: User) {
    const lead = await this.leadsService.findById(id, user.tenantId)
    if (!lead) throw new NotFoundException('Lead not found')
    await this.leadsService.pauseBot(id, user.tenantId, user.id)
    return { success: true }
  }

  @Post(':id/resume-bot')
  @HttpCode(HttpStatus.OK)
  async resumeBot(@Param('id') id: string, @CurrentUser() user: User) {
    const lead = await this.leadsService.findById(id, user.tenantId)
    if (!lead) throw new NotFoundException('Lead not found')
    await this.leadsService.resumeBot(id, user.tenantId)
    return { success: true }
  }

  @Get(':id/messages')
  async getMessages(@Param('id') id: string, @CurrentUser() user: User) {
    const lead = await this.leadsService.findById(id, user.tenantId)
    if (!lead) throw new NotFoundException('Lead not found')
    return this.leadsService.getMessages(id)
  }

  @Post(':id/notes')
  @HttpCode(HttpStatus.OK)
  async updateNotes(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body('notes') notes: string,
  ) {
    const lead = await this.leadsService.findById(id, user.tenantId)
    if (!lead) throw new NotFoundException('Lead not found')
    await this.leadsService.updateLead(id, user.tenantId, { internalNotes: notes })
    return { success: true }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    const lead = await this.leadsService.findById(id, user.tenantId)
    if (!lead) throw new NotFoundException('Lead not found')
    await this.leadsService.deleteLead(id, user.tenantId)
  }
}
