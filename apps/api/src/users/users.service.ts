import { Injectable, UnauthorizedException, NotFoundException, ConflictException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcryptjs'
import { User } from '../database/entities/user.entity'
import { Tenant } from '../database/entities/tenant.entity'
import { UpdateProfileDto, ChangePasswordDto } from './dto/update-profile.dto'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Tenant) private tenantRepo: Repository<Tenant>,
  ) {}

  async getProfile(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } })
    if (!user) throw new NotFoundException('Usuario no encontrado')
    const tenant = user.tenantId
      ? await this.tenantRepo.findOne({ where: { id: user.tenantId } })
      : null
    return { user, tenant }
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } })
    if (!user) throw new NotFoundException('Usuario no encontrado')

    if (dto.name?.trim()) {
      await this.userRepo.update(userId, { name: dto.name.trim() })
    }

    if (dto.clinicName?.trim() && user.tenantId) {
      try {
        await this.tenantRepo.update(user.tenantId, { name: dto.clinicName.trim() })
      } catch {
        throw new ConflictException('Ese nombre de clínica ya está en uso')
      }
    }

    return this.getProfile(userId)
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: ['id', 'passwordHash'],
    })
    if (!user) throw new NotFoundException('Usuario no encontrado')

    if (user.passwordHash && !(await bcrypt.compare(dto.oldPassword, user.passwordHash))) {
      throw new UnauthorizedException('La contraseña actual es incorrecta')
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 12)
    await this.userRepo.update(userId, { passwordHash })
    return { message: 'Contraseña actualizada correctamente' }
  }
}
