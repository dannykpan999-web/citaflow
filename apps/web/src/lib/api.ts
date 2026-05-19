const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('cl_token') : null
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
    ...init,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.message ?? `Error ${res.status}`)
  return data as T
}

export const api = {
  post:   <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch:  <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  put:    <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  get:    <T>(path: string) => request<T>(path),
  delete: <T>(path: string) =>
    request<T>(path, { method: 'DELETE' }),
}

// ── Typed helpers ──────────────────────────────────────────────────────────────

export type LeadStatus = 'new' | 'in_conversation' | 'link_sent' | 'appointment_generated' | 'human_control' | 'not_interested' | 'closed'

export interface Lead {
  id: string
  tenantId: string
  phone: string
  name: string | null
  serviceInterest: string | null
  status: LeadStatus
  botActive: boolean
  assignedToUserId: string | null
  internalNotes: string | null
  createdAt: string
  updatedAt: string
}

export interface Message {
  id: string
  leadId: string
  direction: 'inbound' | 'outbound'
  type: 'text' | 'template' | 'interactive'
  body: string
  status: 'sent' | 'delivered' | 'read' | 'failed'
  isAutomated: boolean
  waMessageId: string | null
  sentAt: string
}

export interface Appointment {
  id: string
  tenantId: string
  leadId: string
  scheduledAt: string
  service: string | null
  reminder24hSent: boolean
  reminder2hSent: boolean
  createdAt: string
  lead?: Lead
}

export interface Service {
  id: string
  tenantId: string
  name: string
  price: number | null
  description: string | null
  promo: string | null
  requiresHuman: boolean
  active: boolean
}

export interface MessageTemplate {
  id: string
  tenantId: string
  type: 'welcome' | 'service_info' | 'agenda_link' | 'follow_up_1' | 'follow_up_2' | 'soft_close' | 'reminder_24h' | 'reminder_2h'
  body: string
  active: boolean
}

export interface TenantSettings {
  id: string
  name: string
  slug: string
  plan: string
  status: string
  city: string | null
  workingHours: string | null
  agendaLink: string | null
  welcomeMessage: string | null
  whatsappPhoneNumberId: string | null
  whatsappAccessToken: string | null
  followUpTimings: { followUp1Hours: number; followUp2Hours: number; followUp3Hours: number } | null
  trialEndsAt: string | null
}

export interface KpiData {
  totalLeads: number
  newToday: number
  newThisMonth: number
  newPrevMonth: number
  conversionRate: number
  prevConversionRate: number
  byStatus: Record<string, number>
  totalAppointments: number
  upcomingAppointments: number
  messagesSent: number
  humanControl: number
}

export interface ChartDay {
  label: string
  leads: number
  appointments: number
}

// ── API methods ────────────────────────────────────────────────────────────────

export const leadsApi = {
  list: (params?: { status?: string; search?: string; page?: number; limit?: number }) => {
    const q = new URLSearchParams()
    if (params?.status) q.set('status', params.status)
    if (params?.search) q.set('search', params.search)
    if (params?.page) q.set('page', String(params.page))
    if (params?.limit) q.set('limit', String(params.limit))
    return api.get<{ data: Lead[]; total: number; page: number; limit: number }>(`/leads?${q}`)
  },
  get: (id: string) => api.get<Lead>(`/leads/${id}`),
  update: (id: string, body: Partial<Lead>) => api.patch<Lead>(`/leads/${id}`, body),
  pauseBot: (id: string) => api.post<{ success: boolean }>(`/leads/${id}/pause-bot`, {}),
  resumeBot: (id: string) => api.post<{ success: boolean }>(`/leads/${id}/resume-bot`, {}),
  messages: (id: string) => api.get<Message[]>(`/leads/${id}/messages`),
  updateNotes: (id: string, notes: string) => api.post<{ success: boolean }>(`/leads/${id}/notes`, { notes }),
  delete: (id: string) => api.delete<void>(`/leads/${id}`),
}

export const appointmentsApi = {
  list: () => api.get<Appointment[]>('/appointments'),
  get: (id: string) => api.get<Appointment>(`/appointments/${id}`),
  create: (body: { leadId: string; scheduledAt: string; service?: string }) =>
    api.post<Appointment>('/appointments', body),
  delete: (id: string) => api.delete<void>(`/appointments/${id}`),
}

export const servicesApi = {
  list: () => api.get<Service[]>('/services'),
  create: (body: Omit<Service, 'id' | 'tenantId'>) => api.post<Service>('/services', body),
  update: (id: string, body: Partial<Service>) => api.patch<Service>(`/services/${id}`, body),
  delete: (id: string) => api.delete<void>(`/services/${id}`),
}

export const templatesApi = {
  list: () => api.get<MessageTemplate[]>('/templates'),
  upsert: (type: string, body: string, active?: boolean) =>
    api.put<MessageTemplate>(`/templates/${type}`, { type, body, active }),
}

export const settingsApi = {
  get: () => api.get<TenantSettings>('/settings'),
  update: (body: Partial<TenantSettings>) => api.patch<TenantSettings>('/settings', body),
}

export const analyticsApi = {
  kpis: () => api.get<KpiData>('/analytics/kpis'),
  chart: () => api.get<ChartDay[]>('/analytics/chart'),
}

export const adminApi = {
  tenants: () => api.get<any[]>('/admin/tenants'),
  tenant: (id: string) => api.get<any>(`/admin/tenants/${id}`),
  updateStatus: (id: string, status: string) =>
    api.patch<any>(`/admin/tenants/${id}/status`, { status }),
  metrics: () => api.get<any>('/admin/metrics'),
}
