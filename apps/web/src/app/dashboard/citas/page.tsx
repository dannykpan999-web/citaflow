'use client'

import { useEffect, useState } from 'react'
import { Calendar, Clock, Bell, BellOff, Trash2, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { appointmentsApi, leadsApi, type Appointment, type Lead } from '@/lib/api'

function ReminderBadge({ sent, label }: { sent: boolean; label: string }) {
  return (
    <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${sent ? 'text-emerald-600 bg-emerald-50' : 'text-[#94a3b8] bg-[#f1f5f9]'}`}>
      {sent ? <Bell className="w-2.5 h-2.5" /> : <BellOff className="w-2.5 h-2.5" />}
      {label}
    </span>
  )
}

function AddAppointmentModal({ leads, onSave, onClose }: {
  leads: Lead[]
  onSave: (data: { leadId: string; scheduledAt: string; service: string }) => Promise<void>
  onClose: () => void
}) {
  const [leadId, setLeadId] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('09:00')
  const [service, setService] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!leadId || !date) return
    setSaving(true)
    await onSave({ leadId, scheduledAt: `${date}T${time}:00.000Z`, service })
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(15,23,42,0.4)' }}>
      <div className="rounded-2xl p-6 w-full max-w-md" style={{ background: '#fff', boxShadow: '0 20px 60px rgba(15,23,42,0.15)' }}>
        <h3 className="text-base font-bold text-[#0f172a] mb-4">Nueva Cita</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-[#475569] block mb-1">Lead</label>
            <select value={leadId} onChange={e => setLeadId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
              style={{ border: '1px solid rgba(15,23,42,0.12)', background: '#f8fafc', color: '#0f172a' }}>
              <option value="">Selecciona un lead...</option>
              {leads.map(l => (
                <option key={l.id} value={l.id}>{l.name ?? l.phone}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#475569] block mb-1">Fecha</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                style={{ border: '1px solid rgba(15,23,42,0.12)', background: '#f8fafc', color: '#0f172a' }} />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#475569] block mb-1">Hora</label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                style={{ border: '1px solid rgba(15,23,42,0.12)', background: '#f8fafc', color: '#0f172a' }} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-[#475569] block mb-1">Servicio (opcional)</label>
            <input type="text" value={service} onChange={e => setService(e.target.value)}
              placeholder="Ej: Hidrafacial, Depilación..."
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
              style={{ border: '1px solid rgba(15,23,42,0.12)', background: '#f8fafc', color: '#0f172a' }} />
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-[#64748b]"
            style={{ background: '#f1f5f9' }}>Cancelar</button>
          <button onClick={handleSave} disabled={saving || !leadId || !date}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}>
            {saving ? 'Guardando...' : 'Crear cita'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CitasPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const [a, l] = await Promise.all([appointmentsApi.list(), leadsApi.list({ limit: 200 })])
      setAppointments(a)
      setLeads(l.data)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const getWeekDays = () => {
    const now = new Date()
    const monday = new Date(now)
    const day = now.getDay() || 7
    monday.setDate(now.getDate() - day + 1 + currentWeekOffset * 7)
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      return d
    })
  }

  const weekDays = getWeekDays()
  const weekStart = weekDays[0]
  const weekEnd = weekDays[6]

  const apptsByDay = weekDays.map(d => ({
    date: d,
    appts: appointments.filter(a => {
      const ad = new Date(a.scheduledAt)
      return ad.toDateString() === d.toDateString()
    }).sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt)),
  }))

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta cita?')) return
    setDeletingId(id)
    try {
      await appointmentsApi.delete(id)
      await load()
    } catch {}
    setDeletingId(null)
  }

  const handleAdd = async (data: { leadId: string; scheduledAt: string; service: string }) => {
    try {
      await appointmentsApi.create(data)
      await load()
      setShowModal(false)
    } catch {}
  }

  const todayStr = new Date().toDateString()
  const upcoming = appointments.filter(a => new Date(a.scheduledAt) >= new Date()).length

  return (
    <div className="max-w-[1280px] mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Agenda de Citas</h1>
          <p className="text-sm text-[#64748b] mt-0.5">{upcoming} citas próximas</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}>
          <Plus className="w-4 h-4" /> Nueva cita
        </button>
      </div>

      {/* Week nav */}
      <div className="rounded-2xl overflow-hidden mb-4" style={{ background: '#fff', border: '1px solid rgba(15,23,42,0.07)', boxShadow: '0 1px 6px rgba(15,23,42,0.04)' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'rgba(15,23,42,0.06)' }}>
          <button onClick={() => setCurrentWeekOffset(o => o - 1)}
            className="p-2 rounded-xl hover:bg-[#f1f5f9] transition-colors">
            <ChevronLeft className="w-4 h-4 text-[#64748b]" />
          </button>
          <div className="text-center">
            <p className="text-sm font-bold text-[#0f172a]">
              {weekStart.toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })} —{' '}
              {weekEnd.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            {currentWeekOffset === 0 && <p className="text-[10px] text-[#06b6d4] font-semibold">Esta semana</p>}
          </div>
          <button onClick={() => setCurrentWeekOffset(o => o + 1)}
            className="p-2 rounded-xl hover:bg-[#f1f5f9] transition-colors">
            <ChevronRight className="w-4 h-4 text-[#64748b]" />
          </button>
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 divide-x" style={{ divideColor: 'rgba(15,23,42,0.06)', minHeight: '300px' }}>
          {apptsByDay.map(({ date, appts }) => {
            const isToday = date.toDateString() === todayStr
            const dayName = date.toLocaleDateString('es-MX', { weekday: 'short' })
            const dayNum = date.getDate()
            return (
              <div key={date.toISOString()} className="flex flex-col" style={{ borderRight: '1px solid rgba(15,23,42,0.06)' }}>
                <div className={`text-center py-3 border-b ${isToday ? 'bg-[#06b6d4]' : 'bg-[#fafafa]'}`}
                  style={{ borderColor: 'rgba(15,23,42,0.06)' }}>
                  <p className={`text-[10px] font-semibold uppercase ${isToday ? 'text-white/80' : 'text-[#94a3b8]'}`}>{dayName}</p>
                  <p className={`text-lg font-bold ${isToday ? 'text-white' : 'text-[#0f172a]'}`}>{dayNum}</p>
                </div>
                <div className="flex-1 p-2 space-y-1.5">
                  {loading ? (
                    <div className="h-10 bg-[#f1f5f9] rounded-lg animate-pulse" />
                  ) : appts.map(a => {
                    const time = new Date(a.scheduledAt).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
                    const lead = leads.find(l => l.id === a.leadId)
                    return (
                      <div key={a.id} className="rounded-lg p-2 text-[10px] group relative"
                        style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.20)' }}>
                        <p className="font-bold text-[#06b6d4] mb-0.5">{time}</p>
                        <p className="font-semibold text-[#0f172a] truncate">{lead?.name ?? 'Lead'}</p>
                        <p className="text-[#64748b] truncate">{a.service ?? 'Servicio'}</p>
                        <button
                          onClick={() => handleDelete(a.id)}
                          disabled={deletingId === a.id}
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-red-50 text-[#94a3b8] hover:text-red-500 transition-all">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Upcoming list */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid rgba(15,23,42,0.07)', boxShadow: '0 1px 6px rgba(15,23,42,0.04)' }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: 'rgba(15,23,42,0.06)' }}>
          <h3 className="text-sm font-bold text-[#0f172a]">Próximas citas</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: '#fafafa' }}>
                {['Lead', 'Fecha y hora', 'Servicio', 'Recordatorio 24h', 'Recordatorio 2h', 'Acciones'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-t" style={{ borderColor: 'rgba(15,23,42,0.05)' }}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-[#f1f5f9] rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : appointments.filter(a => new Date(a.scheduledAt) >= new Date())
                .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))
                .slice(0, 20)
                .map(a => {
                  const lead = leads.find(l => l.id === a.leadId)
                  const dt = new Date(a.scheduledAt)
                  return (
                    <tr key={a.id} className="border-t hover:bg-[#fafafa] transition-colors" style={{ borderColor: 'rgba(15,23,42,0.05)' }}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                            style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}>
                            {(lead?.name ?? 'L').slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-[#0f172a]">{lead?.name ?? 'Lead'}</p>
                            <p className="text-[10px] text-[#94a3b8] font-mono">{lead?.phone ?? a.leadId.slice(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-xs text-[#0f172a]">
                          <Calendar className="w-3.5 h-3.5 text-[#94a3b8]" />
                          {dt.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
                          <Clock className="w-3.5 h-3.5 text-[#94a3b8] ml-1" />
                          {dt.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#64748b]">{a.service ?? '—'}</td>
                      <td className="px-4 py-3"><ReminderBadge sent={a.reminder24hSent} label="24h" /></td>
                      <td className="px-4 py-3"><ReminderBadge sent={a.reminder2hSent} label="2h" /></td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleDelete(a.id)} disabled={deletingId === a.id}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-[#94a3b8] hover:text-red-500 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
          {!loading && appointments.filter(a => new Date(a.scheduledAt) >= new Date()).length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <Calendar className="w-10 h-10 text-[#e2e8f0] mb-2" />
              <p className="text-sm text-[#94a3b8]">No hay citas próximas</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <AddAppointmentModal leads={leads} onSave={handleAdd} onClose={() => setShowModal(false)} />
      )}
    </div>
  )
}
