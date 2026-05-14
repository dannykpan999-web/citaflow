'use client'

import Image from 'next/image'
import { Check, Zap } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    price: '$59',
    period: '/mes',
    desc: 'Para clínicas que quieren automatizar WhatsApp por primera vez.',
    color: '#60a5fa',
    img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80&auto=format&fit=crop',
    imgAlt: 'Clínica pequeña de estética',
    features: [
      '1 número de WhatsApp Business',
      'Hasta 300 conversaciones/mes',
      'Bot de respuesta automática',
      'Envío de link de agenda',
      'Recordatorios 24h y 2h antes',
      'Follow-up hasta 72h',
      'Dashboard básico',
      'Soporte por email',
    ],
    cta: 'Empezar gratis 14 días',
    highlighted: false,
  },
  {
    name: 'Growth',
    price: '$99',
    period: '/mes',
    desc: 'Para clínicas en crecimiento que necesitan más capacidad y análisis.',
    color: '#00b37e',
    img: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80&auto=format&fit=crop',
    imgAlt: 'Clínica moderna de tratamientos',
    features: [
      '3 números de WhatsApp Business',
      'Conversaciones ilimitadas',
      'Bot avanzado con calificación',
      'Integración con cualquier agenda',
      'Recordatorios personalizables',
      'Seguimiento multi-etapa configurable',
      'Dashboard avanzado + exportar',
      'Soporte prioritario 24/7',
      'Onboarding personalizado',
    ],
    cta: 'Empezar gratis 14 días',
    highlighted: true,
    badge: 'Más popular',
  },
]

export default function Pricing() {
  return (
    <section id="precios" className="relative py-24 md:py-32 overflow-hidden">
      <div
        className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-8 pointer-events-none"
        style={{ background: '#00b37e' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Label */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#60a5fa]/20 bg-[#60a5fa]/5 text-xs text-[#60a5fa] font-medium">
            Precios
          </span>
        </div>

        {/* Headline */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2
            className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}
          >
            Precio justo,{' '}
            <span className="gradient-text">resultados reales</span>
          </h2>
          <p className="text-white/50 text-base md:text-lg">
            Sin contratos a largo plazo. Sin costos ocultos. Cancela cuando quieras.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl overflow-hidden border transition-all duration-300 ${
                plan.highlighted
                  ? 'border-[#00b37e]/30 bg-[#0f1a15]'
                  : 'border-white/5 bg-[#111118] hover:border-white/10'
              }`}
            >
              {plan.highlighted && (
                <div
                  className="absolute inset-0 pointer-events-none rounded-2xl"
                  style={{ boxShadow: 'inset 0 0 60px rgba(0,179,126,0.06)' }}
                />
              )}

              {/* Badge */}
              {plan.badge && (
                <div className="absolute top-4 right-4 z-10">
                  <span
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ background: 'linear-gradient(135deg, #00b37e, #34d399)' }}
                  >
                    <Zap className="w-3 h-3" fill="white" />
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Image */}
              <div className="relative h-40 overflow-hidden">
                <Image
                  src={plan.img}
                  alt={plan.imgAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: plan.highlighted
                      ? 'linear-gradient(to bottom, transparent 20%, #0f1a15 100%)'
                      : 'linear-gradient(to bottom, transparent 20%, #111118 100%)',
                  }}
                />
              </div>

              <div className="p-7">
                {/* Plan name */}
                <div className="mb-4">
                  <h3
                    className="text-white font-bold text-xl mb-1"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {plan.name}
                  </h3>
                  <p className="text-white/40 text-sm">{plan.desc}</p>
                </div>

                {/* Price */}
                <div className="flex items-end gap-1 mb-6">
                  <span
                    className="text-5xl font-extrabold"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: plan.color }}
                  >
                    {plan.price}
                  </span>
                  <span className="text-white/40 text-sm mb-2">{plan.period}</span>
                </div>

                {/* CTA */}
                <a
                  href="#contacto"
                  className={`block w-full text-center py-3 rounded-full font-semibold text-sm mb-7 transition-all duration-200 ${
                    plan.highlighted
                      ? 'text-[#0a0a0f] hover:scale-105'
                      : 'text-white border border-white/15 hover:border-white/30 hover:bg-white/5'
                  }`}
                  style={
                    plan.highlighted
                      ? {
                          background: 'linear-gradient(135deg, #00b37e, #34d399)',
                          boxShadow: '0 0 24px rgba(0,179,126,0.3)',
                        }
                      : {}
                  }
                >
                  {plan.cta}
                </a>

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <div
                        className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: `${plan.color}20` }}
                      >
                        <Check className="w-2.5 h-2.5" style={{ color: plan.color }} strokeWidth={3} />
                      </div>
                      <span className="text-white/60 text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Trust note */}
        <p className="text-center text-white/30 text-sm mt-8">
          14 días de prueba gratis · Sin tarjeta de crédito · Cancela cuando quieras
        </p>
      </div>
    </section>
  )
}
