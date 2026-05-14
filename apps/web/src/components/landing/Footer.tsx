import { Phone, Shield, Lock, ExternalLink } from 'lucide-react'

const productLinks = [
  { label: 'Funcionalidades', href: '#funcionalidades' },
  { label: 'Cómo funciona', href: '#como-funciona' },
  { label: 'Precios', href: '#precios' },
  { label: 'Integraciones', href: '#' },
]

const companyLinks = [
  { label: 'Testimonios', href: '#testimonios' },
  { label: 'Blog', href: '#' },
  { label: 'Privacidad', href: '#' },
  { label: 'Términos', href: '#' },
]

const trustBadges = [
  { label: 'WhatsApp oficial', color: '#00b37e', Icon: Phone },
  { label: 'ISO 27001', color: '#60a5fa', Icon: Shield },
  { label: 'GDPR comply', color: '#a855f7', Icon: Lock },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #00b37e, #34d399)' }}
              >
                <Phone className="w-4 h-4 text-white" strokeWidth={2} />
              </div>
              <span
                className="text-white font-bold text-lg"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                CitaFlow
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs mb-5">
              Automatiza tu WhatsApp Business y llena tu agenda sin esfuerzo. Para clínicas estéticas
              en México.
            </p>
            {/* Trust badges */}
            <div className="flex items-center gap-2 flex-wrap">
              {trustBadges.map((badge) => (
                <span
                  key={badge.label}
                  className="inline-flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1 rounded-md border"
                  style={{
                    color: badge.color,
                    borderColor: `${badge.color}30`,
                    background: `${badge.color}10`,
                  }}
                >
                  <badge.Icon className="w-2.5 h-2.5" strokeWidth={2} />
                  {badge.label}
                </span>
              ))}
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4
              className="text-white font-semibold text-sm mb-4"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Producto
            </h4>
            <ul className="space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/40 text-sm hover:text-white/70 transition-colors flex items-center gap-1.5 group"
                  >
                    {link.label}
                    {link.href === '#' && (
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4
              className="text-white font-semibold text-sm mb-4"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Empresa
            </h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/40 text-sm hover:text-white/70 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-xs">
            © {new Date().getFullYear()} CitaFlow. Todos los derechos reservados.
          </p>
          <p className="text-white/20 text-xs flex items-center gap-1">
            Hecho con
            <span className="text-rose-400">♥</span>
            para clínicas estéticas en México
          </p>
        </div>
      </div>
    </footer>
  )
}
