'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const links = [
  { label: 'El Problema',   href: '#problema' },
  { label: 'Cómo funciona', href: '#funciona' },
  { label: 'Producto',      href: '#producto' },
  { label: 'Planes',        href: '#planes' },
]

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(15,23,42,0.07)',
        boxShadow: scrolled
          ? '0 4px 32px rgba(15,23,42,0.10)'
          : '0 1px 8px rgba(15,23,42,0.05)',
      }}
    >
      <div className="max-w-[1180px] mx-auto px-5 h-[72px] flex items-center justify-between gap-4">

        {/* Logo */}
        <a href="#" className="flex-shrink-0 transition-opacity hover:opacity-85">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo-citalead.png"
            alt="CitaLead"
            style={{ height: '44px', width: 'auto' }}
          />
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {links.map((l) => (
            <a key={l.href} href={l.href}
              className="px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200"
              style={{ color: 'rgba(15,23,42,0.60)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#0f172a'; e.currentTarget.style.background = '#f1f5f9' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(15,23,42,0.60)'; e.currentTarget.style.background = 'transparent' }}>
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTA + hamburger */}
        <div className="flex items-center gap-3">
          <a href="/login"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
            style={{ color: 'rgba(15,23,42,0.60)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#0f172a' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(15,23,42,0.60)' }}>
            Iniciar sesión
          </a>
          <a href="/signup"
            className="btn-primary hidden md:inline-flex"
            style={{ padding: '10px 22px', fontSize: '0.8rem' }}>
            Prueba gratis →
          </a>

          <button
            className="md:hidden p-2 rounded-xl transition-colors"
            style={{ color: 'rgba(15,23,42,0.70)', background: '#f1f5f9' }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menú"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden px-4 pb-5 flex flex-col gap-1"
          style={{ background: 'rgba(255,255,255,0.98)', borderTop: '1px solid rgba(15,23,42,0.07)' }}>
          {links.map((l) => (
            <a key={l.href} href={l.href}
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 text-sm font-medium rounded-xl transition-all"
              style={{ color: 'rgba(15,23,42,0.65)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#0f172a'; e.currentTarget.style.background = '#f1f5f9' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(15,23,42,0.65)'; e.currentTarget.style.background = 'transparent' }}>
              {l.label}
            </a>
          ))}
          <a href="/login"
            onClick={() => setMobileOpen(false)}
            className="px-4 py-3 text-sm font-medium rounded-xl text-center"
            style={{ color: '#06b6d4' }}>
            Iniciar sesión
          </a>
          <a href="/signup"
            onClick={() => setMobileOpen(false)}
            className="mt-1 btn-primary w-full justify-center">
            Prueba gratis →
          </a>
        </div>
      )}
    </header>
  )
}
