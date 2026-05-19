import {
  Injectable, UnauthorizedException, ConflictException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, DataSource } from 'typeorm'
import * as bcrypt from 'bcryptjs'
import { User, UserRole } from '../database/entities/user.entity'
import { Tenant, TenantStatus, TenantPlan } from '../database/entities/tenant.entity'
import { MessageTemplate, TemplateType } from '../database/entities/message-template.entity'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { SignupDto } from './dto/signup.dto'
import { EmailService } from '../email/email.service'

const DEFAULT_TEMPLATES: Record<TemplateType, string> = {
  [TemplateType.WELCOME]: '¡Hola! 👋 Gracias por escribirnos. Soy el asistente de {{business_name}}. ¿En qué te puedo ayudar hoy?',
  [TemplateType.SERVICE_INFO]: 'Te comparto información sobre nuestros servicios:\n\n{{services_list}}\n\n¿Te gustaría agendar una cita?',
  [TemplateType.AGENDA_LINK]: '¡Perfecto! Puedes agendar tu cita aquí 👇\n📅 {{agenda_link}}\n\nElige el horario que más te convenga.',
  [TemplateType.FOLLOW_UP_1]: 'Hola {{lead_name}} 😊 Quería saber si pudiste revisar la información. ¿Tienes alguna pregunta o te gustaría agendar?',
  [TemplateType.FOLLOW_UP_2]: 'Hola de nuevo {{lead_name}} 👋 Solo quería asegurarme de que no te quedó ninguna duda. ¡Aquí estamos para ayudarte!',
  [TemplateType.SOFT_CLOSE]: 'Hola {{lead_name}}, entendemos que quizás no es el momento. Si te interesa en algún momento, aquí estaremos. ¡Que tengas un excelente día! 🌟',
  [TemplateType.REMINDER_24H]: '🔔 Recordatorio: Tienes una cita mañana en {{business_name}}.\n📅 {{appointment_date}} a las {{appointment_time}}\n\nSi necesitas cancelar, escríbenos.',
  [TemplateType.REMINDER_2H]: '⏰ Tu cita en {{business_name}} es en 2 horas.\n📅 Hoy a las {{appointment_time}}\n\n¡Te esperamos!',
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Tenant) private tenantRepo: Repository<Tenant>,
    @InjectRepository(MessageTemplate) private templateRepo: Repository<MessageTemplate>,
    private jwtService: JwtService,
    private cfg: ConfigService,
    private dataSource: DataSource,
    private emailService: EmailService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { email: dto.email, active: true },
      select: ['id', 'email', 'name', 'passwordHash', 'role', 'tenantId', 'active'],
    })

    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Credenciales inválidas')
    }

    const tokens = await this.generateTokens(user)
    await this.saveRefreshToken(user.id, tokens.refreshToken)
    return { ...tokens, user: this.sanitize(user) }
  }

  async register(dto: RegisterDto) {
    const exists = await this.userRepo.findOne({ where: { email: dto.email } })
    if (exists) throw new ConflictException('El email ya está registrado')

    const passwordHash = await bcrypt.hash(dto.password, 12)
    const user = this.userRepo.create({
      ...dto,
      passwordHash,
      role: dto.role ?? UserRole.AGENT,
    })
    await this.userRepo.save(user)

    const tokens = await this.generateTokens(user)
    await this.saveRefreshToken(user.id, tokens.refreshToken)
    return { ...tokens, user: this.sanitize(user) }
  }

  async signup(dto: SignupDto) {
    const exists = await this.userRepo.findOne({ where: { email: dto.email } })
    if (exists) throw new ConflictException('El email ya está registrado')

    const slug = dto.clinicName
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    const slugExists = await this.tenantRepo.findOne({ where: { slug } })
    const finalSlug = slugExists ? `${slug}-${Date.now()}` : slug

    const trialEndsAt = new Date()
    trialEndsAt.setDate(trialEndsAt.getDate() + 14)

    return this.dataSource.transaction(async (em) => {
      const tenant = em.create(Tenant, {
        name: dto.clinicName,
        slug: finalSlug,
        plan: TenantPlan.STARTER,
        status: TenantStatus.TRIAL,
        trialEndsAt,
        followUpTimings: { followUp1Hours: 24, followUp2Hours: 48, followUp3Hours: 72 },
      })
      const savedTenant = await em.save(tenant)

      const passwordHash = await bcrypt.hash(dto.password, 12)
      const user = em.create(User, {
        name: dto.name,
        email: dto.email,
        passwordHash,
        role: UserRole.OWNER,
        tenantId: savedTenant.id,
      })
      const savedUser = await em.save(user)

      const templates = Object.entries(DEFAULT_TEMPLATES).map(([type, body]) =>
        em.create(MessageTemplate, { tenantId: savedTenant.id, type: type as TemplateType, body }),
      )
      await em.save(templates)

      const tokens = await this.generateTokens(savedUser)
      await em.update(User, savedUser.id, { refreshToken: tokens.refreshToken })

      const result = { ...tokens, user: this.sanitize(savedUser), tenant: savedTenant }

      // Fire-and-forget welcome email
      this.emailService.sendWelcome(savedTenant.name, dto.email, dto.name, savedTenant.trialEndsAt)

      return result
    })
  }

  async googleAuth(email: string, name: string) {
    const existing = await this.userRepo.findOne({
      where: { email },
      select: ['id', 'email', 'name', 'role', 'tenantId', 'active', 'passwordHash', 'refreshToken'],
    })

    if (existing) {
      const tenant = existing.tenantId
        ? await this.tenantRepo.findOne({ where: { id: existing.tenantId } })
        : null
      const tokens = await this.generateTokens(existing)
      await this.saveRefreshToken(existing.id, tokens.refreshToken)
      return { ...tokens, user: this.sanitize(existing), tenant }
    }

    // First-time Google sign-up: create tenant + user atomically
    const slug = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const slugExists = await this.tenantRepo.findOne({ where: { slug } })
    const finalSlug = slugExists ? `${slug}-${Date.now()}` : slug
    const trialEndsAt = new Date()
    trialEndsAt.setDate(trialEndsAt.getDate() + 14)

    return this.dataSource.transaction(async (em) => {
      const tenant = await em.save(em.create(Tenant, {
        name: `${name}'s Clinic`,
        slug: finalSlug,
        plan: TenantPlan.STARTER,
        status: TenantStatus.TRIAL,
        trialEndsAt,
        followUpTimings: { followUp1Hours: 24, followUp2Hours: 48, followUp3Hours: 72 },
      }))

      const user = await em.save(em.create(User, {
        name,
        email,
        passwordHash: '',
        role: UserRole.OWNER,
        tenantId: tenant.id,
        active: true,
      }))

      const templates = Object.entries(DEFAULT_TEMPLATES).map(([type, body]) =>
        em.create(MessageTemplate, { tenantId: tenant.id, type: type as TemplateType, body }),
      )
      await em.save(templates)

      const tokens = await this.generateTokens(user)
      await em.update(User, user.id, { refreshToken: tokens.refreshToken })

      this.emailService.sendWelcome(tenant.name, email, name, trialEndsAt)

      return { ...tokens, user: this.sanitize(user), tenant }
    })
  }

  async refresh(userId: string, refreshToken: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: ['id', 'email', 'name', 'role', 'tenantId', 'active', 'refreshToken'],
    })

    if (!user?.refreshToken || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Refresh token inválido')
    }

    const tokens = await this.generateTokens(user)
    await this.saveRefreshToken(user.id, tokens.refreshToken)
    return tokens
  }

  async logout(userId: string) {
    await this.userRepo.update(userId, { refreshToken: null })
  }

  private async generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email, tenantId: user.tenantId, role: user.role }

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.cfg.get('JWT_SECRET'),
        expiresIn: this.cfg.get('JWT_EXPIRES_IN', '15m'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.cfg.get('JWT_REFRESH_SECRET'),
        expiresIn: this.cfg.get('JWT_REFRESH_EXPIRES_IN', '7d'),
      }),
    ])

    return { accessToken, refreshToken }
  }

  private async saveRefreshToken(userId: string, token: string) {
    await this.userRepo.update(userId, { refreshToken: token })
  }

  private sanitize(user: User) {
    const { passwordHash, refreshToken, ...safe } = user as any
    return safe
  }
}
