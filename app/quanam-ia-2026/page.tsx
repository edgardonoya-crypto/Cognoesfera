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
    ejemplo: '"¿Cómo hacemos para que el conocimiento de los que se van no desaparezca?"',
  },
  {
    id: 'intuicion',
    nombre: 'La intuición central',
    frase: '"Tengo la corazonada de que el valor real está en…"',
    desc: 'Una corazonada sobre dónde está el valor real. No hace falta demostrarla — hace falta nombrarla.',
    ejemplo: '"El valor de la IA no está en la eficiencia sino en la posibilidad de liberar tiempo para las interrelaciones…"',
  },
  {
    id: 'hilo',
    nombre: 'El hilo conector',
    frase: '"¿Qué pasaría si dos áreas que nunca dialogaron pudieran construir algo juntas?"',
    desc: 'Una conexión que nadie hizo todavía entre dos "cosas" que parecen separadas dentro de Quanam. La conversación es un acto relacional; la activación de una red de inteligencia colectiva',
    ejemplo: '"¿Qué pasaría si dos áreas de Quanam que actualmente no tienen diálogo fluido pudieran construir algo juntas?"',
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

function DuendeContextoBtn() {
  const [msg, setMsg] = useState(false)
  return (
    <div>
      <button
        onClick={() => setMsg(v => !v)}
        style={{ background: 'transparent', border: '1px solid rgba(139,105,20,0.4)', borderRadius: 8, padding: '8px 16px', fontSize: 12, fontFamily: 'Karla, sans-serif', fontWeight: 500, color: '#8B6914', letterSpacing: '0.04em', cursor: 'pointer' }}
      >
        Pedile ayuda al Duende
      </button>
      {msg && <p style={{ marginTop: 10, fontSize: 13, color: '#8A7E70', fontStyle: 'italic', lineHeight: 1.65 }}>El Duende está en construcción — pronto vas a poder explorar el contexto con él.</p>}
    </div>
  )
}

type FragmentoKey = 'mas' | 'preguntas' | null

export default function QuanamIa2026() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  const [bienvenida, setBienvenida] = useState(true)
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [dF1Open, setDF1Open] = useState<FragmentoKey>(null)
  const [dF2Open, setDF2Open] = useState<FragmentoKey>(null)
  const [dF3Open, setDF3Open] = useState<FragmentoKey>(null)
  const [dF1Duende, setDF1Duende] = useState(false)
  const [dF2Duende, setDF2Duende] = useState(false)
  const [dF3Duende, setDF3Duende] = useState(false)
  const [sec2Open, setSec2Open] = useState(false)
  const [f1Open, setF1Open] = useState<FragmentoKey>(null)
  const [f2Open, setF2Open] = useState<FragmentoKey>(null)
  const [f3Open, setF3Open] = useState<FragmentoKey>(null)

  const [lenteStates, setLenteStates] = useState<Record<string, LenteState>>(
    Object.fromEntries(
      LENTES.map(l => [l.id, { open: false, respuesta: '', status: 'idle', errorMsg: '', showDuende: false }])
    )
  )

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
    if (!nombre.trim()) {
      setLenteStates(prev => ({ ...prev, [lente.id]: { ...prev[lente.id], status: 'error', errorMsg: 'Completá tu nombre arriba antes de responder.' } }))
      return
    }
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
            <p style={{ fontSize: 12, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#C4941A', fontWeight: 500, fontFamily: 'Karla, sans-serif' }}>Convocatoria · Por este camino 2026</p>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px,5vw,44px)', fontWeight: 400, lineHeight: 1.18, letterSpacing: '-0.02em', color: '#C4941A', margin: 0 }}>
              Lo que se va.<br />Lo que permanece.<br />Lo que podemos construir.
            </h1>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.80)', fontWeight: 300, fontFamily: 'Karla, sans-serif', lineHeight: 1.7, textAlign: 'center' }}>Entre 5 y 8 semanas. Un grupo de entre 15 y 20 personas. Encuentros que no gestionan el presente — exploran el futuro.</p>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
              <input
                type="text"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                placeholder="Tu nombre"
                style={{ width: '100%', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(196,148,26,0.5)', borderRadius: 10, padding: '14px 18px', fontSize: 16, fontFamily: 'Karla, sans-serif', fontWeight: 300, color: '#fff', outline: 'none', textAlign: 'center' }}
              />
              <p style={{ fontSize: 12, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#C4941A', fontWeight: 500, fontFamily: 'Karla, sans-serif', marginTop: 4 }}>Tu email</p>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Para poder contactarte si queremos profundizar (opcional)"
                style={{ width: '100%', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(196,148,26,0.3)', borderRadius: 10, padding: '14px 18px', fontSize: 15, fontFamily: 'Karla, sans-serif', fontWeight: 300, color: 'rgba(255,255,255,0.8)', outline: 'none', textAlign: 'center' }}
              />
              <button
                onClick={() => { if (nombre.trim()) setBienvenida(false) }}
                disabled={!nombre.trim()}
                style={{ marginTop: 4, background: nombre.trim() ? '#8B6914' : 'rgba(139,105,20,0.35)', color: '#F5EDD8', border: 'none', borderRadius: 10, padding: '14px 32px', fontSize: 15, fontFamily: 'Karla, sans-serif', fontWeight: 500, letterSpacing: '0.08em', cursor: nombre.trim() ? 'pointer' : 'default', transition: 'background 0.2s' }}
              >
                Ingresar
              </button>
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
        .col-marca { font-family: 'Playfair Display', serif; font-size: 15px; font-style: italic; color: var(--goldlt); }
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
                    <p className="fragmento-intro">Hay algo en cada persona que sabe antes de calcular. Antes de que ningún sistema pueda procesarlo. Eso es exactamente lo que la IA no puede tener.</p>
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
                <span className="seccion-titulo">¿Te sumás?</span>
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
                          <p className="lente-desc">{lente.desc}</p>
                          <p className="lente-ejemplo">{lente.ejemplo}</p>

                          {/* FORM */}
                          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 10 }} onClick={e => e.stopPropagation()}>
                            <textarea
                              value={ls.respuesta}
                              onChange={e => setRespuesta(lente.id, e.target.value)}
                              placeholder={`Tu respuesta desde "${lente.nombre}"…`}
                              rows={4}
                              style={{ width: '100%', border: '1px solid rgba(139,105,20,0.2)', borderRadius: 8, padding: '12px 14px', fontSize: 15, fontFamily: 'Karla, sans-serif', fontWeight: 300, color: '#2C2820', background: 'rgba(245,240,232,0.5)', resize: 'vertical', outline: 'none', lineHeight: 1.7 }}
                            />
                            <div>
                              <button
                                onClick={() => setLenteStates(prev => ({ ...prev, [lente.id]: { ...prev[lente.id], showDuende: !prev[lente.id].showDuende } }))}
                                style={{ background: 'transparent', border: '1px solid rgba(139,105,20,0.4)', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontFamily: 'Karla, sans-serif', fontWeight: 500, color: '#8B6914', letterSpacing: '0.04em', cursor: 'pointer' }}
                              >
                                Pedile ayuda al Duende
                              </button>
                              {ls.showDuende && (
                                <p style={{ marginTop: 8, fontSize: 13, color: '#8A7E70', fontStyle: 'italic', lineHeight: 1.65 }}>El Duende está en construcción — pronto vas a poder explorar este lente con él.</p>
                              )}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                              <button
                                onClick={() => enviar(lente)}
                                disabled={ls.status === 'sending'}
                                style={{ background: '#8B6914', color: '#F5EDD8', border: 'none', borderRadius: 8, padding: '10px 22px', fontSize: 13, fontFamily: 'Karla, sans-serif', fontWeight: 500, letterSpacing: '0.06em', cursor: ls.status === 'sending' ? 'default' : 'pointer', opacity: ls.status === 'sending' ? 0.7 : 1, transition: 'opacity 0.2s' }}
                              >
                                {ls.status === 'sending' ? 'Enviando…' : 'Enviar respuesta'}
                              </button>
                              {ls.status === 'sent' && (
                                <span style={{ fontSize: 14, color: '#4A8C5C', fontWeight: 500 }}>✓ Respuesta enviada</span>
                              )}
                              {ls.status === 'error' && (
                                <span style={{ fontSize: 13, color: '#B85C38', fontWeight: 400 }}>{ls.errorMsg}</span>
                              )}
                            </div>
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
          <span className="col-marca">Por este camino 2026</span>
          <span className="col-meta">Quanam · Inteligencia Colectiva + IA</span>
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
              <div>
                <p style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C4941A', fontWeight: 500, marginBottom: 4 }}>el mapa del momento</p>
                <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontStyle: 'italic', color: '#8B6914', lineHeight: 1.35 }}>Tres veces que el piso se movió</p>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: 22, color: '#C4941A', cursor: 'pointer', lineHeight: 1, padding: '0 0 0 16px', flexShrink: 0 }}
              >×</button>
            </div>

            {/* CONTENIDO */}
            <div style={{ padding: '24px 32px 40px', display: 'flex', flexDirection: 'column', gap: 0 }}>

              {/* FRAGMENTO I */}
              <div style={{ borderBottom: '1px solid rgba(139,105,20,0.12)' }}>
                <div
                  onClick={() => setDF1Open(dF1Open === 'mas' ? null : 'mas')}
                  style={{ padding: '18px 0', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 4 }}
                >
                  <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 11, fontStyle: 'italic', color: '#C4941A' }}>I</span>
                  <span style={{ fontSize: 15, fontWeight: 500, color: '#2C2820' }}>El río que cambió de curso</span>
                  <span style={{ fontSize: 14, color: '#6A5E50', lineHeight: 1.75, fontWeight: 300 }}>En 2020 el mundo cambió en semanas. Las organizaciones que salieron mejor paradas fueron las que podían pensar juntas bajo incertidumbre. Lo que viene con la IA es una transformación de magnitud similar. Más silenciosa. Pero igual de profunda.</span>
                  <span style={{ fontSize: 12, color: '#C4941A', fontWeight: 500, marginTop: 4 }}>{dF1Open === 'mas' ? '— menos' : '+ profundizar'}</span>
                </div>
                {dF1Open === 'mas' && (
                  <div style={{ paddingBottom: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <p style={{ fontSize: 14, color: '#6A5E50', lineHeight: 1.75, fontWeight: 300 }}>El COVID fue el colapso simultáneo de tres certezas: que el trabajo era un lugar físico, que las decisiones importantes requerían presencia, que el ritmo de cambio era predecible. Lo que emergió no fue tecnología — fue inteligencia colectiva.</p>
                    <p style={{ fontSize: 14, color: '#6A5E50', lineHeight: 1.75, fontWeight: 300 }}>Lo que está llegando con la IA replica ese patrón — pero más lento y más profundo. No colapsa el cómo trabajamos. Colapsa el por qué trabajamos. Cuando los agentes hagan ese trabajo, la respuesta de siempre dejará de ser suficiente.</p>
                    <p style={{ fontSize: 14, color: '#8B6914', fontStyle: 'italic', lineHeight: 1.65, fontFamily: 'Playfair Display, serif' }}>¿Cuál será entonces la nueva respuesta?</p>
                    <p style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#8A7E70', fontWeight: 500, marginTop: 4 }}>Pregunta orientadora</p>
                    <p style={{ fontSize: 13, color: '#6A5E50', lineHeight: 1.7, fontWeight: 300, paddingLeft: 12, borderLeft: '2px solid rgba(232,201,106,0.4)' }}>La última vez que tomaste una decisión difícil, ¿qué parte podría haber hecho un agente? ¿Y qué parte no?</p>
                    <p style={{ fontSize: 13, color: '#6A5E50', lineHeight: 1.7, fontWeight: 300, paddingLeft: 12, borderLeft: '2px solid rgba(232,201,106,0.4)' }}>¿Cuánto de tu jornada de la semana pasada fue urgente? ¿Cuánto fue importante?</p>
                    <p style={{ fontSize: 13, color: '#6A5E50', lineHeight: 1.7, fontWeight: 300, paddingLeft: 12, borderLeft: '2px solid rgba(232,201,106,0.4)' }}>¿Qué sabés sobre tu cliente que ningún sistema podría saber?</p>
                    <div style={{ marginTop: 8 }}>
                      <button
                        onClick={e => { e.stopPropagation(); setDF1Duende(v => !v) }}
                        style={{ background: 'none', border: '1px solid #C4941A', borderRadius: 6, padding: '7px 14px', fontSize: 12, color: '#8B6914', cursor: 'pointer', letterSpacing: '0.04em' }}
                      >Pedile ayuda al Duende</button>
                      {dF1Duende && <p style={{ fontSize: 13, color: 'var(--inkxlt)', fontStyle: 'italic', marginTop: 8, lineHeight: 1.65 }}>El Duende está en construcción — pronto vas a poder explorar este fragmento con él.</p>}
                    </div>
                  </div>
                )}
              </div>

              {/* FRAGMENTO II */}
              <div style={{ borderBottom: '1px solid rgba(139,105,20,0.12)' }}>
                <div
                  onClick={() => setDF2Open(dF2Open === 'mas' ? null : 'mas')}
                  style={{ padding: '18px 0', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 4 }}
                >
                  <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 11, fontStyle: 'italic', color: '#C4941A' }}>II</span>
                  <span style={{ fontSize: 15, fontWeight: 500, color: '#2C2820' }}>Cuando el piso se mueve</span>
                  <span style={{ fontSize: 14, color: '#6A5E50', lineHeight: 1.75, fontWeight: 300 }}>Cada vez que la humanidad perdió las certezas que organizaban su mundo, encontró la manera de crear nuevas desde adentro. Siempre. Sin excepción. La pregunta no es si va a pasar — es qué construimos antes de que pase.</span>
                  <span style={{ fontSize: 12, color: '#C4941A', fontWeight: 500, marginTop: 4 }}>{dF2Open === 'mas' ? '— menos' : '+ profundizar'}</span>
                </div>
                {dF2Open === 'mas' && (
                  <div style={{ paddingBottom: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <p style={{ fontSize: 14, color: '#6A5E50', lineHeight: 1.75, fontWeight: 300 }}>En el siglo XIX colapsaron tres pilares simultáneamente: la religión perdió autoridad con Darwin, la filosofía iluminista prometía progreso pero las revoluciones industriales mostraron miseria, y los vínculos comunitarios se disolvieron con la urbanización. Nietzsche lo documentó como diagnóstico, no catástrofe.</p>
                    <p style={{ fontSize: 14, color: '#6A5E50', lineHeight: 1.75, fontWeight: 300 }}>Tolstoi fue a vivir con los campesinos. Los movimientos obreros inventaron nuevas formas de valor colectivo. Las vanguardias artísticas crearon lenguajes completamente nuevos.<br /><br />Lo que colapsa ahora es la centralidad del trabajo como fuente de identidad.</p>
                    <p style={{ fontSize: 14, color: '#8B6914', fontStyle: 'italic', lineHeight: 1.65, fontFamily: 'Playfair Display, serif' }}>Si los agentes hacen lo que hacías, ¿desde dónde construís tu valor?</p>
                    <p style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#8A7E70', fontWeight: 500, marginTop: 4 }}>Pregunta orientadora</p>
                    <p style={{ fontSize: 13, color: '#6A5E50', lineHeight: 1.7, fontWeight: 300, paddingLeft: 12, borderLeft: '2px solid rgba(232,201,106,0.4)' }}>¿Cuándo fue la última vez que tu equipo llegó a algo que ninguno traía solo?</p>
                    <p style={{ fontSize: 13, color: '#6A5E50', lineHeight: 1.7, fontWeight: 300, paddingLeft: 12, borderLeft: '2px solid rgba(232,201,106,0.4)' }}>¿Qué conversaciones importantes nunca quedan registradas en Quanam?</p>
                    <p style={{ fontSize: 13, color: '#6A5E50', lineHeight: 1.7, fontWeight: 300, paddingLeft: 12, borderLeft: '2px solid rgba(232,201,106,0.4)' }}>Si mañana un agente hiciera el 80% de tu trabajo, ¿en qué usarías el tiempo liberado?</p>
                    <div style={{ marginTop: 8 }}>
                      <button
                        onClick={e => { e.stopPropagation(); setDF2Duende(v => !v) }}
                        style={{ background: 'none', border: '1px solid #C4941A', borderRadius: 6, padding: '7px 14px', fontSize: 12, color: '#8B6914', cursor: 'pointer', letterSpacing: '0.04em' }}
                      >Pedile ayuda al Duende</button>
                      {dF2Duende && <p style={{ fontSize: 13, color: 'var(--inkxlt)', fontStyle: 'italic', marginTop: 8, lineHeight: 1.65 }}>El Duende está en construcción — pronto vas a poder explorar este fragmento con él.</p>}
                    </div>
                  </div>
                )}
              </div>

              {/* FRAGMENTO III */}
              <div style={{ borderBottom: '1px solid rgba(139,105,20,0.12)' }}>
                <div
                  onClick={() => setDF3Open(dF3Open === 'mas' ? null : 'mas')}
                  style={{ padding: '18px 0', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 4 }}
                >
                  <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 11, fontStyle: 'italic', color: '#C4941A' }}>III</span>
                  <span style={{ fontSize: 15, fontWeight: 500, color: '#2C2820' }}>Lo que está por encima</span>
                  <span style={{ fontSize: 14, color: '#6A5E50', lineHeight: 1.75, fontWeight: 300 }}>Hay algo en cada persona que sabe antes de calcular. Antes de que ningún sistema pueda procesarlo. Eso es exactamente lo que la IA no puede tener.</span>
                  <span style={{ fontSize: 12, color: '#C4941A', fontWeight: 500, marginTop: 4 }}>{dF3Open === 'mas' ? '— menos' : '+ profundizar'}</span>
                </div>
                {dF3Open === 'mas' && (
                  <div style={{ paddingBottom: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <p style={{ fontSize: 14, color: '#6A5E50', lineHeight: 1.75, fontWeight: 300 }}>Kant decía que había dos cosas que lo sorprendían: el orden del cielo, y algo dentro de cada persona que sabe cuándo un acto es ético antes de calcularlo. Los neurólogos lo llaman supraconciencia — no intuición vaga, sino una capacidad que opera por encima de la conciencia ordinaria.</p>
                    <p style={{ fontSize: 14, color: '#6A5E50', lineHeight: 1.75, fontWeight: 300 }}>El médico que sabe que algo está mal antes de que los estudios lo confirmen. El vendedor que percibe que un cliente necesita ser escuchado antes de ser resuelto. El responsable que siente que el momento no está maduro aunque todos los indicadores digan que sí.</p>
                    <p style={{ fontSize: 14, color: '#8B6914', fontStyle: 'italic', lineHeight: 1.65, fontFamily: 'Playfair Display, serif' }}>Eso no es dato. Es juicio situado. Y vive en cada persona y equipo de Quanam — distribuido, latente, esperando las condiciones correctas para volverse visible.</p>
                    <p style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#8A7E70', fontWeight: 500, marginTop: 4 }}>Pregunta orientadora</p>
                    <p style={{ fontSize: 13, color: '#6A5E50', lineHeight: 1.7, fontWeight: 300, paddingLeft: 12, borderLeft: '2px solid rgba(232,201,106,0.4)' }}>¿Cuándo fue la última vez que una conversación cambió genuinamente tu forma de ver un problema?</p>
                    <p style={{ fontSize: 13, color: '#6A5E50', lineHeight: 1.7, fontWeight: 300, paddingLeft: 12, borderLeft: '2px solid rgba(232,201,106,0.4)' }}>¿Para qué te llamaría tu cliente si pudiera llamarle a un agente para todo lo demás?</p>
                    <p style={{ fontSize: 13, color: '#6A5E50', lineHeight: 1.7, fontWeight: 300, paddingLeft: 12, borderLeft: '2px solid rgba(232,201,106,0.4)' }}>¿Qué es lo que hacés que no podrías explicarle a un sistema?</p>
                    <div style={{ marginTop: 8 }}>
                      <button
                        onClick={e => { e.stopPropagation(); setDF3Duende(v => !v) }}
                        style={{ background: 'none', border: '1px solid #C4941A', borderRadius: 6, padding: '7px 14px', fontSize: 12, color: '#8B6914', cursor: 'pointer', letterSpacing: '0.04em' }}
                      >Pedile ayuda al Duende</button>
                      {dF3Duende && <p style={{ fontSize: 13, color: 'var(--inkxlt)', fontStyle: 'italic', marginTop: 8, lineHeight: 1.65 }}>El Duende está en construcción — pronto vas a poder explorar este fragmento con él.</p>}
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
