'use client'

import { useState } from 'react'
import { Plus, Minus, HelpCircle } from 'lucide-react'

const faqs = [
  {
    q: '¿Necesito conocimientos técnicos para configurar CitaFlow?',
    a: 'No. La configuración toma menos de 10 minutos. Te guiamos paso a paso: conectas tu WhatsApp Business, personalizas los mensajes del bot y listo. Sin código, sin APIs complejas.',
  },
  {
    q: '¿CitaFlow funciona con cualquier herramienta de agenda?',
    a: 'Sí. CitaFlow envía el link de tu herramienta de reservas actual (Calendly, Acuity, Google Calendar, o cualquier otra). No necesitas cambiar tu sistema existente.',
  },
  {
    q: '¿Qué pasa si el cliente quiere hablar con una persona?',
    a: 'CitaFlow detecta cuando la conversación necesita atención humana. Puedes pausar el bot con un clic y retomar la conversación manualmente. El bot no interfiere cuando tú estás activo.',
  },
  {
    q: '¿Es la API oficial de WhatsApp o una solución gris?',
    a: 'Usamos la API oficial de Meta (WhatsApp Business Platform). Tu número está completamente seguro y cumple con los términos de servicio de WhatsApp. Sin riesgo de bloqueo.',
  },
  {
    q: '¿Cuánto tiempo tarda en verse resultados?',
    a: 'Nuestros clientes reportan mejoras desde el primer día: leads que antes no recibían respuesta rápida, ahora son atendidos en segundos. La reducción de no-shows se nota en la primera semana.',
  },
  {
    q: '¿Puedo cancelar en cualquier momento?',
    a: 'Sí, sin penalizaciones. Cancela desde tu panel con un clic. No hay contratos a largo plazo ni costos de cancelación.',
  },
  {
    q: '¿Los mensajes del bot suenan robóticos?',
    a: 'Los mensajes son completamente personalizables y están diseñados para sonar naturales. Puedes editar cada plantilla para que refleje el tono de tu clínica — formal, cercano, o el que prefieras.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="relative py-24 md:py-32 overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Label */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-white/60 font-medium">
            <HelpCircle className="w-3 h-3" />
            Preguntas frecuentes
          </span>
        </div>

        {/* Headline */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}
          >
            Todo lo que necesitas{' '}
            <span className="gradient-text">saber</span>
          </h2>
        </div>

        {/* FAQ list */}
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl border bg-[#111118] overflow-hidden transition-all duration-200"
              style={{ borderColor: open === i ? 'rgba(0,179,126,0.25)' : 'rgba(255,255,255,0.05)' }}
            >
              <button
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span
                  className="text-white font-medium text-sm sm:text-base"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {faq.q}
                </span>
                <div
                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200"
                  style={
                    open === i
                      ? { background: '#00b37e', color: '#0a0a0f' }
                      : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }
                  }
                >
                  {open === i ? (
                    <Minus className="w-3.5 h-3.5" strokeWidth={2.5} />
                  ) : (
                    <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                  )}
                </div>
              </button>

              <div
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: open === i ? '300px' : '0px' }}
              >
                <p className="px-6 pb-5 text-white/50 text-sm leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-white/30 text-sm mt-10">
          ¿Tienes otra pregunta?{' '}
          <a href="#contacto" className="text-[#00b37e] hover:text-[#34d399] transition-colors">
            Escríbenos →
          </a>
        </p>
      </div>
    </section>
  )
}
