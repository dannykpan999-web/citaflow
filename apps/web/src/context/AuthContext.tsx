'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { api } from '@/lib/api'

interface AuthUser {
  id: string
  name: string
  email: string
  role: string
  tenantId: string
  createdAt?: string
}

interface AuthTenant {
  id: string
  name: string
  slug: string
  plan: string
  status: string
  trialEndsAt?: string
}

interface AuthState {
  user: AuthUser | null
  tenant: AuthTenant | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>
  signup: (data: {
    clinicName: string
    name: string
    email: string
    password: string
    phone?: string
  }) => Promise<void>
  logout: () => void
  updateProfile: (user: Partial<AuthUser>, tenant?: Partial<AuthTenant>) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    tenant: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  })

  // Rehydrate from localStorage on mount
  useEffect(() => {
    try {
      const token = localStorage.getItem('cl_token')
      const user = localStorage.getItem('cl_user')
      const tenant = localStorage.getItem('cl_tenant')
      if (token && user) {
        setState({
          token,
          user: JSON.parse(user),
          tenant: tenant ? JSON.parse(tenant) : null,
          isAuthenticated: true,
          isLoading: false,
        })
      } else {
        setState(s => ({ ...s, isLoading: false }))
      }
    } catch {
      setState(s => ({ ...s, isLoading: false }))
    }
  }, [])

  const persist = useCallback((token: string, user: AuthUser, tenant?: AuthTenant) => {
    localStorage.setItem('cl_token', token)
    localStorage.setItem('cl_user', JSON.stringify(user))
    if (tenant) localStorage.setItem('cl_tenant', JSON.stringify(tenant))
    setState({ token, user, tenant: tenant ?? null, isAuthenticated: true, isLoading: false })
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post<{ accessToken: string; user: AuthUser }>('/auth/login', { email, password })
    persist(res.accessToken, res.user)
  }, [persist])

  const signup = useCallback(async (data: Parameters<AuthContextValue['signup']>[0]) => {
    const res = await api.post<{ accessToken: string; user: AuthUser; tenant: AuthTenant }>('/auth/signup', data)
    persist(res.accessToken, res.user, res.tenant)
  }, [persist])

  const updateProfile = useCallback((updatedUser: Partial<AuthUser>, updatedTenant?: Partial<AuthTenant>) => {
    setState(s => {
      const newUser = s.user ? { ...s.user, ...updatedUser } : s.user
      const newTenant = s.tenant ? { ...s.tenant, ...updatedTenant } : s.tenant
      if (newUser) localStorage.setItem('cl_user', JSON.stringify(newUser))
      if (newTenant) localStorage.setItem('cl_tenant', JSON.stringify(newTenant))
      return { ...s, user: newUser, tenant: newTenant }
    })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('cl_token')
    localStorage.removeItem('cl_user')
    localStorage.removeItem('cl_tenant')
    setState({ user: null, tenant: null, token: null, isAuthenticated: false, isLoading: false })
    window.location.href = '/login'
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
