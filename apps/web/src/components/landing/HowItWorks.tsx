import Image from 'next/image'
import {
  MessageCircle, Zap, FileText, CalendarCheck, Bell, BarChart2,
  Calendar, RefreshCw, Target, TrendingUp, UserCheck,
} from 'lucide-react'

const steps = [
  { Icon: MessageCircle, num: '1', title: 'Lead escribe por WhatsApp', desc: 'A las 2 AM, en fin de semana o en plena hora pico. CitaLead está siempre encendido.', img: '/images/hw-01-lead.jpg' },
  { Icon: Zap,           num: '2', title: 'Responde en 9 segundos',    desc: 'Respuesta personalizada al servicio exacto que preguntó, en segundos, no en horas.', img: '/images/hw-02-response.jpg' },
  { Icon: FileText,      num: '3', title: 'Cotiza y educa',            desc: 'Explica el servicio, da precios desde, menciona promociones activas.', img: '/images/hw-03-booking.jpg' },
  { Icon: CalendarCheck, num: '4', title: 'Envía la agenda',           desc: 'Envía el link de Calendly, Google Calendar o la agenda que tu clínica ya utiliza.', img: '/images/hw-04-reminder.jpg' },
  { Icon: Bell,          num: '5', title: 'Follow-up automático',      desc: 'Follow-ups automáticos a las 24 h, 48 h y cierre suave a las 72 h.', img: '/images/hw-05-followup.jpg' },
  { Icon: BarChart2,     num: '6', title: 'Reporta lo que vale',       desc: 'Ves leads, citas, recuperados y dónde se está perdiendo dinero en tiempo real.', img: '/images/hw-06-dashboard.jpg' },
]

const features = [
  { Icon: Zap,        title: 'Responde antes que tu competencia',    desc: 'Primer mensaje en segundos, a cualquier hora. Elimina el "ay, no vi el WhatsApp".', img: '/images/feat-01-whatsapp.jpg' },
  { Icon: Calendar,   title: 'Tu agenda, no la nuestra',             desc: 'Trabaja con Calendly, Google Calendar o la agenda que ya uses. Sin migrar nada.', img: '/images/feat-02-calendar.jpg' },
  { Icon: RefreshCw,  title: 'Rescata leads que ya pagaste',         desc: 'Ese prospecto que llegó por publicidad pagada y no agendó: CitaLead le da seguimiento.', img: '/images/feat-03-reminder.jpg' },
  { Icon: Target,     title: 'Especializado en clínicas',            desc: 'Entiende depilación láser, skincare, bótox y más. Nosotros lo configuramos con tus servicios.', img: '/images/feat-04-followup.jpg' },
  { Icon: TrendingUp, title: 'Oportunidades de venta visibles',      desc: 'Ve cuántos leads llegaron hoy, en qué estado están y cuáles requieren seguimiento.', img: '/images/feat-05-dashboard.jpg' },
  { Icon: UserCheck,  title: 'Tú mandas, siempre',                   desc: 'Con "Tomar control" cualquier staff puede entrar a la conversación y pausar CitaLead.', img: '/images/feat-06-control.jpg' },
]

const STEP_OVERLAY = 'linear-gradient(to top, rgba(3,20,35,0.97) 0%, rgba(3,20,35,0.88) 32%, rgba(3,20,35,0.22) 58%, transparent 72%)'
const FEAT_OVERLAY = 'linear-gradient(to top, rgba(3,20,35,0.96) 0%, rgba(3,20,35,0.84) 30%, rgba(3,20,35,0.18) 55%, transparent 70%)'

export default function HowItWorks() {
  return (
    <section id="funciona" className="py-24 md:py-32 relative overflow-hidden"
      style={{ background: '#f8fafc' }}>

      {/* Grid */}
      <div className="absolute inset-0 bg-grid-light opacity-60 pointer-events-none" />

      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.25), transparent)' }} />

      <div className="max-w-[1180px] mx-auto px-5">

        {/* ── Section header ─────────────────────────────────────── */}
        <div className="text-center max-w-3xl mx-auto mb-14 scroll-reveal">
          <span className="label-chip mb-5 inline-flex">Cómo funciona CitaLead</span>
          <h2 className="font-black leading-tight mb-4"
            style={{ fontFamily: "'DM Sans', sans-serif",
              fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', letterSpacing: '-0.04em', color: '#0f172a' }}>
            De un mensaje de WhatsApp{' '}
            <span className="gradient-text">a una cita confirmada.</span>
          </h2>
          <p className="text-base leading-relaxed" style={{ color: '#64748b' }}>
            CitaLead automatiza la primera respuesta, la calificación, el envío de agenda
            y el follow-up. Tu staff solo interviene cuando se necesita juicio humano real.
          </p>
        </div>

        {/* ── Steps grid ─────────────────────────────────────────── */}
        <div className="mb-4 scroll-reveal">
          <span className="text-[11px] font-black uppercase tracking-widest block mb-5"
            style={{ color: '#0891b2' }}>
            El flujo completo
          </span>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 scroll-reveal-stagger">
            {steps.map((s, i) => (
              <div key={s.num}
                className="relative rounded-2xl overflow-hidden group cursor-default"
                style={{
                  height: '340px',
                  boxShadow: '0 12px 40px rgba(15,23,42,0.14)',
                  border: '1px solid rgba(15,23,42,0.10)',
                  animationDelay: `${i * 0.08}s`,
                }}>

                {/* Image */}
                <Image
                  src={s.img} alt={s.title} fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                />

                {/* Overlay */}
                <div className="absolute inset-0 transition-opacity duration-300"
                  style={{ background: STEP_OVERLAY }} />

                {/* Hover glow border */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ boxShadow: 'inset 0 0 0 1px rgba(6,182,212,0.40)' }} />

                {/* Step badge */}
                <div className="absolute top-4 left-4 w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-black"
                  style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', boxShadow: '0 4px 16px rgba(6,182,212,0.50)' }}>
                  {s.num}
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', boxShadow: '0 4px 14px rgba(6,182,212,0.40)' }}>
                    <s.Icon className="w-[18px] h-[18px] text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-white font-bold text-[15px] mb-1.5 leading-snug"
                    style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                    {s.num}. {s.title}
                  </h3>
                  <p className="text-[12.5px] leading-relaxed" style={{ color: 'rgba(241,245,249,0.65)' }}>
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Why CitaLead ────────────────────────────────────────── */}
        <div className="mt-20">
          <div className="mb-10 scroll-reveal">
            <span id="por-que" className="text-[11px] font-black uppercase tracking-widest block mb-3"
              style={{ color: '#0891b2' }}>
              ¿Por qué CitaLead y no un asistente genérico?
            </span>
            <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-12">
              <h2 className="font-black leading-tight"
                style={{ fontFamily: "'DM Sans', sans-serif",
                  fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', letterSpacing: '-0.03em', color: '#0f172a' }}>
                Sistema llave en mano,<br />
                <span className="gradient-text">exclusivo para clínicas estéticas.</span>
              </h2>
              <p className="text-[14.5px] leading-relaxed max-w-sm flex-shrink-0"
                style={{ color: '#64748b' }}>
                No somos un sistema genérico que tardas 3 semanas en configurar. CitaLead es
                Done-For-You: nosotros lo armamos con tus servicios, tu tono y tu agenda.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 scroll-reveal-stagger">
            {features.map((f, i) => (
              <div key={f.title}
                className="relative rounded-2xl overflow-hidden group cursor-default"
                style={{
                  height: '320px',
                  boxShadow: '0 12px 40px rgba(15,23,42,0.14)',
                  border: '1px solid rgba(15,23,42,0.10)',
                  animationDelay: `${i * 0.08}s`,
                }}>

                <Image
                  src={f.img} alt={f.title} fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                />

                <div className="absolute inset-0" style={{ background: FEAT_OVERLAY }} />

                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ boxShadow: 'inset 0 0 0 1px rgba(6,182,212,0.35)' }} />

                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: 'linear-gradient(135deg, #0284c7, #6366f1)', boxShadow: '0 4px 14px rgba(2,132,199,0.45)' }}>
                    <f.Icon className="w-[18px] h-[18px] text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-white font-bold text-[14.5px] mb-1.5 leading-snug"
                    style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                    {f.title}
                  </h3>
                  <p className="text-[12.5px] leading-relaxed" style={{ color: 'rgba(241,245,249,0.65)' }}>
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
