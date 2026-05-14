'use client'

import Image from 'next/image'
import {
  MessageCircle,
  CalendarCheck,
  Bell,
  RefreshCw,
  LayoutDashboard,
  UserCheck,
} from 'lucide-react'

const mainFeatures = [
  {
    title: 'Respuesta instantánea en WhatsApp',
    desc: 'El bot responde en menos de 8 segundos: bienvenida, info del servicio y link de agenda. Nunca más un lead sin respuesta.',
    color: '#00b37e',
    Icon: MessageCircle,
    img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80&auto=format&fit=crop',
    imgAlt: 'Persona usando WhatsApp en teléfono inteligente',
    span: 'lg:col-span-2',
    imgHeight: 'h-52',
  },
  {
    title: 'Agenda automática',
    desc: 'CitaFlow envía tu link de reservas y registra la cita al instante.',
    color: '#a855f7',
    Icon: CalendarCheck,
    img: 'https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?w=600&q=80&auto=format&fit=crop',
    imgAlt: 'Calendario de citas digital',
    span: 'lg:col-span-1',
    imgHeight: 'h-52',
  },
]

const secondaryFeatures = [
  {
    title: 'Recordatorios automáticos',
    desc: 'Mensajes 24h y 2h antes de la cita. Reduce no-shows hasta un 75%.',
    color: '#60a5fa',
    Icon: Bell,
    img: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=600&q=80&auto=format&fit=crop',
    imgAlt: 'Notificación de recordatorio en teléfono',
    span: 'lg:col-span-1',
    imgHeight: 'h-48',
  },
  {
    title: 'Seguimiento inteligente multi-etapa',
    desc: 'Si el prospecto no agendó, CitaFlow hace follow-up a las 12h, 24h, 48h y 72h — sin intervención humana.',
    color: '#f59e0b',
    Icon: RefreshCw,
    img: 'https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=800&q=80&auto=format&fit=crop',
    imgAlt: 'Secuencia de mensajes de seguimiento',
    span: 'lg:col-span-2',
    imgHeight: 'h-48',
  },
]

const bottomFeatures = [
  {
    title: 'Dashboard en tiempo real',
    desc: 'Visualiza leads, citas agendadas, tasa de conversión y leads recuperados. Todo actualizado al instante.',
    color: '#a855f7',
    Icon: LayoutDashboard,
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80&auto=format&fit=crop',
    imgAlt: 'Dashboard de analíticas en pantalla',
    span: 'lg:col-span-2',
    imgHeight: 'h-48',
  },
  {
    title: 'Control humano cuando se necesita',
    desc: 'Pausa el bot con un clic y retoma la conversación. CitaFlow sabe cuándo ceder el paso.',
    color: '#00b37e',
    Icon: UserCheck,
    img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80&auto=format&fit=crop',
    imgAlt: 'Médico usando tablet en clínica',
    span: 'lg:col-span-1',
    imgHeight: 'h-48',
  },
]

type FeatureItem = {
  title: string
  desc: string
  color: string
  Icon: React.ElementType
  img: string
  imgAlt: string
  span: string
  imgHeight: string
}

function FeatureCard({ title, desc, color, Icon, img, imgAlt, span, imgHeight }: FeatureItem) {
  return (
    <div
      className={`group relative rounded-2xl overflow-hidden border border-white/5 bg-[#111118] hover:border-white/10 transition-all duration-300 ${span}`}
    >
      <div className={`relative ${imgHeight} overflow-hidden`}>
        <Image
          src={img}
          alt={imgAlt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 66vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111118] via-[#111118]/30 to-transparent" />
      </div>

      <div className="p-6">
        {/* Icon + title */}
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${color}15`, border: `1px solid ${color}25` }}
          >
            <Icon className="w-4 h-4" style={{ color }} strokeWidth={1.5} />
          </div>
          <h3
            className="text-white font-semibold text-base"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {title}
          </h3>
        </div>
        <p className="text-white/40 text-sm leading-relaxed pl-12">{desc}</p>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />
    </div>
  )
}

export default function Features() {
  return (
    <section id="funcionalidades" className="relative py-24 md:py-32 overflow-hidden">
      <div
        className="absolute top-1/2 right-0 w-96 h-96 rounded-full blur-3xl opacity-8 pointer-events-none"
        style={{ background: '#a855f7' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Label */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#a855f7]/20 bg-[#a855f7]/5 text-xs text-[#a855f7] font-medium">
            Funcionalidades
          </span>
        </div>

        {/* Headline */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2
            className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}
          >
            Todo lo que necesitas para{' '}
            <span className="gradient-text">llenar tu agenda</span>
          </h2>
          <p className="text-white/50 text-base md:text-lg leading-relaxed">
            CitaFlow automatiza el ciclo completo: responder, agendar, recordar y hacer seguimiento.
            Sin integraciones complejas ni conocimientos técnicos.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="space-y-4">
          <div className="grid lg:grid-cols-3 gap-4">
            {mainFeatures.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
          <div className="grid lg:grid-cols-3 gap-4">
            {secondaryFeatures.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
          <div className="grid lg:grid-cols-3 gap-4">
            {bottomFeatures.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
