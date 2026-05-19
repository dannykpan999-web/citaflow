import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BullModule } from '@nestjs/bullmq'
import { AuthModule } from './auth/auth.module'
import { TenantsModule } from './tenants/tenants.module'
import { LeadsModule } from './leads/leads.module'
import { WhatsappModule } from './whatsapp/whatsapp.module'
import { EmailModule } from './email/email.module'
import { AiModule } from './ai/ai.module'
import { UsersModule } from './users/users.module'
import { AppointmentsModule } from './appointments/appointments.module'
import { ServicesModule } from './services/services.module'
import { TemplatesModule } from './templates/templates.module'
import { SettingsModule } from './settings/settings.module'
import { AnalyticsModule } from './analytics/analytics.module'
import { AdminModule } from './admin/admin.module'
import { Tenant } from './database/entities/tenant.entity'
import { User } from './database/entities/user.entity'
import { Lead } from './database/entities/lead.entity'
import { Message } from './database/entities/message.entity'
import { Appointment } from './database/entities/appointment.entity'
import { FollowUpJob } from './database/entities/follow-up-job.entity'
import { Service } from './database/entities/service.entity'
import { MessageTemplate } from './database/entities/message-template.entity'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        host: cfg.get('DB_HOST', 'localhost'),
        port: cfg.get<number>('DB_PORT', 5432),
        database: cfg.get('DB_NAME', 'citaflow_dev'),
        username: cfg.get('DB_USER'),
        password: cfg.get('DB_PASSWORD'),
        entities: [Tenant, User, Lead, Message, Appointment, FollowUpJob, Service, MessageTemplate],
        migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
        synchronize: cfg.get('NODE_ENV') === 'development',
        logging: cfg.get('NODE_ENV') === 'development',
        ssl: cfg.get('DB_SSL') === 'true' ? { rejectUnauthorized: false } : false,
      }),
    }),

    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        connection: {
          host: cfg.get('REDIS_HOST', 'localhost'),
          port: cfg.get<number>('REDIS_PORT', 6379),
        },
      }),
    }),

    AuthModule,
    TenantsModule,
    LeadsModule,
    WhatsappModule,
    EmailModule,
    AiModule,
    UsersModule,
    AppointmentsModule,
    ServicesModule,
    TemplatesModule,
    SettingsModule,
    AnalyticsModule,
    AdminModule,
  ],
})
export class AppModule {}
