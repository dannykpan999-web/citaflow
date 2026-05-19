'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Users, MessageSquare, ShieldAlert, BarChart3, CheckCircle, PauseCircle, Ban } from 'lucide-react'
import { adminApi } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  trial:     { label: 'Trial',     color: '#f59e0b', bg: 'rgba(245,158,11,0.10)'   },
  active:    { label: 'Activo',    color: '#10b981', bg: 'rgba(16,185,129,0.10)'   },
  suspended: { label: 'Suspendido',color: '#ef4444', bg: 'rgba(239,68,68,0.10)'    },
}

export default function AdminPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [tenants, setTenants] = useState<any[]>([])
  const [metrics, setMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState<string | null>(null)

  useEffect(() => {
    if (user && user.role !== 'super_admin') { router.push('/dashboard'); return }
    Promise.all([adminApi.tenants(), adminApi.metrics()])
      .then(([t, m]) => { setTenants(t); setMetrics(m) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  const updateStatus = async (id: string, status: string) => {
    setActionId(id)
    try {
      await adminApi.updateStatus(id, status)
      setTenants(ts => ts.map(t => t.id === id ? { ...t, status } : t))
    } catch {}
    setActionId(null)
  }

  const metricCards = metrics ? [
    { label: 'Total clínicas', value: metrics.totalTenants, icon: Building2, color: '#06b6d4', bg: 'rgba(6,182,212,0.08)' },
    { label: 'Activas',        value: metrics.activeTenants, icon: CheckCircle, color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
    { label: 'En trial',       value: metrics.trialTenants, icon: PauseCircle, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
    { label: 'Total leads',    value: metrics.totalLeads, icon: MessageSquare, color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)' },
    { label: 'Total usuarios', value: metrics.totalUsers, icon: Users, color: '#3b82f6', bg: 'rgba(59,130,246,0.08)' },
    { label: 'Suspendidas',    value: metrics.suspendedTenants, icon: Ban, color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
  ] : []

  return (
    <div className="max-w-[1280px] mx-auto">

      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.08)' }}>
          <ShieldAlert className="w-5 h-5 text-red-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Panel Super Admin</h1>
          <p className="text-sm text-[#64748b]">Solo visible para administradores de CitaLead</p>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-[#f1f5f9] animate-pulse" />
          ))
        ) : metricCards.map(c => {
          const Icon = c.icon
          return (
            <div key={c.label} className="rounded-2xl p-4" style={{ background: '#fff', border: '1px solid rgba(15,23,42,0.07)', boxShadow: '0 1px 4px rgba(15,23,42,0.04)' }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style={{ background: c.bg }}>
                <Icon className="w-4 h-4" style={{ color: c.color }} />
              </div>
              <p className="text-xl font-extrabold text-[#0f172a]">{c.value}</p>
              <p className="text-[10px] text-[#94a3b8]">{c.label}</p>
            </div>
          )
        })}
      </div>

      {/* Tenant table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid rgba(15,23,42,0.07)', boxShadow: '0 1px 6px rgba(15,23,42,0.04)' }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: 'rgba(15,23,42,0.06)' }}>
          <h3 className="text-sm font-bold text-[#0f172a]">Cuentas de clínicas</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: '#fafafa' }}>
                {['Clínica', 'Plan', 'Estado', 'Leads', 'Usuarios', 'Registro', 'Trial hasta', 'Acciones'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t" style={{ borderColor: 'rgba(15,23,42,0.05)' }}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-[#f1f5f9] rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : tenants.map(t => {
                const sc = STATUS_CONFIG[t.status] ?? STATUS_CONFIG.trial
                return (
                  <tr key={t.id} className="border-t hover:bg-[#fafafa] transition-colors" style={{ borderColor: 'rgba(15,23,42,0.05)' }}>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-xs font-semibold text-[#0f172a]">{t.name}</p>
                        <p className="text-[10px] text-[#94a3b8]">{t.slug}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full text-[#3b82f6] bg-[rgba(59,130,246,0.10)] capitalize">{t.plan}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                        style={{ color: sc.color, background: sc.bg }}>{sc.label}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#64748b]">{t.leadCount}</td>
                    <td className="px-4 py-3 text-xs text-[#64748b]">{t.userCount}</td>
                    <td className="px-4 py-3 text-xs text-[#94a3b8]">
                      {new Date(t.createdAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: '2-digit' })}
                    </td>
                    <td className="px-4 py-3 text-xs text-[#94a3b8]">
                      {t.trialEndsAt ? new Date(t.trialEndsAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {t.status !== 'active' && (
                          <button onClick={() => updateStatus(t.id, 'active')} disabled={actionId === t.id}
                            className="text-[10px] font-semibold px-2 py-1 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors">
                            Activar
                          </button>
                        )}
                        {t.status !== 'suspended' && (
                          <button onClick={() => updateStatus(t.id, 'suspended')} disabled={actionId === t.id}
                            className="text-[10px] font-semibold px-2 py-1 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                            Suspender
                          </button>
                        )}
                        {t.status !== 'trial' && (
                          <button onClick={() => updateStatus(t.id, 'trial')} disabled={actionId === t.id}
                            className="text-[10px] font-semibold px-2 py-1 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors">
                            Trial
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {!loading && tenants.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <Building2 className="w-10 h-10 text-[#e2e8f0] mb-2" />
              <p className="text-sm text-[#94a3b8]">No hay cuentas registradas</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
