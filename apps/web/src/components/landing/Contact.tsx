'use client'

import Image from 'next/image'
import { useState } from 'react'
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react'

const perks = [
  '14 días de prueba gratuita',
  'Configuración guiada en vivo',
  'Sin tarjeta de crédito requerida',
  'Soporte personalizado desde el día 1',
]

const fields = [
  { id: 'name', label: 'Tu nombre', placeholder: 'Ej. Mariana Torres', type: 'text' },
  { id: 'clinic', label: 'Nombre de tu clínica', placeholder: 'Ej. Clínica Lumina', type: 'text' },
  { id: 'phone', label: 'WhatsApp Business', placeholder: '+52 55 1234 5678', type: 'tel' },
  { id: 'email', label: 'Correo electrónico', placeholder: 'mariana@clinica.mx', type: 'email' },
]

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    const form = e.currentTarget
    const data = Object.fromEntries(
      fields.map((f) => [f.id, (form.elements.namedItem(f.id) as HTMLInputElement).value])
    )
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contacto" className="relative py-24 md:py-32 overflow-hidden">
      <div
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-8 pointer-events-none"
        style={{ background: '#a855f7' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — copy + image */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00b37e]/20 bg-[#00b37e]/5 text-xs text-[#00b37e] font-medium mb-6">
              Empieza gratis
            </div>

            <h2
              className="text-3xl md:text-5xl font-bold text-white mb-5 leading-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}
            >
              Activa CitaFlow en{' '}
              <span className="gradient-text">tu clínica hoy</span>
            </h2>

            <p className="text-white/50 text-base leading-relaxed mb-8">
              Déjanos tus datos y un especialista te contacta en menos de 2 horas para ayudarte a
              configurar CitaFlow. Sin costo, sin compromiso.
            </p>

            <ul className="space-y-3 mb-10">
              {perks.map((perk) => (
                <li key={perk} className="flex items-center gap-3">
                  <CheckCircle2
                    className="w-5 h-5 flex-shrink-0"
                    style={{ color: '#00b37e' }}
                    strokeWidth={1.5}
                  />
                  <span className="text-white/60 text-sm">{perk}</span>
                </li>
              ))}
            </ul>

            {/* Clinic image */}
            <div className="relative h-48 rounded-2xl overflow-hidden border border-white/5">
              <Image
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80&auto=format&fit=crop"
                alt="Clínica estética profesional"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/60 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-white text-sm font-semibold">Clínica Lumina — CDMX</p>
                <p className="text-white/50 text-xs">Cliente CitaFlow desde 2024</p>
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div>
            <div className="rounded-2xl border border-white/8 bg-[#111118] p-8">
              {status === 'sent' ? (
                <div className="text-center py-12">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(0,179,126,0.15)', border: '1px solid rgba(0,179,126,0.3)' }}>
                    <CheckCircle2 className="w-7 h-7 text-[#00b37e]" strokeWidth={1.5} />
                  </div>
                  <h3
                    className="text-white font-bold text-xl mb-2"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    ¡Mensaje enviado!
                  </h3>
                  <p className="text-white/50 text-sm">
                    Un especialista te contactará en menos de 2 horas.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3
                    className="text-white font-bold text-xl mb-6"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    Solicita tu demo gratuita
                  </h3>

                  {fields.map((field) => (
                    <div key={field.id}>
                      <label
                        className="block text-white/50 text-xs font-medium mb-1.5"
                        htmlFor={field.id}
                      >
                        {field.label}
                      </label>
                      <input
                        id={field.id}
                        name={field.id}
                        type={field.type}
                        placeholder={field.placeholder}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-white/8 bg-white/[0.04] text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#00b37e]/40 focus:bg-white/[0.06] transition-all duration-200"
                      />
                    </div>
                  ))}

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="btn-shine w-full py-4 rounded-full font-semibold text-[#0a0a0f] text-sm transition-all duration-200 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{
                      background: 'linear-gradient(135deg, #00b37e, #34d399)',
                      boxShadow: '0 0 30px rgba(0,179,126,0.3)',
                    }}
                  >
                    {status === 'sending' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        Quiero empezar gratis
                        <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                      </>
                    )}
                  </button>

                  {status === 'error' && (
                    <p className="text-rose-400 text-xs text-center">
                      Hubo un error. Intenta de nuevo o escríbenos directamente.
                    </p>
                  )}

                  <p className="text-white/25 text-xs text-center">
                    Al enviar aceptas nuestros Términos de Servicio y Política de Privacidad.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
