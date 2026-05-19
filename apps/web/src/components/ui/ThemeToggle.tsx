'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      className="relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 flex-shrink-0"
      style={{
        background: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
        border: theme === 'dark' ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.1)',
      }}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-400" strokeWidth={1.8} />
      ) : (
        <Moon className="w-4 h-4 text-slate-600" strokeWidth={1.8} />
      )}
    </button>
  )
}
