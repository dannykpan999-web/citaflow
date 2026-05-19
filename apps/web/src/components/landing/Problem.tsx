'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Clock, MessageSquareOff, TrendingDown, BarChart2, ArrowRight } from 'lucide-react'

function useCounterOnScroll(target: number, duration = 1600) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          let t0: number | null = null
          const ease = (t: number) => 1 - Math.pow(1 - t, 3)
          const tick = (ts: number) => {
            if (!t0) t0 = ts
            const p = Math.min((ts - t0) / duration, 1)
            setCount(Math.round(ease(p) * target))
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
          obs.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [target, duration])

  return { count, ref }
}

const problems = [
  {
    Icon: Clock,
    num: '01',
    title: 'Cada minuto de espera es dinero perdido',
    desc: 'Leads de Meta Ads llegan a cualquier hora. Si tu equipo tarda en contestar, el prospecto ya está preguntando en otra clínica.',
    fix: 'CitaLead responde de forma personalizada en segundos, siempre.',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.07)',
    border: 'rgba(239,68,68,0.15)',
  },
  {
    Icon: MessageSquareOff,
    num: '02',
    title: 'Nadie da seguimiento al que "luego agenda"',
    desc: 'Recepción tiene 50 conversaciones abiertas. Los leads tibios se enfrían solos y nunca más regresan.',
    fix: 'CitaLead da seguimiento automático a las 24 h, 48 h y 72 h.',
    color: '#f97316',
    bg: 'rgba(249,115,22,0.07)',
    border: 'rgba(249,115,22,0.15)',
  },
  {
    Icon: TrendingDown,
    num: '03',
    title: 'La conversación muere en el precio',
    desc: 'El prospecto pregunta el costo, nadie empuja al siguiente paso y la conversación queda en "gracias, lo pienso".',
    fix: 'CitaLead empuja el cierre y envía tu link de agenda en el momento exacto.',
    color: '#a855f7',
    bg: 'rgba(168,85,247,0.07)',
    border: 'rgba(168,85,247,0.15)',
  },
  {
    Icon: BarChart2,
    num: '04',
    title: 'No sabes qué leads son dinero real',
    desc: 'Sin datos, no puedes saber cuántos leads llegaron hoy, cuántos agendaron ni dónde se pierden las oportunidades.',
    fix: 'CitaLead centraliza y ordena cada oportunidad de venta por ti.',
    color: '#06b6d4',
    bg: 'rgba(6,182,212,0.07)',
    border: 'rgba(6,182,212,0.15)',
  },
]

export default function Problem() {
  const stat1 = useCounterOnScroll(78, 1400)
  const stat2 = useCounterOnScroll(10, 1000)

  return (
    <section id="problema" className="relative py-24 md:py-32 overflow-hidden"
      style={{ background: '#f8fafc' }}>

      {/* Background image */}
      <div className="absolute inset-0 pointer-events-none">
        <Image src="/images/bg-problem.jpg" alt="" fill className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0" style={{ background: 'rgba(248,250,252,0.90)' }} />
      </div>

      {/* Grid */}
      <div className="absolute inset-0 bg-grid-light opacity-60 pointer-events-none" />

      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.25), transparent)' }} />

      <div className="relative max-w-[1180px] mx-auto px-5">

        {/* Section header */}
        <div className="text-center mb-16 scroll-reveal">
          <span className="label-chip mb-5 inline-flex">El costo real de contestar tarde</span>
          <h2 className="font-black leading-tight mb-4"
            style={{ fontFamily: "'DM Sans', sans-serif",
              fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', letterSpacing: '-0.04em', color: '#0f172a' }}>
            Las clínicas no pierden ventas por falta de interés.
            <br />
            <span className="gradient-text">Las pierden por falta de velocidad.</span>
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: '#64748b' }}>
            Pagas publicidad para que te escriban. Si tu recepción está ocupada y tarda más
            de 10 minutos en contestar, tu prospecto ya está en otra clínica.
          </p>
        </div>

        {/* Big stat row */}
        <div className="grid sm:grid-cols-2 gap-5 mb-14 scroll-reveal-stagger">

          {/* Stat 1 — Problem */}
          <div className="relative rounded-3xl p-8 overflow-hidden bg-white"
            style={{ border: '1px solid rgba(239,68,68,0.12)', boxShadow: '0 8px 32px rgba(239,68,68,0.06)' }}>
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)', filter: 'blur(30px)' }} />
            <div className="text-[11px] font-bold uppercase tracking-widest mb-4 text-red-500">
              Dato crítico
            </div>
            <div className="flex items-end gap-2 mb-3">
              <span ref={stat1.ref}
                className="font-black leading-none"
                style={{ fontSize: 'clamp(3.5rem, 8vw, 5.5rem)', color: '#ef4444' }}>
                {stat1.count}%
              </span>
            </div>
            <p className="text-base font-semibold leading-snug" style={{ color: '#334155' }}>
              de los leads <strong style={{ color: '#dc2626' }}>no regresan</strong> si no
              reciben respuesta en los primeros 5 minutos.
            </p>
          </div>

          {/* Stat 2 — Solution */}
          <div className="relative rounded-3xl p-8 overflow-hidden bg-white"
            style={{ border: '1px solid rgba(6,182,212,0.15)', boxShadow: '0 8px 32px rgba(6,182,212,0.06)' }}>
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%)', filter: 'blur(30px)' }} />
            <div className="text-[11px] font-bold uppercase tracking-widest mb-4 text-cyan-600">
              Solución CitaLead
            </div>
            <div className="flex items-end gap-2 mb-3">
              <span ref={stat2.ref}
                className="font-black leading-none"
                style={{ fontSize: 'clamp(3.5rem, 8vw, 5.5rem)', color: '#06b6d4' }}>
                {stat2.count}s
              </span>
            </div>
            <p className="text-base font-semibold leading-snug" style={{ color: '#334155' }}>
              es el tiempo promedio de <strong style={{ color: '#0891b2' }}>primera respuesta</strong> de
              CitaLead, sin importar la hora.
            </p>
          </div>
        </div>

        {/* Problem cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 scroll-reveal-stagger">
          {problems.map((p) => (
            <div key={p.num}
              className="card-hover rounded-2xl p-5 flex flex-col bg-white"
              style={{ border: '1px solid rgba(15,23,42,0.07)', boxShadow: '0 4px 16px rgba(15,23,42,0.05)' }}>

              <div className="w-11 h-11 rounded-[14px] flex items-center justify-center mb-4 flex-shrink-0"
                style={{ background: p.bg, border: `1px solid ${p.border}` }}>
                <p.Icon className="w-5 h-5" style={{ color: p.color }} strokeWidth={1.8} />
              </div>

              <span className="text-[11px] font-black uppercase tracking-widest mb-2"
                style={{ color: 'rgba(15,23,42,0.25)' }}>{p.num}</span>

              <h3 className="font-bold text-sm leading-snug mb-2" style={{ color: '#0f172a' }}>
                {p.title}
              </h3>
              <p className="text-[12.5px] leading-relaxed mb-4 flex-1" style={{ color: '#64748b' }}>
                {p.desc}
              </p>

              <div className="flex items-start gap-2 pt-3"
                style={{ borderTop: '1px dashed rgba(15,23,42,0.08)' }}>
                <ArrowRight className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: p.color }} />
                <span className="text-[11.5px] font-semibold leading-relaxed" style={{ color: p.color }}>
                  {p.fix}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
