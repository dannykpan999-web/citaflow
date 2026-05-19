'use client'

import Image from 'next/image'
import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    price: '$59',
    desc: 'Para clínicas que ya pierden leads y quieren empezar a recuperarlos sin complicaciones.',
    limit: 'Hasta 300 conversaciones activas/mes',
    features: [
      '1 número de WhatsApp conectado',
      'Hasta 10 servicios configurados por nosotros',
      'Mensajes base configurados llave en mano',
      '1 follow-up automático para leads fríos',
      'Recordatorio de cita 24 h antes',
      'Botón "Tomar control" (override humano)',
      'Panel de Resultados básico',
      'Activación normalmente en menos de 24 horas',
    ],
    cta: 'Probar Starter gratis →',
    recommended: false,
  },
  {
    name: 'Growth',
    price: '$89',
    desc: 'Para clínicas con volumen constante de leads que quieren máximo seguimiento y recuperación de citas perdidas.',
    limit: 'Hasta 800 conversaciones activas/mes',
    features: [
      'Todo lo del plan Starter, más:',
      'Hasta 25 servicios configurados',
      'Mensajes personalizados por servicio',
      '3 follow-ups automáticos (24 h, 48 h y 72 h)',
      'Recordatorio 24 h + 2 h antes de la cita',
      'Estados completos del lead (embudo visual)',
      'Panel de Resultados con Oportunidades de Venta',
      'Reporte de leads inactivos rescatados',
    ],
    cta: 'Probar Growth 14 días →',
    recommended: true,
  },
]

export default function Pricing() {
  return (
    <section id="planes" className="relative py-24 md:py-32 overflow-hidden"
      style={{ background: '#f8fafc' }}>

      {/* Background image */}
      <div className="absolute inset-0 pointer-events-none">
        <Image src="/images/bg-pricing.jpg" alt="" fill className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0" style={{ background: 'rgba(248,250,252,0.91)' }} />
      </div>

      {/* Subtle grid */}
      <div className="absolute inset-0 bg-grid-light opacity-60 pointer-events-none" />

      {/* Top glow */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.30), transparent)' }} />

      <div className="relative max-w-[1180px] mx-auto px-5">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 scroll-reveal">
          <span className="label-chip-light inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest"
            style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.22)', color: '#0e7490' }}>
            Planes
          </span>
          <h2 className="font-black leading-tight mb-4"
            style={{ fontFamily: "'DM Sans', sans-serif",
              fontSize: 'clamp(2rem, 4.5vw, 3rem)', letterSpacing: '-0.04em', color: '#0f172a' }}>
            Precio justo,{' '}
            <span className="gradient-text">resultados reales.</span>
          </h2>
          <p className="text-base" style={{ color: '#64748b' }}>
            Sin contratos a largo plazo. Sin costos ocultos. Cancela cuando quieras.
          </p>
        </div>

        {/* Trial banner */}
        <div className="flex items-center justify-center gap-3 px-6 py-3 rounded-full mb-10 w-fit mx-auto scroll-reveal"
          style={{
            border: '1px solid rgba(6,182,212,0.22)',
            background: 'rgba(6,182,212,0.06)',
            backdropFilter: 'blur(8px)',
          }}>
          <span className="w-2 h-2 rounded-full bg-cyan-500" />
          <span className="text-sm font-bold" style={{ color: '#0e7490' }}>
            14 días de prueba gratis incluidos en ambos planes
          </span>
          <span className="text-sm font-semibold" style={{ color: '#64748b' }}>·</span>
          <span className="text-sm font-semibold" style={{ color: '#64748b' }}>Sin tarjeta de crédito</span>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-5 max-w-[780px] mx-auto scroll-reveal-stagger">
          {plans.map((plan) => (
            <div key={plan.name}
              className={`relative rounded-2xl flex flex-col ${plan.recommended ? 'gradient-border-card' : ''}`}
              style={{
                background: plan.recommended ? '#ffffff' : '#ffffff',
                boxShadow: plan.recommended
                  ? '0 20px 60px rgba(6,182,212,0.16), 0 4px 16px rgba(6,182,212,0.08)'
                  : '0 8px 32px rgba(15,23,42,0.08)',
                border: plan.recommended ? 'none' : '1px solid rgba(15,23,42,0.09)',
                padding: plan.recommended ? '28px' : '28px',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.transform = 'translateY(-4px)'
                el.style.boxShadow = plan.recommended
                  ? '0 30px 80px rgba(6,182,212,0.22)'
                  : '0 20px 60px rgba(15,23,42,0.14)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.transform = ''
                el.style.boxShadow = plan.recommended
                  ? '0 20px 60px rgba(6,182,212,0.16), 0 4px 16px rgba(6,182,212,0.08)'
                  : '0 8px 32px rgba(15,23,42,0.08)'
              }}>

              {plan.recommended && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] font-black text-white whitespace-nowrap"
                  style={{ background: 'linear-gradient(90deg, #06b6d4, #3b82f6)', boxShadow: '0 4px 16px rgba(6,182,212,0.40)' }}>
                  ✦ Recomendado
                </div>
              )}

              <h3 className="text-xl font-black mb-1" style={{ color: '#0f172a' }}>{plan.name}</h3>
              <p className="text-sm leading-relaxed mb-5" style={{ color: '#64748b', minHeight: '42px' }}>
                {plan.desc}
              </p>

              <div className="mb-1">
                <span className="text-5xl font-black" style={{ color: '#0f172a', letterSpacing: '-0.06em' }}>
                  {plan.price}
                </span>
                <span className="text-sm ml-1" style={{ color: '#94a3b8' }}>USD/mes</span>
              </div>
              <div className="text-xs font-semibold mb-5" style={{ color: '#0891b2' }}>
                Después de los 14 días de prueba
              </div>

              <div className="rounded-xl px-4 py-3 mb-5 text-sm font-bold"
                style={{
                  background: plan.recommended ? 'rgba(6,182,212,0.07)' : '#f8fafc',
                  border: `1px solid ${plan.recommended ? 'rgba(6,182,212,0.18)' : 'rgba(15,23,42,0.08)'}`,
                  color: plan.recommended ? '#0891b2' : '#475569',
                }}>
                {plan.limit}
              </div>

              <ul className="space-y-2.5 flex-1 mb-7">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[13px]">
                    {i === 0 && plan.recommended ? (
                      <span className="font-bold" style={{ color: '#0f172a' }}>{f}</span>
                    ) : (
                      <>
                        <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ background: plan.recommended ? 'rgba(6,182,212,0.12)' : 'rgba(15,23,42,0.06)' }}>
                          <Check className="w-2.5 h-2.5" style={{ color: plan.recommended ? '#06b6d4' : '#22c55e' }} strokeWidth={3} />
                        </div>
                        <span style={{ color: '#475569' }}>{f}</span>
                      </>
                    )}
                  </li>
                ))}
              </ul>

              <a href="/signup"
                className={`block w-full text-center py-3.5 rounded-full font-bold text-sm transition-all duration-200 ${plan.recommended ? 'btn-primary' : ''}`}
                style={plan.recommended ? {} : {
                  background: '#ffffff',
                  border: '1px solid rgba(15,23,42,0.18)',
                  color: '#0f172a',
                }}>
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-sm mt-8 scroll-reveal" style={{ color: '#94a3b8' }}>
          14 días de prueba gratis · Sin tarjeta de crédito · Cancela cuando quieras
        </p>
      </div>
    </section>
  )
}
