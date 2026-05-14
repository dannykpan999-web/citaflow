import { Building2, CalendarCheck2, TrendingDown, Clock } from 'lucide-react'

const stats = [
  { value: '120+', label: 'Clínicas activas', color: '#00b37e', Icon: Building2 },
  { value: '94K+', label: 'Citas generadas', color: '#a855f7', Icon: CalendarCheck2 },
  { value: '75%', label: 'Menos no-shows', color: '#60a5fa', Icon: TrendingDown },
  { value: '15h', label: 'Ahorradas por semana', color: '#f59e0b', Icon: Clock },
]

export default function StatsBar() {
  return (
    <section className="relative py-12 border-y border-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x md:divide-white/5">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-2 px-6 text-center">
              {/* Icon */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center mb-1"
                style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}
              >
                <s.Icon className="w-4 h-4" style={{ color: s.color }} strokeWidth={1.5} />
              </div>

              <div
                className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-none"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: s.color }}
              >
                {s.value}
              </div>
              <div className="text-sm text-white/40">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
