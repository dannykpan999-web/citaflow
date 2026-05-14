import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm'

export enum TemplateType {
  WELCOME = 'welcome',
  SERVICE_INFO = 'service_info',
  AGENDA_LINK = 'agenda_link',
  FOLLOW_UP_1 = 'follow_up_1',
  FOLLOW_UP_2 = 'follow_up_2',
  SOFT_CLOSE = 'soft_close',
  REMINDER_24H = 'reminder_24h',
  REMINDER_2H = 'reminder_2h',
}

@Entity('message_templates')
export class MessageTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  tenantId: string

  @Column({ type: 'enum', enum: TemplateType })
  type: TemplateType

  @Column({ type: 'text' })
  body: string

  @Column({ default: true })
  active: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
