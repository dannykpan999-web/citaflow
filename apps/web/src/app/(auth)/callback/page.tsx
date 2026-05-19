'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const data = params.get('data')
    const errorMsg = params.get('error')

    if (errorMsg || !data) {
      router.replace(`/login?error=${encodeURIComponent(errorMsg ?? 'google_failed')}`)
      return
    }

    try {
      const { accessToken, user, tenant } = JSON.parse(atob(data))
      localStorage.setItem('cl_token', accessToken)
      localStorage.setItem('cl_user', JSON.stringify(user))
      if (tenant) localStorage.setItem('cl_tenant', JSON.stringify(tenant))
      router.replace('/dashboard')
    } catch {
      router.replace('/login?error=invalid_callback')
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#f0f4f8' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-[#06b6d4] border-t-transparent animate-spin" />
        <p className="text-sm text-[#64748b]">Iniciando sesión con Google...</p>
      </div>
    </div>
  )
}
