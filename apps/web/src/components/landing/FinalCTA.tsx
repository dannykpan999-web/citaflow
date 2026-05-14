import Image from 'next/image'
import { Zap, Shield, CheckCircle2, ArrowRight } from 'lucide-react'

const trustItems = [
  { Icon: Zap, text: 'Activo en menos de 5 minutos' },
  { Icon: Shield, text: 'API oficial de Meta' },
  { Icon: CheckCircle2, text: '120+ clínicas activas' },
]

export default function FinalCTA() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1600&q=80&auto=format&fit=crop"
          alt="Clínica estética moderna"
          fill
          className="object-cover opacity-10"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-transparent to-[#0a0a0f]" />
      </div>

      {/* Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(0,179,126,0.12) 0%, transparent 60%)',
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00b37e]/20 bg-[#00b37e]/5 text-xs text-[#00b37e] font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00b37e] animate-pulse-dot" />
          Sin tarjeta de crédito · Sin contrato
        </div>

        {/* Headline */}
        <h2
          className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}
        >
          Tu agenda llena empieza{' '}
          <span className="gradient-text">hoy</span>
        </h2>

        <p className="text-white/50 text-base md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
          Únete a más de 120 clínicas que ya automatizan su WhatsApp con CitaFlow. Configura en
          menos de 5 minutos. Los resultados llegan desde el primer día.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <a
            href="#contacto"
            className="btn-shine inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-[#0a0a0f] text-base transition-all duration-200 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #00b37e, #34d399)',
              boxShadow: '0 0 40px rgba(0,179,126,0.4)',
            }}
          >
            Empezar gratis — 14 días
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </a>
          <a
            href="#como-funciona"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-sm text-white/70 border border-white/10 hover:border-white/25 hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            Ver cómo funciona
          </a>
        </div>

        {/* Trust items */}
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
          {trustItems.map((item) => (
            <div key={item.text} className="flex items-center gap-2 text-white/40 text-sm">
              <item.Icon className="w-4 h-4 text-[#00b37e]" strokeWidth={1.5} />
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
