import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm'

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  tenantId: string

  @Column()
  name: string

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number

  @Column({ nullable: true, type: 'text' })
  description: string

  @Column({ nullable: true })
  promo: string

  @Column({ default: false })
  requiresHuman: boolean

  @Column({ default: true })
  active: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
