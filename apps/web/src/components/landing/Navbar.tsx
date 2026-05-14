'use client'

import { useState, useEffect } from 'react'
import { Phone, Menu, X, ArrowRight } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { label: 'Clínicas', href: '#problema' },
    { label: 'Cómo funciona', href: '#como-funciona' },
    { label: 'Características', href: '#funcionalidades' },
    { label: 'Precios', href: '#precios' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5 shadow-2xl'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-18 flex items-center justify-between gap-6">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group flex-shrink-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #00b37e, #34d399)' }}
          >
            <Phone className="w-4 h-4 text-white" strokeWidth={2} />
          </div>
          <div>
            <div
              className="text-white font-bold text-lg leading-none tracking-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              CitaFlow
            </div>
            <div className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">
              WhatsApp → Citas
            </div>
          </div>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-4 py-2 text-sm text-white/60 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <a
            href="#precios"
            className="hidden md:inline-flex text-sm text-white/60 hover:text-white transition-colors"
          >
            Iniciar sesión
          </a>
          <a
            href="#contacto"
            className="btn-shine inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full text-sm font-semibold text-[#0a0a0f] transition-all duration-200 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #00b37e, #34d399)',
              boxShadow: '0 0 20px rgba(0,179,126,0.3)',
            }}
          >
            <span>Prueba gratis</span>
            <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" strokeWidth={2.5} />
          </a>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors text-white/70"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menú"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#0a0a0f]/95 backdrop-blur-xl px-4 py-4 flex flex-col gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 text-sm text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition-all"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contacto"
            onClick={() => setMobileOpen(false)}
            className="mt-2 w-full text-center px-5 py-3 rounded-full text-sm font-semibold text-[#0a0a0f] flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #00b37e, #34d399)' }}
          >
            Prueba gratis 14 días
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
          </a>
        </div>
      )}
    </header>
  )
}
