import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm'
import { Lead } from './lead.entity'

export enum MessageDirection {
  INBOUND = 'inbound',
  OUTBOUND = 'outbound',
}

export enum MessageType {
  TEXT = 'text',
  TEMPLATE = 'template',
  INTERACTIVE = 'interactive',
}

export enum MessageStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
}

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  leadId: string

  @ManyToOne(() => Lead, (lead) => lead.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'leadId' })
  lead: Lead

  @Column({ type: 'enum', enum: MessageDirection })
  direction: MessageDirection

  @Column({ type: 'enum', enum: MessageType, default: MessageType.TEXT })
  type: MessageType

  @Column({ type: 'text' })
  body: string

  @Column({ type: 'enum', enum: MessageStatus, nullable: true })
  status: MessageStatus

  @Column({ nullable: true })
  waMessageId: string

  @Column({ default: false })
  isAutomated: boolean

  @CreateDateColumn()
  sentAt: Date
}
