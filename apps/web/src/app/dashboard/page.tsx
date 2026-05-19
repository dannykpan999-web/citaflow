'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, Users, Calendar, Zap, MessageSquare, Download, Plus, AlertCircle } from 'lucide-react'
import { analyticsApi, appointmentsApi, type KpiData, type ChartDay, type Appointment } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'

const STATUS_LABELS: Record<string, string> = {
  new: 'Nuevo',
  in_conversation: 'En conversación',
  link_sent: 'Link enviado',
  appointment_generated: 'Cita agendada',
  human_control: 'Control humano',
  not_interested: 'No interesado',
  closed: 'Cerrado',
}

const STATUS_COLORS: Record<string, string> = {
  new: '#06b6d4',
  in_conversation: '#3b82f6',
  link_sent: '#8b5cf6',
  appointment_generated: '#10b981',
  human_control: '#f59e0b',
  not_interested: '#94a3b8',
  closed: '#64748b',
}

function BarChart({ data }: { data: ChartDay[] }) {
  const maxLeads = Math.max(...data.map(d => d.leads), 1)
  return (
    <div className="flex items-end gap-2 h-28 w-full">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full flex flex-col items-center gap-0.5" style={{ height: '96px', justifyContent: 'flex-end' }}>
            <div
              className="w-full rounded-t-lg transition-all"
              style={{
                height: `${Math.max((d.leads / maxLeads) * 88, 4)}px`,
                background: 'linear-gradient(180deg, #06b6d4, #3b82f6)',
                minHeight: '4px',
              }}
            />
          </div>
          <span className="text-[9px] text-[#94a3b8] capitalize">{d.label}</span>
        </div>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const { user, tenant } = useAuth()
  const [kpis, setKpis] = useState<KpiData | null>(null)
  const [chart, setChart] = useState<ChartDay[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  const today = new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })
  const todayLabel = today.charAt(0).toUpperCase() + today.slice(1)
  const todayStr = new Date().toISOString().split('T')[0]

  useEffect(() => {
    Promise.all([analyticsApi.kpis(), analyticsApi.chart(), appointmentsApi.list()])
      .then(([k, c, a]) => {
        setKpis(k)
        setChart(c)
        setAppointments(a)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const todayAppts = appointments
    .filter(a => a.scheduledAt.startsWith(todayStr))
    .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))

  const statCards = kpis ? [
    {
      label: 'Leads hoy',
      value: String(kpis.newToday),
      delta: kpis.newPrevMonth > 0 ? `+${Math.round(((kpis.newThisMonth - kpis.newPrevMonth) / kpis.newPrevMonth) * 100)}%` : '—',
      up: kpis.newThisMonth >= kpis.newPrevMonth,
      icon: Users,
      color: '#06b6d4',
      bg: 'rgba(6,182,212,0.08)',
    },
    {
      label: 'Citas agendadas',
      value: String(kpis.upcomingAppointments),
      delta: `${kpis.totalAppointments} total`,
      up: true,
      icon: Calendar,
      color: '#3b82f6',
      bg: 'rgba(59,130,246,0.08)',
    },
    {
      label: 'Conversión',
      value: `${kpis.conversionRate}%`,
      delta: kpis.prevConversionRate > 0
        ? `${kpis.conversionRate >= kpis.prevConversionRate ? '+' : ''}${kpis.conversionRate - kpis.prevConversionRate}%`
        : '—',
      up: kpis.conversionRate >= kpis.prevConversionRate,
      icon: Zap,
      color: '#10b981',
      bg: 'rgba(16,185,129,0.08)',
    },
    {
      label: 'Control humano',
      value: String(kpis.humanControl),
      delta: kpis.humanControl > 0 ? 'Requieren atención' : 'Sin pendientes',
      up: kpis.humanControl === 0,
      icon: MessageSquare,
      color: '#8b5cf6',
      bg: 'rgba(139,92,246,0.08)',
    },
  ] : []

  const byStatusEntries = kpis
    ? Object.entries(kpis.byStatus).filter(([, v]) => v > 0)
    : []

  return (
    <div className="max-w-[1280px] mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <p className="text-xs text-[#94a3b8] mb-1">{todayLabel}</p>
          <h1 className="text-2xl font-bold text-[#0f172a]">
            Hola, {tenant?.name ?? user?.name ?? 'Clínica'} 👋
          </h1>
          {kpis && (
            <p className="text-sm text-[#64748b] mt-1">
              Hoy tienes{' '}
              <strong className="text-[#0f172a]">{todayAppts.length} citas</strong>
              {' '}y{' '}
              <strong className="text-[#0f172a]">{kpis.newToday} nuevos leads</strong>
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/leads"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-[#64748b] transition-all hover:bg-white"
            style={{ border: '1px solid rgba(15,23,42,0.10)', background: '#f8fafc' }}>
            <Download className="w-3.5 h-3.5" /> Ver leads
          </Link>
          <Link href="/dashboard/conversaciones"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}>
            <Plus className="w-3.5 h-3.5" /> Conversaciones
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl p-5 animate-pulse bg-[#f1f5f9]" style={{ height: '110px' }} />
          ))
        ) : (
          statCards.map((s) => {
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
          })
        )}
      </div>

      {/* Chart + Status breakdown */}
      <div className="grid xl:grid-cols-[1fr_300px] gap-4 mb-6">

        {/* Bar chart */}
        <div className="rounded-2xl p-5"
          style={{ background: '#ffffff', border: '1px solid rgba(15,23,42,0.07)', boxShadow: '0 1px 6px rgba(15,23,42,0.04)' }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-[#0f172a]">Leads últimos 7 días</h3>
              <p className="text-xs text-[#94a3b8] mt-0.5">Nuevos leads por día</p>
            </div>
            <span className="text-xs font-semibold text-[#06b6d4]">{kpis?.newThisMonth ?? 0} este mes</span>
          </div>
          {loading ? (
            <div className="h-28 bg-[#f1f5f9] rounded-xl animate-pulse" />
          ) : (
            <BarChart data={chart.length ? chart : Array.from({ length: 7 }, (_, i) => ({
              label: ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'][i],
              leads: 0,
              appointments: 0,
            }))} />
          )}
        </div>

        {/* Status breakdown */}
        <div className="rounded-2xl p-5"
          style={{ background: '#ffffff', border: '1px solid rgba(15,23,42,0.07)', boxShadow: '0 1px 6px rgba(15,23,42,0.04)' }}>
          <h3 className="text-sm font-bold text-[#0f172a] mb-4">Estado de leads</h3>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-8 bg-[#f1f5f9] rounded-lg animate-pulse" />
              ))}
            </div>
          ) : byStatusEntries.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <AlertCircle className="w-8 h-8 text-[#cbd5e1] mb-2" />
              <p className="text-xs text-[#94a3b8]">Sin leads aún</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {byStatusEntries.map(([status, count]) => {
                const total = kpis!.totalLeads || 1
                const pct = Math.round((count / total) * 100)
                return (
                  <div key={status} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: STATUS_COLORS[status] ?? '#94a3b8' }} />
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#475569] font-medium">{STATUS_LABELS[status] ?? status}</span>
                        <span className="text-[#0f172a] font-bold">{count}</span>
                      </div>
                      <div className="h-1 rounded-full bg-[#f1f5f9]">
                        <div className="h-1 rounded-full" style={{ width: `${pct}%`, background: STATUS_COLORS[status] ?? '#94a3b8' }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Today's appointments */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: '#ffffff', border: '1px solid rgba(15,23,42,0.07)', boxShadow: '0 1px 6px rgba(15,23,42,0.04)' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'rgba(15,23,42,0.06)' }}>
          <h3 className="text-sm font-bold text-[#0f172a]">Citas de hoy</h3>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: '#06b6d4' }}>
              {todayAppts.length}
            </span>
            <Link href="/dashboard/citas" className="text-xs font-semibold text-[#06b6d4] hover:text-[#0891b2]">Ver agenda →</Link>
          </div>
        </div>
        {loading ? (
          <div className="p-5 grid grid-cols-2 md:grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-[#f1f5f9] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : todayAppts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Calendar className="w-10 h-10 text-[#e2e8f0] mb-2" />
            <p className="text-sm text-[#94a3b8]">No hay citas para hoy</p>
            <Link href="/dashboard/citas" className="text-xs font-semibold text-[#06b6d4] mt-2">Ir a la agenda →</Link>
          </div>
        ) : (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {todayAppts.map((a) => {
              const time = new Date(a.scheduledAt).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
              const initials = (a.lead?.name ?? a.leadId).slice(0, 2).toUpperCase()
              return (
                <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-[#f8fafc]"
                  style={{ border: '1px solid rgba(15,23,42,0.06)' }}>
                  <div className="text-[10px] font-bold text-[#06b6d4] w-10 flex-shrink-0">{time}</div>
                  <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[9px] font-bold"
                    style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}>
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#0f172a] truncate">{a.lead?.name ?? 'Lead'}</p>
                    <p className="text-[10px] text-[#94a3b8] truncate">{a.service ?? 'Servicio'}</p>
                  </div>
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${a.reminder24hSent ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
