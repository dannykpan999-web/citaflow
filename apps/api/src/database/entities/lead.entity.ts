import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, ManyToOne,
  JoinColumn, OneToMany, OneToOne,
} from 'typeorm'
import { Tenant } from './tenant.entity'
import { Message } from './message.entity'
import { Appointment } from './appointment.entity'
import { FollowUpJob } from './follow-up-job.entity'

export enum LeadStatus {
  NEW = 'new',
  IN_CONVERSATION = 'in_conversation',
  LINK_SENT = 'link_sent',
  APPOINTMENT_GENERATED = 'appointment_generated',
  HUMAN_CONTROL = 'human_control',
  NOT_INTERESTED = 'not_interested',
  CLOSED = 'closed',
}

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  tenantId: string

  @ManyToOne(() => Tenant, (tenant) => tenant.leads, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant

  @Column()
  phone: string

  @Column({ nullable: true })
  name: string | null

  @Column({ nullable: true })
  serviceInterest: string | null

  @Column({ type: 'enum', enum: LeadStatus, default: LeadStatus.NEW })
  status: LeadStatus

  @Column({ default: true })
  botActive: boolean

  @Column({ nullable: true })
  assignedToUserId: string | null

  @Column({ nullable: true, type: 'text' })
  internalNotes: string | null

  @Column({ nullable: true })
  waContactId: string | null

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(() => Message, (msg) => msg.lead)
  messages: Message[]

  @OneToMany(() => FollowUpJob, (job) => job.lead)
  followUpJobs: FollowUpJob[]

  @OneToOne(() => Appointment, (apt) => apt.lead)
  appointment: Appointment
}
