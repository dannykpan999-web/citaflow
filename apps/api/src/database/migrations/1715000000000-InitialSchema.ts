import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitialSchema1715000000000 implements MigrationInterface {
  name = 'InitialSchema1715000000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "tenant_plan_enum" AS ENUM('starter', 'growth')`)
    await queryRunner.query(`CREATE TYPE "tenant_status_enum" AS ENUM('trial', 'active', 'suspended')`)
    await queryRunner.query(`CREATE TYPE "user_role_enum" AS ENUM('super_admin', 'owner', 'agent')`)
    await queryRunner.query(`CREATE TYPE "lead_status_enum" AS ENUM('new', 'in_conversation', 'link_sent', 'appointment_generated', 'human_control', 'not_interested', 'closed')`)
    await queryRunner.query(`CREATE TYPE "message_direction_enum" AS ENUM('inbound', 'outbound')`)
    await queryRunner.query(`CREATE TYPE "message_type_enum" AS ENUM('text', 'template', 'interactive')`)
    await queryRunner.query(`CREATE TYPE "message_status_enum" AS ENUM('sent', 'delivered', 'read', 'failed')`)
    await queryRunner.query(`CREATE TYPE "follow_up_type_enum" AS ENUM('follow_up_1', 'follow_up_2', 'soft_close', 'reminder_24h', 'reminder_2h')`)
    await queryRunner.query(`CREATE TYPE "follow_up_status_enum" AS ENUM('pending', 'sent', 'cancelled', 'failed')`)
    await queryRunner.query(`CREATE TYPE "template_type_enum" AS ENUM('welcome', 'service_info', 'agenda_link', 'follow_up_1', 'follow_up_2', 'soft_close', 'reminder_24h', 'reminder_2h')`)

    await queryRunner.query(`
      CREATE TABLE "tenants" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "slug" character varying NOT NULL,
        "plan" "tenant_plan_enum" NOT NULL DEFAULT 'starter',
        "status" "tenant_status_enum" NOT NULL DEFAULT 'trial',
        "whatsappPhoneNumberId" character varying,
        "whatsappAccessToken" character varying,
        "agendaLink" character varying,
        "welcomeMessage" character varying,
        "city" character varying,
        "workingHours" character varying,
        "followUpTimings" jsonb,
        "trialEndsAt" date,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_tenants_name" UNIQUE ("name"),
        CONSTRAINT "UQ_tenants_slug" UNIQUE ("slug"),
        CONSTRAINT "PK_tenants" PRIMARY KEY ("id")
      )
    `)

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL,
        "name" character varying NOT NULL,
        "email" character varying NOT NULL,
        "passwordHash" character varying NOT NULL,
        "role" "user_role_enum" NOT NULL DEFAULT 'agent',
        "active" boolean NOT NULL DEFAULT true,
        "refreshToken" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id"),
        CONSTRAINT "FK_users_tenant" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE
      )
    `)

    await queryRunner.query(`
      CREATE TABLE "leads" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL,
        "phone" character varying NOT NULL,
        "name" character varying,
        "serviceInterest" character varying,
        "status" "lead_status_enum" NOT NULL DEFAULT 'new',
        "botActive" boolean NOT NULL DEFAULT true,
        "assignedToUserId" uuid,
        "internalNotes" text,
        "waContactId" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_leads" PRIMARY KEY ("id"),
        CONSTRAINT "FK_leads_tenant" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE
      )
    `)

    await queryRunner.query(`CREATE INDEX "IDX_leads_tenantId" ON "leads" ("tenantId")`)
    await queryRunner.query(`CREATE INDEX "IDX_leads_phone" ON "leads" ("phone")`)
    await queryRunner.query(`CREATE INDEX "IDX_leads_status" ON "leads" ("status")`)

    await queryRunner.query(`
      CREATE TABLE "messages" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "leadId" uuid NOT NULL,
        "direction" "message_direction_enum" NOT NULL,
        "type" "message_type_enum" NOT NULL DEFAULT 'text',
        "body" text NOT NULL,
        "status" "message_status_enum",
        "waMessageId" character varying,
        "isAutomated" boolean NOT NULL DEFAULT false,
        "sentAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_messages" PRIMARY KEY ("id"),
        CONSTRAINT "FK_messages_lead" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE
      )
    `)

    await queryRunner.query(`CREATE INDEX "IDX_messages_leadId" ON "messages" ("leadId")`)

    await queryRunner.query(`
      CREATE TABLE "appointments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "leadId" uuid NOT NULL,
        "tenantId" uuid NOT NULL,
        "scheduledAt" TIMESTAMP NOT NULL,
        "service" character varying,
        "reminder24hSent" boolean NOT NULL DEFAULT false,
        "reminder2hSent" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_appointments" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_appointments_leadId" UNIQUE ("leadId"),
        CONSTRAINT "FK_appointments_lead" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE
      )
    `)

    await queryRunner.query(`
      CREATE TABLE "follow_up_jobs" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "leadId" uuid NOT NULL,
        "tenantId" uuid NOT NULL,
        "type" "follow_up_type_enum" NOT NULL,
        "status" "follow_up_status_enum" NOT NULL DEFAULT 'pending',
        "scheduledAt" TIMESTAMP NOT NULL,
        "bullJobId" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_follow_up_jobs" PRIMARY KEY ("id"),
        CONSTRAINT "FK_follow_up_jobs_lead" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE
      )
    `)

    await queryRunner.query(`
      CREATE TABLE "services" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL,
        "name" character varying NOT NULL,
        "price" numeric(10,2),
        "description" text,
        "promo" character varying,
        "requiresHuman" boolean NOT NULL DEFAULT false,
        "active" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_services" PRIMARY KEY ("id"),
        CONSTRAINT "FK_services_tenant" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE
      )
    `)

    await queryRunner.query(`
      CREATE TABLE "message_templates" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL,
        "type" "template_type_enum" NOT NULL,
        "body" text NOT NULL,
        "active" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_message_templates" PRIMARY KEY ("id"),
        CONSTRAINT "FK_message_templates_tenant" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE
      )
    `)

    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_message_templates_tenant_type" ON "message_templates" ("tenantId", "type")`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "message_templates"`)
    await queryRunner.query(`DROP TABLE "services"`)
    await queryRunner.query(`DROP TABLE "follow_up_jobs"`)
    await queryRunner.query(`DROP TABLE "appointments"`)
    await queryRunner.query(`DROP TABLE "messages"`)
    await queryRunner.query(`DROP TABLE "leads"`)
    await queryRunner.query(`DROP TABLE "users"`)
    await queryRunner.query(`DROP TABLE "tenants"`)
    await queryRunner.query(`DROP TYPE "template_type_enum"`)
    await queryRunner.query(`DROP TYPE "follow_up_status_enum"`)
    await queryRunner.query(`DROP TYPE "follow_up_type_enum"`)
    await queryRunner.query(`DROP TYPE "message_status_enum"`)
    await queryRunner.query(`DROP TYPE "message_type_enum"`)
    await queryRunner.query(`DROP TYPE "message_direction_enum"`)
    await queryRunner.query(`DROP TYPE "lead_status_enum"`)
    await queryRunner.query(`DROP TYPE "user_role_enum"`)
    await queryRunner.query(`DROP TYPE "tenant_status_enum"`)
    await queryRunner.query(`DROP TYPE "tenant_plan_enum"`)
  }
}
