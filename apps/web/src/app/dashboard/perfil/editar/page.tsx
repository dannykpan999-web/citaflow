'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/lib/api'
import { Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react'

export default function EditarPerfilPage() {
  const { user, tenant, updateProfile } = useAuth()

  const [name, setName] = useState(user?.name ?? '')
  const [clinicName, setClinicName] = useState(tenant?.name ?? '')
  const [savingInfo, setSavingInfo] = useState(false)
  const [infoMsg, setInfoMsg] = useState<{ ok: boolean; text: string } | null>(null)

  const [oldPw, setOldPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [savingPw, setSavingPw] = useState(false)
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null)

  if (!user) return null

  const isOwner = user.role === 'owner' || user.role === 'super_admin'

  async function handleSaveInfo(e: React.FormEvent) {
    e.preventDefault()
    setSavingInfo(true)
    setInfoMsg(null)
    try {
      const res = await api.patch<{ user: any; tenant: any }>('/users/me', {
        name: name.trim(),
        ...(isOwner ? { clinicName: clinicName.trim() } : {}),
      })
      updateProfile({ name: res.user.name }, res.tenant ? { name: res.tenant.name } : undefined)
      setInfoMsg({ ok: true, text: 'Información actualizada correctamente' })
    } catch (err: unknown) {
      setInfoMsg({ ok: false, text: err instanceof Error ? err.message : 'Error al guardar' })
    } finally {
      setSavingInfo(false)
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPw !== confirmPw) {
      setPwMsg({ ok: false, text: 'Las contraseñas no coinciden' })
      return
    }
    setSavingPw(true)
    setPwMsg(null)
    try {
      await api.patch('/users/me/password', { oldPassword: oldPw, newPassword: newPw })
      setPwMsg({ ok: true, text: 'Contraseña actualizada correctamente' })
      setOldPw('')
      setNewPw('')
      setConfirmPw('')
    } catch (err: unknown) {
      setPwMsg({ ok: false, text: err instanceof Error ? err.message : 'Error al cambiar contraseña' })
    } finally {
      setSavingPw(false)
    }
  }

  const inputCls = 'w-full px-3.5 py-2.5 rounded-xl text-sm text-[#0f172a] outline-none transition-all'
  const inputStyle = { border: '1.5px solid rgba(15,23,42,0.12)', background: '#fafafa' }
  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => { e.currentTarget.style.borderColor = '#06b6d4' }
  const onBlur  = (e: React.FocusEvent<HTMLInputElement>) => { e.currentTarget.style.borderColor = 'rgba(15,23,42,0.12)' }

  return (
    <div className="max-w-4xl mx-auto">

      {/* Back + heading */}
      <div className="flex items-center gap-3 mb-6">
        <a href="/dashboard/perfil"
          className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white transition-colors"
          style={{ border: '1px solid rgba(15,23,42,0.08)' }}>
          <ArrowLeft className="w-4 h-4 text-[#64748b]" />
        </a>
        <div>
          <h1 className="text-lg font-bold text-[#0f172a]">Configuración de cuenta</h1>
          <p className="text-xs text-[#64748b]">Actualiza tu información personal y contraseña</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* ── Left: General info ──────────────────────────────── */}
        <div className="lg:col-span-3 rounded-2xl p-6"
          style={{ background: '#ffffff', border: '1px solid rgba(15,23,42,0.07)', boxShadow: '0 1px 8px rgba(15,23,42,0.04)' }}>
          <h2 className="text-sm font-bold text-[#0f172a] mb-5">Información general</h2>

          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b" style={{ borderColor: 'rgba(15,23,42,0.06)' }}>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-xl font-bold">
              {user.name.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0f172a]">{user.name}</p>
              <p className="text-xs text-[#94a3b8] mt-0.5">{user.email}</p>
              <p className="text-[10px] text-[#94a3b8] mt-2">Las fotos de perfil no están disponibles en este plan</p>
            </div>
          </div>

          <form onSubmit={handleSaveInfo} className="space-y-4">
            {infoMsg && (
              <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm ${infoMsg.ok ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                {infoMsg.ok ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                {infoMsg.text}
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1.5">Nombre completo</label>
              <input className={inputCls} style={inputStyle} value={name}
                onChange={e => setName(e.target.value)} onFocus={onFocus} onBlur={onBlur} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1.5">Correo electrónico</label>
              <input className={inputCls} style={{ ...inputStyle, opacity: 0.6 }} value={user.email}
                disabled readOnly />
            </div>
            {isOwner && (
              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1.5">Nombre de la clínica</label>
                <input className={inputCls} style={inputStyle} value={clinicName}
                  onChange={e => setClinicName(e.target.value)} onFocus={onFocus} onBlur={onBlur} />
              </div>
            )}
            <div className="pt-2">
              <button type="submit" disabled={savingInfo}
                className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all"
                style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', opacity: savingInfo ? 0.7 : 1 }}>
                {savingInfo ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        </div>

        {/* ── Right: Change password ──────────────────────────── */}
        <div className="lg:col-span-2 rounded-2xl p-6"
          style={{ background: '#ffffff', border: '1px solid rgba(15,23,42,0.07)', boxShadow: '0 1px 8px rgba(15,23,42,0.04)' }}>
          <h2 className="text-sm font-bold text-[#0f172a] mb-5">Cambiar contraseña</h2>

          <form onSubmit={handleChangePassword} className="space-y-4">
            {pwMsg && (
              <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm ${pwMsg.ok ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                {pwMsg.ok ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                {pwMsg.text}
              </div>
            )}
            {[
              { label: 'Contraseña actual', val: oldPw, set: setOldPw, show: showOld, toggle: () => setShowOld(v => !v) },
              { label: 'Nueva contraseña', val: newPw, set: setNewPw, show: showNew, toggle: () => setShowNew(v => !v) },
              { label: 'Confirmar nueva contraseña', val: confirmPw, set: setConfirmPw, show: showConfirm, toggle: () => setShowConfirm(v => !v) },
            ].map(({ label, val, set, show, toggle }) => (
              <div key={label}>
                <label className="block text-xs font-semibold text-[#475569] mb-1.5">{label}</label>
                <div className="relative">
                  <input type={show ? 'text' : 'password'} value={val}
                    onChange={e => set(e.target.value)}
                    className={`${inputCls} pr-10`} style={inputStyle}
                    onFocus={onFocus} onBlur={onBlur}
                    placeholder="••••••••" required />
                  <button type="button" onClick={toggle}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b]">
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
            <div className="pt-2">
              <button type="submit" disabled={savingPw}
                className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all"
                style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', opacity: savingPw ? 0.7 : 1 }}>
                {savingPw ? 'Actualizando...' : 'Cambiar contraseña'}
              </button>
            </div>
          </form>

          {/* Plan info */}
          <div className="mt-6 pt-5 border-t" style={{ borderColor: 'rgba(15,23,42,0.06)' }}>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8] mb-2">Plan actual</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#0f172a] capitalize">{tenant?.plan ?? 'Starter'}</p>
                <p className="text-[10px] text-[#94a3b8] capitalize">{tenant?.status ?? '—'}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-[#0891b2]"
                style={{ background: 'rgba(6,182,212,0.10)', border: '1px solid rgba(6,182,212,0.20)' }}>
                {tenant?.plan === 'growth' ? 'Growth' : 'Starter'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
