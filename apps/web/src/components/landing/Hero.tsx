import WhatsappMock from './WhatsappMock'
import { CreditCard, XCircle, ArrowRight, Play, Star } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0,179,126,0.18) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 50%, rgba(168,85,247,0.12) 0%, transparent 50%)',
        }}
      />
      {/* Grid lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28 w-full">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — copy */}
          <div>
            {/* Pill badge */}
            <div className="animate-fade-up inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-white/60 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00b37e] animate-pulse-dot" />
              Para clínicas estéticas que atienden por WhatsApp
            </div>

            {/* Headline */}
            <h1
              className="animate-fade-up-delay-1 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[0.95] tracking-tight text-white mb-6"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Llena tu agenda.{' '}
              <span className="gradient-text">Sin contestar</span>{' '}
              un solo WhatsApp a mano.
            </h1>

            {/* Subheadline */}
            <p className="animate-fade-up-delay-2 text-base md:text-lg text-white/50 leading-relaxed max-w-lg mb-8">
              CitaFlow responde en segundos, califica al prospecto, envía tu link de agenda y manda
              recordatorios automáticos. Tu WhatsApp trabajando 24/7 — tú enfocada en tu clínica.
            </p>

            {/* CTAs */}
            <div className="animate-fade-up-delay-3 flex flex-col sm:flex-row gap-3 mb-10">
              <a
                href="#contacto"
                className="btn-shine inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-[#0a0a0f] text-sm transition-all duration-200 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #00b37e, #34d399)',
                  boxShadow: '0 0 30px rgba(0,179,126,0.35)',
                }}
              >
                Empezar gratis — 14 días
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </a>
              <a
                href="#como-funciona"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm text-white/70 border border-white/10 hover:border-white/20 hover:text-white hover:bg-white/5 transition-all duration-200"
              >
                <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                  <Play className="w-3 h-3 ml-0.5" fill="currentColor" />
                </span>
                Ver cómo funciona
              </a>
            </div>

            {/* Social proof bar */}
            <div className="animate-fade-up-delay-4 flex flex-wrap items-center gap-x-6 gap-y-3">
              {/* Avatars */}
              <div className="flex -space-x-2">
                {['#00b37e', '#a855f7', '#60a5fa', '#f59e0b'].map((c, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-[#0a0a0f] flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: c }}
                  >
                    {['CL', 'DT', 'ME', 'SP'][i]}
                  </div>
                ))}
              </div>

              {/* Stars */}
              <div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" />
                  ))}
                </div>
                <p className="text-xs text-white/40 mt-0.5">4.9 · 120+ clínicas activas</p>
              </div>

              <div className="h-8 w-px bg-white/10 hidden sm:block" />

              {/* No credit card */}
              <div className="flex items-center gap-1.5 text-white/40 text-xs">
                <CreditCard className="w-3.5 h-3.5" strokeWidth={1.5} />
                Sin tarjeta de crédito
              </div>
              <div className="flex items-center gap-1.5 text-white/40 text-xs">
                <XCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
                Cancela cuando quieras
              </div>
            </div>
          </div>

          {/* Right — WhatsApp mock */}
          <div className="animate-fade-up-delay-3 flex justify-center md:justify-end">
            <WhatsappMock />
          </div>
        </div>
      </div>
    </section>
  )
}
