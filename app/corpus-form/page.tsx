'use client'

import { useState } from 'react'

const TIPOS: Record<string, { label: string; hint: string; placeholder: string }> = {
  concepto:      { label: 'Desarrollo',   hint: 'No necesita estar completo — el corpus crece con lo que emerge.',     placeholder: 'Describí el concepto con la profundidad que tenga hoy…' },
  senal_debil:   { label: 'Qué observás', hint: 'Una señal débil es un patrón que aún no tiene nombre completo.',       placeholder: '¿Qué estás percibiendo? ¿Por qué te parece relevante?…' },
  pendiente:     { label: 'Descripción',  hint: 'Incluí el contexto necesario para retomarlo en otra sesión.',          placeholder: '¿Qué hay que hacer y por qué importa?…' },
  actualizacion: { label: 'Qué cambia',   hint: 'Indicá qué concepto o documento se actualiza y en qué sentido.',      placeholder: 'Concepto a actualizar y naturaleza del cambio…' },
}

const BOTONES = [
  { tipo: 'concepto',      icon: '◈', label: 'Concepto nuevo' },
  { tipo: 'senal_debil',   icon: '◌', label: 'Señal débil' },
  { tipo: 'pendiente',     icon: '◇', label: 'Pendiente' },
  { tipo: 'actualizacion', icon: '↻', label: 'Actualización' },
]

export default function CorpusFormPage() {
  const [tipo, setTipo]           = useState('concepto')
  const [titulo, setTitulo]       = useState('')
  const [autor, setAutor]         = useState('')
  const [contenido, setContenido] = useState('')
  const [loading, setLoading]     = useState(false)
  const [status, setStatus]       = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    try {
      const res = await fetch('/api/corpus-commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo, titulo, autor, contenido }),
      })

      if (res.ok) {
        const r = await res.json()
        setStatus({ type: 'success', msg: `✦ Registrado en ${r.path}` })
        setTitulo('')
        setAutor('')
        setContenido('')
        setTipo('concepto')
      } else {
        const r = await res.json().catch(() => ({}))
        setStatus({ type: 'error', msg: r.error || 'Error al registrar. Intentá de nuevo.' })
      }
    } catch {
      setStatus({ type: 'error', msg: 'Sin conexión. Verificá tu red e intentá de nuevo.' })
    }

    setLoading(false)
  }

  const t = TIPOS[tipo]

  return (
    <div style={s.screen}>
      <div style={s.container}>

        <div style={s.header}>
          <div style={s.logo}>✦</div>
          <h1 style={s.title}>Corpus Vivo</h1>
          <p style={s.subtitle}>Paradigma Aleph · Registro de conocimiento</p>
        </div>

        <div style={s.tipoGrid}>
          {BOTONES.map((b) => (
            <button
              key={b.tipo}
              type="button"
              onClick={() => setTipo(b.tipo)}
              style={{ ...s.tipoBtn, ...(tipo === b.tipo ? s.tipoBtnActive : {}) }}
            >
              <span style={s.tipoIcon}>{b.icon}</span>
              {b.label}
            </button>
          ))}
        </div>

        <div style={s.card}>
          <form onSubmit={handleSubmit}>

            <p style={s.sectionLabel}>Identificación</p>

            <div style={s.field}>
              <label style={s.label} htmlFor="titulo">Título</label>
              <input
                id="titulo"
                style={s.input}
                type="text"
                placeholder="Nombre del concepto, señal o pendiente…"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(83,177,210,.50)')}
                onBlur={(e)  => (e.target.style.borderColor = 'rgba(34,58,54,.10)')}
                required
              />
            </div>

            <div style={s.field}>
              <label style={s.label} htmlFor="autor">Autor / Cognoesfera</label>
              <input
                id="autor"
                style={s.input}
                type="text"
                placeholder="Nombre o Cognoesfera de origen…"
                value={autor}
                onChange={(e) => setAutor(e.target.value)}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(83,177,210,.50)')}
                onBlur={(e)  => (e.target.style.borderColor = 'rgba(34,58,54,.10)')}
                required
              />
            </div>

            <hr style={s.divider} />
            <p style={s.sectionLabel}>{t.label}</p>

            <div style={s.field}>
              <textarea
                id="contenido"
                style={s.textarea}
                placeholder={t.placeholder}
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(83,177,210,.50)')}
                onBlur={(e)  => (e.target.style.borderColor = 'rgba(34,58,54,.10)')}
                required
              />
              <p style={s.hint}>{t.hint}</p>
            </div>

            <hr style={s.divider} />

            <button
              type="submit"
              disabled={loading}
              style={s.submitBtn}
              onMouseOver={(e) => ((e.target as HTMLButtonElement).style.opacity = '0.88')}
              onMouseOut={(e)  => ((e.target as HTMLButtonElement).style.opacity = '1')}
            >
              {loading ? 'Registrando…' : 'Registrar en el corpus'}
            </button>

            {status && (
              <p style={status.type === 'success' ? s.statusSuccess : s.statusError}>
                {status.msg}
              </p>
            )}

          </form>
        </div>

        <p style={s.footerNote}>Destino automático según tipo · Rama main · edgardonoya-crypto/Cognoesfera</p>

      </div>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  screen: {
    minHeight: '100vh',
    padding: '40px 24px 64px',
    background:
      'radial-gradient(circle at 12% 16%, rgba(109,188,173,.14), transparent 28%),' +
      'radial-gradient(circle at 85% 18%, rgba(132,100,205,.10), transparent 24%),' +
      'radial-gradient(circle at 50% 80%, rgba(83,177,210,.08), transparent 30%),' +
      'linear-gradient(180deg, #f7f3e8, #efe9da)',
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    color: '#18201e',
  },
  container: { maxWidth: '580px', margin: '0 auto' },
  header:    { textAlign: 'center', marginBottom: '32px' },
  logo: {
    width: '52px', height: '52px', borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(72,170,152,.85), rgba(132,100,205,.75))',
    margin: '0 auto 16px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.3rem',
    boxShadow: '0 8px 28px rgba(72,170,152,.25)',
  },
  title:    { margin: '0 0 5px', fontSize: '1.45rem', fontWeight: 650, letterSpacing: '-0.04em' },
  subtitle: { margin: 0, color: '#66706d', fontSize: '0.88rem' },
  tipoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginBottom: '20px',
  },
  tipoBtn: {
    padding: '12px 10px',
    borderRadius: '14px',
    border: '1.5px solid rgba(34,58,54,.10)',
    background: 'rgba(255,255,255,.55)',
    fontFamily: 'inherit',
    fontSize: '0.88rem',
    fontWeight: 500,
    color: '#3a4a46',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'border-color 180ms, background 180ms, color 180ms',
  },
  tipoBtnActive: {
    borderColor: 'rgba(72,170,152,.55)',
    background: 'rgba(72,170,152,.10)',
    color: '#1a5a4a',
  },
  tipoIcon: { display: 'block', fontSize: '1.2rem', marginBottom: '4px' },
  card: {
    background: 'linear-gradient(180deg, rgba(255,255,255,.74), rgba(255,255,255,.54))',
    border: '1px solid rgba(34,58,54,.09)',
    borderRadius: '26px',
    boxShadow: '0 20px 56px rgba(27,42,38,.09)',
    padding: '36px 32px',
  },
  sectionLabel: {
    fontSize: '0.70rem', fontWeight: 600, letterSpacing: '0.10em',
    textTransform: 'uppercase', color: '#66706d',
    margin: '0 0 12px',
  },
  field: { marginBottom: '13px' },
  label: { display: 'block', fontSize: '0.84rem', fontWeight: 500, color: '#3a4a46', marginBottom: '5px' },
  input: {
    width: '100%', padding: '11px 14px',
    borderRadius: '13px', border: '1px solid rgba(34,58,54,.10)',
    background: 'rgba(255,255,255,.62)',
    fontFamily: 'inherit', fontSize: '0.94rem', color: '#18201e',
    outline: 'none', transition: 'border-color 200ms, box-shadow 200ms',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%', padding: '11px 14px',
    borderRadius: '13px', border: '1px solid rgba(34,58,54,.10)',
    background: 'rgba(255,255,255,.62)',
    fontFamily: 'inherit', fontSize: '0.94rem', color: '#18201e',
    outline: 'none', transition: 'border-color 200ms',
    resize: 'vertical', minHeight: '120px', lineHeight: 1.55,
    boxSizing: 'border-box',
  },
  hint:    { fontSize: '0.77rem', color: '#8a9a96', marginTop: '5px' },
  divider: { border: 'none', borderTop: '1px solid rgba(34,58,54,.08)', margin: '22px 0' },
  submitBtn: {
    width: '100%', padding: '13px', borderRadius: '14px', border: 'none',
    background: 'linear-gradient(135deg, rgba(72,170,152,.90), rgba(83,177,210,.85))',
    color: '#fff', fontFamily: 'inherit', fontSize: '1rem', fontWeight: 600,
    cursor: 'pointer', transition: 'opacity 200ms',
  },
  statusSuccess: {
    marginTop: '13px', padding: '10px 14px', borderRadius: '10px',
    fontSize: '0.87rem', textAlign: 'center',
    background: 'rgba(72,170,152,.12)', color: 'rgba(30,100,80,.85)',
    border: '1px solid rgba(72,170,152,.22)',
  },
  statusError: {
    marginTop: '13px', padding: '10px 14px', borderRadius: '10px',
    fontSize: '0.87rem', textAlign: 'center',
    background: 'rgba(180,60,60,.07)', color: 'rgba(160,40,40,.85)',
    border: '1px solid rgba(180,60,60,.15)',
  },
  footerNote: { textAlign: 'center', marginTop: '24px', fontSize: '0.79rem', color: '#8a9a96' },
}
