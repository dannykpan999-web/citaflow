'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowRight, Play, Zap, RefreshCw, CalendarCheck, Star } from 'lucide-react'

function useCounter(target: number, duration = 1600) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          let startTime: number | null = null
          const ease = (t: number) => 1 - Math.pow(1 - t, 3)
          const tick = (ts: number) => {
            if (!startTime) startTime = ts
            const p = Math.min((ts - startTime) / duration, 1)
            setCount(Math.round(ease(p) * target))
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
          obs.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [target, duration])

  return { count, ref }
}

export default function Hero() {
  const leads = useCounter(247, 1800)
  const resp  = useCounter(9, 1200)
  const recov = useCounter(31, 1500)

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: '#ffffff', paddingTop: '72px' }}>

      {/* Background image */}
      <div className="absolute inset-0 pointer-events-none">
        <Image src="/images/bg-hero.jpg" alt="" fill className="object-cover object-center" priority sizes="100vw" />
        <div className="absolute inset-0" style={{ background: 'rgba(255,255,255,0.88)' }} />
      </div>

      {/* Subtle dot grid */}
      <div className="absolute inset-0 bg-grid-light opacity-70 pointer-events-none" />

      {/* Aurora blobs — light/pastel on white */}
      <div className="absolute top-1/4 left-[5%] w-[600px] h-[600px] rounded-full pointer-events-none animate-aurora-1"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%)', filter: 'blur(70px)' }} />
      <div className="absolute top-0 right-[10%] w-[500px] h-[500px] rounded-full pointer-events-none animate-aurora-2"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="absolute bottom-[10%] right-[5%] w-[380px] h-[380px] rounded-full pointer-events-none animate-aurora-3"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)', filter: 'blur(80px)' }} />

      <div className="relative max-w-[1180px] mx-auto px-5 py-20 w-full">
        <div className="grid lg:grid-cols-[1fr_460px] gap-12 xl:gap-20 items-center">

          {/* ── LEFT: Copy ─────────────────────────────────────────── */}
          <div>

            {/* Live badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-8 animate-fade-up"
              style={{ background: 'rgba(6,182,212,0.07)', border: '1px solid rgba(6,182,212,0.22)' }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
              <span className="text-xs font-semibold" style={{ color: '#0891b2' }}>
                Automatiza tu clínica en minutos · Prueba 14 días gratis
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-black leading-[0.95] tracking-tight mb-6 animate-fade-up-1"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(2.8rem, 6vw, 5rem)', color: '#0f172a' }}>
              Tu clínica nunca<br />pierde un lead
              <br />
              <span className="gradient-text-animated">mientras duermes.</span>
            </h1>

            {/* Subtext */}
            <p className="text-lg leading-relaxed mb-9 max-w-[480px] animate-fade-up-2"
              style={{ color: 'rgba(15,23,42,0.55)' }}>
              CitaLead responde en 9 segundos, cotiza, envía tu agenda y da seguimiento
              automático a las 24 h, 48 h y 72 h — sin cambiar cómo trabajas hoy.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-10 animate-fade-up-3">
              <a href="/signup" className="btn-primary">
                Probar gratis 14 días <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </a>
              <a href="#funciona"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm transition-all duration-200"
                style={{ color: '#475569', background: '#f1f5f9', border: '1px solid rgba(15,23,42,0.10)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#e2e8f0' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#f1f5f9' }}>
                <Play className="w-4 h-4" strokeWidth={2} /> Ver cómo funciona
              </a>
            </div>

            {/* Social proof avatars */}
            <div className="flex items-center gap-4 mb-10 animate-fade-up-4">
              <div className="flex -space-x-2.5">
                {[
                  '/images/test-avatar-mariana.jpg',
                  '/images/test-avatar-sofia.jpg',
                  '/images/test-avatar-andrea.jpg',
                ].map((src, i) => (
                  <div key={i} className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0"
                    style={{ border: '2px solid #ffffff' }}>
                    <Image src={src} alt="" width={36} height={36} className="object-cover w-full h-full" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5 mb-0.5">
                  {Array(5).fill(0).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" strokeWidth={0} />
                  ))}
                </div>
                <p className="text-[11px] font-medium" style={{ color: 'rgba(15,23,42,0.45)' }}>
                  Clínicas automatizando con CitaLead
                </p>
              </div>
            </div>

            {/* Animated stats */}
            <div ref={leads.ref}
              className="inline-flex items-stretch animate-fade-up-5 rounded-2xl overflow-hidden"
              style={{ border: '1px solid rgba(15,23,42,0.08)', background: '#f8fafc' }}>
              {[
                { val: leads.count, suffix: '',   label: 'leads/mes',       Icon: Zap },
                { val: resp.count,  suffix: 's',  label: 'respuesta',       Icon: RefreshCw },
                { val: recov.count, suffix: '',   label: 'recuperados/mes', Icon: CalendarCheck },
              ].map((s, i) => (
                <div key={i} className="flex flex-col items-center justify-center px-6 py-4"
                  style={{ borderLeft: i > 0 ? '1px solid rgba(15,23,42,0.08)' : undefined }}>
                  <div className="flex items-baseline gap-0.5 mb-0.5">
                    <span className="text-2xl font-black" style={{ color: '#06b6d4' }}>{s.val}</span>
                    <span className="text-base font-black" style={{ color: '#06b6d4' }}>{s.suffix}</span>
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-wide"
                    style={{ color: 'rgba(15,23,42,0.35)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Floating mockup ─────────────────────────────── */}
          <div className="relative hidden lg:flex items-center justify-center min-h-[520px]">

            {/* Soft glow halo */}
            <div className="absolute w-80 h-80 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
                filter: 'blur(40px)',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
              }} />

            {/* Phone */}
            <div className="relative animate-float-slow" style={{ width: '256px', zIndex: 2 }}>
              <div className="relative rounded-[36px] overflow-hidden"
                style={{
                  border: '1px solid rgba(15,23,42,0.10)',
                  boxShadow: '0 40px 100px rgba(15,23,42,0.18), 0 0 0 1px rgba(6,182,212,0.08)',
                }}>
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-14 h-1.5 rounded-full z-10"
                  style={{ background: 'rgba(15,23,42,0.12)' }} />
                <Image
                  src="/images/hw-04-reminder.jpg"
                  alt="CitaLead demo"
                  width={256}
                  height={512}
                  className="object-cover block"
                  priority
                />
              </div>
            </div>

            {/* Floating card: new appointment */}
            <div className="absolute top-10 -left-10 glass-light rounded-2xl p-3 animate-float-card"
              style={{ animationDelay: '0.5s', minWidth: '190px', zIndex: 3 }}>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                  <Image src="/images/test-avatar-mariana.jpg" alt="" width={32} height={32} className="object-cover" />
                </div>
                <div>
                  <div className="text-[11px] font-bold" style={{ color: '#0f172a' }}>Nueva cita agendada</div>
                  <div className="text-[9px]" style={{ color: 'rgba(15,23,42,0.45)' }}>hace 3 min</div>
                </div>
              </div>
              <div className="text-[10px] px-2 py-1 rounded-lg font-bold"
                style={{ background: 'rgba(6,182,212,0.10)', color: '#0891b2' }}>
                Depilación Láser · Mariana G.
              </div>
            </div>

            {/* Floating card: monthly stats */}
            <div className="absolute -right-8 bottom-28 glass-light rounded-2xl p-4 animate-float-card"
              style={{ animationDelay: '1.1s', zIndex: 3 }}>
              <div className="text-[9px] font-bold uppercase tracking-widest mb-1"
                style={{ color: 'rgba(15,23,42,0.40)' }}>Este mes</div>
              <div className="text-4xl font-black leading-none mb-1" style={{ color: '#0f172a' }}>63</div>
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-bold" style={{ color: '#16a34a' }}>↑ +12%</span>
                <span className="text-[10px]" style={{ color: 'rgba(15,23,42,0.45)' }}>citas confirmadas</span>
              </div>
            </div>

            {/* Floating card: response speed */}
            <div className="absolute bottom-8 left-4 glass-light rounded-full px-3.5 py-2 flex items-center gap-2 animate-float-card"
              style={{ animationDelay: '1.7s', zIndex: 3 }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}>
                <Zap className="w-3 h-3 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-[11px] font-bold" style={{ color: '#0f172a' }}>Responde en 9s</span>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #ffffff)' }} />
    </section>
  )
}
