import Image from 'next/image'
import {
  MessageCircle,
  Zap,
  CalendarPlus,
  Bell,
  RefreshCw,
  LayoutDashboard,
} from 'lucide-react'

const steps = [
  {
    num: '01',
    title: 'Llega el lead',
    desc: 'El prospecto escribe a tu WhatsApp Business. CitaFlow detecta el mensaje en tiempo real.',
    color: '#00b37e',
    Icon: MessageCircle,
    img: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80&auto=format&fit=crop',
    imgAlt: 'Persona enviando mensaje por WhatsApp',
  },
  {
    num: '02',
    title: 'Responde en 8 segundos',
    desc: 'El bot envía bienvenida, información del servicio y tu link de agenda — sin que muevas un dedo.',
    color: '#a855f7',
    Icon: Zap,
    img: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=600&q=80&auto=format&fit=crop',
    imgAlt: 'Notificación automática en teléfono',
  },
  {
    num: '03',
    title: 'El prospecto agenda',
    desc: 'El lead elige su horario en tu herramienta de reservas. CitaFlow registra la cita al instante.',
    color: '#60a5fa',
    Icon: CalendarPlus,
    img: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&q=80&auto=format&fit=crop',
    imgAlt: 'Calendario de citas en teléfono',
  },
  {
    num: '04',
    title: 'Recordatorios automáticos',
    desc: 'Se envían recordatorios 24h y 2h antes de la cita. Menos no-shows, más ingresos.',
    color: '#f59e0b',
    Icon: Bell,
    img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80&auto=format&fit=crop',
    imgAlt: 'Recordatorio de cita en teléfono',
  },
  {
    num: '05',
    title: 'Seguimiento inteligente',
    desc: 'Si el prospecto no agendó, CitaFlow hace follow-up a las 24h, 48h y 72h automáticamente.',
    color: '#00b37e',
    Icon: RefreshCw,
    img: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&q=80&auto=format&fit=crop',
    imgAlt: 'Follow up por mensajes',
  },
  {
    num: '06',
    title: 'Mides el resultado',
    desc: 'Tu dashboard muestra leads, citas, conversión y leads recuperados. Todo en tiempo real.',
    color: '#a855f7',
    Icon: LayoutDashboard,
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80&auto=format&fit=crop',
    imgAlt: 'Dashboard de métricas en laptop',
  },
]

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="relative py-24 md:py-32 overflow-hidden">
      {/* Green glow */}
      <div
        className="absolute top-20 -left-40 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: '#00b37e' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Label */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00b37e]/20 bg-[#00b37e]/5 text-xs text-[#00b37e] font-medium">
            Cómo ayuda CitaFlow
          </span>
        </div>

        {/* Headline */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2
            className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}
          >
            Un flujo claro para convertir{' '}
            <span className="gradient-text">mensajes en citas</span>
          </h2>
          <p className="text-white/50 text-base md:text-lg leading-relaxed">
            CitaFlow automatiza lo repetitivo: responder, orientar, enviar la agenda, hacer
            seguimiento y medir. Tu equipo entra cuando realmente se necesita.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {steps.map((s) => (
            <div
              key={s.num}
              className="group relative rounded-2xl overflow-hidden border border-white/5 bg-[#111118] hover:border-white/10 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={s.img}
                  alt={s.imgAlt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111118] via-[#111118]/40 to-transparent" />

                {/* Step number badge */}
                <div
                  className="absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: s.color }}
                >
                  {s.num}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Icon + title row */}
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${s.color}18`, border: `1px solid ${s.color}30` }}
                  >
                    <s.Icon className="w-4 h-4" style={{ color: s.color }} strokeWidth={1.5} />
                  </div>
                  <h3
                    className="text-white font-semibold text-base"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {s.title}
                  </h3>
                </div>
                <p className="text-white/40 text-sm leading-relaxed pl-11">{s.desc}</p>
              </div>

              {/* Bottom color line */}
              <div
                className="h-px mx-5 mb-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
                style={{ background: `linear-gradient(90deg, ${s.color}, transparent)` }}
              />
            </div>
          ))}
        </div>

        {/* Setup badge */}
        <div className="flex justify-center mt-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/8 bg-white/[0.03]">
            <Zap className="w-4 h-4 text-[#00b37e]" strokeWidth={2} />
            <span className="text-white/60 text-sm">
              Configuración express —{' '}
              <span className="text-white font-semibold">activo en menos de 5 minutos.</span>{' '}
              Sin conocimientos técnicos.
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
