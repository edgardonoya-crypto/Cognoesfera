'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/app/lib/supabase'

// ─── datos estáticos del Paradigma Aleph ──────────────────────────────────────

const ESTADOS = [
  { id: 'e1', name: 'Latente',      def: 'Energía disponible sin forma ni dirección compartida.',             func: 'Abrir espacio y suspender marcos para que algo nuevo pueda aparecer.' },
  { id: 'e2', name: 'Posible',      def: 'El sentido comienza a insinuarse en señales aún frágiles.',         func: 'Preparar condiciones para que el sentido pueda enraizar.' },
  { id: 'e3', name: 'Activado',     def: 'Lo importante se reconoce y convoca compromiso colectivo.',         func: 'Reconocer colectivamente lo que importa y orientar.' },
  { id: 'e4', name: 'Emergente',    def: 'La forma comienza a tomar cuerpo de manera flexible.',               func: 'Ensayar estructuras mínimas que vuelvan habitable el proceso.' },
  { id: 'e5', name: 'Expresivo',    def: 'El valor circula, se amplifica y genera retorno.',                   func: 'Permitir que el valor fluya, se reconozca y se retroalimente.' },
  { id: 'e6', name: 'Legible',      def: 'El sistema se vuelve comprensible a sí mismo a través de patrones.', func: 'Acompañar el sistema leyendo su ritmo, sin imponer dirección.' },
  { id: 'e7', name: 'Sostenido',    def: 'La coherencia es interna y el sistema sostiene su propia dinámica.', func: 'Consolidar identidad autónoma capaz de sostener su propia vida.' },
  { id: 'e8', name: 'Ecosistémico', def: 'El sistema se articula con otros generando inteligencia distribuida.', func: 'Tejer reciprocidad y expandir la inteligencia sin capturarla.' },
]

const ACTOS = [
  { id: 'a1', name: 'Desprogramar la mirada',  desc: 'Suspender marcos habituales para que emerja lo que el sistema realmente necesita.' },
  { id: 'a2', name: 'El suelo fértil',          desc: 'Proteger las intuiciones tempranas sin exigirles que sean conclusiones todavía.' },
  { id: 'a3', name: 'El encendido',             desc: 'Dar dirección sin imponer objetivos rígidos — dejar que la forma emerja desde adentro.' },
  { id: 'a4', name: 'Sostener la forma mínima', desc: 'No interrumpir lo que está emergiendo. El facilitador cuida el espacio, no dirige.' },
  { id: 'a5', name: 'La vida en circulación',   desc: 'Sostener la reciprocidad — que cada aporte sea reconocido y el valor circule.' },
  { id: 'a6', name: 'Agencia como lectura',     desc: 'Consolidar sin rigidizar — acompañar la autolectura del sistema.' },
  { id: 'a7', name: 'La célula viva',           desc: 'Proteger la coherencia endógena sin convertirla en rigidez.' },
  { id: 'a8', name: 'Redes de vida',            desc: 'Habilitar la articulación con otras Cognoesferas sin capturar ni fusionar.' },
]

const ACUERDOS = [
  { id: 'ac1', name: 'Rondas de palabra',         desc: 'Cada persona habla en su turno, sin interrupciones.' },
  { id: 'ac2', name: 'Principio de equivalencia', desc: 'Todas las voces tienen el mismo peso en la conversación.' },
  { id: 'ac3', name: 'Cero objeción',             desc: 'Decisiones por ausencia de objeción fundamentada, no por consenso.' },
  { id: 'ac4', name: 'Principios de CNV',          desc: 'Comunicación No Violenta como marco de expresión y escucha.' },
  { id: 'ac5', name: 'Escucha profunda',           desc: 'Escuchar para entender, no para responder.' },
  { id: 'ac6', name: 'Confidencialidad',           desc: 'Lo que emerge en el espacio se procesa dentro — no sale sin acuerdo.' },
]

const PROTOCOLOS = [
  { id: 'p1', name: 'Fogón narrativo',        desc: 'Círculo de relatos donde cada persona comparte una experiencia. Solo escucha.' },
  { id: 'p2', name: 'Ejercicio con postits',  desc: 'Externalizar ideas individualmente antes de compartirlas con el grupo.' },
  { id: 'p3', name: 'Meditación de apertura', desc: '2-3 minutos de silencio o respiración compartida antes de comenzar.' },
  { id: 'p4', name: 'Escucha profunda',       desc: 'En pares: uno habla 3 minutos, el otro escucha y refleja sin interpretar.' },
  { id: 'p5', name: 'Pasos de CNV',           desc: 'Observación → Sentimiento → Necesidad → Pedido.' },
  { id: 'p6', name: 'Espejo colectivo',       desc: 'El facilitador devuelve al grupo lo que escuchó sin añadir interpretación.' },
  { id: 'p7', name: 'Pregunta generativa',    desc: 'Una pregunta abierta que el grupo sostiene sin apresurarse a responder.' },
]

const RELACIONES = [
  { estadoId: 'e1', actoId: 'a1', cv: 85, acuerdos: ['ac5', 'ac4'], protocolos: ['p1', 'p3', 'p7'] },
  { estadoId: 'e2', actoId: 'a2', cv: 80, acuerdos: ['ac1', 'ac4'], protocolos: ['p2', 'p4', 'p7'] },
  { estadoId: 'e3', actoId: 'a3', cv: 78, acuerdos: ['ac1', 'ac2'], protocolos: ['p5', 'p6'] },
  { estadoId: 'e4', actoId: 'a4', cv: 82, acuerdos: ['ac2', 'ac6'], protocolos: ['p6', 'p7'] },
  { estadoId: 'e5', actoId: 'a5', cv: 88, acuerdos: ['ac1', 'ac2', 'ac4'], protocolos: ['p4', 'p6'] },
  { estadoId: 'e6', actoId: 'a6', cv: 84, acuerdos: ['ac3', 'ac6'], protocolos: ['p6', 'p7'] },
  { estadoId: 'e7', actoId: 'a7', cv: 90, acuerdos: ['ac3', 'ac4', 'ac6'], protocolos: ['p5', 'p6'] },
  { estadoId: 'e8', actoId: 'a8', cv: 92, acuerdos: ['ac1', 'ac2', 'ac3'], protocolos: ['p6', 'p7'] },
]

const IND_META = [
  { key: 'i1' as const, name: 'Soberanía del Conocimiento' },
  { key: 'i2' as const, name: 'Trazabilidad Cognitiva' },
  { key: 'i3' as const, name: 'Índice de Capacidad Evolutiva' },
  { key: 'i4' as const, name: 'Polinización Orgánica' },
]

// Posiciones % de cada nodo sobre el campo
const POS = [
  { x: 28, y: 18 }, { x: 46, y: 13 }, { x: 69, y: 26 }, { x: 78, y: 46 },
  { x: 67, y: 68 }, { x: 44, y: 78 }, { x: 22, y: 64 }, { x: 96, y: 56 },
]

const AURAS = [
  'radial-gradient(circle at 50% 50%,rgba(116,197,224,.22),rgba(152,124,213,.14),transparent 64%)',
  'radial-gradient(circle at 50% 50%,rgba(102,186,172,.24),rgba(134,188,120,.14),transparent 64%)',
  'radial-gradient(circle at 50% 50%,rgba(225,181,95,.24),rgba(116,197,224,.14),transparent 64%)',
  'radial-gradient(circle at 50% 50%,rgba(134,188,120,.22),rgba(102,186,172,.14),transparent 64%)',
  'radial-gradient(circle at 50% 50%,rgba(116,197,224,.24),rgba(225,181,95,.12),transparent 64%)',
  'radial-gradient(circle at 50% 50%,rgba(152,124,213,.22),rgba(116,197,224,.14),transparent 64%)',
  'radial-gradient(circle at 50% 50%,rgba(102,186,172,.22),rgba(152,124,213,.12),transparent 64%)',
  'radial-gradient(circle at 50% 50%,rgba(134,188,120,.18),rgba(116,197,224,.18),rgba(152,124,213,.12),transparent 68%)',
]

const DOTS = [
  'linear-gradient(180deg,rgba(83,177,210,.95),rgba(132,100,205,.9))',
  'linear-gradient(180deg,rgba(72,170,152,.95),rgba(134,188,120,.9))',
  'linear-gradient(180deg,rgba(214,166,71,.96),rgba(83,177,210,.88))',
  'linear-gradient(180deg,rgba(134,188,120,.94),rgba(72,170,152,.9))',
  'linear-gradient(180deg,rgba(83,177,210,.95),rgba(214,166,71,.88))',
  'linear-gradient(180deg,rgba(132,100,205,.95),rgba(83,177,210,.88))',
  'linear-gradient(180deg,rgba(72,170,152,.96),rgba(132,100,205,.86))',
  'linear-gradient(180deg,rgba(134,188,120,.92),rgba(83,177,210,.86))',
]

// Líneas de conexión entre nodos [a, b, opacity]
const LINES: [number, number, number][] = [
  [0,1,.42],[1,2,.48],[2,3,.52],[3,4,.42],[4,5,.52],[5,6,.42],
  [1,3,.22],[2,4,.24],[4,6,.18],[0,6,.16],[2,5,.20],
]

function gaugeColor(val: number) {
  if (val >= 70) return '#4eaa98'
  if (val >= 40) return '#d6a647'
  return '#c46a5a'
}

function gaugeLevel(val: number) {
  if (val >= 80) return 'Saludable'
  if (val >= 60) return 'Activo'
  if (val >= 35) return 'Emergente'
  return 'Incipiente'
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

// ─── tipos ───────────────────────────────────────────────────────────────────

type Mode = 'field' | 'session' | 'explore' | 'resonancias'

type Indicadores = { i1: number; i2: number; i3: number; i4: number }

type CognoData = {
  id: string
  name: string
  descripcion: string
  indicadores: Indicadores
}

// ─── página ───────────────────────────────────────────────────────────────────

export default function CognoesferaPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const rolId = searchParams.get('rol_id') ?? ''

  const [mode, setMode] = useState<Mode>('field')
  const [cogno, setCogno] = useState<CognoData | null>(null)
  const [rolName, setRolName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [activeIdx, setActiveIdx] = useState(0)
  const fieldRef = useRef<HTMLDivElement>(null)
  const afldRef = useRef<HTMLDivElement>(null)

  type ResonRow = { respuesta: string; created_at: string }
  const [resonancias, setResonancias] = useState<Record<string, ResonRow[]>>({})
  const [resonOpen, setResonOpen] = useState<string | null>(null)
  const [resonLoaded, setResonLoaded] = useState(false)

  const LENTES_ORDEN = ['El ángulo propio', 'La pregunta viva', 'La intuición central', 'El hilo conector', 'El experimento pendiente']

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }
      setUserEmail(session.user.email ?? '')

      const [{ data: cData }, { data: rData }] = await Promise.all([
        supabase.from('cognoesferas').select('id, name, descripcion, indicadores').eq('id', params.id).single(),
        supabase.from('roles').select('name').eq('id', rolId).single(),
      ])
      if (cData) setCogno(cData)
      if (rData) setRolName(rData.name)
    }
    load()
  }, [params.id, rolId, router])

  useEffect(() => {
    if (mode !== 'resonancias' || resonLoaded) return
    supabase.from('quanam_respuestas').select('lente, respuesta, created_at').order('created_at', { ascending: true }).then(({ data }) => {
      if (!data) return
      const grouped: Record<string, ResonRow[]> = {}
      for (const row of data) {
        if (!grouped[row.lente]) grouped[row.lente] = []
        grouped[row.lente].push({ respuesta: row.respuesta, created_at: row.created_at })
      }
      setResonancias(grouped)
      setResonLoaded(true)
    })
  }, [mode, resonLoaded])

  const activateNode = useCallback((idx: number) => {
    setActiveIdx(idx)
    if (afldRef.current) {
      const p = POS[idx]
      afldRef.current.style.background = `radial-gradient(circle at ${p.x}% ${p.y}%,rgba(255,255,255,.14),transparent 12%),${AURAS[idx]}`
      afldRef.current.style.opacity = '1'
    }
  }, [])

  // current estado data
  const estado = ESTADOS[activeIdx]
  const rel = RELACIONES.find(r => r.estadoId === estado.id)
  const acto = rel ? ACTOS.find(a => a.id === rel.actoId) : null
  const acuerdosActivos = rel ? ACUERDOS.filter(a => rel.acuerdos.includes(a.id)) : []
  const protocolosActivos = rel ? PROTOCOLOS.filter(p => rel.protocolos.includes(p.id)) : []

  const ind = cogno?.indicadores ?? { i1: 0, i2: 0, i3: 0, i4: 0 }

  if (!cogno) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg,#f7f3e8,#efe9da)', fontFamily: 'Inter,sans-serif', color: '#66706d' }}>
      Cargando…
    </div>
  )

  return (
    <div style={{ background: 'radial-gradient(circle at 12% 16%,rgba(109,188,173,.12),transparent 24%),radial-gradient(circle at 85% 18%,rgba(132,100,205,.10),transparent 22%),linear-gradient(180deg,#f7f3e8,#efe9da)', minHeight: '100vh', fontFamily: 'Inter,ui-sans-serif,system-ui,sans-serif', color: '#18201e' }}>

      {/* ── Topbar ── */}
      <div className="topbar">
        <div className="tb-left">
          <span className="tb-title-sm">Cognoesfera</span>
          <span className="tb-cog">{cogno.name}</span>
        </div>
        <div className="tb-right">
          <Link href="/dashboard" className="btn-sm" style={{ textDecoration: 'none' }}>⌂ Inicio</Link>
          <div className="mode-tabs">
            {([
              'field', 'session', 'explore',
              ...(cogno.name === 'Quanam Lab' ? ['resonancias'] : []),
            ] as Mode[]).map(m => (
              <button
                key={m}
                className={`mode-tab${mode === m ? ' active' : ''}`}
                onClick={() => setMode(m)}
              >
                {m === 'field' ? '🗺 Campo' : m === 'session' ? '🔴 Sesión' : m === 'explore' ? '📖 Explorar' : 'Resonancias Quanam IA 2026'}
              </button>
            ))}
          </div>
          <span className="rbadge">{rolName}</span>
          <div className="avatar" style={{ background: 'linear-gradient(135deg,rgba(72,170,152,.80),rgba(132,100,205,.70))' }}>
            {initials(userEmail.split('@')[0])}
          </div>
          <button className="btn-sm" onClick={async () => { await supabase.auth.signOut(); router.push('/login') }}>Salir</button>
        </div>
      </div>

      {/* ── Modo Campo ── */}
      {mode === 'field' && (
        <div className="mode-content">
          <main className="app-page">

            {/* columna izquierda */}
            <div className="app-left">
              <div>
                <div className="eyebrow">Paradigma Aleph</div>
                <h1 style={{ margin: 0, fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 650, letterSpacing: '-.04em', lineHeight: 1.1 }}>Cognoesfera</h1>
                <p className="app-subtitle">Sistema vivo de Inteligencia Colectiva. Los estados coexisten y se influyen mutuamente.</p>
                <div className="app-legend"><strong>Clave de lectura.</strong> Hacé clic en un nodo para ver el estado activo. El estado dominante orienta el Acto de Cuidado.</div>
              </div>

              {/* Campo visual */}
              <div className="field" ref={fieldRef}>
                <div className="grain" />
                <div className="colf" />
                {/* SVG decorativo */}
                <svg className="svgl" viewBox="0 0 1200 900" preserveAspectRatio="none" aria-hidden="true">
                  <defs>
                    <filter id="bS"><feGaussianBlur stdDeviation="10"/></filter>
                    <filter id="bM"><feGaussianBlur stdDeviation="18"/></filter>
                    <linearGradient id="fA" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgba(72,170,152,.0)"/>
                      <stop offset="30%" stopColor="#6fbfaf" stopOpacity=".18"/>
                      <stop offset="100%" stopColor="#987cd5" stopOpacity=".10"/>
                    </linearGradient>
                    <linearGradient id="fB" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#d6a647" stopOpacity=".06"/>
                      <stop offset="50%" stopColor="#75c5e0" stopOpacity=".18"/>
                      <stop offset="100%" stopColor="#80b86f" stopOpacity=".10"/>
                    </linearGradient>
                    <radialGradient id="vA" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#75c5e0" stopOpacity=".15"/>
                      <stop offset="100%" stopColor="#fff" stopOpacity="0"/>
                    </radialGradient>
                    <radialGradient id="vB" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#6fbfaf" stopOpacity=".12"/>
                      <stop offset="100%" stopColor="#fff" stopOpacity="0"/>
                    </radialGradient>
                  </defs>
                  <ellipse cx="350" cy="290" rx="190" ry="120" fill="url(#vB)" filter="url(#bM)"/>
                  <ellipse cx="760" cy="270" rx="220" ry="150" fill="url(#vA)" filter="url(#bM)"/>
                  <ellipse cx="620" cy="620" rx="260" ry="170" fill="url(#vA)" filter="url(#bM)"/>
                  <path d="M180,250 C300,120 560,240 820,300 C960,250 1060,340 1100,430" fill="none" stroke="url(#fA)" strokeWidth="22" strokeLinecap="round" filter="url(#bS)" opacity=".55"/>
                  <path d="M90,610 C220,520 480,560 820,540 C930,465 1100,580 1160,620" fill="none" stroke="url(#fB)" strokeWidth="18" strokeLinecap="round" filter="url(#bS)" opacity=".48"/>
                  <g filter="url(#bS)" opacity=".55">
                    <circle cx="280" cy="210" r="10" fill="#6fbfaf"/>
                    <circle cx="492" cy="236" r="9" fill="#75c5e0"/>
                    <circle cx="808" cy="300" r="8" fill="#987cd5"/>
                    <circle cx="520" cy="564" r="10" fill="#75c5e0"/>
                  </g>
                </svg>

                <div className="afld" ref={afldRef} />
                <div className="ofld" />
                <div className="grid-layer" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: '24px' }} />
                <div className="fog" />
                <div className="breath" />
                <div className="rings">
                  <div className="ring r1" /><div className="ring r2" /><div className="ring r3" />
                </div>

                {/* Core */}
                <div className="core">
                  <div>
                    <h2>Inteligencia Colectiva emergente</h2>
                    <span>Seleccioná un estado</span>
                  </div>
                </div>

                {/* Constelación */}
                <FieldConstellation
                  activeIdx={activeIdx}
                  onActivate={activateNode}
                  fieldRef={fieldRef}
                />
              </div>

              <p className="app-fn">La Inteligencia Colectiva no avanza en etapas fijas: coexiste, se activa y se reorganiza. El Acto de Cuidado correcto depende de leer el estado real del sistema.</p>
            </div>

            {/* columna derecha */}
            <div className="app-right">
              {/* Estado activo */}
              <div className="acard">
                <div className="dlabel">Estado activo</div>
                <h2 className="dstate">{estado.name}</h2>
                <div className="dblock">
                  <div className="dlabel">Definición</div>
                  <p className="dtext">{estado.def}</p>
                </div>
                <div className="dblock">
                  <div className="dlabel">Función del facilitador</div>
                  <p className="dtext">{estado.func}</p>
                </div>
              </div>

              {/* Acto de Cuidado */}
              <div className="acard">
                <div className="dlabel">Acto de Cuidado</div>
                <h2 className="dstate">{acto?.name ?? '—'}</h2>
                <div className="dblock">
                  <div className="dlabel">Descripción</div>
                  <p className="dtext">{acto?.desc ?? ''}</p>
                </div>
                {rel && (
                  <div className="dblock">
                    <div className="dlabel">Coherencia Vital</div>
                    <div className="cvwrap"><div className="cvbar" style={{ width: `${rel.cv}%` }} /></div>
                    <div className="cvlbl"><span>Coherencia Vital</span><span>{rel.cv}%</span></div>
                  </div>
                )}
              </div>

              {/* Acuerdos y Protocolos */}
              <div className="acard" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(34,58,54,.10)' }}>
                    <div style={{ padding: '12px 14px 8px', background: 'rgba(255,255,255,.60)', borderBottom: '1px solid rgba(34,58,54,.10)' }}>
                      <div className="dlabel" style={{ margin: 0 }}>Acuerdos</div>
                    </div>
                    <div style={{ padding: '10px 12px', overflowY: 'auto', maxHeight: '180px' }}>
                      {acuerdosActivos.length ? acuerdosActivos.map(a => (
                        <div key={a.id} className="icard">
                          <div className="iname">{a.name}</div>
                          <div className="idesc">{a.desc}</div>
                        </div>
                      )) : <p className="empty">Ningún acuerdo vinculado.</p>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '12px 14px 8px', background: 'rgba(255,255,255,.60)', borderBottom: '1px solid rgba(34,58,54,.10)' }}>
                      <div className="dlabel" style={{ margin: 0 }}>Protocolos</div>
                    </div>
                    <div style={{ padding: '10px 12px', overflowY: 'auto', maxHeight: '180px' }}>
                      {protocolosActivos.length ? protocolosActivos.map(p => (
                        <div key={p.id} className="icard">
                          <div className="iname">{p.name}</div>
                          <div className="idesc">{p.desc}</div>
                        </div>
                      )) : <p className="empty">Ningún protocolo vinculado.</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* ── Indicadores transversal ── */}
          <div className="ind-transversal">
            <div className="ind-trans-inner">
              <div className="ind-trans-section">
                <div className="ind-trans-section-label">Vitalidad</div>
                <div className="ind-trans-cells">
                  {IND_META.map(im => {
                    const val = ind[im.key] ?? 0
                    const clr = gaugeColor(val)
                    return (
                      <div key={im.key} className="ind-trans-cell">
                        <div className="ind-trans-name">{im.name}</div>
                        <div className="ind-trans-bar">
                          <div className="ind-trans-fill" style={{ width: `${val}%`, background: clr }} />
                        </div>
                        <div className="ind-trans-val" style={{ color: clr }}>{val}%</div>
                        <div className="ind-trans-lv" style={{ color: clr }}>{gaugeLevel(val)}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modo Sesión (próximamente) ── */}
      {mode === 'session' && (
        <div className="mode-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#66706d', fontSize: '0.95rem' }}>
          Modo Sesión — próximamente
        </div>
      )}

      {/* ── Modo Explorar (próximamente) ── */}
      {mode === 'explore' && (
        <div className="mode-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#66706d', fontSize: '0.95rem' }}>
          Modo Explorar — próximamente
        </div>
      )}

      {/* ── Modo Resonancias ── */}
      {mode === 'resonancias' && (
        <div className="mode-content" style={{ padding: '32px 24px', maxWidth: 720, margin: '0 auto', width: '100%' }}>
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#4eaa98', fontWeight: 600, marginBottom: 6 }}>Quanam IA 2026</div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 650, letterSpacing: '-.03em', color: '#18201e' }}>Resonancias</h2>
            <p style={{ margin: '8px 0 0', fontSize: '0.875rem', color: '#66706d' }}>Respuestas recibidas, agrupadas por lente. Los nombres no se muestran.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {LENTES_ORDEN.map(lente => {
              const rows = resonancias[lente] ?? []
              const isOpen = resonOpen === lente
              return (
                <div key={lente} style={{ background: 'rgba(255,255,255,.72)', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(34,58,54,.08)' }}>
                  <button
                    onClick={() => setResonOpen(isOpen ? null : lente)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#18201e' }}>{lente}</div>
                      <div style={{ fontSize: '0.75rem', color: '#66706d', marginTop: 2 }}>{rows.length} {rows.length === 1 ? 'resonancia' : 'resonancias'}</div>
                    </div>
                    <span style={{ fontSize: 18, color: '#4eaa98', lineHeight: 1, fontWeight: 300 }}>{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div style={{ borderTop: '1px solid rgba(34,58,54,.08)', padding: '12px 20px 16px' }}>
                      {rows.length === 0 ? (
                        <p style={{ fontSize: '0.85rem', color: '#66706d', fontStyle: 'italic', margin: 0 }}>Todavía no hay resonancias en esta lente</p>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          {rows.map((r, i) => (
                            <div key={i} style={{ borderLeft: '3px solid rgba(78,170,152,.35)', paddingLeft: 14 }}>
                              <p style={{ fontSize: '0.875rem', color: '#2c3830', lineHeight: 1.7, margin: 0, fontWeight: 300 }}>{r.respuesta}</p>
                              <p style={{ fontSize: '0.72rem', color: '#8a9e98', margin: '4px 0 0' }}>{new Date(r.created_at).toLocaleDateString('es-UY', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── constelación de nodos con líneas SVG ────────────────────────────────────

function FieldConstellation({
  activeIdx,
  onActivate,
  fieldRef,
}: {
  activeIdx: number
  onActivate: (i: number) => void
  fieldRef: React.RefObject<HTMLDivElement | null>
}) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [dims, setDims] = useState({ w: 0, h: 0 })

  useEffect(() => {
    if (!fieldRef.current) return
    const obs = new ResizeObserver(([entry]) => {
      setDims({ w: entry.contentRect.width, h: entry.contentRect.height })
    })
    obs.observe(fieldRef.current)
    return () => obs.disconnect()
  }, [fieldRef])

  function px(pct: number, total: number) { return pct / 100 * total }

  return (
    <div className="cnst">
      {/* líneas SVG */}
      {dims.w > 0 && (
        <svg ref={svgRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}>
          {LINES.map(([a, b, op], i) => (
            <line key={i}
              x1={px(POS[a].x, dims.w)} y1={px(POS[a].y, dims.h)}
              x2={px(POS[b].x, dims.w)} y2={px(POS[b].y, dims.h)}
              stroke="url(#threadGrad)" strokeWidth="1.5" opacity={op}
            />
          ))}
          {/* líneas del centro a cada nodo */}
          {POS.map((p, i) => (
            <line key={`c${i}`}
              x1={px(48, dims.w)} y1={px(50, dims.h)}
              x2={px(p.x, dims.w)} y2={px(p.y, dims.h)}
              stroke="rgba(74,170,156,.20)" strokeWidth="1" opacity={i === 7 ? 0.16 : 0.24}
            />
          ))}
          <defs>
            <linearGradient id="threadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(74,170,156,.22)"/>
              <stop offset="60%" stopColor="rgba(129,109,206,.10)"/>
              <stop offset="100%" stopColor="rgba(83,177,210,.02)"/>
            </linearGradient>
          </defs>
        </svg>
      )}

      {/* nodos */}
      {ESTADOS.map((e, i) => {
        const actoNombre = (() => { const r = RELACIONES.find(r => r.estadoId === e.id); return r ? (ACTOS.find(a => a.id === r.actoId)?.name ?? '') : '' })()
        return (
          <button
            key={e.id}
            className={`node${i === 7 ? ' eco' : ''}${activeIdx === i ? ' active' : ''}`}
            style={{ '--x': `${POS[i].x}%`, '--y': `${POS[i].y}%` } as React.CSSProperties}
            onMouseEnter={() => { if (activeIdx !== i) onActivate(i) }}
            onClick={() => onActivate(i)}
          >
            <span className="faura" style={{ background: AURAS[i] }} />
            <div className="dot" style={{ background: DOTS[i] }} />
            <div className="nlabel">
              <p className="nname">{e.name}</p>
              <div className="nact">{actoNombre}</div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
