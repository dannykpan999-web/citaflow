'use client'

import { useEffect, useState } from 'react'
import { Save, Plus, Trash2, Toggle3D, MessageSquare, Building2, Settings, Clock } from 'lucide-react'
import { settingsApi, servicesApi, templatesApi, type TenantSettings, type Service, type MessageTemplate } from '@/lib/api'

const TABS = [
  { id: 'negocio',       label: 'Negocio',       icon: Building2    },
  { id: 'plantillas',    label: 'Plantillas',     icon: MessageSquare },
  { id: 'servicios',     label: 'Servicios',      icon: Settings     },
  { id: 'automatizacion',label: 'Automatización', icon: Clock        },
]

const TEMPLATE_LABELS: Record<string, string> = {
  welcome:      'Bienvenida',
  service_info: 'Info de servicios',
  agenda_link:  'Link de agenda',
  follow_up_1:  'Seguimiento 1 (12–24h)',
  follow_up_2:  'Seguimiento 2 (48h)',
  soft_close:   'Cierre suave (72h)',
  reminder_24h: 'Recordatorio 24h',
  reminder_2h:  'Recordatorio 2h',
}

const TEMPLATE_ORDER = ['welcome','service_info','agenda_link','follow_up_1','follow_up_2','soft_close','reminder_24h','reminder_2h']

function InputField({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-[#475569] block mb-1.5">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
        style={{ border: '1px solid rgba(15,23,42,0.12)', background: '#f8fafc', color: '#0f172a' }} />
    </div>
  )
}

// ── Tab: Negocio ────────────────────────────────────────────────────────────────
function NegocioTab() {
  const [settings, setSettings] = useState<Partial<TenantSettings>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    settingsApi.get().then(s => { setSettings(s); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const save = async () => {
    setSaving(true)
    try {
      await settingsApi.update({
        name: settings.name,
        city: settings.city,
        workingHours: settings.workingHours,
        agendaLink: settings.agendaLink,
        welcomeMessage: settings.welcomeMessage,
        whatsappPhoneNumberId: settings.whatsappPhoneNumberId,
        whatsappAccessToken: settings.whatsappAccessToken,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {}
    setSaving(false)
  }

  const set = (k: keyof TenantSettings) => (v: string) => setSettings(s => ({ ...s, [k]: v }))

  if (loading) return <div className="animate-pulse space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 bg-[#f1f5f9] rounded-xl" />)}</div>

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Nombre de la clínica" value={settings.name ?? ''} onChange={set('name')} placeholder="Mi Clínica" />
        <InputField label="Ciudad" value={settings.city ?? ''} onChange={set('city')} placeholder="Ciudad de México" />
        <InputField label="Horario de atención" value={settings.workingHours ?? ''} onChange={set('workingHours')} placeholder="Lun–Vie 9:00–18:00" />
        <InputField label="Link de agenda (Calendly, Cal.com...)" value={settings.agendaLink ?? ''} onChange={set('agendaLink')} placeholder="https://calendly.com/tu-clinica" />
      </div>

      <div>
        <label className="text-xs font-semibold text-[#475569] block mb-1.5">Mensaje de bienvenida</label>
        <textarea
          value={settings.welcomeMessage ?? ''}
          onChange={e => set('welcomeMessage')(e.target.value)}
          rows={3}
          placeholder="Hola {{nombre}}, bienvenido a nuestra clínica..."
          className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
          style={{ border: '1px solid rgba(15,23,42,0.12)', background: '#f8fafc', color: '#0f172a' }}
        />
      </div>

      <div className="pt-3 border-t" style={{ borderColor: 'rgba(15,23,42,0.08)' }}>
        <h4 className="text-xs font-bold text-[#0f172a] mb-3 uppercase tracking-wide">Configuración de WhatsApp</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Phone Number ID" value={settings.whatsappPhoneNumberId ?? ''} onChange={set('whatsappPhoneNumberId')} placeholder="123456789012345" />
          <div>
            <label className="text-xs font-semibold text-[#475569] block mb-1.5">Access Token</label>
            <input type="password" value={settings.whatsappAccessToken ?? ''} onChange={e => set('whatsappAccessToken')(e.target.value)}
              placeholder="EAAxxxxxx..."
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
              style={{ border: '1px solid rgba(15,23,42,0.12)', background: '#f8fafc', color: '#0f172a' }} />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
          style={{ background: saved ? '#10b981' : 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}>
          <Save className="w-4 h-4" />
          {saving ? 'Guardando...' : saved ? '¡Guardado!' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  )
}

// ── Tab: Plantillas ─────────────────────────────────────────────────────────────
function PlantillasTab() {
  const [templates, setTemplates] = useState<Record<string, MessageTemplate>>({})
  const [edited, setEdited] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)

  useEffect(() => {
    templatesApi.list()
      .then(ts => {
        const map: Record<string, MessageTemplate> = {}
        const editMap: Record<string, string> = {}
        for (const t of ts) { map[t.type] = t; editMap[t.type] = t.body }
        for (const t of TEMPLATE_ORDER) if (!editMap[t]) editMap[t] = ''
        setTemplates(map)
        setEdited(editMap)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const saveTemplate = async (type: string) => {
    setSaving(type)
    try {
      const t = await templatesApi.upsert(type, edited[type])
      setTemplates(m => ({ ...m, [type]: t }))
      setSaved(type)
      setTimeout(() => setSaved(null), 2000)
    } catch {}
    setSaving(null)
  }

  if (loading) return <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 bg-[#f1f5f9] rounded-xl animate-pulse" />)}</div>

  return (
    <div className="space-y-4">
      <p className="text-xs text-[#64748b]">
        Usa <code className="bg-[#f1f5f9] px-1.5 py-0.5 rounded text-[#06b6d4]">{'{{nombre}}'}</code> y{' '}
        <code className="bg-[#f1f5f9] px-1.5 py-0.5 rounded text-[#06b6d4]">{'{{link}}'}</code> como variables.
      </p>
      {TEMPLATE_ORDER.map(type => (
        <div key={type} className="rounded-xl p-4" style={{ border: '1px solid rgba(15,23,42,0.09)', background: '#fafafa' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#0f172a]">{TEMPLATE_LABELS[type]}</span>
            <button onClick={() => saveTemplate(type)} disabled={saving === type}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all"
              style={{ background: saved === type ? '#10b981' : '#06b6d4' }}>
              <Save className="w-3 h-3" />
              {saving === type ? '...' : saved === type ? '✓' : 'Guardar'}
            </button>
          </div>
          <textarea
            value={edited[type] ?? ''}
            onChange={e => setEdited(m => ({ ...m, [type]: e.target.value }))}
            rows={3}
            placeholder={`Mensaje de ${TEMPLATE_LABELS[type]}...`}
            className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
            style={{ border: '1px solid rgba(15,23,42,0.10)', background: '#fff', color: '#0f172a' }}
          />
        </div>
      ))}
    </div>
  )
}

// ── Tab: Servicios ──────────────────────────────────────────────────────────────
function ServiciosTab() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [newSvc, setNewSvc] = useState({ name: '', price: '', description: '' })
  const [actionId, setActionId] = useState<string | null>(null)

  const load = () => servicesApi.list().then(setServices).catch(() => {}).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const create = async () => {
    try {
      await servicesApi.create({
        name: newSvc.name,
        price: newSvc.price ? parseFloat(newSvc.price) : null,
        description: newSvc.description || null,
        promo: null, requiresHuman: false, active: true,
      } as any)
      setNewSvc({ name: '', price: '', description: '' })
      setAdding(false)
      await load()
    } catch {}
  }

  const toggleActive = async (s: Service) => {
    setActionId(s.id)
    try { await servicesApi.update(s.id, { active: !s.active }); await load() } catch {}
    setActionId(null)
  }

  const remove = async (id: string) => {
    if (!confirm('¿Eliminar este servicio?')) return
    setActionId(id)
    try { await servicesApi.delete(id); await load() } catch {}
    setActionId(null)
  }

  if (loading) return <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 bg-[#f1f5f9] rounded-xl animate-pulse" />)}</div>

  return (
    <div className="space-y-3">
      {services.map(s => (
        <div key={s.id} className="flex items-center gap-4 p-4 rounded-xl"
          style={{ border: '1px solid rgba(15,23,42,0.09)', background: s.active ? '#fafafa' : '#f8f8f8', opacity: s.active ? 1 : 0.65 }}>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#0f172a]">{s.name}</p>
            {s.description && <p className="text-xs text-[#64748b] truncate">{s.description}</p>}
          </div>
          {s.price != null && (
            <span className="text-sm font-bold text-[#10b981]">${Number(s.price).toLocaleString('es-MX')}</span>
          )}
          <button onClick={() => toggleActive(s)} disabled={actionId === s.id}
            className="text-xs font-medium px-3 py-1.5 rounded-full transition-all"
            style={{
              background: s.active ? 'rgba(16,185,129,0.10)' : 'rgba(148,163,184,0.10)',
              color: s.active ? '#059669' : '#94a3b8',
            }}>
            {s.active ? 'Activo' : 'Inactivo'}
          </button>
          <button onClick={() => remove(s.id)} disabled={actionId === s.id}
            className="p-1.5 rounded-lg hover:bg-red-50 text-[#94a3b8] hover:text-red-500 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}

      {adding ? (
        <div className="rounded-xl p-4 space-y-3" style={{ border: '1px dashed rgba(6,182,212,0.4)', background: 'rgba(6,182,212,0.02)' }}>
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Nombre" value={newSvc.name} onChange={v => setNewSvc(s => ({ ...s, name: v }))} placeholder="Hidrafacial" />
            <InputField label="Precio (MXN)" value={newSvc.price} onChange={v => setNewSvc(s => ({ ...s, price: v }))} placeholder="850" type="number" />
          </div>
          <InputField label="Descripción (opcional)" value={newSvc.description} onChange={v => setNewSvc(s => ({ ...s, description: v }))} placeholder="Tratamiento facial profundo..." />
          <div className="flex gap-2">
            <button onClick={() => setAdding(false)} className="px-4 py-2 rounded-lg text-sm text-[#64748b]" style={{ background: '#f1f5f9' }}>Cancelar</button>
            <button onClick={create} disabled={!newSvc.name}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-60"
              style={{ background: '#06b6d4' }}>Crear servicio</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all"
          style={{ border: '1px dashed rgba(15,23,42,0.15)', color: '#64748b' }}>
          <Plus className="w-4 h-4" /> Agregar servicio
        </button>
      )}
    </div>
  )
}

// ── Tab: Automatización ─────────────────────────────────────────────────────────
function AutomatizacionTab() {
  const [settings, setSettings] = useState<Partial<TenantSettings>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    settingsApi.get().then(s => { setSettings(s); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const timings = settings.followUpTimings ?? { followUp1Hours: 18, followUp2Hours: 48, followUp3Hours: 72 }

  const save = async () => {
    setSaving(true)
    try {
      await settingsApi.update({ followUpTimings: timings })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {}
    setSaving(false)
  }

  if (loading) return <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 bg-[#f1f5f9] rounded-xl animate-pulse" />)}</div>

  const flows = [
    { key: 'followUp1Hours' as const, label: 'Seguimiento 1', desc: 'Primer mensaje de seguimiento si no hay respuesta', icon: '1️⃣' },
    { key: 'followUp2Hours' as const, label: 'Seguimiento 2', desc: 'Segundo mensaje si el lead no respondió', icon: '2️⃣' },
    { key: 'followUp3Hours' as const, label: 'Cierre suave', desc: 'Mensaje final de cierre del flujo', icon: '3️⃣' },
  ]

  return (
    <div className="space-y-5">
      <p className="text-xs text-[#64748b]">Define cuántas horas después del primer contacto se envía cada mensaje de seguimiento.</p>

      <div className="space-y-3">
        {flows.map(f => (
          <div key={f.key} className="flex items-center gap-4 p-4 rounded-xl" style={{ border: '1px solid rgba(15,23,42,0.09)', background: '#fafafa' }}>
            <span className="text-2xl">{f.icon}</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#0f172a]">{f.label}</p>
              <p className="text-xs text-[#64748b]">{f.desc}</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={168}
                value={timings[f.key]}
                onChange={e => setSettings(s => ({
                  ...s,
                  followUpTimings: { ...timings, [f.key]: parseInt(e.target.value) || 1 },
                }))}
                className="w-20 px-3 py-2 rounded-xl text-sm text-center font-bold outline-none"
                style={{ border: '1px solid rgba(15,23,42,0.12)', background: '#fff', color: '#0f172a' }}
              />
              <span className="text-xs text-[#94a3b8]">horas</span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl p-4" style={{ background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.15)' }}>
        <p className="text-xs text-[#0f172a] font-semibold mb-2">Flujo actual:</p>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-[#64748b]">Primer contacto</span>
          <span className="text-[10px] font-semibold px-2 py-1 rounded-full text-[#06b6d4]" style={{ background: 'rgba(6,182,212,0.1)' }}>→ {timings.followUp1Hours}h → Seg. 1</span>
          <span className="text-[10px] font-semibold px-2 py-1 rounded-full text-[#3b82f6]" style={{ background: 'rgba(59,130,246,0.1)' }}>→ {timings.followUp2Hours}h → Seg. 2</span>
          <span className="text-[10px] font-semibold px-2 py-1 rounded-full text-[#8b5cf6]" style={{ background: 'rgba(139,92,246,0.1)' }}>→ {timings.followUp3Hours}h → Cierre</span>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white"
          style={{ background: saved ? '#10b981' : 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}>
          <Save className="w-4 h-4" />
          {saving ? 'Guardando...' : saved ? '¡Guardado!' : 'Guardar configuración'}
        </button>
      </div>
    </div>
  )
}

// ── Main ────────────────────────────────────────────────────────────────────────
export default function ConfiguracionPage() {
  const [tab, setTab] = useState('negocio')

  return (
    <div className="max-w-[900px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0f172a]">Configuración</h1>
        <p className="text-sm text-[#64748b] mt-0.5">Ajusta los datos y comportamiento de tu clínica</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-2xl mb-6" style={{ background: '#f1f5f9' }}>
        {TABS.map(t => {
          const Icon = t.icon
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: tab === t.id ? '#fff' : 'transparent',
                color: tab === t.id ? '#0f172a' : '#64748b',
                boxShadow: tab === t.id ? '0 1px 4px rgba(15,23,42,0.08)' : 'none',
              }}>
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid rgba(15,23,42,0.07)', boxShadow: '0 1px 6px rgba(15,23,42,0.04)' }}>
        {tab === 'negocio'        && <NegocioTab />}
        {tab === 'plantillas'     && <PlantillasTab />}
        {tab === 'servicios'      && <ServiciosTab />}
        {tab === 'automatizacion' && <AutomatizacionTab />}
      </div>
    </div>
  )
}
