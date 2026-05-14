import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm'
import { Tenant } from './tenant.entity'

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  OWNER = 'owner',
  AGENT = 'agent',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  tenantId: string

  @ManyToOne(() => Tenant, (tenant) => tenant.users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant

  @Column()
  name: string

  @Column({ unique: true })
  email: string

  @Column({ select: false })
  passwordHash: string

  @Column({ type: 'enum', enum: UserRole, default: UserRole.AGENT })
  role: UserRole

  @Column({ default: true })
  active: boolean

  @Column({ nullable: true, select: false })
  refreshToken: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
