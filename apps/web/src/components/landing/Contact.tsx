'use client'

import { useState } from 'react'
import Image from 'next/image'
import { CheckCircle2, ArrowRight, Loader2, Check } from 'lucide-react'

const fields = [
  { id: 'name',   label: 'Nombre',   placeholder: 'Tu nombre',           type: 'text', autoComplete: 'name' },
  { id: 'clinic', label: 'Clínica',  placeholder: 'Nombre de tu clínica', type: 'text', autoComplete: 'organization' },
  { id: 'phone',  label: 'WhatsApp', placeholder: '+52...',               type: 'tel',  autoComplete: 'tel' },
  { id: 'city',   label: 'Ciudad',   placeholder: 'Ej. Hermosillo',       type: 'text', autoComplete: 'address-level2' },
]

const contactPoints = [
  'Sesión de activación — tú eliges el horario.',
  'Configuración de WhatsApp, servicios y agenda hecha por nuestro equipo.',
  'Mensajes de seguimiento con el tono de tu clínica.',
  'CitaLead listo normalmente en menos de 24 horas después de recibir la información necesaria.',
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
    <section id="contacto" className="relative py-24 md:py-32 overflow-hidden"
      style={{ background: '#f8fafc' }}>

      {/* Grid */}
      <div className="absolute inset-0 bg-grid-light opacity-60 pointer-events-none" />

      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.25), transparent)' }} />

      {/* Subtle aurora */}
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full pointer-events-none animate-aurora-1"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      <div className="relative max-w-[1180px] mx-auto px-5">

        {/* Header */}
        <div className="text-center mb-14 scroll-reveal">
          <span className="label-chip mb-5 inline-flex">Prueba gratis 14 días</span>
          <h2 className="font-black leading-tight mb-4 max-w-2xl mx-auto"
            style={{ fontFamily: "'DM Sans', sans-serif",
              fontSize: 'clamp(1.9rem, 4vw, 2.8rem)', letterSpacing: '-0.04em', color: '#0f172a' }}>
            Tu cuenta lista normalmente{' '}
            <span className="gradient-text">en menos de 24 horas.</span>
          </h2>
          <p className="text-base max-w-lg mx-auto" style={{ color: '#64748b' }}>
            Nosotros configuramos todo. Sin horas peleándote con plataformas.
          </p>
        </div>

        {/* Two columns */}
        <div className="grid lg:grid-cols-2 gap-5 max-w-[960px] mx-auto items-stretch">

          {/* Left: clinic image with teal overlay */}
          <div className="relative rounded-2xl overflow-hidden scroll-reveal-left"
            style={{ minHeight: '400px', border: '1px solid rgba(6,182,212,0.15)', boxShadow: '0 20px 60px rgba(6,182,212,0.10)' }}>
            <div className="absolute inset-0">
              <Image
                src="/images/contact-clinic.jpg"
                alt="Clínica estética"
                fill
                className="object-cover"
                sizes="(max-width:1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0"
                style={{ background: 'linear-gradient(160deg, rgba(6,182,212,0.80) 0%, rgba(59,130,246,0.85) 100%)' }} />
            </div>

            <div className="relative p-7 h-full flex flex-col">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-5 self-start"
                style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.30)', color: '#ffffff' }}>
                Servicio Done-For-You
              </span>
              <h3 className="text-2xl font-black text-white leading-tight mb-3"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Tú atiende a tus pacientes.
                <br />Nosotros armamos todo.
              </h3>
              <p className="text-[14px] leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.80)' }}>
                Hacemos una llamada de 30 minutos, entendemos tu clínica y normalmente en menos
                de 24 horas tienes CitaLead operando con tu WhatsApp, servicios y agenda.
              </p>
              <div className="space-y-3 flex-1">
                {contactPoints.map((pt, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: 'rgba(255,255,255,0.22)', border: '1px solid rgba(255,255,255,0.38)' }}>
                      <Check className="w-3 h-3 text-white" strokeWidth={2.5} />
                    </div>
                    <span className="text-[13px] font-semibold leading-relaxed"
                      style={{ color: 'rgba(255,255,255,0.90)' }}>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className="rounded-2xl overflow-hidden scroll-reveal-right bg-white"
            style={{ border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 20px 60px rgba(15,23,42,0.08)' }}>

            {status === 'sent' ? (
              <div className="p-10 text-center flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background: 'rgba(6,182,212,0.09)', border: '1px solid rgba(6,182,212,0.22)' }}>
                  <CheckCircle2 className="w-8 h-8 text-cyan-500" strokeWidth={1.5} />
                </div>
                <h3 className="font-black text-2xl mb-2" style={{ color: '#0f172a' }}>¡Solicitud enviada!</h3>
                <p className="text-sm" style={{ color: '#64748b' }}>
                  El equipo de CitaLead te contactará para iniciar tu activación llave en mano.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-7 grid grid-cols-2 gap-4">
                {fields.map((field) => (
                  <label key={field.id} className="flex flex-col gap-1.5 text-[12px] font-bold"
                    style={{ color: '#475569' }}>
                    {field.label}
                    <input
                      id={field.id}
                      name={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      autoComplete={field.autoComplete}
                      required
                      className="w-full px-4 py-3.5 rounded-xl text-sm placeholder-slate-300 focus:outline-none transition-all"
                      style={{
                        border: '1px solid rgba(15,23,42,0.12)',
                        background: '#f8fafc',
                        color: '#0f172a',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(6,182,212,0.40)'
                        e.currentTarget.style.background = '#ffffff'
                        e.currentTarget.style.boxShadow = '0 0 0 4px rgba(6,182,212,0.08)'
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(15,23,42,0.12)'
                        e.currentTarget.style.background = '#f8fafc'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    />
                  </label>
                ))}

                <button type="submit" disabled={status === 'sending'}
                  className="col-span-2 btn-primary w-full justify-center mt-1 disabled:opacity-60 disabled:cursor-not-allowed">
                  {status === 'sending' ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
                  ) : (
                    <>Activar mi prueba gratis 14 días <ArrowRight className="w-4 h-4" strokeWidth={2.5} /></>
                  )}
                </button>

                <a href="https://wa.me/5210000000000" target="_blank" rel="noopener"
                  className="col-span-2 block w-full text-center py-3.5 rounded-full font-bold text-sm transition-all hover:scale-[1.01]"
                  style={{ background: '#f0fdf4', border: '1px solid rgba(22,163,74,0.22)', color: '#16a34a' }}>
                  💬 Hablar por WhatsApp
                </a>

                {status === 'error' && (
                  <p className="col-span-2 text-red-500 text-xs text-center">
                    Hubo un error. Intenta de nuevo.
                  </p>
                )}

                <p className="col-span-2 text-[11px] leading-relaxed" style={{ color: '#94a3b8' }}>
                  Al enviar aceptas ser contactado por CitaLead. Sin compromisos — cancelas cuando quieras.
                </p>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
