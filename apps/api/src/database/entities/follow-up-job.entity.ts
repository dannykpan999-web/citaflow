import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm'
import { Lead } from './lead.entity'

export enum FollowUpType {
  FOLLOW_UP_1 = 'follow_up_1',
  FOLLOW_UP_2 = 'follow_up_2',
  SOFT_CLOSE = 'soft_close',
  REMINDER_24H = 'reminder_24h',
  REMINDER_2H = 'reminder_2h',
}

export enum FollowUpStatus {
  PENDING = 'pending',
  SENT = 'sent',
  CANCELLED = 'cancelled',
  FAILED = 'failed',
}

@Entity('follow_up_jobs')
export class FollowUpJob {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  leadId: string

  @ManyToOne(() => Lead, (lead) => lead.followUpJobs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'leadId' })
  lead: Lead

  @Column()
  tenantId: string

  @Column({ type: 'enum', enum: FollowUpType })
  type: FollowUpType

  @Column({ type: 'enum', enum: FollowUpStatus, default: FollowUpStatus.PENDING })
  status: FollowUpStatus

  @Column()
  scheduledAt: Date

  @Column({ nullable: true })
  bullJobId: string

  @CreateDateColumn()
  createdAt: Date
}
