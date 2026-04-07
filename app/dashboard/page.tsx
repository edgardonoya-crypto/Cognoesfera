'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/app/lib/supabase'

// ─── tipos ───────────────────────────────────────────────────────────────────

type Indicadores = { i1: number; i2: number; i3: number; i4: number }

type CognoCard = {
  cognoesfera_id: string
  rol_id: string
  nombre: string
  descripcion: string
  indicadores: Indicadores
  rol: string
}

// ─── constantes ──────────────────────────────────────────────────────────────

const IND_META = [
  { key: 'i1' as const, name: 'Soberanía del Conocimiento' },
  { key: 'i2' as const, name: 'Trazabilidad Cognitiva' },
  { key: 'i3' as const, name: 'Índice de Capacidad Evolutiva' },
  { key: 'i4' as const, name: 'Polinización Orgánica' },
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

// ─── componente ──────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState('')
  const [cards, setCards] = useState<CognoCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }

      setUserEmail(session.user.email ?? '')

      // 1. Resolver el id interno del usuario por email
      let { data: usuarioData } = await supabase
        .from('usuarios')
        .select('id')
        .eq('email', session.user.email)
        .single()

      // 2. Si no existe, crear automáticamente
      if (!usuarioData) {
        const email = session.user.email ?? ''
        const id = email.split('@')[0].split('.')[0]   // "edgardo" de "edgardo.noya@gmail.com"
        const nombre = id.charAt(0).toUpperCase() + id.slice(1)

        const { data: created, error: cErr } = await supabase
          .from('usuarios')
          .upsert({
            id,
            auth_id: null,   // se vincula en el paso siguiente
            nombre,
            email,
            area: '',
            color: '#4eaa98',
          }, { onConflict: 'id', ignoreDuplicates: true })
          .select('id')
          .single()

        if (cErr) {
          setError(`No se pudo crear tu perfil: ${cErr.message}`)
          setLoading(false)
          return
        }
        usuarioData = created
      }

      // 3. Vincular auth_id si aún no está guardado
      await supabase
        .from('usuarios')
        .update({ auth_id: session.user.id })
        .eq('id', usuarioData!.id)
        .is('auth_id', null)

      // 4. Buscar membresías con cognoesfera y rol
      const { data, error: qErr } = await supabase
        .from('membresias')
        .select(`
          cognoesfera_id,
          rol_id,
          roles ( name ),
          cognoesferas ( id, name, descripcion, indicadores )
        `)
        .eq('user_id', usuarioData.id)

      if (qErr) { setError(qErr.message); setLoading(false); return }

      const mapped: CognoCard[] = (data ?? []).map((m: any) => ({
        cognoesfera_id: m.cognoesfera_id,
        rol_id: m.rol_id,
        nombre: m.cognoesferas?.name ?? '—',
        descripcion: m.cognoesferas?.descripcion ?? '',
        indicadores: m.cognoesferas?.indicadores ?? { i1: 0, i2: 0, i3: 0, i4: 0 },
        rol: m.roles?.name ?? '—',
      }))

      setCards(mapped)
      setLoading(false)
    }
    load()
  }, [router])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div style={s.page}>
      <div style={s.wrap}>

        {/* Header */}
        <div style={s.header}>
          <div style={s.logo}>✦</div>
          <div style={{ flex: 1 }}>
            <div style={s.title}>Bienvenido</div>
            <div style={s.sub}>Paradigma Aleph · Tus Cognoesferas</div>
          </div>
          <button style={s.btnSm} onClick={handleLogout}>Salir</button>
        </div>

        <div style={s.note}>
          Seleccioná una Cognoesfera para trabajar. Los indicadores muestran el estado actual de Vitalidad Sistémica.
        </div>

        {/* Tabs (solo visual por ahora) */}
        <div style={s.tabs}>
          <button style={{ ...s.tab, ...s.tabActive }}>Mis Cognoesferas</button>
          <button style={s.tab}>Camino Evolutivo</button>
        </div>

        {/* Lista */}
        {loading && <p style={s.muted}>Cargando…</p>}
        {error && <p style={{ ...s.muted, color: 'rgba(180,60,60,.85)' }}>{error}</p>}
        {!loading && !error && cards.length === 0 && (
          <p style={s.muted}>No tenés Cognoesferas asignadas. Consultá al Arquitecto.</p>
        )}

        <div style={s.list}>
          {cards.map((c) => (
            <CognoCard key={c.cognoesfera_id} card={c} />
          ))}
        </div>

      </div>
    </div>
  )
}

// ─── card ─────────────────────────────────────────────────────────────────────

function CognoCard({ card }: { card: CognoCard }) {
  return (
    <div style={s.card}>
      {/* Top row */}
      <div style={s.cardTop}>
        <div style={s.cogIcon}>✦</div>
        <div style={{ flex: 1 }}>
          <div style={s.cogName}>{card.nombre}</div>
          <div style={s.cogDesc}>{card.descripcion}</div>
        </div>
        <span style={s.rolBadge}>{card.rol}</span>
        <Link
          href={`/cognoesfera/${card.cognoesfera_id}?rol_id=${card.rol_id}`}
          style={{ ...s.openBtn, textDecoration: 'none' }}
        >
          Abrir →
        </Link>
      </div>

      {/* Gauges */}
      <div style={s.gaugesRow} className="gauges-row">
        {IND_META.map((ind, i) => {
          const val = card.indicadores?.[ind.key] ?? 0
          const clr = gaugeColor(val)
          const lv = gaugeLevel(val)
          return (
            <div key={ind.key} style={{ ...s.gaugeCell, borderRight: i === IND_META.length - 1 ? 'none' : `1px solid ${LINE}` }}>
              <div style={s.gaugeTitle}>{ind.name}</div>
              <div style={s.gaugeTrack}>
                <div style={{ ...s.gaugeBar, width: `${val}%`, background: clr }} />
              </div>
              <div style={{ ...s.gaugeVal, color: clr }}>{val}%</div>
              <div style={{ ...s.gaugeDesc, color: clr }}>{lv}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── estilos ──────────────────────────────────────────────────────────────────

const BG = 'radial-gradient(circle at 12% 16%, rgba(109,188,173,.12), transparent 24%), radial-gradient(circle at 85% 18%, rgba(132,100,205,.10), transparent 22%), linear-gradient(180deg, #f7f3e8, #efe9da)'
const LINE = 'rgba(34,58,54,.10)'
const INK = '#18201e'
const MUTED = '#66706d'
const SH = '0 22px 64px rgba(27,42,38,.10)'

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    padding: '28px 24px',
    background: BG,
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    color: INK,
  },
  wrap: { width: '100%', maxWidth: '900px', margin: '0 auto' },
  header: { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' },
  logo: {
    width: '44px', height: '44px', borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(72,170,152,.80), rgba(132,100,205,.70))',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.2rem', flexShrink: 0,
  },
  title: { fontSize: '1.5rem', fontWeight: 650, letterSpacing: '-0.04em' },
  sub: { fontSize: '0.82rem', color: MUTED, marginTop: '1px' },
  btnSm: {
    padding: '5px 11px', borderRadius: '8px', border: `1px solid ${LINE}`,
    background: 'rgba(255,255,255,.40)', fontSize: '0.76rem', color: MUTED,
    cursor: 'pointer',
  },
  note: { fontSize: '0.84rem', color: MUTED, marginBottom: '20px', paddingLeft: '58px' },
  tabs: { display: 'flex', gap: '8px', marginBottom: '18px' },
  tab: {
    padding: '7px 18px', borderRadius: '999px', border: `1px solid ${LINE}`,
    background: 'transparent', fontSize: '0.82rem', color: MUTED, cursor: 'pointer',
  },
  tabActive: { background: INK, color: '#fff', borderColor: INK },
  list: { display: 'flex', flexDirection: 'column', gap: '18px' },
  muted: { fontSize: '0.84rem', color: MUTED },
  card: {
    background: 'linear-gradient(180deg, rgba(255,255,255,.68), rgba(255,255,255,.46))',
    border: `1px solid ${LINE}`, borderRadius: '26px', boxShadow: SH, overflow: 'hidden',
  },
  cardTop: { display: 'flex', alignItems: 'center', gap: '14px', padding: '20px 24px 16px' },
  cogIcon: {
    width: '46px', height: '46px', borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(72,170,152,.65), rgba(83,177,210,.55))',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.1rem', color: '#fff', flexShrink: 0,
  },
  cogName: { fontSize: '1.05rem', fontWeight: 640, letterSpacing: '-0.025em' },
  cogDesc: { fontSize: '0.80rem', color: MUTED, marginTop: '2px', lineHeight: 1.4 },
  rolBadge: {
    fontSize: '0.72rem', padding: '3px 10px', borderRadius: '999px',
    border: `1px solid ${LINE}`, background: 'rgba(255,255,255,.50)', color: MUTED,
    whiteSpace: 'nowrap',
  },
  openBtn: {
    padding: '9px 20px', borderRadius: '12px', border: 'none',
    background: 'linear-gradient(135deg, rgba(72,170,152,.85), rgba(83,177,210,.80))',
    color: '#fff', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
    whiteSpace: 'nowrap', transition: 'opacity 200ms',
  },
  gaugesRow: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
    borderTop: `1px solid ${LINE}`,
  },
  gaugeCell: {
    padding: '16px 12px 14px', textAlign: 'center',
  },
  gaugeTitle: {
    fontSize: '0.70rem', fontWeight: 600, color: INK, letterSpacing: '-0.01em',
    marginBottom: '10px', lineHeight: 1.3, minHeight: '2.4em',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  gaugeTrack: {
    height: '6px', borderRadius: '999px', background: 'rgba(34,58,54,.08)',
    overflow: 'hidden', marginBottom: '5px',
  },
  gaugeBar: { height: '100%', borderRadius: '999px', transition: 'width 600ms ease' },
  gaugeVal: { fontSize: '0.78rem', fontWeight: 650, marginTop: '5px' },
  gaugeDesc: { fontSize: '0.66rem', marginTop: '3px', lineHeight: 1.35, fontWeight: 500 },
}
