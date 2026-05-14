import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BullModule } from '@nestjs/bullmq'
import { AuthModule } from './auth/auth.module'
import { TenantsModule } from './tenants/tenants.module'
import { LeadsModule } from './leads/leads.module'
import { WhatsappModule } from './whatsapp/whatsapp.module'

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
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
        synchronize: cfg.get('NODE_ENV') === 'development',
        logging: cfg.get('NODE_ENV') === 'development',
        ssl: cfg.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
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
  ],
})
export class AppModule {}
