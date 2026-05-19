'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    q: '¿Es un sistema genérico de respuestas automáticas?',
    a: 'No. Es un sistema llave en mano configurado específicamente con tus servicios, tu tono y tu agenda de WhatsApp. Tus pacientes notarán que es el asistente de tu clínica, no un sistema genérico.',
  },
  {
    q: '¿Necesito cambiar mi agenda?',
    a: 'No. Trabajamos con el link de Calendly, Google Calendar o tu agenda de preferencia. Sin migraciones, sin complicaciones — tu flujo actual se mantiene desde el primer día.',
  },
  {
    q: '¿Cuánto tiempo tarda la activación?',
    a: 'Normalmente en menos de 24 horas después de recibir la información necesaria. Nosotros configuramos todo: WhatsApp, servicios, mensajes y link de agenda. Tú apruebas y encendemos.',
  },
  {
    q: '¿Puedo intervenir en las conversaciones?',
    a: 'Sí, en cualquier momento. El botón "Tomar control" permite pausar CitaLead para que tú o tu recepción atiendan manualmente. Después pueden reactivarlo cuando sea necesario.',
  },
  {
    q: '¿Vale la pena el costo?',
    a: 'Si CitaLead te recupera 2 prospectos al mes que antes te dejaban en visto, el sistema ya se pagó solo. Durante los 14 días de prueba medimos leads, citas y recuperados para que lo veas con tus propios números.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="relative py-24 md:py-28 overflow-hidden"
      style={{ background: '#f8fafc' }}>

      {/* Subtle grid */}
      <div className="absolute inset-0 bg-grid-light opacity-50 pointer-events-none" />

      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.20), transparent)' }} />

      <div className="relative max-w-[780px] mx-auto px-5">

        {/* Header */}
        <div className="text-center mb-14 scroll-reveal">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest mb-5"
            style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.22)', color: '#0e7490' }}>
            Preguntas frecuentes
          </span>
          <h2 className="font-black leading-tight mb-4"
            style={{ fontFamily: "'DM Sans', sans-serif",
              fontSize: 'clamp(1.9rem, 4vw, 2.8rem)', letterSpacing: '-0.04em', color: '#0f172a' }}>
            Lo que nos preguntan{' '}
            <span className="gradient-text">antes de activar.</span>
          </h2>
          <p className="text-base" style={{ color: '#64748b' }}>
            Respuestas directas para tomar la decisión con toda la información.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3 scroll-reveal-stagger">
          {faqs.map((faq, i) => {
            const isOpen = open === i
            return (
              <div key={i}
                className="rounded-2xl overflow-hidden transition-all duration-300"
                style={{
                  border: isOpen ? '1px solid rgba(6,182,212,0.30)' : '1px solid rgba(15,23,42,0.08)',
                  background: isOpen ? '#ffffff' : '#ffffff',
                  boxShadow: isOpen ? '0 8px 32px rgba(6,182,212,0.10)' : '0 2px 8px rgba(15,23,42,0.04)',
                }}>

                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left transition-colors"
                >
                  <span className="font-bold text-[15px] leading-snug flex-1"
                    style={{ color: isOpen ? '#0e7490' : '#0f172a' }}>
                    {faq.q}
                  </span>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                    style={{
                      background: isOpen ? 'rgba(6,182,212,0.12)' : 'rgba(15,23,42,0.06)',
                      color: isOpen ? '#06b6d4' : '#64748b',
                      transform: isOpen ? 'rotate(0deg)' : 'rotate(0deg)',
                    }}>
                    {isOpen
                      ? <Minus className="w-3.5 h-3.5" strokeWidth={2.5} />
                      : <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                    }
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5" style={{ animation: 'accordion-open 0.25s ease both' }}>
                    <p className="text-[14px] leading-relaxed" style={{ color: '#475569' }}>
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <p className="text-center text-sm mt-10 scroll-reveal" style={{ color: '#94a3b8' }}>
          ¿Tienes otra pregunta?{' '}
          <a href="/signup" className="font-semibold transition-colors"
            style={{ color: '#0891b2' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#0e7490')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#0891b2')}>
            Escríbenos →
          </a>
        </p>
      </div>
    </section>
  )
}
