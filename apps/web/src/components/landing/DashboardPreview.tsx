'use client'

import { useState } from 'react'
import {
  BarChart2, MessageCircle, Settings, DollarSign,
  RefreshCw, Calendar, ChevronRight,
} from 'lucide-react'

type Tab = 'dashboard' | 'conversations' | 'clinic' | 'services' | 'automation' | 'agenda'
type Conv = 'daniela' | 'ana' | 'maria' | 'camila' | 'paula'

const navItems: { id: Tab; icon: React.ElementType; label: string }[] = [
  { id: 'dashboard',     icon: BarChart2,     label: 'Panel de Resultados' },
  { id: 'conversations', icon: MessageCircle, label: 'Conversaciones' },
  { id: 'clinic',        icon: Settings,      label: 'Mi Clínica' },
  { id: 'services',      icon: DollarSign,    label: 'Servicios' },
  { id: 'automation',    icon: RefreshCw,     label: 'Mensajes Automáticos' },
  { id: 'agenda',        icon: Calendar,      label: 'Citas y Recordatorios' },
]

const metrics = [
  { icon: '👥', badge: '+34%', badgeColor: '#10b981', label: 'Leads recibidos este mes', value: '247' },
  { icon: '⏱️', badge: '24/7', badgeColor: '#06b6d4', label: 'Tiempo de 1ª respuesta', value: '9s' },
  { icon: '📅', badge: '+24', badgeColor: '#6366f1', label: 'Citas generadas', value: '63' },
  { icon: '📈', badge: '+6.2 pts', badgeColor: '#10b981', label: 'Conversión lead → cita', value: '25%' },
  { icon: '✅', badge: 'rescatados', badgeColor: '#8b5cf6', label: 'Leads inactivos recuperados', value: '31' },
  { icon: '🔁', badge: 'activo', badgeColor: '#f59e0b', label: 'Follow-ups en curso', value: '42' },
]
const bars = [42, 58, 51, 66, 72, 64, 89, 78, 96, 100]

const convs: Record<Conv, { name: string; phone: string; service: string; state: string; chat: { side: 'user'|'bot'; text: string }[] }> = {
  daniela: {
    name: 'Daniela Torres', phone: '+52 55 4444 2222', service: 'MedSpa básico', state: 'Cita generada',
    chat: [
      { side: 'user', text: 'Hola 👋 Quiero más información sobre depilación láser.' },
      { side: 'bot',  text: '¡Hola Daniela! Gracias por escribirnos. Soy el asistente de Bella Estética. ¿Te interesa depilación de alguna zona en específico?' },
      { side: 'user', text: 'Zona completa, piernas y bikini.' },
      { side: 'bot',  text: 'Perfecto. Zona completa incluye piernas y bikini desde $1,800 MXN por sesión. Ofrecemos paquetes de 6 y 8 sesiones con descuento. ¿Te gustaría agendar una valoración gratuita?' },
      { side: 'user', text: 'Sí, ¿cómo agendo?' },
      { side: 'bot',  text: '¡Genial! Te comparto nuestro link de agenda para que elijas el horario que más te convenga 👇\n📅 Agendar cita → citaflow.co/agenda/lumina' },
    ],
  },
  ana: {
    name: 'Ana García', phone: '+52 55 3333 1111', service: 'Depilación láser', state: 'Nuevo',
    chat: [
      { side: 'user', text: 'Hola, quiero información sobre depilación láser.' },
      { side: 'bot',  text: '¡Hola Ana! Con gusto te ayudo. Tenemos depilación láser desde $800 MXN por zona. ¿Qué zona te interesa?' },
    ],
  },
  maria: {
    name: 'María López', phone: '+52 55 2222 3333', service: 'Facial antiedad', state: 'Link enviado',
    chat: [
      { side: 'user', text: '¿Cuánto cuesta el facial antiedad?' },
      { side: 'bot',  text: 'El facial antiedad tiene un costo de $950 MXN. ¿Te gustaría agendar una sesión?' },
      { side: 'user', text: 'Ya vi el link de agenda, muchas gracias.' },
    ],
  },
  camila: {
    name: 'Camila Soto', phone: '+52 55 5555 4444', service: 'Bótox', state: 'En control humano',
    chat: [
      { side: 'user', text: 'Tengo una alergia, necesito saber si puedo hacerme el tratamiento.' },
      { side: 'bot',  text: 'Entiendo tu pregunta, Camila. Para casos con alergias, es importante que uno de nuestros especialistas te asesore. Te estoy conectando con nuestra recepción ahora.' },
    ],
  },
  paula: {
    name: 'Paula Medina', phone: '+52 55 6666 5555', service: 'Paquete completo', state: 'Interesado',
    chat: [
      { side: 'user', text: 'Sí me interesa el paquete completo.' },
      { side: 'bot',  text: '¡Qué buena noticia! El paquete completo incluye 3 tratamientos a precio especial. Te envío el link para que elijas tu horario.' },
    ],
  },
}

const convList: { id: Conv; badge: string; badgeColor: string; preview: string; time: string }[] = [
  { id: 'daniela', badge: 'Cita generada', badgeColor: '#10b981', preview: 'Confirmada para el 7 junio a las 11:00 a.m.', time: '11:24' },
  { id: 'ana',     badge: 'Nuevo',         badgeColor: '#06b6d4', preview: 'Hola, quiero información sobre depilación...', time: '10:58' },
  { id: 'maria',   badge: 'Link enviado',  badgeColor: '#818cf8', preview: 'Ya vi el link de agenda, muchas gracias.', time: '10:45' },
  { id: 'camila',  badge: 'En control humano', badgeColor: '#f43f5e', preview: 'Tengo una alergia, necesito saber si...', time: '2 jun' },
  { id: 'paula',   badge: 'Interesado',    badgeColor: '#10b981', preview: 'Sí me interesa el paquete completo.', time: '1 jun' },
]

const services = [
  { name: 'Depilación láser — zona pequeña',   note: '🏷️ 20% off paquete 6 sesiones', price: '$800' },
  { name: 'Depilación láser — zona mediana',    note: 'Servicio activo',                price: '$1,200' },
  { name: 'Depilación láser — zona completa',   note: '🏷️ 15% off paquete 8 sesiones', price: '$1,800' },
  { name: 'Facial antiedad',                    note: 'Servicio activo',                price: '$950' },
  { name: 'MedSpa básico',                      note: 'Incluye 3 tratamientos',         price: '$1,500' },
  { name: 'Bótox (frente)',                     note: 'Requiere valoración médica',      price: '$2,800' },
]

const templates = [
  { name: 'Mensaje de bienvenida 24/7 vía WhatsApp',    badge: 'Bienvenida',  color: '#8b5cf6' },
  { name: 'Envío de información y precios',             badge: 'Info',        color: '#818cf8' },
  { name: 'Envío de link de agenda (Calendly / Google Cal)', badge: 'Agenda', color: '#10b981' },
  { name: 'Follow-up 1 (12–24h) — rescate de lead',    badge: 'Seguimiento', color: '#f59e0b' },
  { name: 'Follow-up 2 (48h) — cierre',                badge: 'Seguimiento', color: '#f59e0b' },
  { name: 'Cierre suave (72h)',                         badge: 'Cierre',      color: '#94a3b8' },
  { name: 'Recordatorio de cita 24h antes',             badge: 'Recordatorio',color: '#06b6d4' },
  { name: 'Recordatorio de cita 2h antes',              badge: 'Recordatorio',color: '#06b6d4' },
]

const appointments = [
  { initial: 'A', color: '#047857', bg: 'rgba(16,185,129,0.12)', name: 'Ana García',    service: 'Depilación zona completa', date: '7 jun · 11:00 AM', reminder: '🔔 24h enviado · 2h programado', reminderColor: '#047857' },
  { initial: 'D', color: '#047857', bg: 'rgba(16,185,129,0.12)', name: 'Daniela Torres', service: 'MedSpa básico',           date: '8 jun · 10:00 AM', reminder: '🔔 24h programado',             reminderColor: '#047857' },
  { initial: 'C', color: '#b45309', bg: 'rgba(245,158,11,0.12)', name: 'Camila Soto',   service: 'Facial antiedad',          date: '9 jun · 3:00 PM',  reminder: '🔔 24h programado',             reminderColor: '#b45309' },
  { initial: 'P', color: '#1d4ed8', bg: 'rgba(59,130,246,0.10)', name: 'Paula Medina',  service: 'Paquete completo',         date: '10 jun · 9:30 AM', reminder: '🔔 Pendiente confirmación',     reminderColor: '#94a3b8' },
]

const tabTitles: Record<Tab, string> = {
  dashboard: 'Panel de Resultados',
  conversations: 'Conversaciones',
  clinic: 'Mi Clínica',
  services: 'Servicios y precios',
  automation: 'Mensajes Automáticos',
  agenda: 'Citas y Recordatorios',
}

export default function DashboardPreview() {
  const [tab, setTab] = useState<Tab>('dashboard')
  const [conv, setConv] = useState<Conv>('daniela')

  return (
    <section id="producto" className="relative py-24 md:py-32 overflow-hidden"
      style={{ background: '#ffffff' }}>

      {/* Grid + top divider */}
      <div className="absolute inset-0 bg-grid-light opacity-60 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.25), transparent)' }} />

      <div className="max-w-[1180px] mx-auto px-5 relative">

        {/* Header */}
        <div className="text-center mb-10 scroll-reveal">
          <span className="label-chip mb-5 inline-flex">Producto por dentro</span>
          <h2 className="font-black leading-tight mb-4"
            style={{ fontFamily: "'DM Sans', sans-serif",
              fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', letterSpacing: '-0.04em', color: '#0f172a' }}>
            Así opera CitaLead{' '}
            <span className="gradient-text">dentro de tu clínica.</span>
          </h2>
          <p className="text-base max-w-2xl mx-auto" style={{ color: '#64748b' }}>
            Explora el Panel de Resultados, conversaciones activas, servicios configurados,
            plantillas automáticas y recordatorios.
          </p>
        </div>

        {/* App frame */}
        <div className="rounded-[1.5rem] overflow-hidden scroll-reveal-scale"
          style={{ border: '1px solid rgba(6,182,212,0.14)', boxShadow: '0 32px 100px rgba(6,182,212,0.12), 0 0 0 1px rgba(255,255,255,0.04)' }}>

          {/* Mobile tabs */}
          <div className="lg:hidden flex overflow-x-auto gap-1 p-2 border-b"
            style={{ background: '#f8fafc', borderColor: 'rgba(15,23,42,0.08)' }}>
            {navItems.map((n) => (
              <button key={n.id} onClick={() => setTab(n.id)}
                className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={tab === n.id
                  ? { background: 'linear-gradient(90deg, #06b6d4, #3b82f6)', color: '#fff' }
                  : { color: '#64748b', background: 'transparent' }}>
                {n.label}
              </button>
            ))}
          </div>

          <div className="flex" style={{ minHeight: '580px' }}>

            {/* Sidebar */}
            <aside className="hidden lg:flex flex-col w-56 flex-shrink-0"
              style={{ background: '#0a1628', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
              {/* Brand */}
              <div className="px-4 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}>CF</div>
                  <div>
                    <div className="text-white font-bold text-sm">CitaLead</div>
                    <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.38)' }}>WhatsApp → Citas 24/7</div>
                  </div>
                </div>
              </div>

              {/* Nav */}
              <nav className="flex-1 p-2 space-y-0.5">
                {navItems.map((n) => (
                  <button key={n.id} onClick={() => setTab(n.id)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-[12.5px] font-semibold transition-all"
                    style={tab === n.id
                      ? { background: 'rgba(6,182,212,0.18)', color: '#67e8f9', border: '1px solid rgba(6,182,212,0.25)' }
                      : { color: 'rgba(255,255,255,0.45)', background: 'transparent', border: '1px solid transparent' }}>
                    <n.icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.75} />
                    {n.label}
                    {tab === n.id && <ChevronRight className="w-3 h-3 ml-auto" />}
                  </button>
                ))}
              </nav>

              {/* Usage */}
              <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                <div className="text-white font-bold text-xs mb-1">Plan Growth</div>
                <div className="text-[10.5px] mb-2" style={{ color: 'rgba(255,255,255,0.40)' }}>183 de 800 conversaciones</div>
                <div className="h-1.5 rounded-full mb-2" style={{ background: 'rgba(255,255,255,0.10)' }}>
                  <div className="h-full rounded-full" style={{ width: '23%', background: 'linear-gradient(90deg, #06b6d4, #3b82f6)' }} />
                </div>
                <div className="text-[10px]" style={{ color: 'rgba(6,182,212,0.80)' }}>✓ Configuración llave en mano activa</div>
              </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col bg-white overflow-hidden">

              {/* App header */}
              <header className="px-6 py-4 border-b flex items-center justify-between"
                style={{ borderColor: 'rgba(15,23,42,0.08)', background: '#fafcff' }}>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-0.5">Panel CitaLead</div>
                  <h2 className="text-lg font-bold text-slate-900">{tabTitles[tab]}</h2>
                </div>
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl"
                  style={{ background: 'rgba(15,23,42,0.04)', border: '1px solid rgba(15,23,42,0.08)' }}>
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-800">Clínica Lumina · Hermosillo</div>
                    <div className="text-[10px] text-slate-400">Plan Growth · activo</div>
                  </div>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}>CL</div>
                </div>
              </header>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-5">

                {/* ── DASHBOARD ── */}
                {tab === 'dashboard' && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                      {metrics.map((m) => (
                        <div key={m.label} className="rounded-xl p-4"
                          style={{ border: '1px solid rgba(15,23,42,0.08)', background: '#fafcff' }}>
                          <div className="flex items-center gap-1.5 mb-2">
                            <span className="text-base">{m.icon}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                              style={{ background: m.badgeColor }}>{m.badge}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mb-1">{m.label}</div>
                          <div className="text-2xl font-extrabold text-slate-900" style={{ letterSpacing: '-0.04em' }}>{m.value}</div>
                        </div>
                      ))}
                    </div>

                    <div className="grid lg:grid-cols-5 gap-4">
                      <div className="lg:col-span-3 rounded-xl p-5"
                        style={{ border: '1px solid rgba(15,23,42,0.08)', background: '#fafcff' }}>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <div className="font-bold text-slate-900 text-sm">Citas generadas — tendencia</div>
                            <div className="text-[11px] text-slate-400">Últimos 10 días · en crecimiento</div>
                          </div>
                          <span className="text-[10.5px] font-bold px-2.5 py-1 rounded-full text-white"
                            style={{ background: 'linear-gradient(90deg,#06b6d4,#3b82f6)' }}>25% conversión</span>
                        </div>
                        <div className="flex items-end gap-1.5" style={{ height: '120px' }}>
                          {bars.map((h, i) => (
                            <div key={i} className="flex-1 rounded-md flex items-end p-0.5"
                              style={{ background: 'rgba(15,23,42,0.05)', height: '100%' }}>
                              <div className="w-full rounded-[4px]"
                                style={{ height: `${h}%`, background: i >= 6 ? 'linear-gradient(0deg,#06b6d4,#6366f1)' : 'linear-gradient(0deg,#bae6fd,#c7d2fe)' }} />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="lg:col-span-2 space-y-3">
                        <div className="rounded-xl p-4"
                          style={{ border: '1px solid rgba(15,23,42,0.08)', background: '#fafcff' }}>
                          <div className="font-bold text-slate-900 text-sm mb-0.5">Oportunidades de Venta</div>
                          <div className="text-[11px] text-slate-400">Leads ordenados para seguimiento</div>
                        </div>
                        {[
                          '✨ 31 leads inactivos rescatados: CitaLead respondió en segundos vía WhatsApp y programó seguimiento automático.',
                          '✨ Depilación zona completa concentra el 41% de la intención de compra esta semana.',
                          '✨ 4 conversaciones requieren atención humana con preguntas médicas específicas.',
                        ].map((txt, i) => (
                          <div key={i} className="rounded-xl p-3 text-[12px] leading-relaxed text-slate-700"
                            style={{ border: '1px solid rgba(6,182,212,0.18)', background: '#f0f9ff' }}>
                            {txt}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── CONVERSATIONS ── */}
                {tab === 'conversations' && (
                  <div className="grid lg:grid-cols-5 gap-4 h-full" style={{ minHeight: '420px' }}>
                    {/* List */}
                    <div className="lg:col-span-2 space-y-2">
                      <div className="rounded-xl px-3 py-2.5 text-sm text-slate-400"
                        style={{ border: '1px solid rgba(15,23,42,0.08)', background: '#f8fafc' }}>
                        🔎 Buscar lead...
                      </div>
                      <div className="flex gap-1.5 flex-wrap">
                        {['Todos','Nuevo','En conversación','Cita generada'].map((f) => (
                          <span key={f} className="text-[10.5px] font-semibold px-2.5 py-1 rounded-full"
                            style={{ background: '#f0f9ff', border: '1px solid rgba(6,182,212,0.20)', color: '#0369a1' }}>{f}</span>
                        ))}
                      </div>
                      {convList.map((c) => (
                        <div key={c.id} onClick={() => setConv(c.id)}
                          className="flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all"
                          style={{
                            border: conv === c.id ? '1px solid rgba(6,182,212,0.30)' : '1px solid rgba(15,23,42,0.08)',
                            background: conv === c.id ? '#f0f9ff' : '#fafcff',
                          }}>
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg,#06b6d4,#3b82f6)' }}>
                            {c.id[0].toUpperCase()}{c.id === 'daniela' ? 'T' : c.id === 'ana' ? 'G' : c.id === 'maria' ? 'L' : c.id === 'camila' ? 'S' : 'M'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-slate-900 text-[13px]">{convs[c.id].name}</div>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
                              style={{ background: c.badgeColor }}>{c.badge}</span>
                            <div className="text-[11px] text-slate-400 mt-0.5 truncate">{c.preview}</div>
                          </div>
                          <div className="text-[10px] text-slate-400 flex-shrink-0">{c.time}</div>
                        </div>
                      ))}
                    </div>

                    {/* Chat */}
                    <div className="lg:col-span-3 flex flex-col rounded-xl overflow-hidden"
                      style={{ border: '1px solid rgba(15,23,42,0.08)' }}>
                      <div className="px-4 py-3 border-b flex items-center justify-between"
                        style={{ background: '#fafcff', borderColor: 'rgba(15,23,42,0.08)' }}>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{convs[conv].name}</div>
                          <div className="text-[11px] text-slate-400">{convs[conv].phone} · {convs[conv].service}</div>
                        </div>
                        <button className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-white"
                          style={{ background: 'linear-gradient(90deg,#f97316,#fb923c)' }}>
                          Tomar control
                        </button>
                      </div>

                      <div className="flex-1 p-4 space-y-2.5 overflow-y-auto" style={{ background: '#f8fafb', maxHeight: '280px' }}>
                        {convs[conv].chat.map((m, i) => (
                          <div key={i} className={`flex ${m.side === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className="max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[12.5px] leading-relaxed whitespace-pre-line"
                              style={m.side === 'user'
                                ? { background: '#dcfce7', color: '#166534' }
                                : { background: '#ffffff', color: '#0f172a', border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 2px 8px rgba(15,23,42,0.05)' }}>
                              {m.side === 'bot' && <div className="text-[9px] text-slate-400 mb-0.5">Automático</div>}
                              {m.text}
                            </div>
                          </div>
                        ))}
                        {conv === 'daniela' && (
                          <div className="rounded-xl p-3 text-[11.5px]"
                            style={{ background: '#ecfdf5', border: '1px solid rgba(52,211,153,0.25)', color: '#065f46' }}>
                            ✅ Cita generada · Depilación zona completa · 7 junio · 11:00 AM<br />
                            🔔 Recordatorio 24h programado · 6 junio · 11:00 AM
                          </div>
                        )}
                      </div>

                      <div className="px-4 py-3 border-t flex gap-2"
                        style={{ borderColor: 'rgba(15,23,42,0.08)', background: '#fafcff' }}>
                        <button className="px-3 py-1.5 rounded-lg text-xs font-bold text-white"
                          style={{ background: 'linear-gradient(90deg,#06b6d4,#3b82f6)' }}>
                          Enviar link de agenda
                        </button>
                        <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700"
                          style={{ border: '1px solid rgba(15,23,42,0.14)', background: '#fff' }}>
                          Marcar como cita generada
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── CLINIC ── */}
                {tab === 'clinic' && (
                  <div className="rounded-xl p-6" style={{ border: '1px solid rgba(15,23,42,0.08)', background: '#fafcff' }}>
                    <h3 className="font-bold text-slate-900 text-base mb-1">Configuración de clínica</h3>
                    <p className="text-slate-400 text-sm mb-5">Configurado por el equipo de CitaLead durante tu activación. Para modificar algo, contáctanos.</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        ['Nombre de la clínica', 'Clínica Lumina'],
                        ['Horarios de atención', 'Lun–Sáb · 9:00 – 7:00 PM (CitaLead responde 24/7)'],
                        ['Ubicación', 'Hermosillo, Sonora'],
                        ['Link de agenda', 'citaflow.co/agenda/lumina'],
                        ['Tono de comunicación', 'Profesional, cálido y cercano'],
                        ['Mensaje de bienvenida', 'Hola, gracias por escribir a Clínica Lumina. ¿Qué tratamiento te interesa?'],
                      ].map(([label, val]) => (
                        <div key={label} className="rounded-xl p-4" style={{ border: '1px solid rgba(15,23,42,0.08)', background: '#fff' }}>
                          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">{label}</div>
                          <div className="text-sm font-semibold text-slate-800">{val}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── SERVICES ── */}
                {tab === 'services' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-slate-900 text-xl">Servicios y precios</h3>
                        <p className="text-slate-400 text-sm">CitaLead usa esta información para responder y enviar agenda.</p>
                      </div>
                      <button className="px-4 py-2 rounded-xl text-xs font-bold text-white"
                        style={{ background: 'linear-gradient(90deg,#06b6d4,#3b82f6)' }}>
                        + Agregar servicio
                      </button>
                    </div>
                    <div className="space-y-2">
                      {services.map((s) => (
                        <div key={s.name} className="flex items-center gap-4 px-4 py-3.5 rounded-xl"
                          style={{ border: '1px solid rgba(15,23,42,0.08)', background: '#fafcff' }}>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-slate-900 text-sm">{s.name}</div>
                            <div className="text-[12px] text-slate-400">{s.note}</div>
                          </div>
                          <div className="font-bold text-lg text-slate-900" style={{ letterSpacing: '-0.02em' }}>{s.price}</div>
                          <button className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-slate-600"
                            style={{ border: '1px solid rgba(15,23,42,0.14)', background: '#fff' }}>Editar</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── AUTOMATION ── */}
                {tab === 'automation' && (
                  <div>
                    <div className="mb-4">
                      <h3 className="font-bold text-slate-900 text-xl">Mensajes Automáticos</h3>
                      <p className="text-slate-400 text-sm">Configurados con el tono y servicios de tu clínica.</p>
                    </div>
                    <div className="space-y-2">
                      {templates.map((t) => (
                        <div key={t.name} className="flex items-center gap-4 px-4 py-3.5 rounded-xl"
                          style={{ border: '1px solid rgba(15,23,42,0.08)', background: '#fafcff' }}>
                          <div className="flex-1">
                            <div className="font-bold text-slate-900 text-sm mb-1">{t.name}</div>
                            <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full text-white"
                              style={{ background: t.color }}>{t.badge}</span>
                          </div>
                          <button className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-slate-600"
                            style={{ border: '1px solid rgba(15,23,42,0.14)', background: '#fff' }}>Ver</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── AGENDA ── */}
                {tab === 'agenda' && (
                  <div>
                    <div className="mb-4">
                      <h3 className="font-bold text-slate-900 text-xl">Citas y Recordatorios</h3>
                      <p className="text-slate-400 text-sm">Citas generadas con recordatorios automáticos por WhatsApp.</p>
                    </div>
                    <div className="space-y-2">
                      {appointments.map((a) => (
                        <div key={a.name} className="flex items-center gap-4 px-4 py-3.5 rounded-xl"
                          style={{ border: '1px solid rgba(15,23,42,0.08)', background: '#fafcff' }}>
                          <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                            style={{ background: a.bg, color: a.color }}>{a.initial}</div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-slate-900 text-sm">{a.name}</div>
                            <div className="text-[12px] text-slate-400">{a.service}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-slate-900 text-sm">{a.date}</div>
                            <div className="text-[11px] font-semibold" style={{ color: a.reminderColor }}>{a.reminder}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-400 text-xs mt-4">
          Vista interactiva — referencia visual del MVP Fase 1 · Datos de ejemplo
        </p>
      </div>
    </section>
  )
}
