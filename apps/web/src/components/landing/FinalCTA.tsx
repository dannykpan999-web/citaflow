import Image from 'next/image'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

const bullets = [
  'Setup llave en mano — nosotros configuramos todo',
  'Sin tarjeta de crédito — 14 días de prueba real',
  'Activación normalmente en menos de 24 horas',
]

export default function FinalCTA() {
  return (
    <section className="relative py-10 md:py-14 overflow-hidden"
      style={{ background: '#ffffff' }}>

      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.25), transparent)' }} />

      <div className="max-w-[1180px] mx-auto px-5">
        <div className="relative rounded-[2.5rem] overflow-hidden scroll-reveal-scale"
          style={{ boxShadow: '0 32px 100px rgba(6,182,212,0.20)' }}>

          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src="/images/cta-clinic.jpg"
              alt="Clínica estética"
              fill
              className="object-cover object-center"
              sizes="100vw"
            />
            {/* Animated gradient overlay */}
            <div className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, rgba(6,182,212,0.88) 0%, rgba(14,116,144,0.82) 40%, rgba(59,130,246,0.88) 100%)',
              }} />
            {/* Animated shine sweep */}
            <div className="absolute inset-0 animate-shimmer opacity-30" />
          </div>

          {/* Aurora inside CTA */}
          <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full pointer-events-none animate-aurora-2"
            style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.20) 0%, transparent 70%)', filter: 'blur(60px)' }} />

          {/* Content */}
          <div className="relative px-8 md:px-16 py-16 md:py-20 text-center">

            {/* Badge */}
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-8"
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', color: '#ffffff' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              14 días gratis · Sin tarjeta de crédito
            </span>

            <h2 className="font-black text-white leading-tight mb-6 mx-auto"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
                letterSpacing: '-0.05em',
                maxWidth: '800px',
                textShadow: '0 2px 20px rgba(0,0,0,0.30)',
              }}>
              Comienza a llenar tu agenda 24/7.
              <br />
              <span style={{ color: '#67e8f9' }}>Hoy mismo.</span>
            </h2>

            <p className="text-lg leading-relaxed mb-8 mx-auto"
              style={{ color: 'rgba(255,255,255,0.75)', maxWidth: '560px' }}>
              Prueba CitaLead gratis. Descubre cuántos leads estás perdiendo por velocidad de
              respuesta y cuántos podríamos recuperar para ti.
            </p>

            {/* Bullets */}
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-10">
              {bullets.map((b, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#34d399' }} strokeWidth={2} />
                  <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.80)' }}>{b}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/signup"
                className="inline-flex items-center justify-center gap-2 px-9 py-4 rounded-full font-black text-base text-slate-900 transition-all hover:scale-105"
                style={{ background: '#ffffff', boxShadow: '0 8px 40px rgba(255,255,255,0.25)' }}>
                Comenzar prueba gratis
                <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
              </a>
              <a href="#producto"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-sm text-white border transition-all hover:bg-white/10"
                style={{ borderColor: 'rgba(255,255,255,0.35)' }}>
                Ver el producto por dentro
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
