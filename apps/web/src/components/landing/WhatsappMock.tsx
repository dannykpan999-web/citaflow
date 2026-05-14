export default function WhatsappMock() {
  const messages = [
    { from: 'lead', text: 'Hola 👋 quiero info sobre depilación láser' },
    {
      from: 'bot',
      text: '¡Hola! Soy el asistente de Clínica Lumina. ¿Te interesa alguna zona en específico?',
    },
    { from: 'lead', text: 'Zona completa — piernas y bikini' },
    {
      from: 'bot',
      text: 'Perfecto ✨ Zona completa desde $1,800 MXN/sesión. Tenemos paquetes de 6 y 8 sesiones con descuento. ¿Te agendo una valoración gratuita?',
    },
    { from: 'lead', text: 'Sí, ¿cómo agendo?' },
    {
      from: 'bot',
      text: '¡Aquí tu link de agenda! 👇\n📅 bit.ly/lumina-agenda\nElige el horario que te convenga.',
    },
  ]

  return (
    <div className="relative animate-float">
      {/* Glow behind phone */}
      <div
        className="absolute inset-0 blur-3xl opacity-30 rounded-3xl"
        style={{ background: 'linear-gradient(135deg, #00b37e, #a855f7)' }}
      />

      {/* Phone frame */}
      <div
        className="relative w-[300px] sm:w-[340px] rounded-[2.5rem] p-1.5 shadow-2xl"
        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))' }}
      >
        <div className="rounded-[2rem] overflow-hidden bg-[#111118] border border-white/10">
          {/* Status bar */}
          <div className="flex items-center justify-between px-5 py-2 bg-[#111118] text-white/40 text-[10px]">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-2 rounded-sm border border-white/40 relative">
                <div className="absolute inset-0.5 right-1 bg-white/40 rounded-sm" />
              </div>
            </div>
          </div>

          {/* WhatsApp header */}
          <div
            className="flex items-center gap-3 px-4 py-3"
            style={{ background: 'linear-gradient(90deg, #00b37e, #007a57)' }}
          >
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
              CL
            </div>
            <div>
              <div className="text-white text-sm font-semibold">Clínica Lumina</div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse-dot" />
                <span className="text-white/70 text-[10px]">CitaFlow está activo</span>
              </div>
            </div>
          </div>

          {/* Chat area */}
          <div className="px-3 py-4 space-y-2.5 bg-[#0a0a0f] min-h-[320px]">
            {/* Date chip */}
            <div className="flex justify-center">
              <span className="text-[10px] text-white/30 bg-white/5 px-3 py-1 rounded-full">Hoy</span>
            </div>

            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'lead' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[82%] rounded-2xl px-3 py-2 text-[12px] leading-relaxed ${
                    m.from === 'lead'
                      ? 'rounded-tr-sm text-white'
                      : 'rounded-tl-sm text-white/85'
                  }`}
                  style={
                    m.from === 'lead'
                      ? { background: 'linear-gradient(135deg, #00b37e, #34d399)' }
                      : { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.06)' }
                  }
                >
                  {m.from === 'bot' && (
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-[9px] text-[#00b37e] font-semibold uppercase tracking-wider">
                        ⚡ Automático
                      </span>
                    </div>
                  )}
                  <p style={{ whiteSpace: 'pre-line' }}>{m.text}</p>
                  <div className="text-[9px] text-white/30 text-right mt-1">
                    {`${9 + i}:4${i}`} {m.from === 'lead' ? '✓✓' : ''}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            <div className="flex justify-start">
              <div className="flex gap-1 px-4 py-3 rounded-2xl rounded-tl-sm bg-white/7 border border-white/6">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Appointment confirmed chip */}
          <div
            className="mx-3 mb-3 mt-0 rounded-xl px-3 py-2.5 flex items-start gap-2"
            style={{
              background: 'rgba(0,179,126,0.1)',
              border: '1px solid rgba(0,179,126,0.25)',
            }}
          >
            <span className="text-[#00b37e] text-sm mt-0.5">✅</span>
            <div>
              <p className="text-[11px] text-[#00b37e] font-semibold">Cita generada</p>
              <p className="text-[10px] text-white/40">
                Depilación zona completa · 7 jun · 11:00 AM<br />
                🔔 Recordatorio 24h programado
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats floating card */}
      <div
        className="absolute -bottom-4 -left-6 rounded-2xl px-4 py-3 shadow-xl"
        style={{
          background: 'rgba(17,17,24,0.95)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="text-[10px] text-white/40 mb-1">Respuesta promedio</div>
        <div
          className="text-2xl font-extrabold"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#00b37e' }}
        >
          8s
        </div>
        <div className="text-[10px] text-white/30">antes: 4 horas</div>
      </div>

      {/* Conversion card */}
      <div
        className="absolute -top-4 -right-4 rounded-2xl px-4 py-3 shadow-xl"
        style={{
          background: 'rgba(17,17,24,0.95)',
          border: '1px solid rgba(168,85,247,0.2)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="text-[10px] text-white/40 mb-1">Conversión</div>
        <div
          className="text-2xl font-extrabold"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#a855f7' }}
        >
          +34%
        </div>
        <div className="text-[10px] text-white/30">vs. manual</div>
      </div>
    </div>
  )
}
