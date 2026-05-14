import {
  Injectable, UnauthorizedException, ConflictException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcryptjs'
import { User, UserRole } from '../database/entities/user.entity'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
    private cfg: ConfigService,
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
