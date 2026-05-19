'use client'

import { useEffect, useState, useRef, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, Bot, User, Send, StickyNote, CheckCheck, Check, Clock, AlertCircle, RefreshCw } from 'lucide-react'
import { leadsApi, type Lead, type Message, type LeadStatus } from '@/lib/api'

const STATUS_CONFIG: Record<LeadStatus, { label: string; color: string; bg: string }> = {
  new:                   { label: 'Nuevo',           color: '#06b6d4', bg: 'rgba(6,182,212,0.10)'   },
  in_conversation:       { label: 'En conversación', color: '#3b82f6', bg: 'rgba(59,130,246,0.10)'  },
  link_sent:             { label: 'Link enviado',    color: '#8b5cf6', bg: 'rgba(139,92,246,0.10)'  },
  appointment_generated: { label: 'Cita agendada',  color: '#10b981', bg: 'rgba(16,185,129,0.10)'  },
  human_control:         { label: 'Control humano', color: '#f59e0b', bg: 'rgba(245,158,11,0.10)'   },
  not_interested:        { label: 'No interesado',  color: '#94a3b8', bg: 'rgba(148,163,184,0.10)' },
  closed:                { label: 'Cerrado',         color: '#64748b', bg: 'rgba(100,116,139,0.10)' },
}

function MessageBubble({ msg }: { msg: Message }) {
  const isOut = msg.direction === 'outbound'
  const time = new Date(msg.sentAt).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })

  const StatusIcon = () => {
    if (!isOut) return null
    if (msg.status === 'read') return <CheckCheck className="w-3 h-3 text-[#06b6d4]" />
    if (msg.status === 'delivered') return <CheckCheck className="w-3 h-3 text-[#94a3b8]" />
    if (msg.status === 'sent') return <Check className="w-3 h-3 text-[#94a3b8]" />
    if (msg.status === 'failed') return <AlertCircle className="w-3 h-3 text-red-400" />
    return <Clock className="w-3 h-3 text-[#94a3b8]" />
  }

  return (
    <div className={`flex ${isOut ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 ${isOut ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}
        style={{
          background: isOut ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' : '#f1f5f9',
          color: isOut ? '#fff' : '#0f172a',
        }}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.body}</p>
        <div className={`flex items-center gap-1 mt-1 ${isOut ? 'justify-end' : 'justify-start'}`}>
          <span className="text-[10px]" style={{ color: isOut ? 'rgba(255,255,255,0.7)' : '#94a3b8' }}>{time}</span>
          {msg.isAutomated && <Bot className="w-2.5 h-2.5" style={{ color: isOut ? 'rgba(255,255,255,0.7)' : '#94a3b8' }} />}
          <StatusIcon />
        </div>
      </div>
    </div>
  )
}

function ConversationPanel({ leadId }: { leadId: string }) {
  const [lead, setLead] = useState<Lead | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState('')
  const [editingNotes, setEditingNotes] = useState(false)
  const [savingNotes, setSavingNotes] = useState(false)
  const [botLoading, setBotLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [l, m] = await Promise.all([leadsApi.get(leadId), leadsApi.messages(leadId)])
      setLead(l)
      setMessages(m)
      setNotes(l.internalNotes ?? '')
    } catch {}
    setLoading(false)
  }, [leadId])

  useEffect(() => { load() }, [load])
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const toggleBot = async () => {
    if (!lead) return
    setBotLoading(true)
    try {
      if (lead.botActive) await leadsApi.pauseBot(lead.id)
      else await leadsApi.resumeBot(lead.id)
      await load()
    } catch {}
    setBotLoading(false)
  }

  const saveNotes = async () => {
    if (!lead) return
    setSavingNotes(true)
    try {
      await leadsApi.updateNotes(lead.id, notes)
      setEditingNotes(false)
    } catch {}
    setSavingNotes(false)
  }

  if (loading) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="animate-spin w-6 h-6 border-2 border-[#06b6d4] border-t-transparent rounded-full" />
    </div>
  )

  if (!lead) return (
    <div className="flex-1 flex items-center justify-center text-[#94a3b8]">Lead no encontrado</div>
  )

  const cfg = STATUS_CONFIG[lead.status]

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Lead header */}
      <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: 'rgba(15,23,42,0.07)', background: '#fff' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}>
            {(lead.name ?? lead.phone).slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#0f172a]">{lead.name ?? 'Sin nombre'}</p>
            <p className="text-xs text-[#94a3b8] font-mono">{lead.phone}</p>
          </div>
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full ml-2"
            style={{ color: cfg.color, background: cfg.bg }}>
            {cfg.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="p-2 rounded-xl hover:bg-[#f1f5f9] text-[#64748b] transition-colors" title="Actualizar">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={toggleBot}
            disabled={botLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: lead.botActive ? 'rgba(245,158,11,0.10)' : 'rgba(16,185,129,0.10)',
              color: lead.botActive ? '#d97706' : '#059669',
            }}>
            {lead.botActive ? <><User className="w-4 h-4" /> Tomar control</> : <><Bot className="w-4 h-4" /> Reactivar bot</>}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4" style={{ background: '#fafafa' }}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Send className="w-10 h-10 text-[#e2e8f0] mb-2" />
            <p className="text-sm text-[#94a3b8]">Sin mensajes aún</p>
          </div>
        ) : (
          messages.map(m => <MessageBubble key={m.id} msg={m} />)
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Internal notes */}
      <div className="px-5 py-3 border-t" style={{ borderColor: 'rgba(15,23,42,0.07)', background: '#fff' }}>
        <div className="flex items-center gap-2 mb-2">
          <StickyNote className="w-3.5 h-3.5 text-[#f59e0b]" />
          <span className="text-xs font-semibold text-[#475569]">Notas internas</span>
          {!editingNotes && (
            <button onClick={() => setEditingNotes(true)}
              className="text-[10px] text-[#06b6d4] font-semibold ml-1">Editar</button>
          )}
        </div>
        {editingNotes ? (
          <div className="flex gap-2">
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              placeholder="Notas internas sobre este lead..."
              className="flex-1 text-xs rounded-xl px-3 py-2 resize-none outline-none"
              style={{ border: '1px solid rgba(15,23,42,0.12)', background: '#f8fafc', color: '#0f172a' }}
            />
            <div className="flex flex-col gap-1">
              <button onClick={saveNotes} disabled={savingNotes}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                style={{ background: '#06b6d4' }}>
                {savingNotes ? '...' : 'Guardar'}
              </button>
              <button onClick={() => setEditingNotes(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#64748b]"
                style={{ background: '#f1f5f9' }}>
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-[#64748b] italic">{notes || 'Sin notas'}</p>
        )}
      </div>
    </div>
  )
}

function ConversacionesContent() {
  const searchParams = useSearchParams()
  const initialLead = searchParams.get('lead')
  const [leads, setLeads] = useState<Lead[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(initialLead)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    leadsApi.list({ limit: 100 })
      .then(r => { setLeads(r.data); if (!selectedId && r.data[0]) setSelectedId(r.data[0].id) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = leads.filter(l =>
    !search || (l.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
    l.phone.includes(search)
  )

  return (
    <div className="flex h-[calc(100vh-80px)] rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(15,23,42,0.07)', boxShadow: '0 1px 6px rgba(15,23,42,0.04)' }}>

      {/* Lead list sidebar */}
      <div className="w-72 flex-shrink-0 flex flex-col border-r" style={{ borderColor: 'rgba(15,23,42,0.07)', background: '#fff' }}>
        <div className="p-4 border-b" style={{ borderColor: 'rgba(15,23,42,0.07)' }}>
          <h2 className="text-sm font-bold text-[#0f172a] mb-3">Conversaciones</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94a3b8]" />
            <input
              type="text" placeholder="Buscar..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs rounded-xl outline-none"
              style={{ border: '1px solid rgba(15,23,42,0.10)', background: '#f8fafc', color: '#0f172a' }}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-4 border-b animate-pulse" style={{ borderColor: 'rgba(15,23,42,0.05)' }}>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#f1f5f9]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-[#f1f5f9] rounded w-3/4" />
                    <div className="h-2 bg-[#f1f5f9] rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))
          ) : filtered.map(lead => {
            const cfg = STATUS_CONFIG[lead.status]
            const isSelected = selectedId === lead.id
            return (
              <button
                key={lead.id}
                onClick={() => setSelectedId(lead.id)}
                className="w-full text-left p-4 border-b transition-all"
                style={{
                  borderColor: 'rgba(15,23,42,0.05)',
                  background: isSelected ? 'rgba(6,182,212,0.06)' : 'transparent',
                  borderLeft: isSelected ? '3px solid #06b6d4' : '3px solid transparent',
                }}>
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}>
                    {(lead.name ?? lead.phone).slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-xs font-semibold text-[#0f172a] truncate">{lead.name ?? 'Sin nombre'}</p>
                      {!lead.botActive && <User className="w-3 h-3 text-[#f59e0b] flex-shrink-0" />}
                    </div>
                    <p className="text-[10px] text-[#94a3b8] font-mono mb-1">{lead.phone}</p>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                      style={{ color: cfg.color, background: cfg.bg }}>
                      {cfg.label}
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Conversation panel */}
      {selectedId ? (
        <ConversationPanel key={selectedId} leadId={selectedId} />
      ) : (
        <div className="flex-1 flex items-center justify-center flex-col gap-2" style={{ background: '#fafafa' }}>
          <Send className="w-12 h-12 text-[#e2e8f0]" />
          <p className="text-sm text-[#94a3b8]">Selecciona una conversación</p>
        </div>
      )}
    </div>
  )
}

export default function ConversacionesPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin w-6 h-6 border-2 border-[#06b6d4] border-t-transparent rounded-full" /></div>}>
      <ConversacionesContent />
    </Suspense>
  )
}
