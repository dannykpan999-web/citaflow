import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, OneToMany,
} from 'typeorm'
import { User } from './user.entity'
import { Lead } from './lead.entity'

export enum TenantPlan {
  STARTER = 'starter',
  GROWTH = 'growth',
}

export enum TenantStatus {
  TRIAL = 'trial',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
}

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  name: string

  @Column({ unique: true })
  slug: string

  @Column({ type: 'enum', enum: TenantPlan, default: TenantPlan.STARTER })
  plan: TenantPlan

  @Column({ type: 'enum', enum: TenantStatus, default: TenantStatus.TRIAL })
  status: TenantStatus

  @Column({ nullable: true })
  whatsappPhoneNumberId: string

  @Column({ nullable: true })
  whatsappAccessToken: string

  @Column({ nullable: true })
  agendaLink: string

  @Column({ nullable: true })
  welcomeMessage: string

  @Column({ nullable: true })
  city: string

  @Column({ nullable: true })
  workingHours: string

  @Column({ type: 'jsonb', nullable: true })
  followUpTimings: {
    followUp1Hours: number
    followUp2Hours: number
    followUp3Hours: number
  }

  @Column({ type: 'date', nullable: true })
  trialEndsAt: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(() => User, (user) => user.tenant)
  users: User[]

  @OneToMany(() => Lead, (lead) => lead.tenant)
  leads: Lead[]
}
