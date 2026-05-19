'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, MessageCircleCheck } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(email, password)
      router.push('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Left: Form ─────────────────────────────────────────────── */}
      <div className="w-full lg:w-[45%] flex flex-col justify-between px-8 sm:px-14 py-10">

        {/* Logo */}
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo-citalead.png" alt="CitaLead" style={{ height: '38px', width: 'auto' }} />
        </div>

        {/* Form body */}
        <form onSubmit={handleLogin} className="max-w-[400px] w-full mx-auto">
          <h1 className="text-[28px] font-bold text-[#0f172a] mb-1">Bienvenido de vuelta</h1>
          <p className="text-sm text-[#64748b] mb-8">Ingresa tus datos para acceder a tu cuenta</p>

          {/* Google SSO */}
          <a
            href={`${process.env.NEXT_PUBLIC_API_URL ?? 'http://31.220.53.87:8080/api'}/auth/google`}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border text-sm font-medium text-[#0f172a] mb-6 transition-all hover:bg-[#f8fafc]"
            style={{ borderColor: 'rgba(15,23,42,0.12)' }}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continuar con Google
          </a>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: 'rgba(15,23,42,0.08)' }} />
            <span className="text-xs text-[#94a3b8]">O continúa con email</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(15,23,42,0.08)' }} />
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm text-red-600 bg-red-50 border border-red-100">
              {error}
            </div>
          )}

          {/* Fields */}
          <div className="space-y-4 mb-5">
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1.5">Correo electrónico</label>
              <input
                type="email"
                placeholder="clinica@ejemplo.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl text-sm text-[#0f172a] outline-none transition-all"
                style={{ border: '1.5px solid rgba(15,23,42,0.12)', background: '#fafafa' }}
                onFocus={e => e.currentTarget.style.borderColor = '#06b6d4'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(15,23,42,0.12)'}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1.5">Contraseña</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-11 rounded-xl text-sm text-[#0f172a] outline-none transition-all"
                  style={{ border: '1.5px solid rgba(15,23,42,0.12)', background: '#fafafa' }}
                  onFocus={e => e.currentTarget.style.borderColor = '#06b6d4'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(15,23,42,0.12)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b]"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between mb-7">
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => setRemember(!remember)}
                className="w-4 h-4 rounded flex items-center justify-center transition-all cursor-pointer"
                style={{
                  border: remember ? 'none' : '1.5px solid rgba(15,23,42,0.20)',
                  background: remember ? '#06b6d4' : 'transparent',
                }}
              >
                {remember && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8"><path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <span className="text-xs text-[#64748b]">Recordarme</span>
            </label>
            <a href="#" className="text-xs font-semibold text-[#06b6d4] hover:text-[#0891b2]">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all mb-5"
            style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', opacity: loading ? 0.75 : 1 }}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>

          <p className="text-center text-xs text-[#64748b]">
            ¿No tienes cuenta?{' '}
            <a href="/signup" className="font-semibold text-[#06b6d4] hover:text-[#0891b2]">
              Crear cuenta gratis
            </a>
          </p>
        </form>

        {/* Footer */}
        <p className="text-[10px] text-[#94a3b8] text-center">
          © {new Date().getFullYear()} CitaLead · Privacidad · Términos
        </p>
      </div>

      {/* ── Right: Brand panel ─────────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[55%] flex-col justify-between p-14 relative overflow-hidden"
        style={{ background: '#0891b2' }}
      >
        {/* Background image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/auth-login-bg.jpg" alt="" className="absolute inset-0 w-full h-full object-cover object-center" style={{ opacity: 1 }} />

        {/* Gradient overlay — light tint so clinic image shows clearly */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(8,145,178,0.45) 0%, rgba(6,182,212,0.38) 35%, rgba(59,130,246,0.45) 100%)' }} />

        {/* Subtle grid */}
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />

        {/* Glow orbs */}
        <div className="absolute top-[-80px] right-[-80px] w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-60px] left-[-60px] w-64 h-64 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.30) 0%, transparent 70%)' }} />

        {/* Headline */}
        <div className="relative z-10 mt-8">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-white/90 text-xs font-medium">14 días gratis · Sin tarjeta</span>
          </div>
          <h2 className="text-white text-[32px] font-bold leading-tight mb-4">
            Convierte leads en citas,<br />automáticamente.
          </h2>
          <p className="text-white/70 text-sm leading-relaxed max-w-sm">
            Tu asistente responde al instante por WhatsApp, califica leads y agenda citas — incluso mientras duermes.
          </p>
        </div>

        {/* Floating stat cards */}
        <div className="relative z-10 flex flex-col gap-3">
          {/* Card 1 */}
          <div
            className="flex items-center gap-4 rounded-2xl px-5 py-4 w-fit"
            style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(12px)' }}
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <MessageCircleCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-white text-xl font-extrabold">8 seg</p>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.55)' }}>Demo</span>
              </div>
              <p className="text-white/60 text-xs">Tiempo de respuesta promedio</p>
            </div>
            <div className="ml-6 text-right">
              <p className="text-emerald-300 text-sm font-bold">▲ 97%</p>
              <p className="text-white/40 text-[10px]">más rápido que manual</p>
            </div>
          </div>

          {/* Card 2 */}
          <div
            className="flex items-center gap-4 rounded-2xl px-5 py-4 w-fit"
            style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(12px)' }}
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-white text-xl font-extrabold">+34%</p>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.55)' }}>Demo</span>
              </div>
              <p className="text-white/60 text-xs">Más citas agendadas</p>
            </div>
            <div className="ml-6 text-right">
              <p className="text-purple-300 text-sm font-bold">vs. manual</p>
              <p className="text-white/40 text-[10px]">promedio clientes</p>
            </div>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-3 mt-2">
            <div className="flex -space-x-2">
              {['CL','MR','SP','AD'].map((i) => (
                <div key={i} className="w-7 h-7 rounded-full border-2 border-white/30 bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-[9px] font-bold">{i}</div>
              ))}
            </div>
            <p className="text-white/60 text-xs">Clínicas automatizando con CitaLead</p>
          </div>
        </div>
      </div>
    </div>
  )
}
