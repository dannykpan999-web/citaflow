'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown, Users, Calendar, Zap, Clock, Download, Phone } from 'lucide-react'

// ── Mock Data ──────────────────────────────────────────────────────────────────

const stats = [
  { label: 'Leads hoy',        value: '47',  delta: '+12%', up: true,  icon: Users,    color: '#06b6d4', bg: 'rgba(6,182,212,0.08)'   },
  { label: 'Citas agendadas',  value: '18',  delta: '+8%',  up: true,  icon: Calendar, color: '#3b82f6', bg: 'rgba(59,130,246,0.08)'  },
  { label: 'Conversión',       value: '34%', delta: '+5%',  up: true,  icon: Zap,      color: '#10b981', bg: 'rgba(16,185,129,0.08)'  },
  { label: 'Tiempo respuesta', value: '8s',  delta: '-97%', up: true,  icon: Clock,    color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)'  },
]

const chartPoints = [32, 45, 38, 60, 55, 72, 68, 85, 78, 92, 88, 110, 95, 120]
const W = 560, H = 160

function buildPath(pts: number[]) {
  const max = Math.max(...pts), min = Math.min(...pts)
  const range = max - min || 1
  const xs = pts.map((_, i) => (i / (pts.length - 1)) * W)
  const ys = pts.map(v => H - 8 - ((v - min) / range) * (H - 24))
  let d = `M ${xs[0]} ${ys[0]}`
  for (let i = 1; i < xs.length; i++) {
    const cx = (xs[i - 1] + xs[i]) / 2
    d += ` C ${cx} ${ys[i - 1]}, ${cx} ${ys[i]}, ${xs[i]} ${ys[i]}`
  }
  return { d, xs, ys }
}

const leads = [
  { name: 'Sofía Ramírez',   source: 'WhatsApp', service: 'Depilación láser',      score: 92, time: '5 min',  status: 'hot',    avatar: 'SR' },
  { name: 'Andrea López',    source: 'Facebook', service: 'Hidrafacial',            score: 78, time: '12 min', status: 'warm',   avatar: 'AL' },
  { name: 'Mariana Torres',  source: 'WhatsApp', service: 'Toxina botulínica',      score: 85, time: '8 min',  status: 'hot',    avatar: 'MT' },
  { name: 'Daniela Flores',  source: 'Instagram',service: 'Rellenos dérmicos',     score: 61, time: '35 min', status: 'cold',   avatar: 'DF' },
  { name: 'Valeria Mendoza', source: 'WhatsApp', service: 'Depilación zona comp.', score: 88, time: '3 min',  status: 'hot',    avatar: 'VM' },
  { name: 'Carmen Ortega',   source: 'Facebook', service: 'Limpieza facial',       score: 55, time: '1 hr',   status: 'cold',   avatar: 'CO' },
]

const appointments = [
  { time: '09:00',  name: 'Sofía R.',   service: 'Depilación láser',  status: 'confirmed', avatar: 'SR' },
  { time: '10:30',  name: 'Andrea L.',  service: 'Hidrafacial',       status: 'confirmed', avatar: 'AL' },
  { time: '12:00',  name: 'Mariana T.', service: 'Botox',             status: 'pending',   avatar: 'MT' },
  { time: '14:00',  name: 'Lupita V.',  service: 'Rellenos',          status: 'confirmed', avatar: 'LV' },
  { time: '15:30',  name: 'Carmen O.',  service: 'Limpieza facial',   status: 'pending',   avatar: 'CO' },
]

const sources = [
  { label: 'WhatsApp', pct: 52, color: '#10b981' },
  { label: 'Facebook',  pct: 24, color: '#3b82f6' },
  { label: 'Instagram', pct: 16, color: '#8b5cf6' },
  { label: 'Otros',     pct: 8,  color: '#f59e0b' },
]

// ── Donut SVG ──────────────────────────────────────────────────────────────────
function Donut() {
  const r = 52, cx = 64, cy = 64
  const circ = 2 * Math.PI * r
  let offset = 0
  const slices = sources.map(s => {
    const dash = (s.pct / 100) * circ
    const el = { ...s, dash, offset }
    offset += dash
    return el
  })
  return (
    <svg width="128" height="128" viewBox="0 0 128 128">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth="16" />
      {slices.map(s => (
        <circle key={s.label} cx={cx} cy={cy} r={r} fill="none"
          stroke={s.color} strokeWidth="16"
          strokeDasharray={`${s.dash} ${circ - s.dash}`}
          strokeDashoffset={-s.offset}
          transform={`rotate(-90 ${cx} ${cy})`}
          strokeLinecap="butt" />
      ))}
      <text x={cx} y={cy - 5} textAnchor="middle" fontSize="13" fontWeight="700" fill="#0f172a">100%</text>
      <text x={cx} y={cy + 11} textAnchor="middle" fontSize="8" fill="#64748b">Total</text>
    </svg>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [chartTab, setChartTab] = useState<'week' | 'month'>('month')
  const { d: linePath, xs, ys } = buildPath(chartPoints)
  const areaPath = `${linePath} L ${xs[xs.length - 1]} ${H} L ${xs[0]} ${H} Z`

  const today = new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })
  const todayLabel = today.charAt(0).toUpperCase() + today.slice(1)

  return (
    <div className="max-w-[1280px] mx-auto">

      {/* ── Demo banner ────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-5 px-4 py-3 rounded-xl text-sm"
        style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)' }}>
        <span className="text-base">⚠️</span>
        <div>
          <span className="font-semibold text-amber-700">Datos de ejemplo</span>
          <span className="text-amber-600 ml-2">— Los números mostrados son de demostración. Se reemplazarán con tu información real al conectar WhatsApp y tu agenda.</span>
        </div>
      </div>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <p className="text-xs text-[#94a3b8] mb-1">{todayLabel}</p>
          <h1 className="text-2xl font-bold text-[#0f172a]">Hola, Clínica Lumina 👋</h1>
          <p className="text-sm text-[#64748b] mt-1">Hoy tienes <strong className="text-[#0f172a]">18 citas</strong> y <strong className="text-[#0f172a]">47 nuevos leads</strong></p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-[#64748b] transition-all hover:bg-white"
            style={{ border: '1px solid rgba(15,23,42,0.10)', background: '#f8fafc' }}>
            <Download className="w-3.5 h-3.5" /> Exportar
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}>
            <Phone className="w-3.5 h-3.5" /> Nuevo Lead
          </button>
        </div>
      </div>

      {/* ── Stat cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="rounded-2xl p-5 transition-all hover:shadow-md"
              style={{ background: '#ffffff', border: '1px solid rgba(15,23,42,0.07)', boxShadow: '0 1px 6px rgba(15,23,42,0.04)' }}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                  <Icon className="w-4 h-4" style={{ color: s.color }} />
                </div>
                <span className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${s.up ? 'text-emerald-600 bg-emerald-50' : 'text-red-500 bg-red-50'}`}>
                  {s.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {s.delta}
                </span>
              </div>
              <p className="text-2xl font-extrabold text-[#0f172a] mb-0.5">{s.value}</p>
              <p className="text-xs text-[#94a3b8]">{s.label}</p>
            </div>
          )
        })}
      </div>

      {/* ── Chart row ──────────────────────────────────────────────── */}
      <div className="grid xl:grid-cols-[1fr_300px] gap-4 mb-6">

        {/* Line chart */}
        <div className="rounded-2xl p-5"
          style={{ background: '#ffffff', border: '1px solid rgba(15,23,42,0.07)', boxShadow: '0 1px 6px rgba(15,23,42,0.04)' }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-[#0f172a]">Rendimiento de Leads</h3>
              <div className="flex items-center gap-4 mt-1">
                <span className="flex items-center gap-1.5 text-xs text-[#64748b]"><span className="w-2 h-2 rounded-full bg-[#06b6d4]" />Leads</span>
                <span className="flex items-center gap-1.5 text-xs text-[#64748b]"><span className="w-2 h-2 rounded-full bg-[#10b981]" />Conversiones</span>
              </div>
            </div>
            <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: 'rgba(15,23,42,0.08)' }}>
              {(['week', 'month'] as const).map(t => (
                <button key={t} onClick={() => setChartTab(t)}
                  className="px-3 py-1.5 text-xs font-medium transition-all"
                  style={{
                    background: chartTab === t ? '#06b6d4' : '#f8fafc',
                    color: chartTab === t ? '#ffffff' : '#64748b',
                  }}>
                  {t === 'week' ? 'Semana' : 'Mes'}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-hidden rounded-xl">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none" style={{ height: '140px' }}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={areaPath} fill="url(#areaGrad)" />
              <path d={linePath} fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              {/* Conversion line (offset downward) */}
              <path
                d={buildPath(chartPoints.map(v => v * 0.62)).d}
                fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 3"
                strokeLinecap="round" strokeLinejoin="round" opacity="0.7"
              />
              {/* Highlight dot at latest point */}
              <circle cx={xs[xs.length - 1]} cy={ys[ys.length - 1]} r="4" fill="#06b6d4" />
              <circle cx={xs[xs.length - 1]} cy={ys[ys.length - 1]} r="7" fill="rgba(6,182,212,0.15)" />
            </svg>
          </div>
          {/* X axis labels */}
          <div className="flex justify-between mt-2">
            {['Ene 1','Ene 5','Ene 10','Ene 15','Ene 20','Ene 25','Ene 30'].map(l => (
              <span key={l} className="text-[9px] text-[#94a3b8]">{l}</span>
            ))}
          </div>
        </div>

        {/* Lead Sources */}
        <div className="rounded-2xl p-5"
          style={{ background: '#ffffff', border: '1px solid rgba(15,23,42,0.07)', boxShadow: '0 1px 6px rgba(15,23,42,0.04)' }}>
          <h3 className="text-sm font-bold text-[#0f172a] mb-4">Fuentes de Leads</h3>
          <div className="flex justify-center mb-4">
            <Donut />
          </div>
          <div className="space-y-2.5">
            {sources.map(s => (
              <div key={s.label} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#475569] font-medium">{s.label}</span>
                    <span className="text-[#0f172a] font-bold">{s.pct}%</span>
                  </div>
                  <div className="h-1 rounded-full bg-[#f1f5f9]">
                    <div className="h-1 rounded-full transition-all" style={{ width: `${s.pct}%`, background: s.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom row ─────────────────────────────────────────────── */}
      <div className="grid xl:grid-cols-[1fr_300px] gap-4">

        {/* Leads table */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: '#ffffff', border: '1px solid rgba(15,23,42,0.07)', boxShadow: '0 1px 6px rgba(15,23,42,0.04)' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'rgba(15,23,42,0.06)' }}>
            <h3 className="text-sm font-bold text-[#0f172a]">Leads Prioritarios</h3>
            <a href="/dashboard/leads" className="text-xs font-semibold text-[#06b6d4] hover:text-[#0891b2]">Ver todos →</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: '#fafafa' }}>
                  {['Lead','Servicio','Fuente','Score','Hace','Acción'].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map((l, i) => (
                  <tr key={i} className="border-t hover:bg-[#fafafa] transition-colors" style={{ borderColor: 'rgba(15,23,42,0.05)' }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-[10px] font-bold">{l.avatar}</div>
                        <span className="text-xs font-medium text-[#0f172a]">{l.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#64748b]">{l.service}</td>
                    <td className="px-4 py-3 text-xs text-[#64748b]">{l.source}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{
                          background: l.score >= 80 ? 'rgba(16,185,129,0.10)' : l.score >= 65 ? 'rgba(245,158,11,0.10)' : 'rgba(100,116,139,0.10)',
                          color: l.score >= 80 ? '#059669' : l.score >= 65 ? '#d97706' : '#64748b',
                        }}>
                        {l.score}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#94a3b8]">{l.time}</td>
                    <td className="px-4 py-3">
                      <button className="text-[10px] font-semibold px-3 py-1 rounded-lg text-white transition-all"
                        style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}>
                        Agendar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Today's appointments */}
        <div className="rounded-2xl"
          style={{ background: '#ffffff', border: '1px solid rgba(15,23,42,0.07)', boxShadow: '0 1px 6px rgba(15,23,42,0.04)' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'rgba(15,23,42,0.06)' }}>
            <h3 className="text-sm font-bold text-[#0f172a]">Citas de hoy</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: '#06b6d4' }}>
              {appointments.length}
            </span>
          </div>
          <div className="p-4 space-y-3">
            {appointments.map((a, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-[#f8fafc]"
                style={{ border: '1px solid rgba(15,23,42,0.06)' }}>
                <div className="text-[10px] font-bold text-[#06b6d4] w-10 flex-shrink-0">{a.time}</div>
                <div className="w-7 h-7 rounded-full flex-shrink-0 bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-[9px] font-bold">{a.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#0f172a] truncate">{a.name}</p>
                  <p className="text-[10px] text-[#94a3b8] truncate">{a.service}</p>
                </div>
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${a.status === 'confirmed' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              </div>
            ))}
            <a href="/dashboard/citas"
              className="block text-center text-xs font-semibold py-2.5 rounded-xl transition-all mt-1"
              style={{ color: '#06b6d4', border: '1px solid rgba(6,182,212,0.20)', background: 'rgba(6,182,212,0.04)' }}>
              Ver agenda completa →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
