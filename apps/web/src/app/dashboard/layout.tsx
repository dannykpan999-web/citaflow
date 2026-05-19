'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  LayoutDashboard, MessageCircle, Calendar, Users,
  BarChart2, Settings, LogOut, ChevronLeft, ChevronRight,
  HelpCircle, Bell, UserCircle, UserCog
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',       href: '/dashboard',               group: 'general' },
  { icon: MessageCircle,   label: 'Conversaciones',  href: '/dashboard/conversaciones', group: 'general' },
  { icon: Calendar,        label: 'Citas',           href: '/dashboard/citas',          group: 'general' },
  { icon: Users,           label: 'Leads',           href: '/dashboard/leads',          group: 'general' },
  { icon: BarChart2,       label: 'Analíticas',      href: '/dashboard/analiticas',     group: 'tools' },
  { icon: Settings,        label: 'Configuración',   href: '/dashboard/configuracion',  group: 'tools' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, tenant, isAuthenticated, isLoading, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f0f4f8' }}>
        <div className="w-8 h-8 rounded-full border-2 border-[#06b6d4] border-t-transparent animate-spin" />
      </div>
    )
  }

  const initials = user?.name
    ? user.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
    : 'CL'

  return (
    <div className="min-h-screen flex" style={{ background: '#f0f4f8' }}>

      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <aside
        className="flex flex-col flex-shrink-0 transition-all duration-300 relative"
        style={{
          width: collapsed ? '68px' : '228px',
          background: '#ffffff',
          borderRight: '1px solid rgba(15,23,42,0.07)',
          boxShadow: '2px 0 12px rgba(15,23,42,0.04)',
        }}
      >
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-[72px] w-6 h-6 rounded-full flex items-center justify-center z-10 transition-all hover:scale-110"
          style={{ background: '#ffffff', border: '1px solid rgba(15,23,42,0.10)', boxShadow: '0 2px 8px rgba(15,23,42,0.08)' }}
        >
          {collapsed ? <ChevronRight className="w-3 h-3 text-[#64748b]" /> : <ChevronLeft className="w-3 h-3 text-[#64748b]" />}
        </button>

        {/* Logo */}
        <div className="h-[64px] flex items-center px-4 border-b" style={{ borderColor: 'rgba(15,23,42,0.06)' }}>
          {collapsed
            ? <img src="/images/logo-citalead.png" alt="CitaLead" style={{ height: '28px', width: '28px', objectFit: 'cover', objectPosition: 'left' }} />
            : <img src="/images/logo-citalead.png" alt="CitaLead" style={{ height: '32px', width: 'auto' }} />
          }
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 overflow-y-auto">
          {!collapsed && <p className="text-[9px] font-bold uppercase tracking-widest px-2 mb-2" style={{ color: 'rgba(15,23,42,0.30)' }}>General</p>}
          {navItems.filter(n => n.group === 'general').map((item) => (
            <NavItem key={item.href} item={item} collapsed={collapsed} active={pathname === item.href} />
          ))}

          <div className="my-3 mx-2 h-px" style={{ background: 'rgba(15,23,42,0.06)' }} />

          {!collapsed && <p className="text-[9px] font-bold uppercase tracking-widest px-2 mb-2" style={{ color: 'rgba(15,23,42,0.30)' }}>Herramientas</p>}
          {navItems.filter(n => n.group === 'tools').map((item) => (
            <NavItem key={item.href} item={item} collapsed={collapsed} active={pathname === item.href} />
          ))}
        </nav>

        {/* Help card */}
        {!collapsed && (
          <div className="mx-3 mb-3 rounded-xl p-3" style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.14)' }}>
            <div className="flex items-center gap-2 mb-1">
              <HelpCircle className="w-3.5 h-3.5" style={{ color: '#06b6d4' }} />
              <p className="text-xs font-semibold text-[#0f172a]">¿Necesitas ayuda?</p>
            </div>
            <p className="text-[10px] text-[#64748b] mb-2">Habla con soporte en minutos</p>
            <button className="w-full text-[10px] font-semibold py-1.5 rounded-lg text-white" style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}>
              Contactar soporte
            </button>
          </div>
        )}

        {/* User */}
        <div
          onClick={logout}
          className="flex items-center gap-3 px-3 py-3 border-t cursor-pointer hover:bg-[#f8fafc] transition-colors"
          style={{ borderColor: 'rgba(15,23,42,0.06)' }}
          title="Cerrar sesión"
        >
          <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold">{initials}</div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#0f172a] truncate">{tenant?.name ?? user?.name}</p>
                <p className="text-[10px] text-[#94a3b8] truncate">{user?.email}</p>
              </div>
              <LogOut className="w-3.5 h-3.5 text-[#94a3b8] flex-shrink-0" />
            </>
          )}
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <header className="h-[64px] flex items-center justify-between px-6 flex-shrink-0"
          style={{ background: '#ffffff', borderBottom: '1px solid rgba(15,23,42,0.07)', boxShadow: '0 1px 8px rgba(15,23,42,0.04)' }}>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm text-[#94a3b8]"
              style={{ background: '#f8fafc', border: '1px solid rgba(15,23,42,0.07)', minWidth: '220px' }}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35"/></svg>
              Buscar...
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-[#f8fafc]"
                style={{ border: '1px solid rgba(15,23,42,0.08)' }}>
                <Bell className="w-4 h-4 text-[#64748b]" />
              </button>
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white text-[9px] font-bold flex items-center justify-center" style={{ background: '#06b6d4' }}>3</span>
            </div>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(v => !v)}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold hover:opacity-90 transition-opacity"
              >
                {initials}
              </button>

              {showDropdown && (
                <div className="absolute right-0 top-10 w-52 rounded-2xl shadow-xl z-50 overflow-hidden"
                  style={{ background: '#ffffff', border: '1px solid rgba(15,23,42,0.08)' }}>
                  {/* Header */}
                  <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(15,23,42,0.06)' }}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{initials}</div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#0f172a] truncate">{user?.name}</p>
                        <p className="text-[10px] text-[#94a3b8] truncate">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                  {/* Items */}
                  <div className="py-1.5">
                    <a href="/dashboard/perfil" onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#374151] hover:bg-[#f8fafc] transition-colors">
                      <UserCircle className="w-3.5 h-3.5 text-[#64748b]" />
                      Mi perfil
                    </a>
                    <a href="/dashboard/perfil/editar" onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#374151] hover:bg-[#f8fafc] transition-colors">
                      <UserCog className="w-3.5 h-3.5 text-[#64748b]" />
                      Configuración de cuenta
                    </a>
                  </div>
                  <div className="border-t py-1.5" style={{ borderColor: 'rgba(15,23,42,0.06)' }}>
                    <button onClick={logout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors">
                      <LogOut className="w-3.5 h-3.5" />
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

function NavItem({ item, collapsed, active }: { item: typeof navItems[0]; collapsed: boolean; active: boolean }) {
  const Icon = item.icon
  return (
    <a
      href={item.href}
      className="flex items-center gap-3 px-2 py-2.5 rounded-xl mb-0.5 transition-all group"
      style={{
        background: active ? 'rgba(6,182,212,0.08)' : 'transparent',
        color: active ? '#0891b2' : 'rgba(15,23,42,0.55)',
      }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#0f172a' } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(15,23,42,0.55)' } }}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      {!collapsed && <span className="text-sm font-medium truncate">{item.label}</span>}
      {active && !collapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#06b6d4]" />}
    </a>
  )
}
