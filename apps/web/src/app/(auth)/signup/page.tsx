'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, CheckCircle2, Zap, Calendar, Bell } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

const features = [
  { icon: Zap,          text: 'Responde leads en segundos por WhatsApp' },
  { icon: Calendar,     text: 'Agenda citas automáticamente 24/7' },
  { icon: Bell,         text: 'Recordatorios automáticos a tus pacientes' },
  { icon: CheckCircle2, text: 'Dashboard en tiempo real de tu conversión' },
]

export default function SignupPage() {
  const router = useRouter()
  const { signup } = useAuth()
  const [form, setForm] = useState({ clinicName: '', name: '', email: '', phone: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await signup(form)
      router.push('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al crear la cuenta')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Left: Form ─────────────────────────────────────────────── */}
      <div className="w-full lg:w-[50%] flex flex-col justify-between px-8 sm:px-14 py-10">

        {/* Logo */}
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo-citalead.png" alt="CitaLead" style={{ height: '38px', width: 'auto' }} />
        </div>

        {/* Form body */}
        <form onSubmit={handleSignup} className="max-w-[420px] w-full mx-auto">
          {/* Free trial badge */}
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-5 text-xs font-semibold"
            style={{ background: 'rgba(6,182,212,0.08)', color: '#0891b2', border: '1px solid rgba(6,182,212,0.20)' }}>
            ✨ 14 días gratis · Sin tarjeta de crédito
          </div>

          <h1 className="text-[26px] font-bold text-[#0f172a] mb-1">Crea tu cuenta gratis</h1>
          <p className="text-sm text-[#64748b] mb-7">Empieza a automatizar tu clínica hoy mismo</p>

          {/* Google SSO */}
          <a
            href={`${process.env.NEXT_PUBLIC_API_URL ?? 'http://31.220.53.87:8080/api'}/auth/google`}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border text-sm font-medium text-[#0f172a] mb-5 transition-all hover:bg-[#f8fafc]"
            style={{ borderColor: 'rgba(15,23,42,0.12)' }}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Registrarse con Google
          </a>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px" style={{ background: 'rgba(15,23,42,0.08)' }} />
            <span className="text-xs text-[#94a3b8]">O con tu email</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(15,23,42,0.08)' }} />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm text-red-600 bg-red-50 border border-red-100">
              {error}
            </div>
          )}

          {/* Fields */}
          <div className="space-y-3.5 mb-6">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1.5">Nombre de la clínica</label>
                <input type="text" placeholder="Clínica Lumina" required
                  value={form.clinicName} onChange={set('clinicName')}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all"
                  style={{ border: '1.5px solid rgba(15,23,42,0.12)', background: '#fafafa' }}
                  onFocus={e => e.currentTarget.style.borderColor = '#06b6d4'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(15,23,42,0.12)'} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1.5">Tu nombre completo</label>
                <input type="text" placeholder="Dra. Ana García" required
                  value={form.name} onChange={set('name')}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all"
                  style={{ border: '1.5px solid rgba(15,23,42,0.12)', background: '#fafafa' }}
                  onFocus={e => e.currentTarget.style.borderColor = '#06b6d4'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(15,23,42,0.12)'} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1.5">Correo electrónico</label>
              <input type="email" placeholder="clinica@ejemplo.com" required
                value={form.email} onChange={set('email')}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={{ border: '1.5px solid rgba(15,23,42,0.12)', background: '#fafafa' }}
                onFocus={e => e.currentTarget.style.borderColor = '#06b6d4'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(15,23,42,0.12)'} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1.5">WhatsApp Business</label>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 px-3 rounded-xl text-sm text-[#64748b]"
                  style={{ border: '1.5px solid rgba(15,23,42,0.12)', background: '#fafafa', minWidth: '72px' }}>
                  🇲🇽 +52
                </div>
                <input type="tel" placeholder="55 1234 5678"
                  value={form.phone} onChange={set('phone')}
                  className="flex-1 px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all"
                  style={{ border: '1.5px solid rgba(15,23,42,0.12)', background: '#fafafa' }}
                  onFocus={e => e.currentTarget.style.borderColor = '#06b6d4'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(15,23,42,0.12)'} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1.5">Contraseña</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} placeholder="Mínimo 8 caracteres"
                  value={form.password} onChange={set('password')}
                  className="w-full px-3.5 py-2.5 pr-11 rounded-xl text-sm outline-none transition-all"
                  style={{ border: '1.5px solid rgba(15,23,42,0.12)', background: '#fafafa' }}
                  onFocus={e => e.currentTarget.style.borderColor = '#06b6d4'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(15,23,42,0.12)'} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b]">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all mb-4"
            style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', opacity: loading ? 0.75 : 1 }}
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta gratis →'}
          </button>

          <p className="text-[10px] text-center text-[#94a3b8] mb-4">
            Al registrarte aceptas nuestros{' '}
            <a href="#" className="text-[#06b6d4]">Términos</a> y{' '}
            <a href="#" className="text-[#06b6d4]">Privacidad</a>
          </p>

          <p className="text-center text-xs text-[#64748b]">
            ¿Ya tienes cuenta?{' '}
            <a href="/login" className="font-semibold text-[#06b6d4] hover:text-[#0891b2]">Iniciar sesión</a>
          </p>
        </form>

        <p className="text-[10px] text-[#94a3b8] text-center">
          © {new Date().getFullYear()} CitaLead · Todos los derechos reservados
        </p>
      </div>

      {/* ── Right: Brand panel ─────────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[50%] flex-col justify-between p-14 relative overflow-hidden"
        style={{ background: '#0f172a' }}
      >
        {/* Background image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/auth-signup-bg.jpg" alt="" className="absolute inset-0 w-full h-full object-cover object-center" style={{ opacity: 1 }} />

        {/* Dark overlay — light tint so medspa image shows clearly */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(145deg, rgba(15,23,42,0.50) 0%, rgba(12,26,46,0.44) 50%, rgba(14,31,58,0.50) 100%)' }} />

        {/* Grid */}
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
        {/* Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 70%)' }} />

        {/* Top glow line */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.35), transparent)' }} />

        <div className="relative z-10 mt-6">
          <p className="text-[#67e8f9] text-xs font-semibold uppercase tracking-widest mb-4">Por qué CitaLead</p>
          <h2 className="text-white text-[28px] font-bold leading-tight mb-8">
            Todo lo que tu clínica<br />necesita en un solo lugar
          </h2>

          {/* Feature list */}
          <div className="space-y-4 mb-10">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.20)' }}>
                  <Icon className="w-4 h-4" style={{ color: '#67e8f9' }} />
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(241,245,249,0.75)' }}>{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial card */}
        <div className="relative z-10">
          <div className="rounded-2xl p-5"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex text-yellow-400 gap-0.5 text-sm">★★★★★</div>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.40)', border: '1px solid rgba(255,255,255,0.12)' }}>Ejemplo</span>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(241,245,249,0.70)' }}>
              "Pasamos de responder leads en 4 horas a hacerlo en segundos. Las citas aumentaron significativamente desde el primer mes."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold">CL</div>
              <div>
                <p className="text-white text-xs font-semibold">Directora de Clínica</p>
                <p className="text-[10px]" style={{ color: 'rgba(241,245,249,0.40)' }}>Usuario CitaLead</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <div className="flex -space-x-2">
              {['A','M','S','D','L'].map(i => (
                <div key={i} className="w-6 h-6 rounded-full border border-white/20 bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-[9px] font-bold">{i}</div>
              ))}
            </div>
            <p className="text-xs" style={{ color: 'rgba(241,245,249,0.40)' }}>Clínicas automatizando con CitaLead</p>
          </div>
        </div>
      </div>
    </div>
  )
}
