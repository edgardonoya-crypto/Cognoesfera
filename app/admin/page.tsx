'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/app/lib/supabase'

const ARQUITECTO_EMAIL = 'edgardo.noya@gmail.com'

const LENTES_ORDEN = [
  'El ángulo propio',
  'La pregunta viva',
  'La intuición central',
  'El hilo conector',
  'El experimento pendiente',
]

type Respuesta = { id: string; nombre: string; email: string; lente: string; respuesta: string; created_at: string }
type Contacto  = { id: string; nombre: string; email: string; mensaje: string; origen: string | null; created_at: string }
type Respondente = { nombre: string; email: string; lentes: string[]; primera: string; respuestas: Respuesta[] }
type DuendeMensaje = { role: 'user' | 'assistant'; content: string; timestamp?: string }
type LoginLog = { id: string; email: string; created_at: string }
type DuendeConv = { id: string; nombre_participante: string | null; email_participante: string | null; contexto_origen: string | null; mensajes: DuendeMensaje[]; created_at: string }

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('es-UY', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AdminPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'unauth' | 'forbidden' | 'ok'>('loading')
  const [respondentes, setRespondentes] = useState<Respondente[]>([])
  const [contactos, setContactos] = useState<Contacto[]>([])
  const [conversaciones, setConversaciones] = useState<DuendeConv[]>([])
  const [selected, setSelected] = useState<Respondente | null>(null)
  const [selectedConv, setSelectedConv] = useState<string | null>(null)
  const [loginLogs, setLoginLogs] = useState<LoginLog[]>([])

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }
      if (session.user.email !== ARQUITECTO_EMAIL) { setStatus('forbidden'); return }

      const accessToken = session.access_token

      const [{ data: rData }, { data: cData }, duendeRes, { data: lData }] = await Promise.all([
        supabase.from('quanam_respuestas').select('id, nombre, email, lente, respuesta, created_at').order('created_at', { ascending: true }),
        supabase.from('aleph_contacto').select('id, nombre, email, mensaje, origen, created_at').order('created_at', { ascending: false }),
        fetch('/api/admin/duende-chats', { headers: { Authorization: `Bearer ${accessToken}` } }).then(r => r.json()),
        supabase.from('login_log').select('id, email, created_at').order('created_at', { ascending: false }).limit(50),
      ])

      const dData: DuendeConv[] | null = duendeRes?.data ?? null
      if (duendeRes?.error) console.error('duende-chats admin error:', duendeRes.error)

      if (rData) {
        const map = new Map<string, Respondente>()
        for (const r of rData as Respuesta[]) {
          const key = `${r.nombre}||${r.email}`
          if (!map.has(key)) map.set(key, { nombre: r.nombre, email: r.email, lentes: [], primera: r.created_at, respuestas: [] })
          const entry = map.get(key)!
          if (!entry.lentes.includes(r.lente)) entry.lentes.push(r.lente)
          entry.respuestas.push(r)
          if (r.created_at < entry.primera) entry.primera = r.created_at
        }
        setRespondentes(Array.from(map.values()))
      }

      if (cData) setContactos(cData as Contacto[])
      if (dData) setConversaciones((dData as DuendeConv[]).filter(d => Array.isArray(d.mensajes) && d.mensajes.length > 0))
      if (lData) setLoginLogs(lData as LoginLog[])
      setStatus('ok')
    }
    load()
  }, [router])

  if (status === 'loading') return (
    <div style={styles.center}>Cargando…</div>
  )
  if (status === 'forbidden') return (
    <div style={styles.center}>Acceso no autorizado</div>
  )

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <div style={styles.eyebrow}>Cognoesfera · Admin</div>
            <h1 style={styles.h1}>Panel de administración</h1>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => router.push('/dashboard')} style={styles.btnSm}>← Volver</button>
            <button onClick={async () => { await supabase.auth.signOut(); router.push('/login') }} style={styles.btnSm}>Salir</button>
          </div>
        </div>

        {/* SECCIÓN A — Respondentes */}
        <section style={styles.section}>
          <h2 style={styles.h2}>Quanam IHA Lab 2026 · Respondentes</h2>
          <p style={styles.meta}>{respondentes.length} persona{respondentes.length !== 1 ? 's' : ''} respondieron</p>

          {respondentes.length === 0 ? (
            <p style={styles.empty}>Todavía no hay respuestas.</p>
          ) : (
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    {['Nombre', 'Email', 'Lentes', 'Primera respuesta', ''].map(h => (
                      <th key={h} style={styles.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {respondentes.map((r, i) => {
                    const isOpen = selected?.email === r.email && selected?.nombre === r.nombre
                    return (
                      <>
                        <tr
                          key={i}
                          style={{ ...styles.tr, background: isOpen ? 'rgba(78,170,152,.08)' : undefined }}
                        >
                          <td style={styles.td}>{r.nombre}</td>
                          <td style={{ ...styles.td, color: '#66706d' }}>{r.email || '—'}</td>
                          <td style={styles.td}>{r.lentes.length}</td>
                          <td style={{ ...styles.td, color: '#66706d' }}>{fmt(r.primera)}</td>
                          <td style={{ ...styles.td, textAlign: 'right', width: 40 }}>
                            <button
                              onClick={() => setSelected(isOpen ? null : r)}
                              style={{ background: 'none', border: '1px solid rgba(78,170,152,.4)', borderRadius: 6, width: 26, height: 26, cursor: 'pointer', fontSize: 16, color: '#4eaa98', lineHeight: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 300 }}
                            >{isOpen ? '−' : '+'}</button>
                          </td>
                        </tr>
                        {isOpen && (
                          <tr key={`${i}-detail`} style={{ background: 'rgba(78,170,152,.04)' }}>
                            <td colSpan={5} style={{ padding: '16px 20px 20px' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                {LENTES_ORDEN.map(lente => {
                                  const rows = r.respuestas.filter(rr => rr.lente === lente)
                                  if (rows.length === 0) return null
                                  return (
                                    <div key={lente}>
                                      <div style={styles.lenteName}>{lente}</div>
                                      {rows.map((rr, j) => (
                                        <div key={j} style={styles.respuesta}>
                                          <p style={styles.respuestaText}>{rr.respuesta}</p>
                                          <p style={styles.respuestaDate}>{fmt(rr.created_at)}</p>
                                        </div>
                                      ))}
                                    </div>
                                  )
                                })}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* SECCIÓN B — Contactos Aleph */}
        <section style={styles.section}>
          <h2 style={styles.h2}>Contactos Aleph</h2>
          <p style={styles.meta}>{contactos.length} mensaje{contactos.length !== 1 ? 's' : ''}</p>

          {contactos.length === 0 ? (
            <p style={styles.empty}>Todavía no hay mensajes.</p>
          ) : (
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    {['Nombre', 'Email', 'Mensaje', 'Origen', 'Fecha'].map(h => (
                      <th key={h} style={styles.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {contactos.map((c, i) => (
                    <tr key={i} style={styles.tr}>
                      <td style={styles.td}>{c.nombre || '—'}</td>
                      <td style={{ ...styles.td, color: '#66706d' }}>{c.email || '—'}</td>
                      <td style={{ ...styles.td, maxWidth: 280, whiteSpace: 'pre-wrap' }}>{c.mensaje}</td>
                      <td style={{ ...styles.td, color: '#66706d', fontSize: '0.78rem' }}>{c.origen || '—'}</td>
                      <td style={{ ...styles.td, color: '#66706d', whiteSpace: 'nowrap' }}>{fmt(c.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* SECCIÓN C — Conversaciones Duende */}
        <section style={styles.section}>
          <h2 style={styles.h2}>Conversaciones Duende</h2>
          <p style={styles.meta}>{conversaciones.length} conversación{conversaciones.length !== 1 ? 'es' : ''}</p>

          {conversaciones.length === 0 ? (
            <p style={styles.empty}>Todavía no hay conversaciones.</p>
          ) : (
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    {['Nombre', 'Email', 'Contexto', 'Intercambios', 'Fecha', ''].map(h => (
                      <th key={h} style={styles.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {conversaciones.map((conv) => {
                    const isOpen = selectedConv === conv.id
                    const intercambios = Math.floor(conv.mensajes.length / 2)
                    return (
                      <>
                        <tr key={conv.id} style={{ ...styles.tr, background: isOpen ? 'rgba(139,105,20,.06)' : undefined }}>
                          <td style={styles.td}>{conv.nombre_participante || '—'}</td>
                          <td style={{ ...styles.td, color: '#66706d' }}>{conv.email_participante || '—'}</td>
                          <td style={{ ...styles.td, color: '#66706d', fontSize: '0.8rem' }}>{conv.contexto_origen || '—'}</td>
                          <td style={{ ...styles.td, color: '#66706d' }}>{intercambios}</td>
                          <td style={{ ...styles.td, color: '#66706d', whiteSpace: 'nowrap' }}>{fmt(conv.created_at)}</td>
                          <td style={{ ...styles.td, textAlign: 'right', width: 40 }}>
                            <button
                              onClick={() => setSelectedConv(isOpen ? null : conv.id)}
                              style={{ background: 'none', border: '1px solid rgba(139,105,20,.4)', borderRadius: 6, width: 26, height: 26, cursor: 'pointer', fontSize: 16, color: '#8B6914', lineHeight: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 300 }}
                            >{isOpen ? '−' : '+'}</button>
                          </td>
                        </tr>
                        {isOpen && (
                          <tr key={`${conv.id}-detail`} style={{ background: 'rgba(139,105,20,.03)' }}>
                            <td colSpan={6} style={{ padding: '16px 20px 20px' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {conv.mensajes.map((m, i) => (
                                  <div key={i} style={{
                                    padding: '10px 14px',
                                    borderRadius: 8,
                                    background: m.role === 'user' ? 'rgba(34,58,54,.06)' : 'transparent',
                                    borderLeft: m.role === 'assistant' ? '3px solid rgba(139,105,20,.35)' : 'none',
                                    paddingLeft: m.role === 'assistant' ? 14 : 14,
                                  }}>
                                    <p style={{ fontSize: '0.72rem', fontWeight: 600, color: m.role === 'user' ? '#4eaa98' : '#8B6914', margin: '0 0 4px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                                      {m.role === 'user' ? (conv.nombre_participante || 'Usuario') : 'Duende'}
                                    </p>
                                    <p style={{ fontSize: '0.875rem', color: '#2c3830', lineHeight: 1.65, margin: 0, fontStyle: m.role === 'assistant' ? 'italic' : 'normal', fontWeight: 300 }}>
                                      {m.content}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>


        {/* SECCIÓN D — Log de accesos */}
        <section style={styles.section}>
          <h2 style={styles.h2}>Log de accesos</h2>
          <p style={styles.meta}>{loginLogs.length} acceso{loginLogs.length !== 1 ? 's' : ''} registrado{loginLogs.length !== 1 ? 's' : ''}</p>
          {loginLogs.length === 0 ? (
            <p style={styles.empty}>Todavía no hay accesos registrados.</p>
          ) : (
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    {['Email', 'Fecha', 'Hora'].map(h => (<th key={h} style={styles.th}>{h}</th>))}
                  </tr>
                </thead>
                <tbody>
                  {loginLogs.map((l, i) => (
                    <tr key={i} style={styles.tr}>
                      <td style={styles.td}>{l.email}</td>
                      <td style={{...styles.td, color: '#66706d'}}>{fmt(l.created_at)}</td>
                      <td style={{...styles.td, color: '#66706d'}}>{new Date(l.created_at).toLocaleTimeString('es-UY', {hour: '2-digit', minute: '2-digit'})}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg,#f7f3e8,#efe9da)',
    fontFamily: 'Inter,ui-sans-serif,system-ui,sans-serif',
    color: '#18201e',
    padding: '0 0 64px',
  } as React.CSSProperties,
  center: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Inter,sans-serif',
    color: '#66706d',
    background: 'linear-gradient(180deg,#f7f3e8,#efe9da)',
  } as React.CSSProperties,
  container: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '0 24px',
  } as React.CSSProperties,
  header: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    padding: '40px 0 32px',
    borderBottom: '1px solid rgba(34,58,54,.10)',
    marginBottom: 40,
  } as React.CSSProperties,
  eyebrow: {
    fontSize: 11,
    letterSpacing: '0.22em',
    textTransform: 'uppercase' as const,
    color: '#4eaa98',
    fontWeight: 600,
    marginBottom: 6,
  },
  h1: {
    margin: 0,
    fontSize: '1.6rem',
    fontWeight: 650,
    letterSpacing: '-.04em',
  } as React.CSSProperties,
  h2: {
    margin: '0 0 4px',
    fontSize: '1.1rem',
    fontWeight: 650,
    letterSpacing: '-.02em',
    color: '#18201e',
  } as React.CSSProperties,
  btnSm: {
    background: 'rgba(34,58,54,.08)',
    border: '1px solid rgba(34,58,54,.12)',
    borderRadius: 8,
    padding: '7px 14px',
    fontSize: '0.8rem',
    color: '#18201e',
    cursor: 'pointer',
    fontFamily: 'inherit',
  } as React.CSSProperties,
  section: {
    marginBottom: 48,
  } as React.CSSProperties,
  meta: {
    fontSize: '0.8rem',
    color: '#66706d',
    margin: '0 0 16px',
  } as React.CSSProperties,
  empty: {
    fontSize: '0.875rem',
    color: '#66706d',
    fontStyle: 'italic',
    margin: 0,
  } as React.CSSProperties,
  tableWrap: {
    overflowX: 'auto' as const,
    borderRadius: 12,
    border: '1px solid rgba(34,58,54,.10)',
    background: 'rgba(255,255,255,.72)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: '0.85rem',
  } as React.CSSProperties,
  th: {
    padding: '12px 16px',
    textAlign: 'left' as const,
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase' as const,
    color: '#66706d',
    borderBottom: '1px solid rgba(34,58,54,.10)',
    background: 'rgba(34,58,54,.03)',
  } as React.CSSProperties,
  tr: {
    cursor: 'pointer',
    transition: 'background 0.15s',
    borderBottom: '1px solid rgba(34,58,54,.06)',
  } as React.CSSProperties,
  td: {
    padding: '12px 16px',
    color: '#18201e',
    verticalAlign: 'top',
  } as React.CSSProperties,
  detail: {
    marginTop: 20,
    background: 'rgba(255,255,255,.85)',
    border: '1px solid rgba(78,170,152,.25)',
    borderRadius: 14,
    padding: '24px 24px 28px',
  } as React.CSSProperties,
  detailHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottom: '1px solid rgba(34,58,54,.08)',
  } as React.CSSProperties,
  detailName: {
    fontSize: '1rem',
    fontWeight: 650,
    color: '#18201e',
  } as React.CSSProperties,
  detailEmail: {
    fontSize: '0.8rem',
    color: '#66706d',
    marginTop: 2,
  } as React.CSSProperties,
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: 20,
    color: '#66706d',
    cursor: 'pointer',
    lineHeight: 1,
    padding: 0,
  } as React.CSSProperties,
  lenteName: {
    fontSize: '0.78rem',
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase' as const,
    color: '#4eaa98',
    marginBottom: 8,
  },
  respuesta: {
    borderLeft: '3px solid rgba(78,170,152,.30)',
    paddingLeft: 14,
    marginBottom: 10,
  } as React.CSSProperties,
  respuestaText: {
    fontSize: '0.875rem',
    color: '#2c3830',
    lineHeight: 1.7,
    margin: 0,
    fontWeight: 300,
  } as React.CSSProperties,
  respuestaDate: {
    fontSize: '0.72rem',
    color: '#8a9e98',
    margin: '4px 0 0',
  } as React.CSSProperties,
}
