import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Resend } from 'resend'

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name)
  private resend: Resend
  private from: string

  constructor(private cfg: ConfigService) {
    this.resend = new Resend(this.cfg.get<string>('RESEND_API_KEY'))
    this.from = this.cfg.get<string>('RESEND_FROM_EMAIL', 'CitaLead <onboarding@resend.dev>')
  }

  async sendWelcome(clinicName: string, email: string, userName: string, trialEndsAt: Date): Promise<void> {
    const trialDate = trialEndsAt.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
    try {
      await this.resend.emails.send({
        from: this.from,
        to: email,
        subject: `¡Bienvenido a CitaLead, ${userName}! Tu prueba gratuita ha comenzado 🚀`,
        html: this.welcomeHtml(clinicName, userName, trialDate),
      })
      this.logger.log(`Welcome email sent to ${email}`)
    } catch (err) {
      this.logger.error(`Failed to send welcome email to ${email}: ${err}`)
    }
  }

  async sendNewLeadNotification(ownerEmail: string, clinicName: string, leadPhone: string): Promise<void> {
    try {
      await this.resend.emails.send({
        from: this.from,
        to: ownerEmail,
        subject: `📲 Nuevo lead en ${clinicName}`,
        html: this.newLeadHtml(clinicName, leadPhone),
      })
      this.logger.log(`New lead email sent to ${ownerEmail}`)
    } catch (err) {
      this.logger.error(`Failed to send new lead email to ${ownerEmail}: ${err}`)
    }
  }

  private welcomeHtml(clinicName: string, userName: string, trialDate: string): string {
    return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:'Segoe UI',Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:40px 20px">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#06b6d4,#3b82f6);padding:36px 40px;text-align:center">
          <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:-0.5px">CitaLead</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px">Automatización de citas por WhatsApp</p>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:40px">
          <h2 style="margin:0 0 8px;color:#0f172a;font-size:22px;font-weight:700">¡Hola, ${userName}! 👋</h2>
          <p style="margin:0 0 24px;color:#64748b;font-size:15px;line-height:1.6">
            Tu cuenta de <strong style="color:#0f172a">${clinicName}</strong> está lista. Tu prueba gratuita de 14 días está activa hasta el <strong>${trialDate}</strong>.
          </p>
          <!-- Steps -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px">
            ${[
              ['1', 'Conecta tu WhatsApp Business', 'Ve a Configuración y agrega tu número y token de Meta.'],
              ['2', 'Agrega tus servicios', 'Crea los servicios de tu clínica para que el asistente los conozca.'],
              ['3', 'Activa tu asistente de IA', 'El bot responderá leads automáticamente y agendará citas 24/7.'],
            ].map(([n, title, desc]) => `
            <tr><td style="padding:12px 0;border-bottom:1px solid #f1f5f9">
              <table cellpadding="0" cellspacing="0"><tr>
                <td style="width:36px;height:36px;background:linear-gradient(135deg,#06b6d4,#3b82f6);border-radius:50%;text-align:center;vertical-align:middle;color:#fff;font-weight:800;font-size:14px">${n}</td>
                <td style="padding-left:14px">
                  <p style="margin:0;color:#0f172a;font-weight:600;font-size:14px">${title}</p>
                  <p style="margin:2px 0 0;color:#64748b;font-size:13px">${desc}</p>
                </td>
              </tr></table>
            </td></tr>`).join('')}
          </table>
          <!-- CTA -->
          <div style="text-align:center;margin-bottom:32px">
            <a href="${this.cfg.get('WEB_URL', 'http://31.220.53.87:8080')}/dashboard"
               style="display:inline-block;background:linear-gradient(135deg,#06b6d4,#3b82f6);color:#ffffff;font-weight:700;font-size:15px;padding:14px 32px;border-radius:10px;text-decoration:none">
              Ir a mi dashboard →
            </a>
          </div>
          <p style="margin:0;color:#94a3b8;font-size:12px;text-align:center">¿Necesitas ayuda? Escríbenos por WhatsApp o al chat de soporte.</p>
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #f1f5f9">
          <p style="margin:0;color:#94a3b8;font-size:11px">© ${new Date().getFullYear()} CitaLead · Todos los derechos reservados</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
  }

  private newLeadHtml(clinicName: string, leadPhone: string): string {
    const now = new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })
    return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:'Segoe UI',Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:40px 20px">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
        <tr><td style="background:linear-gradient(135deg,#06b6d4,#3b82f6);padding:28px 36px;text-align:center">
          <p style="margin:0;color:#fff;font-size:28px">📲</p>
          <h2 style="margin:8px 0 0;color:#fff;font-size:20px;font-weight:700">Nuevo lead recibido</h2>
        </td></tr>
        <tr><td style="padding:32px 36px">
          <p style="margin:0 0 20px;color:#64748b;font-size:15px">
            Un nuevo contacto escribió a <strong style="color:#0f172a">${clinicName}</strong> por WhatsApp. El asistente de IA ya está respondiendo.
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0;margin-bottom:28px">
            <tr><td style="padding:16px 20px">
              <p style="margin:0 0 4px;color:#94a3b8;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em">Teléfono</p>
              <p style="margin:0;color:#0f172a;font-size:16px;font-weight:700">${leadPhone}</p>
            </td></tr>
            <tr><td style="padding:12px 20px;border-top:1px solid #e2e8f0">
              <p style="margin:0 0 4px;color:#94a3b8;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em">Recibido</p>
              <p style="margin:0;color:#0f172a;font-size:14px">${now} (CDMX)</p>
            </td></tr>
          </table>
          <div style="text-align:center">
            <a href="${this.cfg.get('WEB_URL', 'http://31.220.53.87:8080')}/dashboard/leads"
               style="display:inline-block;background:linear-gradient(135deg,#06b6d4,#3b82f6);color:#fff;font-weight:700;font-size:14px;padding:12px 28px;border-radius:10px;text-decoration:none">
              Ver lead en dashboard →
            </a>
          </div>
        </td></tr>
        <tr><td style="background:#f8fafc;padding:16px 36px;text-align:center;border-top:1px solid #f1f5f9">
          <p style="margin:0;color:#94a3b8;font-size:11px">© ${new Date().getFullYear()} CitaLead</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
  }
}
