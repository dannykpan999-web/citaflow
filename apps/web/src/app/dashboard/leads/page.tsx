'use client'

import { useEffect, useState, useCallback } from 'react'
import { Search, Filter, MoreHorizontal, Bot, User, Trash2, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react'
import { leadsApi, type Lead, type LeadStatus } from '@/lib/api'
import Link from 'next/link'

const STATUS_CONFIG: Record<LeadStatus, { label: string; color: string; bg: string }> = {
  new:                    { label: 'Nuevo',          color: '#06b6d4', bg: 'rgba(6,182,212,0.10)'   },
  in_conversation:        { label: 'En conversación', color: '#3b82f6', bg: 'rgba(59,130,246,0.10)'  },
  link_sent:              { label: 'Link enviado',    color: '#8b5cf6', bg: 'rgba(139,92,246,0.10)'  },
  appointment_generated:  { label: 'Cita agendada',  color: '#10b981', bg: 'rgba(16,185,129,0.10)'  },
  human_control:          { label: 'Control humano', color: '#f59e0b', bg: 'rgba(245,158,11,0.10)'   },
  not_interested:         { label: 'No interesado',  color: '#94a3b8', bg: 'rgba(148,163,184,0.10)' },
  closed:                 { label: 'Cerrado',        color: '#64748b', bg: 'rgba(100,116,139,0.10)' },
}

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'Todos' },
  ...Object.entries(STATUS_CONFIG).map(([v, c]) => ({ value: v, label: c.label })),
]

function StatusBadge({ status }: { status: LeadStatus }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' }
  return (
    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
      style={{ color: cfg.color, background: cfg.bg }}>
      {cfg.label}
    </span>
  )
}

function Avatar({ name, phone }: { name: string | null; phone: string }) {
  const initials = name ? name.slice(0, 2).toUpperCase() : phone.slice(-2)
  return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
      style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}>
      {initials}
    </div>
  )
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const LIMIT = 20

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await leadsApi.list({ status: statusFilter || undefined, search: search || undefined, page, limit: LIMIT })
      setLeads(res.data)
      setTotal(res.total)
    } catch {}
    setLoading(false)
  }, [page, search, statusFilter])

  useEffect(() => { load() }, [load])

  const handlePauseResume = async (lead: Lead) => {
    setActionLoading(lead.id)
    try {
      if (lead.botActive) await leadsApi.pauseBot(lead.id)
      else await leadsApi.resumeBot(lead.id)
      await load()
    } catch {}
    setActionLoading(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este lead?')) return
    setActionLoading(id)
    try {
      await leadsApi.delete(id)
      await load()
    } catch {}
    setActionLoading(null)
  }

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <div className="max-w-[1280px] mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Leads</h1>
          <p className="text-sm text-[#64748b] mt-0.5">{total} leads en total</p>
        </div>
      </div>

      {/* Search + filters */}
      <div className="rounded-2xl p-4 mb-4" style={{ background: '#ffffff', border: '1px solid rgba(15,23,42,0.07)', boxShadow: '0 1px 6px rgba(15,23,42,0.04)' }}>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
            <input
              type="text"
              placeholder="Buscar por nombre, teléfono o servicio..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{ border: '1px solid rgba(15,23,42,0.12)', background: '#f8fafc', color: '#0f172a' }}
            />
          </div>
          <button
            onClick={() => setShowFilters(v => !v)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{
              border: '1px solid rgba(15,23,42,0.12)',
              background: showFilters ? '#06b6d4' : '#f8fafc',
              color: showFilters ? '#fff' : '#64748b',
            }}>
            <Filter className="w-4 h-4" /> Filtros
          </button>
        </div>

        {showFilters && (
          <div className="mt-3 pt-3 border-t flex flex-wrap gap-2" style={{ borderColor: 'rgba(15,23,42,0.07)' }}>
            {STATUS_OPTIONS.map(o => (
              <button
                key={o.value}
                onClick={() => { setStatusFilter(o.value); setPage(1) }}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{
                  background: statusFilter === o.value ? '#06b6d4' : 'rgba(15,23,42,0.05)',
                  color: statusFilter === o.value ? '#fff' : '#475569',
                }}>
                {o.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#ffffff', border: '1px solid rgba(15,23,42,0.07)', boxShadow: '0 1px 6px rgba(15,23,42,0.04)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: '#fafafa' }}>
                {['Lead', 'Teléfono', 'Servicio', 'Estado', 'Bot', 'Última actividad', 'Acciones'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-t" style={{ borderColor: 'rgba(15,23,42,0.05)' }}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-[#f1f5f9] rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16">
                    <Search className="w-10 h-10 text-[#e2e8f0] mx-auto mb-2" />
                    <p className="text-sm text-[#94a3b8]">No se encontraron leads</p>
                  </td>
                </tr>
              ) : leads.map(lead => (
                <tr key={lead.id} className="border-t hover:bg-[#fafafa] transition-colors" style={{ borderColor: 'rgba(15,23,42,0.05)' }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={lead.name} phone={lead.phone} />
                      <div>
                        <p className="text-xs font-semibold text-[#0f172a]">{lead.name ?? 'Sin nombre'}</p>
                        <p className="text-[10px] text-[#94a3b8]">#{lead.id.slice(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#64748b] font-mono">{lead.phone}</td>
                  <td className="px-4 py-3 text-xs text-[#64748b]">{lead.serviceInterest ?? '—'}</td>
                  <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                  <td className="px-4 py-3">
                    <span className={`flex items-center gap-1 text-[11px] font-medium ${lead.botActive ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {lead.botActive ? <><Bot className="w-3.5 h-3.5" /> Activo</> : <><User className="w-3.5 h-3.5" /> Humano</>}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#94a3b8]">
                    {new Date(lead.updatedAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link href={`/dashboard/conversaciones?lead=${lead.id}`}
                        className="p-1.5 rounded-lg hover:bg-[#f1f5f9] transition-colors text-[#64748b]" title="Ver conversación">
                        <MessageSquare className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handlePauseResume(lead)}
                        disabled={actionLoading === lead.id}
                        className="p-1.5 rounded-lg hover:bg-[#f1f5f9] transition-colors"
                        style={{ color: lead.botActive ? '#f59e0b' : '#10b981' }}
                        title={lead.botActive ? 'Tomar control' : 'Reactivar bot'}>
                        {lead.botActive ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleDelete(lead.id)}
                        disabled={actionLoading === lead.id}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-[#94a3b8] hover:text-red-500 transition-colors"
                        title="Eliminar">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t" style={{ borderColor: 'rgba(15,23,42,0.06)' }}>
            <p className="text-xs text-[#94a3b8]">
              Mostrando {((page - 1) * LIMIT) + 1}–{Math.min(page * LIMIT, total)} de {total}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg hover:bg-[#f1f5f9] disabled:opacity-40 transition-colors">
                <ChevronLeft className="w-4 h-4 text-[#64748b]" />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className="w-7 h-7 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: page === p ? '#06b6d4' : 'transparent',
                    color: page === p ? '#fff' : '#64748b',
                  }}>
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg hover:bg-[#f1f5f9] disabled:opacity-40 transition-colors">
                <ChevronRight className="w-4 h-4 text-[#64748b]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
