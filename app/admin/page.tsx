'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { supabase } from '@/app/lib/supabase'

const ARQUITECTO_EMAIL = 'edgardo.noya@gmail.com'

type Contacto  = { id: string; nombre: string; email: string; mensaje: string; origen: string | null; created_at: string }
type DuendeMensaje = { role: 'user' | 'assistant'; content: string; timestamp?: string }
type AccesoConvocatoria = { id: string; email: string; created_at: string }
type LoginLog = { id: string; email: string; created_at: string }
type DuendeConv = { id: string; nombre_participante: string | null; email_participante: string | null; contexto_origen: string | null; mensajes: DuendeMensaje[]; created_at: string }
type ArchivoCuraduria = { id: string; created_at: string; email_participante: string | null; contexto_origen: string | null; nombre_archivo: string | null; tipo_archivo: string | null; contenido_base64: string | null; mensaje_asociado: string | null; estado: 'pendiente' | 'aprobado' | 'descartado' | 'señal'; notas_curador: string | null }
type PreguntaArquitecto = { id: string; created_at: string; email_participante: string | null; contexto_origen: string | null; pregunta: string }
type Iniciativa = { id: string; nombre: string; descripcion: string | null; responsable: string | null; estado: 'activa' | 'pausada' | 'completada'; fecha_inicio: string | null; visible_convocatoria: boolean; created_at: string }
type InteresSaved = { id: string; iniciativa_id: string; email_participante: string | null; lente_origen: string | null; fragmento_origen: string | null; momento: string | null; created_at: string; iniciativas?: { nombre: string } | null }
type EstadoVitalAdmin = { id: string; email: string; contexto: string; estado: string; fecha_entrada: string; dias_en_campo: number }

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('es-UY', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AdminPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'unauth' | 'forbidden' | 'ok'>('loading')
  const [contactos, setContactos] = useState<Contacto[]>([])
  const [conversaciones, setConversaciones] = useState<DuendeConv[]>([])
  const [convTab, setConvTab] = useState<'usuario' | 'lente' | 'usuariolente'>('usuario')
  const [convExpandedUsers, setConvExpandedUsers] = useState<Set<string>>(new Set())
  const [convExpandedLentes, setConvExpandedLentes] = useState<Set<string>>(new Set())
  const [convSelectedUser, setConvSelectedUser] = useState<string | null>(null)
  const [convSelectedLente, setConvSelectedLente] = useState<string | null>(null)
  const [loginLogs, setLoginLogs] = useState<LoginLog[]>([])
  const [accesosConv, setAccesosConv] = useState<AccesoConvocatoria[]>([])
  const [archivos, setArchivos] = useState<ArchivoCuraduria[]>([])
  const [notasCurador, setNotasCurador] = useState<Record<string, string>>({})
  const [preguntas, setPreguntas] = useState<PreguntaArquitecto[]>([])
  const [respuestasTexto, setRespuestasTexto] = useState<Record<string, string>>({})
  const [iniciativas, setIniciativas] = useState<Iniciativa[]>([])
  const [intereses, setIntereses] = useState<InteresSaved[]>([])
  const [estadosVitales, setEstadosVitales] = useState<EstadoVitalAdmin[]>([])
  const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null)
  const [editingValue, setEditingValue] = useState('')
  const [mounted, setMounted] = useState(false)
  const [modalAbierto, setModalAbierto] = useState<null | 'campo' | 'conversaciones' | 'curacion' | 'preguntas' | 'iniciativas' | 'accesos'>(null)
  const [responsableDropdownId, setResponsableDropdownId] = useState<string | null>(null)
  const [responsableSearch, setResponsableSearch] = useState('')
  const [responsableDropdownPos, setResponsableDropdownPos] = useState<{ top: number; left: number } | null>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }
      if (session.user.email !== ARQUITECTO_EMAIL) { setStatus('forbidden'); return }

      const accessToken = session.access_token

      const [{ data: cData }, duendeRes, { data: lData }] = await Promise.all([
        supabase.from('aleph_contacto').select('id, nombre, email, mensaje, origen, created_at').order('created_at', { ascending: false }),
        fetch('/api/admin/duende-chats', { headers: { Authorization: `Bearer ${accessToken}` } }).then(r => r.json()),
        supabase.from('login_log').select('id, email, created_at').order('created_at', { ascending: false }).limit(50),
      ])

      const dData: DuendeConv[] | null = duendeRes?.data ?? null
      if (duendeRes?.error) console.error('duende-chats admin error:', duendeRes.error)

      if (cData) setContactos(cData as Contacto[])
      if (dData) setConversaciones((dData as DuendeConv[]).filter(d => Array.isArray(d.mensajes) && d.mensajes.length > 0))
      if (lData) setLoginLogs(lData as LoginLog[])
      const { data: aData } = await supabase.from('convocatoria_accesos').select('id, email, created_at').order('created_at', { ascending: false }).limit(100)
      if (aData) setAccesosConv(aData as AccesoConvocatoria[])

      const archivosRes = await fetch('/api/admin/archivos-curaduria', { headers: { Authorization: `Bearer ${accessToken}` } }).then(r => r.json())
      if (archivosRes?.data) {
        const arch = archivosRes.data as ArchivoCuraduria[]
        setArchivos(arch)
        const notas: Record<string, string> = {}
        for (const a of arch) notas[a.id] = a.notas_curador ?? ''
        setNotasCurador(notas)
      }

      const { data: pData } = await supabase
        .from('preguntas_arquitectos')
        .select('id, created_at, email_participante, contexto_origen, pregunta')
        .eq('estado', 'pendiente')
        .order('created_at', { ascending: false })
      if (pData) setPreguntas(pData as PreguntaArquitecto[])

      // Iniciativas + intereses
      const [iniciativasRes, interesesRes] = await Promise.all([
        fetch('/api/admin/iniciativas', { headers: { Authorization: `Bearer ${accessToken}` } }).then(r => r.json()),
        fetch('/api/admin/iniciativas?tipo=intereses', { headers: { Authorization: `Bearer ${accessToken}` } }).then(r => r.json()),
      ])
      if (iniciativasRes?.data) setIniciativas(iniciativasRes.data as Iniciativa[])
      if (interesesRes?.data) setIntereses(interesesRes.data as InteresSaved[])

      const evRes = await fetch('/api/admin/estados-vitales', { headers: { Authorization: `Bearer ${accessToken}` } }).then(r => r.json())
      if (evRes?.data) setEstadosVitales(evRes.data as EstadoVitalAdmin[])

      setStatus('ok')
    }
    load()
  }, [router])

  async function actualizarEstado(id: string, estado: ArchivoCuraduria['estado']) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const res = await fetch('/api/admin/archivos-curaduria', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ id, estado }),
    })
    if (res.ok) setArchivos(prev => prev.map(a => a.id === id ? { ...a, estado } : a))
  }

  async function responderPregunta(p: PreguntaArquitecto) {
    const respuesta = respuestasTexto[p.id]?.trim()
    if (!respuesta) return
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const res = await fetch('/api/admin/responder-pregunta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ id: p.id, email_participante: p.email_participante, pregunta: p.pregunta, respuesta }),
    })
    if (res.ok) setPreguntas(prev => prev.filter(q => q.id !== p.id))
  }

  async function guardarNotas(id: string) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const notas_curador = notasCurador[id] ?? ''
    const res = await fetch('/api/admin/archivos-curaduria', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ id, notas_curador }),
    })
    if (res.ok) setArchivos(prev => prev.map(a => a.id === id ? { ...a, notas_curador } : a))
  }

  async function patchIniciativa(id: string, field: string, value: unknown) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const res = await fetch('/api/admin/iniciativas', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ id, field, value }),
    })
    if (res.ok) {
      setIniciativas(prev => prev.map(ini => ini.id === id ? { ...ini, [field]: value } : ini))
    }
  }

  async function nuevaIniciativa() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const res = await fetch('/api/admin/iniciativas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ nombre: 'Nueva iniciativa' }),
    })
    const data = await res.json()
    if (data?.data) setIniciativas(prev => [...prev, data.data as Iniciativa])
  }

  function startEdit(id: string, field: string, currentValue: string) {
    setEditingCell({ id, field })
    setEditingValue(currentValue)
  }

  async function commitEdit() {
    if (!editingCell) return
    await patchIniciativa(editingCell.id, editingCell.field, editingValue)
    setEditingCell(null)
  }

  if (status === 'loading') return (
    <div style={styles.center}>Cargando…</div>
  )
  if (status === 'forbidden') return (
    <div style={styles.center}>Acceso no autorizado</div>
  )

  // Conteos para las cajas
  const hoy = new Date()
  const esHoy = (iso: string) => { const d = new Date(iso); return d.getDate() === hoy.getDate() && d.getMonth() === hoy.getMonth() && d.getFullYear() === hoy.getFullYear() }
  const accesosHoy = [...accesosConv, ...loginLogs].filter(a => esHoy(a.created_at)).length
  const archivosPendientes = archivos.filter(a => a.estado === 'pendiente').length
  const iniciativasActivas = iniciativas.filter(i => i.estado === 'activa').length

  const cajas: { id: typeof modalAbierto & string; nombre: string; conteo: number; desc: string; color: string }[] = [
    { id: 'campo',          nombre: 'El campo',       conteo: estadosVitales.length,   desc: 'Usuarios en el campo',              color: '#4eaa98' },
    { id: 'conversaciones', nombre: 'Conversaciones', conteo: conversaciones.length,   desc: 'Conversaciones con el Duende',      color: '#8B6914' },
    { id: 'curacion',       nombre: 'Curación',       conteo: archivosPendientes,      desc: 'Archivos para revisar',             color: '#C4941A' },
    { id: 'preguntas',      nombre: 'Preguntas',      conteo: preguntas.length,        desc: 'Preguntas al Arquitecto',           color: '#C4941A' },
    { id: 'iniciativas',    nombre: 'Iniciativas',    conteo: iniciativasActivas,      desc: 'Iniciativas del campo',             color: '#8B6914' },
    { id: 'accesos',        nombre: 'Accesos',        conteo: accesosHoy,              desc: 'Accesos hoy al sistema',            color: '#4eaa98' },
  ]

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

        {/* Grid de cajas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 48 }}>
          {cajas.map(c => (
            <div
              key={c.id}
              onClick={() => setModalAbierto(c.id as typeof modalAbierto)}
              style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(34,58,54,0.10)', borderRadius: 14, padding: '22px 20px 18px', cursor: 'pointer', transition: 'box-shadow 0.15s', display: 'flex', flexDirection: 'column', gap: 6 }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 18px rgba(0,0,0,0.10)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = ''}
            >
              <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: c.color }}>{c.nombre}</div>
              <div style={{ fontSize: '2.4rem', fontWeight: 700, letterSpacing: '-0.04em', color: '#18201e', lineHeight: 1 }}>{c.conteo}</div>
              <div style={{ fontSize: '0.78rem', color: '#66706d', marginTop: 2 }}>{c.desc}</div>
            </div>
          ))}
        </div>

        {/* MODALES — cada caja abre uno */}
        {mounted && modalAbierto && createPortal(
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(0,0,0,0.50)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
            onClick={e => { if (e.target === e.currentTarget) setModalAbierto(null) }}
          >
            <div style={{ width: 'min(860px,95vw)', maxHeight: '88vh', background: '#f7f3e8', borderRadius: 18, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.22)' }}>
              {/* Modal header */}
              <div style={{ padding: '20px 28px 16px', borderBottom: '1px solid rgba(34,58,54,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                <h2 style={{ ...styles.h2, margin: 0 }}>
                  {modalAbierto === 'campo' && 'El campo'}
                  {modalAbierto === 'conversaciones' && 'Conversaciones con el Duende'}
                  {modalAbierto === 'curacion' && 'Curación'}
                  {modalAbierto === 'preguntas' && 'Preguntas al Arquitecto'}
                  {modalAbierto === 'iniciativas' && 'Iniciativas'}
                  {modalAbierto === 'accesos' && 'Accesos al sistema'}
                </h2>
                <button onClick={() => setModalAbierto(null)} style={{ background: 'none', border: 'none', fontSize: 20, color: '#8A7E70', cursor: 'pointer', lineHeight: 1, padding: 4 }}>✕</button>
              </div>
              {/* Modal body */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>

                {/* EL CAMPO */}
                {modalAbierto === 'campo' && (
                  estadosVitales.length === 0 ? <p style={styles.empty}>Todavía no hay estados vitales registrados.</p> : (
                    <div style={styles.tableWrap}>
                      <table style={styles.table}>
                        <thead><tr>{['Email', 'Estado actual', 'Fecha entrada', 'Días en campo'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr></thead>
                        <tbody>
                          {estadosVitales.map(ev => (
                            <tr key={ev.id} style={styles.tr}>
                              <td style={styles.td}>{ev.email}</td>
                              <td style={{ ...styles.td, fontStyle: 'italic', color: '#5a7a6a' }}>{ev.estado}</td>
                              <td style={{ ...styles.td, color: '#66706d' }}>{fmt(ev.fecha_entrada)}</td>
                              <td style={{ ...styles.td, color: '#66706d', textAlign: 'center' }}>{ev.dias_en_campo}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                )}

                {/* CONVERSACIONES */}
                {modalAbierto === 'conversaciones' && (() => {
                  if (conversaciones.length === 0) return <p style={styles.empty}>Todavía no hay conversaciones.</p>

                  // Derived data
                  const byUser = new Map<string, DuendeConv[]>()
                  const byLente = new Map<string, DuendeConv[]>()
                  for (const c of conversaciones) {
                    const u = c.email_participante ?? '(sin email)'
                    const l = c.contexto_origen ?? '(sin contexto)'
                    if (!byUser.has(u)) byUser.set(u, [])
                    byUser.get(u)!.push(c)
                    if (!byLente.has(l)) byLente.set(l, [])
                    byLente.get(l)!.push(c)
                  }

                  const tabBtn = (id: typeof convTab, label: string) => (
                    <button
                      onClick={() => setConvTab(id)}
                      style={{ padding: '6px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: convTab === id ? 650 : 400, background: convTab === id ? 'rgba(139,105,20,0.15)' : 'rgba(34,58,54,0.06)', color: convTab === id ? '#8B6914' : '#66706d' }}
                    >{label}</button>
                  )

                  const firstUserMsg = (conv: DuendeConv) => conv.mensajes.find(m => m.role === 'user')?.content ?? '—'

                  const LENTES_CONOCIDAS = new Set(['El ángulo propio', 'La pregunta viva', 'La intuición central', 'El hilo conector', 'El experimento pendiente'])
                  const clasificarCtx = (ctx: string): 'lente' | 'resonancia' =>
                    LENTES_CONOCIDAS.has(ctx) ? 'lente' : 'resonancia'
                  const badgeCtx = (ctx: string) => {
                    const tipo = clasificarCtx(ctx)
                    return (
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, padding: '1px 6px', borderRadius: 4, marginLeft: 6, background: tipo === 'lente' ? 'rgba(90,120,80,.12)' : 'rgba(139,105,20,.13)', color: tipo === 'lente' ? '#4a7040' : '#8B6914', border: `1px solid ${tipo === 'lente' ? 'rgba(90,120,80,.28)' : 'rgba(139,105,20,.28)'}` }}>
                        {tipo === 'lente' ? 'Lente' : 'Resonancia'}
                      </span>
                    )
                  }

                  return (
                    <div>
                      {/* Tabs */}
                      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                        {tabBtn('usuario', 'Por usuario')}
                        {tabBtn('lente', 'Por lente / resonancia')}
                        {tabBtn('usuariolente', 'Por usuario y lente')}
                      </div>

                      {/* POR USUARIO */}
                      {convTab === 'usuario' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {[...byUser.entries()].map(([email, convs]) => {
                            const isOpen = convExpandedUsers.has(email)
                            const ultima = convs.reduce((a, b) => a.created_at > b.created_at ? a : b)
                            const toggle = () => setConvExpandedUsers(prev => {
                              const s = new Set(prev); isOpen ? s.delete(email) : s.add(email); return s
                            })
                            const porCtx = new Map<string, DuendeConv[]>()
                            for (const c of convs) {
                              const k = c.contexto_origen ?? '(sin contexto)'
                              if (!porCtx.has(k)) porCtx.set(k, [])
                              porCtx.get(k)!.push(c)
                            }
                            return (
                              <div key={email} style={{ border: '1px solid rgba(34,58,54,.10)', borderRadius: 10, overflow: 'hidden' }}>
                                <div onClick={toggle} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', cursor: 'pointer', background: isOpen ? 'rgba(139,105,20,.05)' : 'rgba(255,255,255,.7)' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <span style={{ fontSize: '0.875rem', color: '#18201e', fontWeight: 500 }}>{email}</span>
                                    <span style={{ fontSize: '0.75rem', color: '#8B6914', background: 'rgba(139,105,20,.12)', borderRadius: 10, padding: '2px 8px' }}>{convs.length} conv{convs.length !== 1 ? 's' : ''}</span>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <span style={{ fontSize: '0.75rem', color: '#8a9e98' }}>{fmt(ultima.created_at)}</span>
                                    <span style={{ color: '#8B6914', fontSize: 18, lineHeight: 1 }}>{isOpen ? '−' : '+'}</span>
                                  </div>
                                </div>
                                {isOpen && (
                                  <div style={{ padding: '12px 16px 16px', display: 'flex', flexDirection: 'column', gap: 12, background: 'rgba(139,105,20,.02)' }}>
                                    {[...porCtx.entries()].map(([ctx, ctxConvs]) => (
                                      <div key={ctx}>
                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                                          <span style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#8B6914' }}>{ctx}</span>
                                          {badgeCtx(ctx)}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                          {ctxConvs.map(c => (
                                            <div key={c.id} style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(255,255,255,.8)', border: '1px solid rgba(34,58,54,.08)' }}>
                                              <div style={{ fontSize: '0.78rem', color: '#2c3830', lineHeight: 1.5, marginBottom: 4, fontStyle: 'italic', fontWeight: 300 }}>{firstUserMsg(c).slice(0, 120)}{firstUserMsg(c).length > 120 ? '…' : ''}</div>
                                              <div style={{ fontSize: '0.72rem', color: '#8a9e98' }}>{fmt(c.created_at)}</div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}

                      {/* POR LENTE */}
                      {convTab === 'lente' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {[...byLente.entries()].map(([lente, convs]) => {
                            const isOpen = convExpandedLentes.has(lente)
                            const usuariosDistintos = new Set(convs.map(c => c.email_participante ?? '')).size
                            const sorted = [...convs].sort((a, b) => b.created_at.localeCompare(a.created_at))
                            const toggle = () => setConvExpandedLentes(prev => {
                              const s = new Set(prev); isOpen ? s.delete(lente) : s.add(lente); return s
                            })
                            return (
                              <div key={lente} style={{ border: '1px solid rgba(34,58,54,.10)', borderRadius: 10, overflow: 'hidden' }}>
                                <div onClick={toggle} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', cursor: 'pointer', background: isOpen ? 'rgba(78,170,152,.05)' : 'rgba(255,255,255,.7)' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <span style={{ fontSize: '0.875rem', color: '#18201e', fontWeight: 500 }}>{lente}</span>
                                    {badgeCtx(lente)}
                                    <span style={{ fontSize: '0.75rem', color: '#4eaa98', background: 'rgba(78,170,152,.12)', borderRadius: 10, padding: '2px 8px' }}>{convs.length} conv{convs.length !== 1 ? 's' : ''}</span>
                                    <span style={{ fontSize: '0.75rem', color: '#66706d' }}>{usuariosDistintos} usuario{usuariosDistintos !== 1 ? 's' : ''}</span>
                                  </div>
                                  <span style={{ color: '#4eaa98', fontSize: 18, lineHeight: 1 }}>{isOpen ? '−' : '+'}</span>
                                </div>
                                {isOpen && (
                                  <div style={{ padding: '12px 16px 16px', display: 'flex', flexDirection: 'column', gap: 6, background: 'rgba(78,170,152,.02)' }}>
                                    {sorted.map(c => (
                                      <div key={c.id} style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(255,255,255,.8)', border: '1px solid rgba(34,58,54,.08)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                                          <span style={{ fontSize: '0.75rem', color: '#4eaa98', fontWeight: 500 }}>{c.email_participante ?? '—'}</span>
                                          <span style={{ fontSize: '0.72rem', color: '#8a9e98' }}>{fmt(c.created_at)}</span>
                                        </div>
                                        <div style={{ fontSize: '0.78rem', color: '#2c3830', lineHeight: 1.5, fontStyle: 'italic', fontWeight: 300 }}>{firstUserMsg(c).slice(0, 120)}{firstUserMsg(c).length > 120 ? '…' : ''}</div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}

                      {/* POR USUARIO Y LENTE */}
                      {convTab === 'usuariolente' && (() => {
                        const todosUsuarios = [...new Set(conversaciones.map(c => c.email_participante ?? '(sin email)'))]
                        const todasLentes = [...new Set(conversaciones.map(c => c.contexto_origen ?? '(sin contexto)'))]

                        const lentesDelUsuario = convSelectedUser
                          ? [...new Set(conversaciones.filter(c => (c.email_participante ?? '(sin email)') === convSelectedUser).map(c => c.contexto_origen ?? '(sin contexto)'))]
                          : todasLentes
                        const usuariosDelaLente = convSelectedLente
                          ? [...new Set(conversaciones.filter(c => (c.contexto_origen ?? '(sin contexto)') === convSelectedLente).map(c => c.email_participante ?? '(sin email)'))]
                          : todosUsuarios

                        const convInterseccion = (convSelectedUser && convSelectedLente)
                          ? conversaciones.filter(c =>
                              (c.email_participante ?? '(sin email)') === convSelectedUser &&
                              (c.contexto_origen ?? '(sin contexto)') === convSelectedLente
                            )
                          : []

                        const itemStyle = (selected: boolean, color: string): React.CSSProperties => ({
                          padding: '8px 12px', borderRadius: 8, cursor: 'pointer', fontSize: '0.82rem',
                          background: selected ? `rgba(${color},.15)` : 'rgba(255,255,255,.7)',
                          border: `1px solid ${selected ? `rgba(${color},.35)` : 'rgba(34,58,54,.08)'}`,
                          color: selected ? '#18201e' : '#66706d', fontWeight: selected ? 600 : 400,
                        })

                        return (
                          <div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                              <div>
                                <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#4eaa98', marginBottom: 8 }}>Usuarios</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                  {todosUsuarios.filter(u => usuariosDelaLente.includes(u)).map(u => (
                                    <div key={u} onClick={() => setConvSelectedUser(convSelectedUser === u ? null : u)} style={itemStyle(convSelectedUser === u, '78,170,152')}>{u}</div>
                                  ))}
                                  {todosUsuarios.filter(u => !usuariosDelaLente.includes(u)).map(u => (
                                    <div key={u} onClick={() => { setConvSelectedUser(convSelectedUser === u ? null : u); setConvSelectedLente(null) }} style={{ ...itemStyle(false, '78,170,152'), opacity: 0.35 }}>{u}</div>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#8B6914', marginBottom: 8 }}>Lentes / Resonancias</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                  {todasLentes.filter(l => lentesDelUsuario.includes(l)).map(l => (
                                    <div key={l} onClick={() => setConvSelectedLente(convSelectedLente === l ? null : l)} style={{ ...itemStyle(convSelectedLente === l, '139,105,20'), display: 'flex', alignItems: 'center' }}><span>{l}</span>{badgeCtx(l)}</div>
                                  ))}
                                  {todasLentes.filter(l => !lentesDelUsuario.includes(l)).map(l => (
                                    <div key={l} onClick={() => { setConvSelectedLente(convSelectedLente === l ? null : l); setConvSelectedUser(null) }} style={{ ...itemStyle(false, '139,105,20'), opacity: 0.35, display: 'flex', alignItems: 'center' }}><span>{l}</span>{badgeCtx(l)}</div>
                                  ))}
                                </div>
                              </div>
                            </div>
                            {convSelectedUser && convSelectedLente && (
                              <div>
                                <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#66706d', marginBottom: 10 }}>
                                  {convSelectedUser} · {convSelectedLente}
                                </div>
                                {convInterseccion.length === 0
                                  ? <p style={styles.empty}>Sin conversaciones en esta intersección.</p>
                                  : <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                      {convInterseccion.map(c => (
                                        <div key={c.id} style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(255,255,255,.8)', border: '1px solid rgba(34,58,54,.10)' }}>
                                          <div style={{ fontSize: '0.72rem', color: '#8a9e98', marginBottom: 6 }}>{fmt(c.created_at)}</div>
                                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                            {c.mensajes.map((m, i) => (
                                              <div key={i} style={{ padding: '6px 10px', borderRadius: 6, background: m.role === 'user' ? 'rgba(34,58,54,.06)' : 'transparent', borderLeft: m.role === 'assistant' ? '3px solid rgba(139,105,20,.35)' : 'none' }}>
                                                <p style={{ fontSize: '0.72rem', fontWeight: 600, color: m.role === 'user' ? '#4eaa98' : '#8B6914', margin: '0 0 3px', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>{m.role === 'user' ? (c.nombre_participante || 'Usuario') : 'Duende'}</p>
                                                <p style={{ fontSize: '0.82rem', color: '#2c3830', lineHeight: 1.6, margin: 0, fontStyle: m.role === 'assistant' ? 'italic' : 'normal', fontWeight: 300 }}>{m.content}</p>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                }
                              </div>
                            )}
                            {(!convSelectedUser || !convSelectedLente) && (
                              <p style={{ ...styles.empty, marginTop: 8 }}>Seleccioná un usuario y una lente para ver la intersección.</p>
                            )}
                          </div>
                        )
                      })()}

                    </div>
                  )
                })()}

                {/* CURACIÓN */}
                {modalAbierto === 'curacion' && (
                  archivos.length === 0 ? <p style={styles.empty}>Todavía no hay archivos enviados.</p> : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {archivos.map(a => {
                        const estadoColor: Record<string, string> = { pendiente: '#C4941A', aprobado: '#4eaa98', descartado: '#66706d', señal: '#8B6914' }
                        const esImagen = a.tipo_archivo?.startsWith('image/')
                        const esPdf = a.tipo_archivo === 'application/pdf'
                        return (
                          <div key={a.id} style={{ background: 'rgba(255,255,255,.72)', border: '1px solid rgba(34,58,54,.10)', borderRadius: 12, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                              <div>
                                <span style={{ fontSize: '0.8rem', color: '#66706d' }}>{a.email_participante || '—'}</span>
                                {a.contexto_origen && <span style={{ fontSize: '0.78rem', color: '#8a9e98', marginLeft: 10 }}>· {a.contexto_origen}</span>}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                                <span style={{ fontSize: '0.72rem', background: estadoColor[a.estado] + '22', color: estadoColor[a.estado], border: `1px solid ${estadoColor[a.estado]}55`, borderRadius: 4, padding: '2px 8px', fontWeight: 600, letterSpacing: '0.04em' }}>{a.estado}</span>
                                <span style={{ fontSize: '0.72rem', color: '#8a9e98' }}>{new Date(a.created_at).toLocaleDateString('es-UY', {day:'numeric',month:'short'})} {new Date(a.created_at).toLocaleTimeString('es-UY', {hour:'2-digit',minute:'2-digit'})}</span>
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                              {esImagen && a.contenido_base64 && <img src={`data:${a.tipo_archivo};base64,${a.contenido_base64}`} alt={a.nombre_archivo ?? 'imagen'} style={{ maxHeight: 120, maxWidth: 160, borderRadius: 6, objectFit: 'contain', border: '1px solid rgba(34,58,54,.10)', flexShrink: 0 }} />}
                              {esPdf && <div style={{ width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(196,148,26,.1)', borderRadius: 8, border: '1px solid rgba(196,148,26,.25)', flexShrink: 0 }}><span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#C4941A', letterSpacing: '0.06em' }}>PDF</span></div>}
                              <div style={{ minWidth: 0 }}>
                                <p style={{ margin: '0 0 4px', fontSize: '0.78rem', color: '#66706d', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.nombre_archivo || '—'} {a.tipo_archivo && <span style={{ color: '#8a9e98' }}>· {a.tipo_archivo}</span>}</p>
                                {a.mensaje_asociado && <p style={{ margin: 0, fontSize: '0.875rem', color: '#2c3830', lineHeight: 1.65, fontWeight: 300 }}>{a.mensaje_asociado}</p>}
                              </div>
                            </div>
                            <textarea value={notasCurador[a.id] ?? ''} onChange={e => setNotasCurador(prev => ({ ...prev, [a.id]: e.target.value }))} placeholder="Notas del curador…" rows={2} style={{ width: '100%', border: '1px solid rgba(34,58,54,.12)', borderRadius: 6, padding: '8px 10px', fontSize: '0.8rem', fontFamily: 'inherit', color: '#18201e', background: 'rgba(247,243,232,.6)', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                              <button onClick={() => actualizarEstado(a.id, 'aprobado')} style={{ ...styles.btnSm, borderColor: 'rgba(78,170,152,.4)', color: '#4eaa98' }}>Aprobar</button>
                              <button onClick={() => actualizarEstado(a.id, 'descartado')} style={{ ...styles.btnSm, borderColor: 'rgba(102,112,109,.3)', color: '#66706d' }}>Descartar</button>
                              <button onClick={() => actualizarEstado(a.id, 'señal')} style={{ ...styles.btnSm, borderColor: 'rgba(139,105,20,.4)', color: '#8B6914' }}>Custodiar como señal</button>
                              <button onClick={() => guardarNotas(a.id)} style={{ ...styles.btnSm, marginLeft: 'auto' }}>Guardar notas</button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )
                )}

                {/* PREGUNTAS */}
                {modalAbierto === 'preguntas' && (
                  preguntas.length === 0 ? <p style={styles.empty}>No hay preguntas pendientes.</p> : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {preguntas.map(p => (
                        <div key={p.id} style={{ background: 'rgba(255,255,255,.72)', border: '1px solid rgba(34,58,54,.10)', borderRadius: 12, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                            <div>
                              <span style={{ fontSize: '0.8rem', color: '#66706d' }}>{p.email_participante || '—'}</span>
                              {p.contexto_origen && <span style={{ fontSize: '0.78rem', color: '#8a9e98', marginLeft: 10 }}>· {p.contexto_origen}</span>}
                            </div>
                            <span style={{ fontSize: '0.72rem', color: '#8a9e98', flexShrink: 0 }}>{new Date(p.created_at).toLocaleDateString('es-UY', {day:'numeric',month:'short'})} {new Date(p.created_at).toLocaleTimeString('es-UY', {hour:'2-digit',minute:'2-digit'})}</span>
                          </div>
                          <div style={{ borderLeft: '3px solid rgba(139,105,20,.30)', paddingLeft: 14 }}>
                            <p style={{ margin: 0, fontSize: '0.875rem', color: '#2c3830', lineHeight: 1.7, fontStyle: 'italic', fontWeight: 300 }}>{p.pregunta}</p>
                          </div>
                          <textarea value={respuestasTexto[p.id] ?? ''} onChange={e => setRespuestasTexto(prev => ({ ...prev, [p.id]: e.target.value }))} placeholder="Escribí la respuesta para enviar por email…" rows={3} style={{ width: '100%', border: '1px solid rgba(34,58,54,.12)', borderRadius: 6, padding: '8px 10px', fontSize: '0.8rem', fontFamily: 'inherit', color: '#18201e', background: 'rgba(247,243,232,.6)', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={() => responderPregunta(p)} disabled={!respuestasTexto[p.id]?.trim()} style={{ ...styles.btnSm, borderColor: 'rgba(78,170,152,.4)', color: '#4eaa98', opacity: respuestasTexto[p.id]?.trim() ? 1 : 0.45, cursor: respuestasTexto[p.id]?.trim() ? 'pointer' : 'default' }}>Responder por email</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}

                {/* INICIATIVAS */}
                {modalAbierto === 'iniciativas' && (<>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <p style={styles.meta}>{iniciativas.length} iniciativa{iniciativas.length !== 1 ? 's' : ''} · {intereses.length} interés{intereses.length !== 1 ? 'es' : ''} detectado{intereses.length !== 1 ? 's' : ''}</p>
                    <button onClick={nuevaIniciativa} style={{ ...styles.btnSm, background: 'rgba(139,105,20,0.1)', borderColor: 'rgba(139,105,20,0.25)', color: '#8B6914' }}>+ Nueva iniciativa</button>
                  </div>
                  {iniciativas.length === 0 ? <p style={styles.empty}>No hay iniciativas.</p> : (
                    <div style={styles.tableWrap}>
                      <table style={{ ...styles.table, tableLayout: 'fixed' as const }}>
                        <thead><tr>{['Nombre', 'Descripción', 'Responsable', 'Estado', 'Visible'].map(h => <th key={h} style={{ ...styles.th, width: h === 'Nombre' ? '22%' : h === 'Descripción' ? '30%' : h === 'Responsable' ? '18%' : h === 'Estado' ? '14%' : '10%' }}>{h}</th>)}</tr></thead>
                        <tbody>
                          {iniciativas.map(ini => (
                            <tr key={ini.id} style={{ ...styles.tr, cursor: 'default' }}>
                              <td style={styles.td} onClick={() => startEdit(ini.id, 'nombre', ini.nombre)}>
                                {editingCell?.id === ini.id && editingCell.field === 'nombre'
                                  ? <input autoFocus value={editingValue} onChange={e => setEditingValue(e.target.value)} onBlur={commitEdit} onKeyDown={e => e.key === 'Enter' && commitEdit()} style={{ width: '100%', border: '1px solid rgba(139,105,20,0.3)', borderRadius: 4, padding: '4px 6px', fontSize: '0.82rem', fontFamily: 'inherit', outline: 'none' }} />
                                  : <span style={{ cursor: 'pointer', display: 'block', minHeight: 20 }}>{ini.nombre}</span>}
                              </td>
                              <td style={styles.td} onClick={() => startEdit(ini.id, 'descripcion', ini.descripcion ?? '')}>
                                {editingCell?.id === ini.id && editingCell.field === 'descripcion'
                                  ? <textarea autoFocus value={editingValue} onChange={e => setEditingValue(e.target.value)} onBlur={commitEdit} rows={2} style={{ width: '100%', border: '1px solid rgba(139,105,20,0.3)', borderRadius: 4, padding: '4px 6px', fontSize: '0.82rem', fontFamily: 'inherit', outline: 'none', resize: 'vertical' }} />
                                  : <span style={{ cursor: 'pointer', display: 'block', minHeight: 20, color: ini.descripcion ? '#18201e' : '#aaa', fontStyle: ini.descripcion ? 'normal' : 'italic', fontSize: '0.82rem' }}>{ini.descripcion || 'Agregar descripción…'}</span>}
                              </td>
                              <td style={styles.td} onClick={e => { const rect = (e.currentTarget as HTMLElement).getBoundingClientRect(); setResponsableDropdownPos({ top: rect.bottom + 4, left: rect.left }); setResponsableDropdownId(ini.id); setResponsableSearch('') }}>
                                <span style={{ cursor: 'pointer', display: 'block', minHeight: 20, color: ini.responsable ? '#18201e' : '#aaa', fontStyle: ini.responsable ? 'normal' : 'italic', fontSize: '0.82rem' }}>{ini.responsable ? (ini.responsable.length > 20 ? ini.responsable.slice(0, 20) + '…' : ini.responsable) : '—'}</span>
                              </td>
                              <td style={styles.td}>
                                <select value={ini.estado} onChange={e => patchIniciativa(ini.id, 'estado', e.target.value)} style={{ border: '1px solid rgba(34,58,54,.15)', borderRadius: 6, padding: '3px 6px', fontSize: '0.8rem', fontFamily: 'inherit', background: '#fff', color: ini.estado === 'activa' ? '#4eaa98' : ini.estado === 'pausada' ? '#C4941A' : '#66706d', cursor: 'pointer' }}>
                                  <option value="activa">Activa</option>
                                  <option value="pausada">Pausada</option>
                                  <option value="completada">Completada</option>
                                </select>
                              </td>
                              <td style={{ ...styles.td, textAlign: 'center' as const }}>
                                <button onClick={() => patchIniciativa(ini.id, 'visible_convocatoria', !ini.visible_convocatoria)} style={{ background: ini.visible_convocatoria ? 'rgba(78,170,152,0.15)' : 'rgba(34,58,54,0.06)', border: `1px solid ${ini.visible_convocatoria ? 'rgba(78,170,152,0.4)' : 'rgba(34,58,54,0.15)'}`, borderRadius: 12, padding: '3px 10px', fontSize: '0.75rem', color: ini.visible_convocatoria ? '#4eaa98' : '#66706d', cursor: 'pointer', whiteSpace: 'nowrap' as const }}>{ini.visible_convocatoria ? 'Visible' : 'Oculta'}</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {intereses.length > 0 && (
                    <div style={{ marginTop: 28 }}>
                      <h3 style={{ fontSize: '0.9rem', fontWeight: 650, color: '#18201e', marginBottom: 12 }}>Intereses registrados</h3>
                      <div style={styles.tableWrap}>
                        <table style={styles.table}>
                          <thead><tr>{['Email', 'Iniciativa', 'Origen', 'Momento', 'Fecha'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr></thead>
                          <tbody>
                            {intereses.map(int => (
                              <tr key={int.id} style={{ ...styles.tr, cursor: 'default' }}>
                                <td style={styles.td}>{int.email_participante || '—'}</td>
                                <td style={styles.td}>{int.iniciativas?.nombre || int.iniciativa_id}</td>
                                <td style={{ ...styles.td, color: '#66706d', fontSize: '0.8rem' }}>{int.lente_origen || int.fragmento_origen || '—'}</td>
                                <td style={{ ...styles.td, color: '#66706d', fontSize: '0.8rem', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{int.momento || '—'}</td>
                                <td style={{ ...styles.td, color: '#66706d' }}>{fmt(int.created_at)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>)}

                {/* ACCESOS */}
                {modalAbierto === 'accesos' && (<>
                  <p style={{ ...styles.meta, marginBottom: 20 }}>{accesosConv.length} accesos convocatoria · {loginLogs.length} logins al sistema</p>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 650, color: '#18201e', marginBottom: 12 }}>Convocatoria</h3>
                  {accesosConv.length === 0 ? <p style={styles.empty}>Sin accesos.</p> : (
                    <div style={{ ...styles.tableWrap, marginBottom: 28 }}>
                      <table style={styles.table}>
                        <thead><tr>{['Email', 'Fecha', 'Hora'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr></thead>
                        <tbody>
                          {accesosConv.map((a, i) => (
                            <tr key={i} style={styles.tr}>
                              <td style={styles.td}>{a.email}</td>
                              <td style={{ ...styles.td, color: '#66706d' }}>{fmt(a.created_at)}</td>
                              <td style={{ ...styles.td, color: '#66706d' }}>{new Date(a.created_at).toLocaleTimeString('es-UY', {hour:'2-digit',minute:'2-digit'})}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 650, color: '#18201e', marginBottom: 12 }}>Logins al sistema</h3>
                  {loginLogs.length === 0 ? <p style={styles.empty}>Sin logins.</p> : (
                    <div style={styles.tableWrap}>
                      <table style={styles.table}>
                        <thead><tr>{['Email', 'Fecha', 'Hora'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr></thead>
                        <tbody>
                          {loginLogs.map((l, i) => (
                            <tr key={i} style={styles.tr}>
                              <td style={styles.td}>{l.email}</td>
                              <td style={{ ...styles.td, color: '#66706d' }}>{fmt(l.created_at)}</td>
                              <td style={{ ...styles.td, color: '#66706d' }}>{new Date(l.created_at).toLocaleTimeString('es-UY', {hour:'2-digit',minute:'2-digit'})}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>)}

              </div>
            </div>
          </div>,
          document.body
        )}


      </div>

      {/* Responsable dropdown portal */}
      {mounted && responsableDropdownId && responsableDropdownPos && createPortal(
        <>
          <div
            onClick={() => setResponsableDropdownId(null)}
            style={{ position: 'fixed', inset: 0, zIndex: 499 }}
          />
          <div style={{ position: 'fixed', top: responsableDropdownPos.top, left: responsableDropdownPos.left, zIndex: 500, background: '#fff', border: '1px solid rgba(139,105,20,0.25)', borderRadius: 10, boxShadow: '0 6px 24px rgba(0,0,0,0.13)', width: 280, padding: '8px 8px 6px', fontFamily: 'Inter,sans-serif' }}>
            <input
              autoFocus
              placeholder="Buscar email…"
              value={responsableSearch}
              onChange={e => setResponsableSearch(e.target.value)}
              onClick={e => e.stopPropagation()}
              style={{ width: '100%', border: '1px solid rgba(139,105,20,0.2)', borderRadius: 6, padding: '5px 9px', fontSize: '0.8rem', fontFamily: 'inherit', outline: 'none', marginBottom: 6, boxSizing: 'border-box' as const, background: '#faf8f3' }}
            />
            <div style={{ maxHeight: 200, overflowY: 'auto' as const }}>
              <div
                onClick={() => { patchIniciativa(responsableDropdownId, 'responsable', null); setResponsableDropdownId(null) }}
                style={{ padding: '5px 8px', cursor: 'pointer', borderRadius: 6, fontSize: '0.8rem', color: '#aaa', fontStyle: 'italic' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(139,105,20,0.07)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ''}
              >— Sin responsable</div>
              {accesosConv
                .filter(a => a.email.toLowerCase().includes(responsableSearch.toLowerCase()))
                .map(a => {
                  const isSelected = iniciativas.find(i => i.id === responsableDropdownId)?.responsable === a.email
                  return (
                    <div
                      key={a.id}
                      onClick={() => { patchIniciativa(responsableDropdownId, 'responsable', a.email); setResponsableDropdownId(null) }}
                      style={{ padding: '6px 8px', cursor: 'pointer', borderRadius: 6, background: isSelected ? 'rgba(78,170,152,0.1)' : undefined }}
                      onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'rgba(139,105,20,0.07)' }}
                      onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = '' }}
                    >
                      <div style={{ color: '#18201e', fontWeight: isSelected ? 600 : 400, fontSize: '0.82rem' }}>{a.email}</div>
                      <div style={{ color: '#aaa', fontSize: '0.72rem', marginTop: 1 }}>{fmt(a.created_at)}</div>
                    </div>
                  )
                })}
              {accesosConv.filter(a => a.email.toLowerCase().includes(responsableSearch.toLowerCase())).length === 0 && (
                <div style={{ padding: '8px', fontSize: '0.8rem', color: '#aaa', textAlign: 'center' as const }}>Sin resultados</div>
              )}
            </div>
          </div>
        </>,
        document.body
      )}

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
