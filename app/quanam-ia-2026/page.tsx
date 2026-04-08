'use client'

import { useEffect, useRef, useState } from 'react'

const LENTES = [
  {
    id: 'angulo',
    nombre: 'El ángulo propio',
    frase: '"Desde donde estoy veo algo que el resto no está viendo…"',
    desc: 'Lo que solo vos podés ver desde tu lugar. La percepción que no aparece en ninguna presentación — independientemente de tu área o seniority.',
    ejemplo: '"Desde operaciones veo algo que el negocio no está viendo…"',
  },
  {
    id: 'pregunta',
    nombre: 'La pregunta viva',
    frase: '"Mi gran pregunta es…"',
    desc: 'Algo que te intriga y todavía no tiene respuesta. Una incomodidad productiva que el grupo podría explorar juntos.',
    ejemplo: '"¿Qué queda vivo en la organización de cada persona que estuvo?"',
  },
  {
    id: 'intuicion',
    nombre: 'La intuición central',
    frase: '"Tengo la corazonada de que el valor real está en…"',
    desc: 'Antes de que cualquier sistema procese la información, algo en vos ya sabe. No es intuición mágica — es un tipo de inteligencia que la neurociencia empieza a describir y que la IA, por ahora, no puede tener.',
    ejemplo: '',
  },
  {
    id: 'hilo',
    nombre: 'El hilo conector',
    frase: '"¿Qué pasaría si dos áreas que no dialogan frecuentemente pudieran construir algo juntas?"',
    desc: 'Una conexión que nadie hizo todavía entre dos cosas que parecen separadas dentro de Quanam.\nLa conversación es un acto relacional; la activación de una red de inteligencia colectiva.',
    ejemplo: '',
  },
  {
    id: 'experimento',
    nombre: 'El experimento pendiente',
    frase: '"Siempre quise probar qué pasaría si…"',
    desc: 'Algo que quisiste hacer y no hiciste. O algo que harías hoy si tuvieras el espacio para intentarlo.',
    ejemplo: '"Siempre quise probar qué pasaría si juntáramos a los más nuevos con los más antiguos a pensar un problema real…"',
  },
]

type LenteState = {
  open: boolean
  respuesta: string
  status: 'idle' | 'sending' | 'sent' | 'error'
  errorMsg: string
  showDuende: boolean
}

type DuendeChatProps = {
  lente: { id: string; nombre: string; frase: string; desc: string }
  mensajeInicial?: string
  nombre?: string
  email?: string
  autoAbrir?: boolean
}

type DuendeMsg = { role: 'user' | 'assistant'; content: string }

function DuendeChat({ lente, mensajeInicial, nombre, email, autoAbrir }: DuendeChatProps) {
  const [abierto, setAbierto] = useState(false)
  const [msgs, setMsgs] = useState<DuendeMsg[]>([])
  const [sesionId, setSesionId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const iniciado = useRef(false)

  useEffect(() => {
    if (autoAbrir && mensajeInicial?.trim() && !iniciado.current) {
      iniciado.current = true
      setAbierto(true)
      const userMsg = mensajeInicial.trim()
      setMsgs([{ role: 'user', content: userMsg }])
      const prompt = `El usuario está explorando el lente "${lente.nombre}". La propuesta es: ${lente.frase}. El usuario escribió: "${userMsg}". Respondé desde el paradigma. Sé breve y abrí territorio — no cerrés.`
      callDuende(prompt, [], null)
    }
  }, [autoAbrir, mensajeInicial])

  async function callDuende(mensaje: string, historial: DuendeMsg[], sid: string | null) {
    setLoading(true)
    try {
      const res = await fetch('/api/duende', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje, historial, sesion_id: sid, modo: 'convocatoria', nombre, email, contexto_origen: lente.nombre }),
      })
      const data = await res.json()
      if (data.respuesta) {
        setMsgs(prev => [...prev, { role: 'assistant', content: data.respuesta }])
        if (data.sesion_id) setSesionId(data.sesion_id)
      }
    } catch {
      setMsgs(prev => [...prev, { role: 'assistant', content: '(El Duende no pudo responder en este momento.)' }])
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  function enviarInput(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter' || !input.trim() || loading) return
    const msg = input.trim()
    setInput('')
    const newMsgs: DuendeMsg[] = [...msgs, { role: 'user', content: msg }]
    setMsgs(newMsgs)
    callDuende(msg, msgs, sesionId)
  }

  if (!abierto) return null

  return (
    <div style={{ marginTop: 10 }}>
      {loading && msgs.filter(m => m.role === 'assistant').length === 0 && (
        <p style={{ fontSize: 13, color: '#8A7E70', fontStyle: 'italic', lineHeight: 1.65 }}>El Duende está pensando…</p>
      )}
      {msgs.map((m, i) => (
        <p key={i} style={{ fontSize: 13, color: m.role === 'assistant' ? '#8A7E70' : '#2C2820', fontStyle: m.role === 'assistant' ? 'italic' : 'normal', lineHeight: 1.65, marginBottom: 8 }}>
          {m.role === 'user' ? `Vos: ${m.content}` : m.content}
        </p>
      ))}
      {loading && msgs.filter(m => m.role === 'assistant').length > 0 && (
        <p style={{ fontSize: 13, color: '#8A7E70', fontStyle: 'italic', lineHeight: 1.65 }}>El Duende está pensando…</p>
      )}
      {msgs.length > 0 && (
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={enviarInput}
          placeholder="Seguí la conversación… (Enter para enviar)"
          disabled={loading}
          style={{ width: '100%', border: '1px solid rgba(139,105,20,0.2)', borderRadius: 6, padding: '8px 10px', fontSize: 13, fontFamily: 'Karla, sans-serif', color: '#2C2820', background: 'rgba(245,240,232,0.5)', outline: 'none', marginTop: 8, boxSizing: 'border-box' }}
        />
      )}
    </div>
  )
}

type DuendeFragmentoProps = {
  fragmentoId: string
  titulo: string
  contexto: string
  nombre?: string
  email?: string
}

function DuendeFragmento({ titulo, contexto, nombre, email }: DuendeFragmentoProps) {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<DuendeMsg[]>([])
  const [sesionId, setSesionId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function callDuende(mensaje: string, historial: DuendeMsg[], sid: string | null) {
    setLoading(true)
    try {
      const res = await fetch('/api/duende', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje, historial, sesion_id: sid, modo: 'convocatoria', nombre, email, contexto_origen: titulo }),
      })
      const data = await res.json()
      if (data.respuesta) {
        setMsgs(prev => [...prev, { role: 'assistant', content: data.respuesta }])
        if (data.sesion_id) setSesionId(data.sesion_id)
      }
    } catch {
      setMsgs(prev => [...prev, { role: 'assistant', content: '(El Duende no pudo responder en este momento.)' }])
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  function toggleOpen(e: React.MouseEvent) {
    e.stopPropagation()
    if (!open && msgs.length === 0) {
      setOpen(true)
      const inicial = `El usuario está explorando el fragmento "${titulo}". Contexto: ${contexto}. Respondé desde ese territorio con brevedad. Abrí una pregunta que invite a pensar.`
      callDuende(inicial, [], null)
    } else {
      setOpen(v => !v)
    }
  }

  function enviarInput(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter' || !input.trim() || loading) return
    const msg = input.trim()
    setInput('')
    const newMsgs: DuendeMsg[] = [...msgs, { role: 'user', content: msg }]
    setMsgs(newMsgs)
    callDuende(msg, msgs, sesionId)
  }

  return (
    <div>
      <button onClick={toggleOpen} style={{ background: 'none', border: '1px solid #C4941A', borderRadius: 6, padding: '6px 12px', fontSize: 11, color: '#8B6914', cursor: 'pointer', letterSpacing: '0.04em' }}>
        {open ? 'Cerrar el Duende' : 'Conversá con el Duende'}
      </button>
      {open && (
        <div style={{ marginTop: 8 }}>
          {loading && msgs.length === 0 && (
            <p style={{ fontSize: 12, color: '#8A7E70', fontStyle: 'italic', lineHeight: 1.65 }}>El Duende está pensando…</p>
          )}
          {msgs.map((m, i) => (
            <p key={i} style={{ fontSize: 12, color: m.role === 'assistant' ? '#8A7E70' : '#2C2820', fontStyle: m.role === 'assistant' ? 'italic' : 'normal', lineHeight: 1.65, marginBottom: 6 }}>
              {m.role === 'user' ? `Vos: ${m.content}` : m.content}
            </p>
          ))}
          {loading && msgs.length > 0 && (
            <p style={{ fontSize: 12, color: '#8A7E70', fontStyle: 'italic', lineHeight: 1.65 }}>El Duende está pensando…</p>
          )}
          {msgs.length > 0 && (
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={enviarInput}
              placeholder="Seguí la conversación… (Enter para enviar)"
              disabled={loading}
              style={{ width: '100%', border: '1px solid rgba(139,105,20,0.2)', borderRadius: 6, padding: '6px 10px', fontSize: 12, fontFamily: 'Karla, sans-serif', color: '#2C2820', background: 'rgba(245,240,232,0.5)', outline: 'none', marginTop: 6, boxSizing: 'border-box' }}
            />
          )}
        </div>
      )}
    </div>
  )
}

function getCookie(name: string): string {
  if (typeof document === 'undefined') return ''
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return decodeURIComponent(parts.pop()!.split(';').shift() ?? '')
  return ''
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`
}

type FragmentoKey = 'mas' | 'preguntas' | null

export default function QuanamIa2026() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const emailRef = useRef<HTMLInputElement>(null)

  const [bienvenida, setBienvenida] = useState(true)
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerSec1Open, setDrawerSec1Open] = useState(false)
  const [drawerSecMidOpen, setDrawerSecMidOpen] = useState(false)
  const [drawerSec2Open, setDrawerSec2Open] = useState(false)
  const [dF1Open, setDF1Open] = useState(false)
  const [dF2Open, setDF2Open] = useState(false)
  const [dF3Open, setDF3Open] = useState(false)
  const [dF4Open, setDF4Open] = useState(false)
  const [dF1Prof, setDF1Prof] = useState(false)
  const [dF2Prof, setDF2Prof] = useState(false)
  const [dF3Prof, setDF3Prof] = useState(false)
  const [dF4Prof, setDF4Prof] = useState(false)
  const [dF5Open, setDF5Open] = useState(false)
  const [contactMsg, setContactMsg] = useState('')
  const [contactStatus, setContactStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [sec2Open, setSec2Open] = useState(false)
  const [f1Open, setF1Open] = useState<FragmentoKey>(null)
  const [f2Open, setF2Open] = useState<FragmentoKey>(null)
  const [f3Open, setF3Open] = useState<FragmentoKey>(null)

  const [lenteStates, setLenteStates] = useState<Record<string, LenteState>>(
    Object.fromEntries(
      LENTES.map(l => [l.id, { open: false, respuesta: '', status: 'idle', errorMsg: '', showDuende: false }])
    )
  )

  const [otpStep, setOtpStep] = useState<'email' | 'otp'>('email')
  const [otpToken, setOtpToken] = useState('')
  const [otpError, setOtpError] = useState('')
  const [otpLoading, setOtpLoading] = useState(false)

  useEffect(() => {
    const savedEmail = getCookie('quanam_email')
    if (savedEmail) setEmail(savedEmail)
  }, [])

  async function handleSendOtp() {
    if (!email.trim()) return
    setOtpError('')
    setOtpLoading(true)
    const res = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim() }),
    })
    const data = await res.json() as { success: boolean; error?: string }
    setOtpLoading(false)
    if (!data.success) {
      setOtpError('No pudimos enviar el código. Verificá el email.')
      return
    }
    setOtpStep('otp')
  }

  async function handleVerifyOtp() {
    if (otpToken.length < 6) return
    setOtpError('')
    setOtpLoading(true)
    const { createBrowserClient } = await import('@supabase/ssr')
    const sb = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { error } = await sb.auth.verifyOtp({ email: email.trim(), token: otpToken, type: 'email' })
    setOtpLoading(false)
    if (error) {
      setOtpError('Código incorrecto o expirado.')
      return
    }
    setCookie('quanam_email', email.trim(), 30)
    // Registrar acceso a la convocatoria
    try {
      const { createBrowserClient } = await import('@supabase/ssr')
      const sb = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
      await sb.from('convocatoria_accesos').insert({ email: email.trim() })
    } catch {}
    setBienvenida(false)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    if (!ctx) return
    const W = 160, H = 160
    canvas.width = W; canvas.height = H
    const cx = W / 2, cy = H / 2, N = 12
    let t = 0, phase = 'dispersed', phaseT = 0
    type Node = { x: number; y: number; vx: number; vy: number; baseAngle: number; phase: number; size: number }
    let nodes: Node[] = []
    function initNodes() {
      nodes = Array.from({ length: N }, (_, i) => {
        const angle = (i / N) * Math.PI * 2
        return {
          x: cx + Math.cos(angle + (Math.random() - 0.5) * 2) * (55 + Math.random() * 20),
          y: cy + Math.sin(angle + (Math.random() - 0.5) * 2) * (45 + Math.random() * 15),
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          baseAngle: angle,
          phase: i * 0.6,
          size: 3 + Math.random() * 3,
        }
      })
    }
    function draw() {
      ctx.clearRect(0, 0, W, H)
      phaseT++
      const DUR = 150
      if (phase === 'dispersed' && phaseT > DUR) { phase = 'attracting'; phaseT = 0 }
      else if (phase === 'attracting' && phaseT > DUR) { phase = 'coalesced'; phaseT = 0 }
      else if (phase === 'coalesced' && phaseT > DUR * 2) { phase = 'dispersed'; phaseT = 0; initNodes() }
      const coalesced = phase === 'coalesced'
      const attracting = phase === 'attracting'
      const progress = Math.min(phaseT / DUR, 1)
      nodes.forEach(n => {
        if (attracting || coalesced) {
          const tr = coalesced ? 50 + 4 * Math.sin(t * 0.03 + n.phase) : 68 - progress * 18
          const tx = cx + Math.cos(n.baseAngle) * tr
          const ty = cy + Math.sin(n.baseAngle) * tr * 0.75
          n.vx += (tx - n.x) * 0.04; n.vy += (ty - n.y) * 0.04
          n.vx *= 0.82; n.vy *= 0.82
        } else {
          n.vx += (Math.random() - 0.5) * 0.15; n.vy += (Math.random() - 0.5) * 0.15
          n.vx *= 0.97; n.vy *= 0.97
        }
        n.x += n.vx; n.y += n.vy
      })
      if (coalesced) {
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.025)
        const gr = ctx.createRadialGradient(cx, cy, 0, cx, cy, 50)
        gr.addColorStop(0, `rgba(139,105,20,${0.12 + pulse * 0.06})`)
        gr.addColorStop(1, 'rgba(139,105,20,0)')
        ctx.beginPath(); ctx.arc(cx, cy, 50, 0, Math.PI * 2); ctx.fillStyle = gr; ctx.fill()
      }
      for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
        const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y)
        const maxD = coalesced ? 115 : attracting ? 125 - progress * 20 : 75
        if (d < maxD) {
          const alpha = coalesced ? 0.18 + 0.08 * Math.sin(t * 0.02 + i * 0.5) : (1 - d / maxD) * 0.14 * progress
          ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y)
          ctx.strokeStyle = `rgba(139,105,20,${alpha})`; ctx.lineWidth = 0.8; ctx.stroke()
        }
      }
      nodes.forEach(n => {
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.025 + n.phase)
        const r = n.size * (coalesced ? 1.0 + pulse * 0.4 : 0.7 + pulse * 0.3)
        ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(139,105,20,${coalesced ? 0.60 + pulse * 0.3 : 0.28 + pulse * 0.22})`; ctx.fill()
      })
      t++
      animRef.current = requestAnimationFrame(draw)
    }
    initNodes(); draw()
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  function toggleFragmento(setter: React.Dispatch<React.SetStateAction<FragmentoKey>>, key: FragmentoKey, current: FragmentoKey) {
    setter(current === key ? null : key)
  }

  function toggleLente(id: string) {
    setLenteStates(prev => ({ ...prev, [id]: { ...prev[id], open: !prev[id].open } }))
  }

  function setRespuesta(id: string, value: string) {
    setLenteStates(prev => ({ ...prev, [id]: { ...prev[id], respuesta: value, status: 'idle', errorMsg: '', showDuende: false } }))
  }

  async function enviar(lente: typeof LENTES[0]) {
    const respuesta = lenteStates[lente.id].respuesta
    if (!respuesta.trim()) {
      setLenteStates(prev => ({ ...prev, [lente.id]: { ...prev[lente.id], status: 'error', errorMsg: 'Escribí tu respuesta antes de enviar.' } }))
      return
    }
    setLenteStates(prev => ({ ...prev, [lente.id]: { ...prev[lente.id], status: 'sending' } }))
    try {
      const res = await fetch('/api/quanam-respuesta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombre.trim(), lente: lente.nombre, respuesta: respuesta.trim(), email: email.trim() || null }),
      })
      if (res.ok) {
        setLenteStates(prev => ({ ...prev, [lente.id]: { ...prev[lente.id], status: 'sent', respuesta: '' } }))
      } else {
        const data = await res.json()
        setLenteStates(prev => ({ ...prev, [lente.id]: { ...prev[lente.id], status: 'error', errorMsg: data.error || 'Error al enviar.' } }))
      }
    } catch {
      setLenteStates(prev => ({ ...prev, [lente.id]: { ...prev[lente.id], status: 'error', errorMsg: 'Error de conexión.' } }))
    }
  }

  return (
    <>
      {/* BIENVENIDA */}
      {bienvenida && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            src="/Inteligencia_Colectiva.MP4"
          />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)' }} />
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '0 24px', maxWidth: 480, width: '100%', textAlign: 'center' }}>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(48px,8vw,80px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em', color: '#C4941A', margin: 0 }}>
              IHA
            </h1>
            <p style={{ fontSize: 'clamp(18px,3vw,28px)', color: '#C4941A', fontFamily: 'Karla, sans-serif', fontWeight: 300, letterSpacing: '0.06em', margin: 0 }}>Inteligencia Humana Aumentada</p>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.82)', fontWeight: 300, fontFamily: 'Karla, sans-serif', lineHeight: 1.75, textAlign: 'center', margin: 0 }}>El piso se está moviendo. La IA está reconfigurando lo que hacemos más rápido de lo que podemos nombrarlo. Las organizaciones que van a salir bien paradas son las que empiezan a pensar juntas hoy.<br /><br /><em style={{ color: '#E8C96A', fontStyle: 'italic', fontSize: 17 }}>¿Qué señales te entusiasman… o te inquietan?</em></p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.40)', fontWeight: 300, fontFamily: 'Karla, sans-serif', lineHeight: 1.6, textAlign: 'center', marginTop: 6 }}>Entre 5 y 8 semanas · Un grupo de entre 15 y 20 personas · Encuentros que no gestionan el presente — exploran el futuro.</p>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
              {otpStep === 'email' ? (
                <>
                  <input
                    ref={emailRef}
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleSendOtp() }}
                    placeholder="Tu email…"
                    style={{ width: '100%', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(196,148,26,0.5)', borderRadius: 10, padding: '14px 18px', fontSize: 16, fontFamily: 'Karla, sans-serif', fontWeight: 300, color: '#fff', outline: 'none', textAlign: 'center' }}
                  />
                  <button
                    onClick={handleSendOtp}
                    disabled={!email.trim() || otpLoading}
                    style={{ marginTop: 4, background: email.trim() ? '#8B6914' : 'rgba(139,105,20,0.35)', color: '#F5EDD8', border: 'none', borderRadius: 10, padding: '14px 32px', fontSize: 15, fontFamily: 'Karla, sans-serif', fontWeight: 500, letterSpacing: '0.08em', cursor: email.trim() ? 'pointer' : 'default', transition: 'background 0.2s' }}
                  >
                    {otpLoading ? 'Enviando…' : 'Enviar código'}
                  </button>
                </>
              ) : (
                <>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', fontFamily: 'Karla, sans-serif', fontWeight: 300, lineHeight: 1.6 }}>
                    Ingresá el código que enviamos a <strong style={{ color: '#C4941A' }}>{email}</strong>
                  </p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.50)', fontFamily: 'Karla, sans-serif', fontWeight: 300 }}>
                    Si no llegó, revisá tu carpeta de spam.
                  </p>
                  <input
                    type="text"
                    value={otpToken}
                    onChange={e => setOtpToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    onKeyDown={e => { if (e.key === 'Enter') handleVerifyOtp() }}
                    placeholder="Código de 6 dígitos…"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    autoFocus
                    style={{ width: '100%', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(196,148,26,0.5)', borderRadius: 10, padding: '14px 18px', fontSize: 16, fontFamily: 'Karla, sans-serif', fontWeight: 300, color: '#fff', outline: 'none', textAlign: 'center', letterSpacing: '0.2em' }}
                  />
                  <button
                    onClick={handleVerifyOtp}
                    disabled={otpToken.length < 6 || otpLoading}
                    style={{ marginTop: 4, background: otpToken.length >= 6 ? '#8B6914' : 'rgba(139,105,20,0.35)', color: '#F5EDD8', border: 'none', borderRadius: 10, padding: '14px 32px', fontSize: 15, fontFamily: 'Karla, sans-serif', fontWeight: 500, letterSpacing: '0.08em', cursor: otpToken.length >= 6 ? 'pointer' : 'default', transition: 'background 0.2s' }}
                  >
                    {otpLoading ? 'Verificando…' : 'Ingresar'}
                  </button>
                  <button
                    onClick={() => { setOtpStep('email'); setOtpToken(''); setOtpError('') }}
                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.45)', fontSize: 12, fontFamily: 'Karla, sans-serif', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                  >
                    Volver a ingresar el email
                  </button>
                </>
              )}
              {otpError && <p style={{ fontSize: 13, color: '#ffb3b3', fontFamily: 'Karla, sans-serif' }}>{otpError}</p>}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&family=Karla:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #F5F0E8; --card-w: rgba(255,255,255,0.97); --card-m: rgba(245,240,232,0.95);
          --card-d: #2C1F08; --ink: #2C2820; --inklt: #6A5E50; --inkxlt: #8A7E70;
          --gold: #8B6914; --goldlt: #C4941A; --goldxlt: #E8C96A; --cream: #F5EDD8;
          --rule: rgba(139,105,20,0.15);
        }
        html { scroll-behavior: smooth; }
        body { background: var(--bg); font-family: 'Karla', sans-serif; color: var(--ink); min-height: 100vh; -webkit-font-smoothing: antialiased; }
        .wrap { max-width: 860px; margin: 0 auto; padding: 0 24px 80px; }
        header { padding: 48px 0 40px; border-bottom: 1px solid var(--rule); display: grid; grid-template-columns: 1fr 180px; gap: 0 40px; align-items: center; }
        .header-left { grid-column: 1; }
        .header-anim { grid-column: 2; display: flex; align-items: center; justify-content: center; }
        .eyebrow { font-size: 14px; letter-spacing: 0.26em; text-transform: uppercase; color: var(--goldlt); margin-bottom: 18px; font-weight: 500; }
        h1 { font-family: 'Playfair Display', serif; font-size: clamp(32px,4.5vw,50px); font-weight: 400; line-height: 1.12; letter-spacing: -0.02em; color: var(--gold); margin-bottom: 20px; }
        h1 em { font-style: italic; color: var(--goldlt); }
        .bajada { font-size: 17px; color: var(--inklt); line-height: 1.8; font-weight: 300; }
        .bajada strong { font-weight: 500; color: var(--ink); }
        canvas#anim-canvas { display: block; width: 160px; height: 160px; }
        .aguila { margin-top: 12px; background: var(--card-d); border-radius: 20px; padding: 44px 40px 40px; display: flex; flex-direction: column; gap: 18px; }
        .bloque-etiqueta { font-size: 11px; letter-spacing: 0.26em; text-transform: uppercase; font-weight: 500; }
        .aguila .bloque-etiqueta { color: var(--goldxlt); opacity: 0.7; }
        .aguila-titulo { font-family: 'Playfair Display', serif; font-size: clamp(18px,2.5vw,24px); font-weight: 400; font-style: italic; color: var(--cream); line-height: 1.45; }
        .aguila-cuerpo { font-size: 17px; color: rgba(245,237,216,0.88); line-height: 1.85; font-weight: 300; }
        .aguila-acento { font-size: 16px; color: rgba(245,237,216,0.72); line-height: 1.8; border-left: 2px solid rgba(232,201,106,0.3); padding-left: 18px; font-style: italic; font-weight: 300; }
        .secciones { margin-top: 12px; display: flex; flex-direction: column; gap: 1px; background: var(--rule); border: 1px solid var(--rule); border-radius: 20px; overflow: hidden; }
        .seccion { background: var(--card-w); }
        .seccion-header { padding: 0 32px; min-height: 80px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: background 0.2s; user-select: none; -webkit-tap-highlight-color: transparent; }
        .seccion-header:hover { background: rgba(255,255,255,1); }
        .seccion-header-left { display: flex; flex-direction: column; gap: 5px; }
        .seccion-etiqueta { font-size: 11px; letter-spacing: 0.26em; text-transform: uppercase; color: var(--goldlt); font-weight: 500; }
        .seccion-titulo { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 400; font-style: italic; color: var(--gold); }
        .seccion-subtitulo { font-size: 13px; color: var(--inkxlt); font-weight: 300; margin-top: 2px; }
        .seccion-flecha { width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--rule); background: var(--bg); display: flex; align-items: center; justify-content: center; font-size: 18px; color: var(--goldlt); transition: transform 0.35s ease; flex-shrink: 0; margin-left: 20px; }
        .seccion.open .seccion-flecha { transform: rotate(90deg); }
        .seccion-body { max-height: 0; overflow: hidden; transition: max-height 0.45s ease; }
        .seccion.open .seccion-body { max-height: 9000px; }
        .fragmentos { border-top: 1px solid var(--rule); }
        .fragmento { border-bottom: 1px solid var(--rule); }
        .fragmento:last-child { border-bottom: none; }
        .fragmento-visible { padding: 24px 32px 20px 40px; display: flex; flex-direction: column; gap: 10px; }
        .fragmento-num { font-family: 'Playfair Display', serif; font-size: 12px; font-style: italic; color: var(--goldlt); }
        .fragmento-titulo { font-size: 16px; font-weight: 500; color: var(--ink); margin-bottom: 4px; }
        .fragmento-intro { font-size: 16px; color: var(--inklt); line-height: 1.8; font-weight: 300; }
        .fragmento-links { display: flex; gap: 20px; margin-top: 6px; padding-bottom: 4px; }
        .flink { font-size: 13px; color: var(--goldlt); font-weight: 500; cursor: pointer; border-bottom: 1px solid rgba(196,148,26,0.3); padding-bottom: 1px; transition: color 0.2s, border-color 0.2s; -webkit-tap-highlight-color: transparent; }
        .flink:hover { color: var(--gold); border-color: var(--gold); }
        .fragmento-expandido { max-height: 0; overflow: hidden; transition: max-height 0.4s ease; }
        .fragmento-expandido.open { max-height: 2000px; }
        .fragmento-contenido { padding: 0 40px 28px 40px; display: flex; flex-direction: column; gap: 14px; border-top: 1px solid var(--rule); }
        .fragmento-contenido-titulo { font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--goldlt); font-weight: 500; padding-top: 20px; }
        .fragmento-texto { font-size: 16px; color: var(--inklt); line-height: 1.85; font-weight: 300; }
        .fragmento-lista { display: flex; flex-direction: column; gap: 8px; padding-left: 4px; }
        .fragmento-lista li { font-size: 16px; color: var(--inklt); line-height: 1.75; font-weight: 300; list-style: none; padding-left: 16px; position: relative; }
        .fragmento-lista li::before { content: '—'; position: absolute; left: 0; color: var(--goldxlt); }
        .fragmento-acento { font-size: 15px; color: var(--gold); line-height: 1.75; font-style: italic; font-family: 'Playfair Display', serif; }
        .fragmento-pregunta { font-size: 16px; color: var(--inklt); line-height: 1.8; font-weight: 300; padding-left: 16px; border-left: 2px solid var(--goldxlt); }
        .lentes-intro { padding: 28px 40px 20px; border-top: 1px solid var(--rule); display: flex; flex-direction: column; gap: 12px; }
        .lentes-sub { font-size: 16px; color: var(--inklt); line-height: 1.75; font-weight: 300; }
        .lentes-sub em { font-style: italic; color: var(--gold); }
        .lentes-lista { border-top: 1px solid var(--rule); }
        .lente { border-bottom: 1px solid var(--rule); background: var(--card-w); cursor: pointer; -webkit-tap-highlight-color: transparent; transition: background 0.2s; }
        .lente:last-child { border-bottom: none; }
        .lente:hover { background: rgba(250,248,244,1); }
        .lente-header { padding: 0 32px 0 40px; min-height: 64px; display: flex; align-items: center; justify-content: space-between; }
        .lente-header-left { display: flex; flex-direction: column; gap: 4px; flex: 1; padding-right: 12px; }
        .lente-nombre { font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--goldlt); font-weight: 500; }
        .lente-frase { font-family: 'Playfair Display', serif; font-size: 16px; font-style: italic; color: var(--ink); line-height: 1.4; }
        .lente-flecha { width: 28px; height: 28px; border-radius: 50%; border: 1px solid var(--rule); display: flex; align-items: center; justify-content: center; font-size: 14px; color: var(--inkxlt); transition: transform 0.3s ease; flex-shrink: 0; background: var(--bg); }
        .lente.open .lente-flecha { transform: rotate(90deg); }
        .lente-body { max-height: 0; overflow: hidden; transition: max-height 0.35s ease; }
        .lente.open .lente-body { max-height: 800px; }
        .lente-contenido { padding: 4px 40px 24px 40px; display: flex; flex-direction: column; gap: 10px; }
        .lente-desc { font-size: 16px; color: var(--inklt); line-height: 1.8; font-weight: 300; }
        .lente-ejemplo { font-size: 15px; color: var(--goldlt); font-style: italic; line-height: 1.65; }
        .pregunta-central { margin-top: 12px; padding: 44px 8px 40px; border-top: 1px solid var(--rule); display: flex; flex-direction: column; gap: 16px; }
        .pregunta-central .bloque-etiqueta { color: var(--goldlt); }
        .pregunta-texto { font-family: 'Playfair Display', serif; font-size: clamp(20px,3vw,32px); font-style: italic; font-weight: 400; color: var(--gold); line-height: 1.55; }
        .pregunta-quanam { font-size: 15px; color: var(--inkxlt); font-style: italic; }
        .cierre { margin-top: 12px; background: #EDE8DC; border: 1px solid var(--rule); border-radius: 20px; padding: 40px; display: flex; flex-direction: column; gap: 16px; }
        .cierre-texto { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 400; font-style: italic; color: var(--gold); line-height: 1.65; }
        .cierre-sub { font-size: 17px; color: var(--inklt); line-height: 1.8; font-weight: 300; }
        .cierre-sub strong { font-weight: 500; color: var(--ink); }
        .colophon { margin-top: 48px; padding-top: 24px; border-top: 1px solid var(--rule); display: flex; align-items: center; justify-content: space-between; }
        .col-marca { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--goldlt); }
        .col-meta { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--inkxlt); }
        @media (max-width: 640px) {
          header { grid-template-columns: 1fr; gap: 28px 0; }
          .header-anim { justify-content: flex-start; }
          .aguila { padding: 36px 28px 32px; }
          .seccion-header { padding: 0 24px; }
          .fragmento-visible { padding: 20px 24px 16px 28px; }
          .fragmento-contenido { padding: 0 28px 24px 28px; }
          .lentes-intro { padding: 24px 28px 18px; }
          .lente-header { padding: 0 24px 0 28px; }
          .lente-contenido { padding: 4px 28px 24px 28px; }
          .cierre { padding: 32px 28px; }
          .pregunta-central { padding: 36px 0 32px; }
        }
      `}</style>

      <div className="wrap" style={{ display: bienvenida ? 'none' : undefined }}>

        {/* HEADER */}
        <header>
          <div className="header-left">
            <div className="eyebrow">Convocatoria · Por este camino 2026</div>
            <h1>Lo que se va.<br />Lo que <em>permanece.</em><br />Lo que podemos construir.</h1>
            <p className="bajada">Hay más inteligencia en Quanam de la que Quanam sabe que tiene. <strong>Esta es la invitación a verla juntos.</strong></p>
          </div>
          <div className="header-anim">
            <canvas ref={canvasRef} id="anim-canvas" />
          </div>
        </header>

        <div style={{ width: '100%', padding: '16px 20px', background: 'rgba(245,240,232,0.95)', border: '1px solid rgba(139,105,20,0.15)', borderRadius: 12, marginBottom: 12, marginTop: 12 }}>
          <p style={{ fontSize: 13, color: '#8A7E70', lineHeight: 1.75, fontWeight: 300 }}><em>Esta convocatoria tiene tres capas.</em> Podés leer solo la primera y ya tenés todo lo que necesitás para decidir. Las otras dos son para quien quiera ir más lejos. Ninguna es obligatoria.</p>
        </div>

        {/* ÁGUILA */}
        <div className="aguila">
          <span className="bloque-etiqueta">el punto de partida</span>
          <p className="aguila-titulo">Cuenta la historia que un águila se posó en una rama. Una voz de alguien que no sabía volar le preguntó si no temía que la rama se quebrara. El águila respondió: mi confianza no está en la rama. Está en mis alas.</p>
          <p className="aguila-cuerpo">Quanam lleva años construyendo ramas — metodologías, proyectos, tecnologías. La inteligencia artificial es la rama más nueva, y la más tentadora: procesa todo lo que Quanam ha hecho, ordena todo lo que Quanam sabe. Pero sigue siendo una rama. Las alas son otra cosa: la inteligencia que vive distribuida entre las personas, las áreas, las conversaciones que nunca se registraron.</p>
          <p className="aguila-acento">La IA puede decirte todo lo que Quanam sabe. No puede decirte lo que Quanam todavía no sabe que sabe.</p>
        </div>

        {/* PREGUNTA CENTRAL */}
        <div className="pregunta-central">
          <span className="bloque-etiqueta" style={{ color: 'var(--goldlt)' }}>La pregunta</span>
          <p className="pregunta-texto">&ldquo;¿Cómo puede la inteligencia artificial en Quanam crear condiciones para que lo que sabemos juntos — y que todavía no sabemos que sabemos — se vuelva visible… y desde ahí, empezar a ver caminos que hoy todavía no estamos viendo?&rdquo;</p>
          <p className="pregunta-quanam">Quanam: por este camino.</p>
        </div>

        {/* SECCIONES */}
        <div className="secciones">

          {/* SECCIÓN 1 — movida al panel flotante lateral */}
          {false && <div className="fragmentos">

                {/* FRAGMENTO I */}
                <div className="fragmento">
                  <div className="fragmento-visible">
                    <span className="fragmento-num">I</span>
                    <div className="fragmento-titulo">El río que cambió de curso</div>
                    <div style={{ fontSize: 12, color: '#8A7E70', fontWeight: 300, marginTop: 2 }}>2 min · 5 min con profundidad</div>
                    <p className="fragmento-intro">En 2020 el mundo cambió en semanas. Nadie tenía el manual. Las organizaciones que salieron mejor paradas no fueron las que tenían más información — fueron las que podían pensar juntas bajo incertidumbre. Lo que viene con la IA es una transformación de magnitud similar. Más silenciosa. Pero igual de profunda.</p>
                    <div className="fragmento-links">
                      <span className="flink" onClick={() => toggleFragmento(setF1Open, 'mas', f1Open)}>más...</span>
                      <span className="flink" onClick={() => toggleFragmento(setF1Open, 'preguntas', f1Open)}>preguntas</span>
                    </div>
                  </div>
                  <div className={`fragmento-expandido${f1Open === 'mas' ? ' open' : ''}`}>
                    <div className="fragmento-contenido">
                      <span className="fragmento-contenido-titulo">Para quien quiere profundidad</span>
                      <p className="fragmento-texto">Sí, sucedió. Y lo vivimos todos hace apenas cinco años. Cuando se declaró la emergencia sanitaria, en una semana ya nos habíamos organizado — cada área haciendo los ajustes que le correspondían para que pudiéramos seguir operando. Sin manual. Sin que nadie lo hubiera planificado. Simplemente ocurrió.</p>
                      <p className="fragmento-texto">El COVID no fue solo una crisis sanitaria. Fue el colapso simultáneo de tres certezas:</p>
                      <ul className="fragmento-lista">
                        <li>Que el trabajo era un lugar físico</li>
                        <li>Que las decisiones importantes requerían presencia</li>
                        <li>Que el ritmo de cambio era predecible</li>
                      </ul>
                      <p className="fragmento-texto">Las tres se derrumbaron en semanas. Lo que emergió no fue tecnología — fue inteligencia colectiva. Los equipos que salieron mejor parados fueron los que tenían suficiente confianza acumulada para improvisar sin desintegrarse. Los que tenían desarrollada la capacidad de agencia.</p>
                      <p className="fragmento-texto">Lo que está llegando con la IA replica ese patrón — pero más lento y más profundo. No colapsa el cómo trabajamos. Colapsa el por qué trabajamos. Durante siglos, el trabajo fue parte central de la identidad de las personas. Cuando los agentes hagan ese trabajo, esa respuesta dejará de ser suficiente.</p>
                      <p className="fragmento-acento">¿Cuál será entonces la nueva respuesta?</p>
                    </div>
                  </div>
                  <div className={`fragmento-expandido${f1Open === 'preguntas' ? ' open' : ''}`}>
                    <div className="fragmento-contenido">
                      <span className="fragmento-contenido-titulo">Preguntas</span>
                      <p className="fragmento-pregunta">La última vez que tomaste una decisión difícil, ¿qué parte podría haber hecho un agente? ¿Y qué parte no?</p>
                      <p className="fragmento-pregunta">¿Cuánto de tu jornada de la semana pasada fue urgente? ¿Cuánto fue importante?</p>
                      <p className="fragmento-pregunta">¿Qué sabés sobre tu cliente que ningún sistema podría saber?</p>
                    </div>
                  </div>
                </div>

                {/* FRAGMENTO II */}
                <div className="fragmento">
                  <div className="fragmento-visible">
                    <span className="fragmento-num">II</span>
                    <div className="fragmento-titulo">Cuando el piso se mueve</div>
                    <div style={{ fontSize: 12, color: '#8A7E70', fontWeight: 300, marginTop: 2 }}>2 min · 6 min con profundidad</div>
                    <p className="fragmento-intro">Cada vez que la humanidad perdió las certezas que organizaban su mundo, encontró la manera de crear nuevas desde adentro. Siempre. Sin excepción. La pregunta no es si va a pasar — es qué construimos antes de que pase.</p>
                    <div className="fragmento-links">
                      <span className="flink" onClick={() => toggleFragmento(setF2Open, 'mas', f2Open)}>más...</span>
                      <span className="flink" onClick={() => toggleFragmento(setF2Open, 'preguntas', f2Open)}>preguntas</span>
                    </div>
                  </div>
                  <div className={`fragmento-expandido${f2Open === 'mas' ? ' open' : ''}`}>
                    <div className="fragmento-contenido">
                      <span className="fragmento-contenido-titulo">Para quien quiere profundidad</span>
                      <p className="fragmento-texto">Existen momentos en que las respuestas que una sociedad usa para justificar por qué algo vale la pena dejan de convencer — no porque sean falsas, sino porque el mundo cambia tanto — que las respuestas, y las preguntas que hay detrás de ellas, ya no alcanzan. A eso lo llamamos &ldquo;el vértigo de quedarse sin piso.&rdquo;</p>
                      <p className="fragmento-texto">En el siglo XIX, tres pilares que organizaban el sentido de la vida colapsaron casi simultáneamente:</p>
                      <ul className="fragmento-lista">
                        <li>La religión perdió autoridad con Darwin</li>
                        <li>La filosofía iluminista prometía progreso ilustrado — pero las revoluciones industriales mostraron trabajo infantil y miseria urbana</li>
                        <li>Los vínculos de las comunidades tradicionales se disolvieron con la urbanización masiva</li>
                      </ul>
                      <p className="fragmento-texto">Hace 150 años alguien lo nombró con precisión: Nietzsche lo documentó como diagnóstico, no como catástrofe. Y la pregunta que dejó abierta fue: ¿desde dónde construimos sentido cuando el piso se mueve?</p>
                      <p className="fragmento-texto">Hay una idea que aparece en la literatura rusa — y que Tolstoi encarnó con su vida — que los grandes desafíos son también una oportunidad: nos permiten ver con claridad lo que en los momentos tranquilos permanece invisible. Veamos qué cosas pasaron en aquel entonces:</p>
                      <ul className="fragmento-lista">
                        <li>Tolstoi abandonó su vida de aristócrata y fue a vivir con los campesinos</li>
                        <li>Los movimientos obreros inventaron nuevas formas de valor colectivo sin esperar que nadie se los diera</li>
                        <li>Las vanguardias artísticas rompieron todas las convenciones heredadas y crearon lenguajes completamente nuevos</li>
                      </ul>
                      <p className="fragmento-texto">Existe algo muy humano que se confirma una y otra vez: cuando los marcos colapsan, los humanos siempre hemos encontrado la manera de crear nuevos.</p>
                      <p className="fragmento-texto">Lo que colapsa ahora no es la religión. Es algo igualmente profundo: la centralidad del trabajo como fuente de identidad. Cuando los agentes hagan ese trabajo, la respuesta de siempre deja de alcanzar.</p>
                      <p className="fragmento-acento">Si los agentes hacen lo que hacías, ¿desde dónde construís tu valor?</p>
                    </div>
                  </div>
                  <div className={`fragmento-expandido${f2Open === 'preguntas' ? ' open' : ''}`}>
                    <div className="fragmento-contenido">
                      <span className="fragmento-contenido-titulo">Preguntas</span>
                      <p className="fragmento-pregunta">¿Cuándo fue la última vez que tu equipo llegó a algo que ninguno traía solo?</p>
                      <p className="fragmento-pregunta">¿Qué conversaciones importantes nunca quedan registradas en Quanam?</p>
                      <p className="fragmento-pregunta">Si mañana un agente hiciera el 80% de tu trabajo, ¿en qué usarías el tiempo liberado?</p>
                    </div>
                  </div>
                </div>

                {/* FRAGMENTO III */}
                <div className="fragmento">
                  <div className="fragmento-visible">
                    <span className="fragmento-num">III</span>
                    <div className="fragmento-titulo">Lo que está por encima</div>
                    <div style={{ fontSize: 12, color: '#8A7E70', fontWeight: 300, marginTop: 2 }}>2 min · 5 min con profundidad</div>
                    <p className="fragmento-intro">Antes de que cualquier sistema procese la información, algo en vos ya sabe. No es intuición mágica — es un tipo de inteligencia que la neurociencia empieza a describir y que la IA, por ahora, no puede tener.</p>
                    <div className="fragmento-links">
                      <span className="flink" onClick={() => toggleFragmento(setF3Open, 'mas', f3Open)}>más...</span>
                      <span className="flink" onClick={() => toggleFragmento(setF3Open, 'preguntas', f3Open)}>preguntas</span>
                    </div>
                  </div>
                  <div className={`fragmento-expandido${f3Open === 'mas' ? ' open' : ''}`}>
                    <div className="fragmento-contenido">
                      <span className="fragmento-contenido-titulo">Para quien quiere profundidad</span>
                      <p className="fragmento-texto">Un filósofo del siglo XVIII lo describió mejor que nadie: Kant decía que había dos cosas que lo sorprendían enormemente:</p>
                      <ul className="fragmento-lista">
                        <li>Una externa: el orden del cielo — su permanencia, su escala. Al contemplar una pintura, uno sabe que hay un pintor detrás de ella, decía él.</li>
                        <li>Una interna: algo dentro de cada persona que sabe cuándo un acto es ético o no — antes de calcularlo, antes de argumentarlo. Los neurólogos lo llaman supraconciencia. No es intuición vaga — es una capacidad que opera por encima de la conciencia ordinaria y aparece exactamente en los momentos que más importan.</li>
                      </ul>
                      <p className="fragmento-texto">Tres ejemplos concretos de lo que esa capacidad produce y ningún sistema puede replicar:</p>
                      <ul className="fragmento-lista">
                        <li>El médico que sabe que algo está mal antes de que los estudios lo confirmen</li>
                        <li>El vendedor que percibe que un cliente necesita ser escuchado antes de ser resuelto</li>
                        <li>El responsable de una decisión que siente que el momento no está maduro aunque todos los indicadores digan que sí</li>
                      </ul>
                      <p className="fragmento-acento">Eso no es dato. Es juicio situado. Y vive en cada persona y equipo de Quanam — distribuido, latente, esperando las condiciones correctas para volverse visible y multiplicarse.</p>
                    </div>
                  </div>
                  <div className={`fragmento-expandido${f3Open === 'preguntas' ? ' open' : ''}`}>
                    <div className="fragmento-contenido">
                      <span className="fragmento-contenido-titulo">Preguntas</span>
                      <p className="fragmento-pregunta">¿Cuándo fue la última vez que una conversación cambió genuinamente tu forma de ver un problema?</p>
                      <p className="fragmento-pregunta">¿Para qué te llamaría tu cliente si pudiera llamarle a un agente para todo lo demás?</p>
                      <p className="fragmento-pregunta">¿Qué es lo que hacés que no podrías explicarle a un sistema?</p>
                    </div>
                  </div>
                </div>

          </div>}

          {/* SECCIÓN 2 */}
          <div className={`seccion${sec2Open ? ' open' : ''}`}>
            <div className="seccion-header" onClick={() => setSec2Open(v => !v)}>
              <div className="seccion-header-left">
                <span className="seccion-etiqueta">la convocatoria</span>
                <span className="seccion-titulo">¿Qué ves vos desde donde estás?</span>
              </div>
              <span className="seccion-flecha">›</span>
            </div>
            <div className="seccion-body">
              <div className="lentes-intro">
                <p className="lentes-sub">Elegí uno o varios lentes y describí lo que ves — o lo que imaginarías ver — desde ahí.</p>
              </div>
              <div className="lentes-lista">
                {LENTES.map(lente => {
                  const ls = lenteStates[lente.id]
                  return (
                    <div key={lente.id} className={`lente${ls.open ? ' open' : ''}`}>
                      <div className="lente-header" onClick={() => toggleLente(lente.id)}>
                        <div className="lente-header-left">
                          <span className="lente-nombre">{lente.nombre}</span>
                          <span className="lente-frase">{lente.frase}</span>
                        </div>
                        <span className="lente-flecha">›</span>
                      </div>
                      <div className="lente-body">
                        <div className="lente-contenido">
                          {lente.desc.split('\n').map((line, i) => (
                            <p key={i} className="lente-desc" style={i > 0 ? { marginTop: 8 } : undefined}>{line}</p>
                          ))}
                          {lente.ejemplo && <p className="lente-ejemplo">{lente.ejemplo}</p>}

                          {/* FORM */}
                          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 10 }} onClick={e => e.stopPropagation()}>
                            {!ls.showDuende ? (
                              <>
                                <textarea
                                  value={ls.respuesta}
                                  onChange={e => setRespuesta(lente.id, e.target.value)}
                                  placeholder={`Tu respuesta desde "${lente.nombre}"…`}
                                  rows={4}
                                  style={{ width: '100%', border: '1px solid rgba(139,105,20,0.2)', borderRadius: 8, padding: '12px 14px', fontSize: 15, fontFamily: 'Karla, sans-serif', fontWeight: 300, color: '#2C2820', background: 'rgba(245,240,232,0.5)', resize: 'vertical', outline: 'none', lineHeight: 1.7 }}
                                />
                                <button
                                  onClick={() => {
                                    if (!ls.respuesta.trim()) return
                                    setLenteStates(prev => ({ ...prev, [lente.id]: { ...prev[lente.id], showDuende: true } }))
                                  }}
                                  disabled={!ls.respuesta.trim()}
                                  style={{ alignSelf: 'flex-start', background: ls.respuesta.trim() ? '#8B6914' : 'rgba(139,105,20,0.3)', color: '#F5EDD8', border: 'none', borderRadius: 8, padding: '10px 22px', fontSize: 13, fontFamily: 'Karla, sans-serif', fontWeight: 500, letterSpacing: '0.06em', cursor: ls.respuesta.trim() ? 'pointer' : 'default', transition: 'background 0.2s' }}
                                >
                                  Enviar al Duende
                                </button>
                              </>
                            ) : (
                              <DuendeChat lente={lente} mensajeInicial={ls.respuesta} nombre={nombre} email={email} autoAbrir={true} />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

        </div>

        {/* CÓMO SE FORMA EL GRUPO */}
        <div style={{ borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)', padding: '48px 0', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <span style={{ fontSize: 11, letterSpacing: '0.26em', textTransform: 'uppercase', fontWeight: 500, color: 'var(--goldlt)' }}>cómo se forma el grupo</span>
          <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontStyle: 'italic', fontWeight: 400, color: 'var(--gold)', lineHeight: 1.45 }}>No hay un perfil buscado. Hay una búsqueda.</p>
          <p style={{ fontSize: 16, color: 'var(--inklt)', fontWeight: 300, lineHeight: 2, fontFamily: 'Karla, sans-serif' }}>Las respuestas que lleguen van a ser leídas antes de saber quién las escribió. Se va a buscar diversidad de enfoques — no jerarquías, no áreas, no seniority. Una vez identificadas las respuestas que juntas cubran el campo más amplio de miradas, se va a convocar a las personas que las formularon.</p>
          <p style={{ fontSize: 16, color: 'var(--inklt)', fontWeight: 300, lineHeight: 2, fontFamily: 'Karla, sans-serif' }}>Podés responder con una pregunta, una incomodidad, una intuición, un desafío, una opinión. No hay respuesta correcta ni incorrecta. No hay límite de cantidad — si algo más te surge, respondé otro lente. O el mismo desde otro ángulo.</p>
          <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontStyle: 'italic', fontWeight: 400, color: 'var(--gold)', lineHeight: 1.55, textAlign: 'center', marginTop: 24 }}>Lo que importa es lo que ves desde donde estás.</p>
        </div>

        {/* CIERRE */}
        <div className="cierre">
          <p className="cierre-texto">La inteligencia genuina no se construye acumulando información. Emerge cuando se crean las condiciones para que aparezca. Eso es lo que estamos invitando a construir.</p>
          <p className="cierre-sub">Entre 5 y 8 semanas. Un grupo de entre 15 y 20 personas. Encuentros que no gestionan el presente — exploran el futuro. <strong>Dentro de ese tiempo, Quanam puede saber cosas de sí misma que hoy no sabe que sabe. Eso empieza con una respuesta tuya.</strong></p>
        </div>

        <div className="colophon">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span className="col-marca">Quanam</span>
            <span className="col-meta">Por este camino 2026</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, textAlign: 'right' }}>
            <span className="col-meta">Inteligencia Humana Aumentada</span>
            <span className="col-meta">Inteligencia Colectiva potenciada por la IA</span>
          </div>
        </div>

      </div>

      {/* PESTAÑA + DRAWER — contexto */}
      {!bienvenida && (
        <>
          {/* OVERLAY */}
          {drawerOpen && (
            <div
              onClick={() => setDrawerOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.15)' }}
            />
          )}

          {/* PESTAÑA VERTICAL */}
          <div
            onClick={() => setDrawerOpen(true)}
            style={{
              position: 'fixed', right: 0, top: '50%', transform: 'translateY(-50%)',
              zIndex: 70, width: 40, height: 120,
              background: '#FFFFFF',
              borderLeft: '1px solid rgba(139,105,20,0.15)',
              borderTop: '1px solid rgba(139,105,20,0.15)',
              borderBottom: '1px solid rgba(139,105,20,0.15)',
              borderRadius: '8px 0 0 8px',
              alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              display: drawerOpen ? 'none' : 'flex',
            }}
          >
            <span style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8A7E70', writingMode: 'vertical-rl', transform: 'rotate(180deg)', whiteSpace: 'nowrap', userSelect: 'none', padding: '8px 0' }}>contexto</span>
          </div>

          {/* DRAWER */}
          <div
            style={{
              position: 'fixed', top: 0, right: 0, height: '100vh', width: 420,
              zIndex: 70,
              background: '#FFFFFF',
              boxShadow: '-4px 0 24px rgba(0,0,0,0.10)',
              transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)',
              transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
              display: 'flex', flexDirection: 'column',
              overflowY: 'auto',
            }}
          >
            {/* CABECERA */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 32px 0' }}>
              <p style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C4941A', fontWeight: 500, margin: 0 }}>el mapa del momento</p>
              <button onClick={() => setDrawerOpen(false)} style={{ background: 'none', border: 'none', fontSize: 22, color: '#C4941A', cursor: 'pointer', lineHeight: 1, padding: '0 0 0 16px', flexShrink: 0 }}>×</button>
            </div>

            {/* CONTENIDO */}
            <div style={{ padding: '16px 32px 40px', display: 'flex', flexDirection: 'column' }}>

              {/* NIVEL 1 — SECCIÓN A */}
              <div style={{ borderBottom: '1px solid rgba(139,105,20,0.18)' }}>
                <div onClick={() => setDrawerSec1Open(v => !v)} style={{ padding: '18px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, fontStyle: 'italic', color: '#8B6914', lineHeight: 1.35, margin: 0 }}>Tres veces que el piso se movió</p>
                  <span style={{ fontSize: 16, color: '#C4941A', fontWeight: 300, flexShrink: 0, marginLeft: 12 }}>{drawerSec1Open ? '−' : '+'}</span>
                </div>
                {drawerSec1Open && (
                  <div style={{ paddingBottom: 8 }}>

                    {/* SUB F1 */}
                    <div style={{ borderTop: '1px solid rgba(139,105,20,0.10)' }}>
                      <div onClick={() => setDF1Open(v => !v)} style={{ padding: '13px 0 8px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 500, color: '#2C2820' }}>El río que cambió de curso</span>
                        <span style={{ fontSize: 14, color: '#C4941A', fontWeight: 300, flexShrink: 0 }}>{dF1Open ? '−' : '+'}</span>
                      </div>
                      {dF1Open && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 16 }}>
                          <p style={{ fontSize: 13, color: '#6A5E50', lineHeight: 1.75, fontWeight: 300 }}>En 2020 el mundo cambió en semanas. Las organizaciones que salieron mejor paradas fueron las que podían pensar juntas bajo incertidumbre. Lo que viene con la IA es una transformación de magnitud similar. Más silenciosa. Pero igual de profunda.</p>
                          <button onClick={e => { e.stopPropagation(); setDF1Prof(v => !v) }} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', padding: 0, fontSize: 12, color: '#C4941A', fontWeight: 500, cursor: 'pointer', letterSpacing: '0.04em' }}>{dF1Prof ? '— menos' : '+ Profundizar'}</button>
                          {dF1Prof && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                              <p style={{ fontSize: 13, color: '#6A5E50', lineHeight: 1.75, fontWeight: 300 }}>El COVID fue el colapso simultáneo de tres certezas: que el trabajo era un lugar físico, que las decisiones importantes requerían presencia, que el ritmo de cambio era predecible. Lo que emergió no fue tecnología — fue inteligencia colectiva.</p>
                              <p style={{ fontSize: 13, color: '#6A5E50', lineHeight: 1.75, fontWeight: 300 }}>Lo que está llegando con la IA replica ese patrón — pero más lento y más profundo. No colapsa el cómo trabajamos. Colapsa el por qué trabajamos. Cuando los agentes hagan ese trabajo, la respuesta de siempre dejará de ser suficiente.</p>
                              <p style={{ fontSize: 13, color: '#8B6914', fontStyle: 'italic', lineHeight: 1.65, fontFamily: 'Playfair Display, serif' }}>¿Cuál será entonces la nueva respuesta?</p>
                              <p style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#8A7E70', fontWeight: 500 }}>Pregunta orientadora</p>
                              <p style={{ fontSize: 12, color: '#6A5E50', lineHeight: 1.7, fontWeight: 300, paddingLeft: 12, borderLeft: '2px solid rgba(232,201,106,0.4)' }}>La última vez que tomaste una decisión difícil, ¿qué parte podría haber hecho un agente? ¿Y qué parte no?</p>
                              <p style={{ fontSize: 12, color: '#6A5E50', lineHeight: 1.7, fontWeight: 300, paddingLeft: 12, borderLeft: '2px solid rgba(232,201,106,0.4)' }}>¿Cuánto de tu jornada de la semana pasada fue urgente? ¿Cuánto fue importante?</p>
                              <p style={{ fontSize: 12, color: '#6A5E50', lineHeight: 1.7, fontWeight: 300, paddingLeft: 12, borderLeft: '2px solid rgba(232,201,106,0.4)' }}>¿Qué sabés sobre tu cliente que ningún sistema podría saber?</p>
                              <DuendeFragmento fragmentoId="f1" titulo="El río que cambió de curso" contexto="En 2020 el mundo cambió en semanas. Lo que viene con la IA replica ese patrón — más lento y más profundo. No colapsa el cómo trabajamos. Colapsa el por qué trabajamos. Cuando los agentes hagan ese trabajo, la respuesta de siempre dejará de ser suficiente." nombre={nombre} email={email} />
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* SUB F2 */}
                    <div style={{ borderTop: '1px solid rgba(139,105,20,0.10)' }}>
                      <div onClick={() => setDF2Open(v => !v)} style={{ padding: '13px 0 8px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 500, color: '#2C2820' }}>Cuando el piso se mueve</span>
                        <span style={{ fontSize: 14, color: '#C4941A', fontWeight: 300, flexShrink: 0 }}>{dF2Open ? '−' : '+'}</span>
                      </div>
                      {dF2Open && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 16 }}>
                          <p style={{ fontSize: 13, color: '#6A5E50', lineHeight: 1.75, fontWeight: 300 }}>Cada vez que la humanidad perdió las certezas que organizaban su mundo, encontró la manera de crear nuevas desde adentro. Siempre. Sin excepción. La pregunta no es si va a pasar — es qué construimos antes de que pase.</p>
                          <button onClick={e => { e.stopPropagation(); setDF2Prof(v => !v) }} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', padding: 0, fontSize: 12, color: '#C4941A', fontWeight: 500, cursor: 'pointer', letterSpacing: '0.04em' }}>{dF2Prof ? '— menos' : '+ Profundizar'}</button>
                          {dF2Prof && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                              <p style={{ fontSize: 13, color: '#6A5E50', lineHeight: 1.75, fontWeight: 300 }}>En el siglo XIX colapsaron tres pilares simultáneamente: la religión perdió autoridad con Darwin, la filosofía iluminista prometía progreso pero las revoluciones industriales mostraron miseria, y los vínculos comunitarios se disolvieron con la urbanización. Nietzsche lo documentó como diagnóstico, no catástrofe.</p>
                              <p style={{ fontSize: 13, color: '#6A5E50', lineHeight: 1.75, fontWeight: 300 }}>Tolstoi fue a vivir con los campesinos. Los movimientos obreros inventaron nuevas formas de valor colectivo. Las vanguardias artísticas crearon lenguajes completamente nuevos.<br /><br />Lo que colapsa ahora es la centralidad del trabajo como fuente de identidad.</p>
                              <p style={{ fontSize: 13, color: '#8B6914', fontStyle: 'italic', lineHeight: 1.65, fontFamily: 'Playfair Display, serif' }}>Si los agentes hacen lo que hacías, ¿desde dónde construís tu valor?</p>
                              <p style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#8A7E70', fontWeight: 500 }}>Pregunta orientadora</p>
                              <p style={{ fontSize: 12, color: '#6A5E50', lineHeight: 1.7, fontWeight: 300, paddingLeft: 12, borderLeft: '2px solid rgba(232,201,106,0.4)' }}>¿Cuándo fue la última vez que tu equipo llegó a algo que ninguno traía solo?</p>
                              <p style={{ fontSize: 12, color: '#6A5E50', lineHeight: 1.7, fontWeight: 300, paddingLeft: 12, borderLeft: '2px solid rgba(232,201,106,0.4)' }}>¿Qué conversaciones importantes nunca quedan registradas en Quanam?</p>
                              <p style={{ fontSize: 12, color: '#6A5E50', lineHeight: 1.7, fontWeight: 300, paddingLeft: 12, borderLeft: '2px solid rgba(232,201,106,0.4)' }}>Si mañana un agente hiciera el 80% de tu trabajo, ¿en qué usarías el tiempo liberado?</p>
                              <DuendeFragmento fragmentoId="f2" titulo="Cuando el piso se mueve" contexto="Cada vez que la humanidad perdió las certezas que organizaban su mundo, encontró la manera de crear nuevas desde adentro. Lo que colapsa ahora es la centralidad del trabajo como fuente de identidad. Si los agentes hacen lo que hacías, ¿desde dónde construís tu valor?" nombre={nombre} email={email} />
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* SUB F3 */}
                    <div style={{ borderTop: '1px solid rgba(139,105,20,0.10)', marginBottom: 8 }}>
                      <div onClick={() => setDF3Open(v => !v)} style={{ padding: '13px 0 8px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 500, color: '#2C2820' }}>Lo que está por encima</span>
                        <span style={{ fontSize: 14, color: '#C4941A', fontWeight: 300, flexShrink: 0 }}>{dF3Open ? '−' : '+'}</span>
                      </div>
                      {dF3Open && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 16 }}>
                          <p style={{ fontSize: 13, color: '#6A5E50', lineHeight: 1.75, fontWeight: 300 }}>Antes de que cualquier sistema procese la información, algo en vos ya sabe. No es intuición mágica — es un tipo de inteligencia que la neurociencia empieza a describir y que la IA, por ahora, no puede tener.</p>
                          <button onClick={e => { e.stopPropagation(); setDF3Prof(v => !v) }} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', padding: 0, fontSize: 12, color: '#C4941A', fontWeight: 500, cursor: 'pointer', letterSpacing: '0.04em' }}>{dF3Prof ? '— menos' : '+ Profundizar'}</button>
                          {dF3Prof && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                              <p style={{ fontSize: 13, color: '#6A5E50', lineHeight: 1.75, fontWeight: 300 }}>Kant decía que había dos cosas que lo sorprendían: el orden del cielo, y algo dentro de cada persona que sabe cuándo un acto es ético antes de calcularlo.</p>
                              <p style={{ fontSize: 13, color: '#6A5E50', lineHeight: 1.75, fontWeight: 300 }}>Hoy la neurociencia lo describe como un procesamiento no consciente e integrado, en el que múltiples sistemas —cerebrales y corporales— participan en la toma de decisiones antes de que aparezca el pensamiento deliberativo.</p>
                              <p style={{ fontSize: 13, color: '#6A5E50', lineHeight: 1.75, fontWeight: 300 }}>El médico que percibe que algo no está bien antes de que los estudios lo confirmen. El vendedor que siente que un cliente necesita ser escuchado antes de ser resuelto. El responsable que reconoce que el momento no está maduro, aunque todos los indicadores digan que sí.</p>
                              <p style={{ fontSize: 13, color: '#8B6914', fontStyle: 'italic', lineHeight: 1.65, fontFamily: 'Playfair Display, serif' }}>Eso no es dato: es juicio situado. Un tipo de procesamiento integrado, presente en cada persona y equipo de Quanam — distribuido, latente, esperando las condiciones adecuadas para hacerse visible.</p>
                              <p style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#8A7E70', fontWeight: 500 }}>Pregunta orientadora</p>
                              <p style={{ fontSize: 12, color: '#6A5E50', lineHeight: 1.7, fontWeight: 300, paddingLeft: 12, borderLeft: '2px solid rgba(232,201,106,0.4)' }}>¿Cuándo fue la última vez que una conversación cambió genuinamente tu forma de ver un problema?</p>
                              <p style={{ fontSize: 12, color: '#6A5E50', lineHeight: 1.7, fontWeight: 300, paddingLeft: 12, borderLeft: '2px solid rgba(232,201,106,0.4)' }}>¿Para qué te llamaría tu cliente si pudiera llamarle a un agente para todo lo demás?</p>
                              <p style={{ fontSize: 12, color: '#6A5E50', lineHeight: 1.7, fontWeight: 300, paddingLeft: 12, borderLeft: '2px solid rgba(232,201,106,0.4)' }}>¿Qué es lo que hacés que no podrías explicarle a un sistema?</p>
                              <DuendeFragmento fragmentoId="f3" titulo="Lo que está por encima" contexto="Antes de que cualquier sistema procese la información, algo en vos ya sabe. No es intuición mágica — es juicio situado. Un tipo de procesamiento integrado que la IA, por ahora, no puede tener. El médico que percibe que algo no está bien antes de que los estudios lo confirmen." nombre={nombre} email={email} />
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                  </div>
                )}
              </div>

              {/* NIVEL 1 — SECCIÓN MID */}
              <div style={{ borderBottom: '1px solid rgba(139,105,20,0.18)' }}>
                <div onClick={() => setDrawerSecMidOpen(v => !v)} style={{ padding: '18px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, fontStyle: 'italic', color: '#8B6914', lineHeight: 1.35, margin: 0 }}>Y en cada caso, quedó algo más</p>
                  <span style={{ fontSize: 16, color: '#C4941A', fontWeight: 300, flexShrink: 0, marginLeft: 12 }}>{drawerSecMidOpen ? '−' : '+'}</span>
                </div>
                {drawerSecMidOpen && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 24 }}>
                    {[
                      {
                        label: 'Siglo XIX',
                        text: 'Tolstoi fue a vivir con los campesinos. Los movimientos obreros inventaron nuevas formas de valor colectivo. Las vanguardias crearon lenguajes que antes no existían. La humanidad no encontró las respuestas en los sistemas que colapsaban — las construyó desde el entre.',
                      },
                      {
                        label: '2020',
                        text: 'Lo que emergió no fue tecnología — fue inteligencia colectiva. Las organizaciones que salieron mejor paradas fueron las que aprendieron a pensar juntas bajo incertidumbre.',
                      },
                      {
                        label: 'Ahora',
                        text: 'Todavía está emergiendo. Pero el patrón sugiere que lo que quedará no será lo que los agentes puedan hacer solos — sino lo que emerge cuando humanos y agentes piensan juntos. Sin los humanos, los agentes no tienen hacia dónde ir.',
                      },
                    ].map(({ label, text }) => (
                      <div key={label} style={{ paddingLeft: 14, borderLeft: '2px solid rgba(196,148,26,0.35)' }}>
                        <p style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C4941A', fontWeight: 500, margin: '0 0 6px' }}>{label}</p>
                        <p style={{ fontSize: 13, color: '#6A5E50', lineHeight: 1.75, fontWeight: 300, margin: 0 }}>{text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* NIVEL 1 — SECCIÓN B */}
              <div style={{ borderBottom: '1px solid rgba(139,105,20,0.18)' }}>
                <div onClick={() => setDrawerSec2Open(v => !v)} style={{ padding: '18px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, fontStyle: 'italic', color: '#8B6914', lineHeight: 1.35, margin: 0 }}>¿Desde dónde se diseñó esto?</p>
                  <span style={{ fontSize: 16, color: '#C4941A', fontWeight: 300, flexShrink: 0, marginLeft: 12 }}>{drawerSec2Open ? '−' : '+'}</span>
                </div>
                {drawerSec2Open && (
                  <div style={{ paddingBottom: 8 }}>

                    {/* SUB F4 */}
                    <div style={{ borderTop: '1px solid rgba(139,105,20,0.10)', marginBottom: 8 }}>
                      <div onClick={() => setDF4Open(v => !v)} style={{ padding: '13px 0 8px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 500, color: '#2C2820' }}>El Paradigma Aleph</span>
                        <span style={{ fontSize: 14, color: '#C4941A', fontWeight: 300, flexShrink: 0 }}>{dF4Open ? '−' : '+'}</span>
                      </div>
                      {dF4Open && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 16 }}>
                          <p style={{ fontSize: 13, color: '#6A5E50', lineHeight: 1.75, fontWeight: 300 }}>Esta convocatoria se construyó desde el Paradigma Aleph — un marco teórico-práctico para la emergencia de inteligencia colectiva, desarrollado a lo largo de más de una década.</p>
                          <button onClick={e => { e.stopPropagation(); setDF4Prof(v => !v) }} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', padding: 0, fontSize: 12, color: '#C4941A', fontWeight: 500, cursor: 'pointer', letterSpacing: '0.04em' }}>{dF4Prof ? '— menos' : '+ Profundizar'}</button>
                          {dF4Prof && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                              <p style={{ fontSize: 13, color: '#6A5E50', lineHeight: 1.75, fontWeight: 300 }}>El Paradigma Aleph no es una metodología. Es una forma de leer cómo los sistemas vivos piensan juntos — y qué condiciones hacen falta para que eso ocurra. El paradigma tiene un origen distribuido: emergió en múltiples redes. Quanam lo integra, siendo parte de su evolución desde los inicios.</p>
                              <p style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#8A7E70', fontWeight: 500 }}>Pregunta orientadora</p>
                              <p style={{ fontSize: 12, color: '#6A5E50', lineHeight: 1.7, fontWeight: 300, paddingLeft: 12, borderLeft: '2px solid rgba(232,201,106,0.4)' }}>¿Qué condiciones harían falta en Quanam para que la inteligencia colectiva emerja como propiedad del sistema?</p>
                              <DuendeFragmento fragmentoId="f4" titulo="El Paradigma Aleph" contexto="Esta convocatoria se construyó desde el Paradigma Aleph — un marco teórico-práctico para la emergencia de inteligencia colectiva. No es una metodología. Es una forma de leer cómo los sistemas vivos piensan juntos y qué condiciones hacen falta para que eso ocurra." nombre={nombre} email={email} />
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* SUB F5 — Líneas de exploración */}
                    <div style={{ borderTop: '1px solid rgba(139,105,20,0.10)', marginBottom: 8 }}>
                      <div onClick={() => setDF5Open(v => !v)} style={{ padding: '13px 0 8px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 500, color: '#2C2820' }}>Líneas de exploración abiertas</span>
                        <span style={{ fontSize: 14, color: '#C4941A', fontWeight: 300, flexShrink: 0 }}>{dF5Open ? '−' : '+'}</span>
                      </div>
                      {dF5Open && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 16 }}>
                          <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {[
                              'Varios equipos de Quanam',
                              'En una ONG',
                              'En una institución educativa que presentará la Inteligencia Humana Aumentada en el Congreso Mundial IAC 2026 (Punta del Este)',
                              'Diversos grupos de trabajo internacionales que exploran la Inteligencia Colectiva',
                              'Existen en este momento varias propuestas para la implementación de esta IHA',
                            ].map((item, i) => (
                              <li key={i} style={{ fontSize: 12, color: '#6A5E50', lineHeight: 1.7, fontWeight: 300 }}>{item}</li>
                            ))}
                          </ul>

                          <DuendeFragmento fragmentoId="f5" titulo="Líneas de exploración abiertas" contexto="El Paradigma Aleph se está aplicando en este momento en varios equipos de Quanam, una ONG, una institución educativa que presentará en el Congreso Mundial IAC 2026, y grupos internacionales que exploran la Inteligencia Colectiva." nombre={nombre} email={email} />

                          <div style={{ borderTop: '1px solid rgba(139,105,20,0.10)', marginTop: 4, paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <p style={{ fontSize: 12, color: '#6A5E50', lineHeight: 1.65, fontWeight: 300 }}>Si querés conversar sobre estas iniciativas, dejá tu mensaje acá</p>
                            <textarea
                              value={contactMsg}
                              onChange={e => setContactMsg(e.target.value)}
                              placeholder="Tu mensaje…"
                              rows={3}
                              style={{ width: '100%', border: '1px solid rgba(139,105,20,0.2)', borderRadius: 8, padding: '10px 12px', fontSize: 12, fontFamily: 'Karla, sans-serif', fontWeight: 300, color: '#2C2820', background: 'rgba(245,240,232,0.4)', resize: 'vertical', outline: 'none', lineHeight: 1.6 }}
                            />
                            {contactStatus !== 'sent' && (
                              <button
                                onClick={async e => {
                                  e.stopPropagation()
                                  if (!contactMsg.trim() || contactStatus === 'sending') return
                                  setContactStatus('sending')
                                  try {
                                    const res = await fetch('/api/aleph-contacto', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ nombre, email, mensaje: contactMsg.trim(), origen: 'Líneas de exploración abiertas' }),
                                    })
                                    setContactStatus(res.ok ? 'sent' : 'error')
                                  } catch {
                                    setContactStatus('error')
                                  }
                                }}
                                disabled={!contactMsg.trim() || contactStatus === 'sending'}
                                style={{ alignSelf: 'flex-start', background: contactMsg.trim() ? '#8B6914' : 'rgba(139,105,20,0.3)', color: '#F5EDD8', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 11, fontFamily: 'Karla, sans-serif', fontWeight: 500, letterSpacing: '0.06em', cursor: contactMsg.trim() ? 'pointer' : 'default', transition: 'background 0.2s' }}
                              >
                                {contactStatus === 'sending' ? 'Enviando…' : 'Enviar mensaje'}
                              </button>
                            )}
                            {contactStatus === 'sent' && <p style={{ fontSize: 12, color: '#8B6914', fontStyle: 'italic', lineHeight: 1.65 }}>Tu mensaje fue enviado. Gracias.</p>}
                            {contactStatus === 'error' && <p style={{ fontSize: 12, color: '#c0392b', lineHeight: 1.65 }}>Hubo un error. Intentá de nuevo.</p>}
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                )}
              </div>

            </div>
          </div>
        </>
      )}
    </>
  )
}
