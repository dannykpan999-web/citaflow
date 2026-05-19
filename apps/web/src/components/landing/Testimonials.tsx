import Image from 'next/image'
import { Star, TrendingUp } from 'lucide-react'

const testimonials = [
  {
    name: 'Mariana Torres',
    role: 'Directora, Clínica Lumina',
    quote:
      'Antes perdíamos al menos 5 leads diarios por respuesta tardía. Con CitaLead nuestra tasa de conversión subió 38% en el primer mes. CitaLead responde mejor que nosotros a las 11pm.',
    rating: 5,
    avatar: '/images/test-avatar-mariana.jpg',
    metric: '+38%',
    metricLabel: 'conversión',
    color: '#00b37e',
    clinicImg: '/images/test-clinic-lumina.jpg',
  },
  {
    name: 'Sofía Reyes',
    role: 'Fundadora, Centro Derma+',
    quote:
      'El seguimiento automático es un cambio de juego. Recuperamos leads que creíamos perdidos. Una clienta agendó al tercer follow-up, 3 días después de su primer mensaje.',
    rating: 5,
    avatar: '/images/test-avatar-sofia.jpg',
    metric: '72h',
    metricLabel: 'lead recuperado',
    color: '#a855f7',
    clinicImg: '/images/test-clinic-derma.jpg',
  },
  {
    name: 'Andrea Méndez',
    role: 'Co-fundadora, Spa Éclat',
    quote:
      'Los recordatorios automáticos redujeron nuestros no-shows de 25% a 6%. Eso se traduce en miles de pesos recuperados al mes. La configuración tomó menos de 10 minutos.',
    rating: 5,
    avatar: '/images/test-avatar-andrea.jpg',
    metric: '-75%',
    metricLabel: 'no-shows',
    color: '#60a5fa',
    clinicImg: '/images/test-clinic-eclat.jpg',
  },
]

const bottomStats = [
  { val: '4.9/5', label: 'Calificación promedio' },
  { val: '120+', label: 'Clínicas activas' },
  { val: '94K+', label: 'Citas generadas' },
]

export default function Testimonials() {
  return (
    <section id="testimonios" className="relative py-24 md:py-32 overflow-hidden bg-[#0a0a0f]">
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-48 rounded-full blur-3xl pointer-events-none"
        style={{ background: '#00b37e', opacity: 0.05 }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Label */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 text-xs text-amber-400 font-medium">
            <Star className="w-3 h-3" fill="currentColor" />
            Testimonios de ejemplo
          </span>
        </div>

        {/* Headline */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2
            className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}
          >
            Clínicas que ya{' '}
            <span className="gradient-text">llenan su agenda</span>
          </h2>
          <p className="text-white/50 text-base md:text-lg">
            Resultados que clínicas estéticas podrían obtener al automatizar su WhatsApp con CitaLead.
          </p>
        </div>

        {/* Testimonial cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="group relative rounded-2xl overflow-hidden border border-white/5 bg-[#111118] hover:border-white/10 transition-all duration-300 flex flex-col"
            >
              {/* Clinic image header */}
              <div className="relative h-36 overflow-hidden">
                <Image
                  src={t.clinicImg}
                  alt={`Clínica de ${t.name}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111118] via-[#111118]/50 to-transparent" />

                {/* Metric badge */}
                <div
                  className="absolute bottom-3 right-3 rounded-xl px-3 py-1.5 text-center"
                  style={{
                    background: 'rgba(10,10,15,0.85)',
                    border: `1px solid ${t.color}40`,
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <div className="flex items-center gap-1 justify-center">
                    <TrendingUp className="w-3 h-3" style={{ color: t.color }} strokeWidth={2} />
                    <span className="text-lg font-extrabold" style={{ color: t.color, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {t.metric}
                    </span>
                  </div>
                  <div className="text-[10px] text-white/40">{t.metricLabel}</div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                {/* Stars */}
                <div className="flex items-center gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" />
                  ))}
                </div>

                <blockquote className="text-white/60 text-sm leading-relaxed flex-1 mb-5">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <div
                    className="relative w-10 h-10 rounded-full overflow-hidden border-2 flex-shrink-0"
                    style={{ borderColor: `${t.color}60` }}
                  >
                    <Image src={t.avatar} alt={t.name} fill className="object-cover" sizes="40px" />
                  </div>
                  <div>
                    <div
                      className="text-white text-sm font-semibold"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      {t.name}
                    </div>
                    <div className="text-white/40 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>

              <div
                className="h-px mx-6 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
                style={{ background: `linear-gradient(90deg, ${t.color}, transparent)` }}
              />
            </div>
          ))}
        </div>

        {/* Bottom stats bar */}
        <div className="flex flex-wrap justify-center items-center gap-8 mt-14 pt-10 border-t border-white/5">
          {bottomStats.map((s) => (
            <div key={s.label} className="text-center">
              <div
                className="text-2xl font-extrabold text-white"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {s.val}
              </div>
              <div className="text-sm text-white/40 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
