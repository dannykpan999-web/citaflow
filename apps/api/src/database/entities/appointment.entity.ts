import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn,
} from 'typeorm'
import { Lead } from './lead.entity'

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  leadId: string

  @OneToOne(() => Lead, (lead) => lead.appointment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'leadId' })
  lead: Lead

  @Column()
  tenantId: string

  @Column()
  scheduledAt: Date

  @Column({ nullable: true })
  service: string

  @Column({ default: false })
  reminder24hSent: boolean

  @Column({ default: false })
  reminder2hSent: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
