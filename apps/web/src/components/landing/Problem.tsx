import { Clock, BellOff, MessageCircleX, BarChart2 } from 'lucide-react'

const problems = [
  {
    num: '01',
    title: 'Respuesta tardía',
    desc: 'El lead pregunta el precio a las 9pm. Si no contestas en minutos, ya agendó con tu competencia.',
    Icon: Clock,
  },
  {
    num: '02',
    title: 'Seguimiento que no pasa',
    desc: 'El prospecto dice "ahorita lo veo" y se enfría. Nadie tiene tiempo de darle seguimiento uno a uno.',
    Icon: BellOff,
  },
  {
    num: '03',
    title: 'Conversaciones sin cierre',
    desc: 'Muchos mensajes, pocas citas. El WhatsApp se llena pero la agenda no.',
    Icon: MessageCircleX,
  },
  {
    num: '04',
    title: 'Sin visibilidad del negocio',
    desc: 'No sabes cuántos leads llegan, cuántos convierten ni cuántas citas se pierden cada semana.',
    Icon: BarChart2,
  },
]

export default function Problem() {
  return (
    <section id="problema" className="relative py-24 md:py-32 overflow-hidden">
      {/* Subtle red glow */}
      <div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-5 pointer-events-none"
        style={{ background: '#fb7185' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section label */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-rose-500/20 bg-rose-500/5 text-xs text-rose-400 font-medium">
            Lo que pasa en muchas clínicas
          </span>
        </div>

        {/* Headline */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2
            className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}
          >
            No pierdes leads por falta de interés.
            <br />
            <span className="text-white/40">Los pierdes por falta de seguimiento.</span>
          </h2>
          <p className="text-white/50 text-base md:text-lg leading-relaxed">
            Un prospecto pregunta por precio, horarios o promociones. Si nadie responde rápido, si no
            se le da seguimiento o si la conversación se pierde entre otros mensajes, esa oportunidad
            no termina en cita.
          </p>
        </div>

        {/* Problem cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {problems.map((p) => (
            <div
              key={p.num}
              className="group relative rounded-2xl p-6 border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 bg-rose-500/10 border border-rose-500/15 group-hover:bg-rose-500/15 transition-colors duration-300">
                <p.Icon className="w-5 h-5 text-rose-400" strokeWidth={1.5} />
              </div>

              <div
                className="text-xs font-bold mb-2"
                style={{ color: 'rgba(251,113,133,0.7)', letterSpacing: '0.1em' }}
              >
                {p.num}
              </div>
              <h3
                className="text-white font-semibold mb-2 text-base"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {p.title}
              </h3>
              <p className="text-white/40 text-sm leading-relaxed">{p.desc}</p>

              {/* Hover line */}
              <div className="absolute bottom-0 left-6 right-6 h-px bg-rose-500/0 group-hover:bg-rose-500/20 transition-all duration-300 rounded-full" />
            </div>
          ))}
        </div>

        {/* Transition statement */}
        <div className="text-center mt-14">
          <p className="text-white/30 text-sm">
            CitaFlow elimina cada uno de estos problemas — automáticamente.
          </p>
          <a
            href="#como-funciona"
            className="inline-flex items-center gap-2 mt-3 text-sm text-[#00b37e] hover:text-[#34d399] transition-colors"
          >
            Ver cómo funciona ↓
          </a>
        </div>
      </div>
    </section>
  )
}
