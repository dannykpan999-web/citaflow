'use client'

import { useAuth } from '@/context/AuthContext'
import { UserCog, Mail, Building2, Crown, Calendar, Shield, CheckCircle } from 'lucide-react'

export default function PerfilPage() {
  const { user, tenant } = useAuth()

  if (!user) return null

  const initials = user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()

  const planLabel = tenant?.plan === 'growth' ? 'Growth' : 'Starter'
  const planColor = tenant?.plan === 'growth'
    ? { bg: 'rgba(59,130,246,0.10)', color: '#3b82f6', border: 'rgba(59,130,246,0.20)' }
    : { bg: 'rgba(6,182,212,0.10)', color: '#0891b2', border: 'rgba(6,182,212,0.20)' }

  const statusLabel = tenant?.status === 'trial' ? 'Prueba gratuita' : tenant?.status === 'active' ? 'Activo' : 'Suspendido'
  const statusColor = tenant?.status === 'active' ? '#10b981' : tenant?.status === 'trial' ? '#f59e0b' : '#ef4444'

  const trialDate = tenant?.trialEndsAt
    ? new Date(tenant.trialEndsAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  const roleLabel = user.role === 'owner' ? 'Propietario' : user.role === 'super_admin' ? 'Super Admin' : 'Agente'

  const details = [
    { icon: UserCog, label: 'Nombre completo', value: user.name },
    { icon: Mail, label: 'Correo electrónico', value: user.email, verified: true },
    { icon: Building2, label: 'Clínica', value: tenant?.name ?? '—' },
    { icon: Crown, label: 'Plan', value: planLabel },
    { icon: Shield, label: 'Rol', value: roleLabel },
    { icon: Calendar, label: 'Miembro desde', value: memberSince ?? '—' },
  ]

  return (
    <div className="max-w-3xl mx-auto">

      {/* Banner + Avatar */}
      <div className="relative mb-16">
        <div className="h-36 rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 60%, #6366f1 100%)' }}>
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, rgba(255,255,255,0.3) 0%, transparent 60%)' }} />
        </div>
        {/* Avatar */}
        <div className="absolute -bottom-10 left-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-white shadow-lg">
            {initials}
          </div>
        </div>
        {/* Edit button */}
        <div className="absolute bottom-4 right-4">
          <a href="/dashboard/perfil/editar"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90"
            style={{ background: 'rgba(255,255,255,0.20)', border: '1px solid rgba(255,255,255,0.30)', backdropFilter: 'blur(8px)' }}>
            <UserCog className="w-3.5 h-3.5" />
            Editar perfil
          </a>
        </div>
      </div>

      {/* Name + badges */}
      <div className="px-1 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-xl font-bold text-[#0f172a]">{user.name}</h1>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold"
            style={{ background: planColor.bg, color: planColor.color, border: `1px solid ${planColor.border}` }}>
            <Crown className="w-2.5 h-2.5" />
            {planLabel}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold"
            style={{ background: `${statusColor}14`, color: statusColor, border: `1px solid ${statusColor}30` }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor }} />
            {statusLabel}
          </span>
        </div>
        {trialDate && tenant?.status === 'trial' && (
          <p className="text-xs text-[#94a3b8] mt-1">Prueba activa hasta el {trialDate}</p>
        )}
      </div>

      {/* Profile details card */}
      <div className="rounded-2xl p-6 mb-4" style={{ background: '#ffffff', border: '1px solid rgba(15,23,42,0.07)', boxShadow: '0 1px 8px rgba(15,23,42,0.04)' }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-bold text-[#0f172a]">Información de perfil</h2>
          <a href="/dashboard/perfil/editar" className="text-xs font-semibold text-[#06b6d4] hover:text-[#0891b2] flex items-center gap-1">
            <UserCog className="w-3 h-3" /> Editar
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
          {details.map(({ icon: Icon, label, value, verified }, i) => (
            <div key={label} className="flex items-start gap-3 py-4"
              style={{ borderBottom: i < details.length - 2 ? '1px solid rgba(15,23,42,0.05)' : 'none' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.14)' }}>
                <Icon className="w-4 h-4" style={{ color: '#0891b2' }} />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wider mb-0.5">{label}</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-[#0f172a]">{value}</p>
                  {verified && (
                    <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-1.5 py-0.5">
                      <CheckCircle className="w-2.5 h-2.5" /> Verificado
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security card */}
      <div className="rounded-2xl p-5 flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.06), rgba(59,130,246,0.06))', border: '1px solid rgba(6,182,212,0.14)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.20)' }}>
            <Shield className="w-5 h-5" style={{ color: '#0891b2' }} />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#0f172a]">Seguridad de la cuenta</p>
            <p className="text-xs text-[#64748b]">Cambia tu contraseña en Configuración de cuenta</p>
          </div>
        </div>
        <a href="/dashboard/perfil/editar"
          className="px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}>
          Gestionar →
        </a>
      </div>
    </div>
  )
}
