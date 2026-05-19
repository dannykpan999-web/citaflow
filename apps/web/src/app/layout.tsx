import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { AuthProvider } from '@/context/AuthContext'

export const metadata: Metadata = {
  title: 'CitaLead — Convierte WhatsApp en citas confirmadas',
  description:
    'CitaLead automatiza tu agenda por WhatsApp. Responde en segundos, reduce no-shows y llena tu clínica sin esfuerzo manual.',
  keywords: 'WhatsApp automatización citas clínica estética agendamiento',
  openGraph: {
    title: 'CitaLead — Automatización de citas por WhatsApp',
    description: 'Llena tu agenda. Reduce los no-shows. Todo por WhatsApp, todo en automático.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
