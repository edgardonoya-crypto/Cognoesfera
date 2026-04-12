'use client'

import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { supabase } from '@/app/lib/supabase'

const ARQUITECTO_EMAILS = new Set(['edgardo.noya@gmail.com', 'edgardo.noya@quanam.com'])

type Contacto  = { id: string; nombre: string; email: string; mensaje: string; origen: string | null; created_at: string }
type DuendeMensaje = { role: 'user' | 'assistant'; content: string; timestamp?: string }
type AccesoConvocatoria = { id: string; email: string; created_at: string }
type LoginLog = { id: string; email: string; created_at: string }
type DuendeConvEstado = 'activa' | 'archivada' | 'ruido'
type DuendeConv = { id: string; nombre_participante: string | null; email_participante: string | null; contexto_origen: string | null; mensajes: DuendeMensaje[]; created_at: string; estado?: DuendeConvEstado }
type ArchivoCuraduria = { id: string; created_at: string; email_participante: string | null; contexto_origen: string | null; nombre_archivo: string | null; tipo_archivo: string | null; contenido_base64: string | null; mensaje_asociado: string | null; estado: 'pendiente' | 'aprobado' | 'descartado' | 'señal'; notas_curador: string | null }
type PreguntaArquitecto = { id: string; created_at: string; email_participante: string | null; contexto_origen: string | null; pregunta: string }
type Iniciativa = { id: string; nombre: string; descripcion: string | null; responsable: string | null; estado: 'activa' | 'pausada' | 'completada'; fecha_inicio: string | null; visible_convocatoria: boolean; created_at: string }
type InteresSaved = { id: string; iniciativa_id: string; email_participante: string | null; lente_origen: string | null; fragmento_origen: string | null; momento: string | null; created_at: string; iniciativas?: { nombre: string } | null }
type EstadoVitalAdmin = { id: string; email: string; contexto: string; estado: string; fecha_entrada: string; dias_en_campo: number }
type DuendeMsgArquitecto = { role: 'user' | 'assistant'; content: string }

type Analisis = {
  id: string
  consulta: string
  respuesta: string
  fuentes: Array<{ id: string; email: string | null; contexto: string }>
  conversaciones_n: number
  created_at: string
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('es-UY', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AdminPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'unauth' | 'forbidden' | 'ok'>('loading')
  const [contactos, setContactos] = useState<Contacto[]>([])
  const [conversaciones, setConversaciones] = useState<DuendeConv[]>([])
  const [convTab, setConvTab] = useState<'usuario' | 'lente' | 'usuariolente'>('usuario')
  const [convFiltroEstado, setConvFiltroEstado] = useState<'activa' | 'archivada' | 'ruido' | null>(null)
  const [convSeleccionModo, setConvSeleccionModo] = useState(false)
  const [convSeleccionados, setConvSeleccionados] = useState<Set<string>>(new Set())
  const [convExpandedUsers, setConvExpandedUsers] = useState<Set<string>>(new Set())
  const [convExpandedLentes, setConvExpandedLentes] = useState<Set<string>>(new Set())
  const [convSelectedUser, setConvSelectedUser] = useState<string | null>(null)
  const [convSelectedLente, setConvSelectedLente] = useState<string | null>(null)
  const [convExpandedMsgs, setConvExpandedMsgs] = useState<Set<string>>(new Set())
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
  const [lenteModal, setLenteModal] = useState<{
    contexto: string
    convs: DuendeConv[]
  } | null>(null)
  const [analisisHistorial, setAnalisisHistorial] = useState<Analisis[]>([])
  const [analisisExpandido, setAnalisisExpandido] = useState<string | null>(null)
  const [consultaInput, setConsultaInput] = useState('')
  const [analizando, setAnalizando] = useState(false)
  const [hiloArquitecto, setHiloArquitecto] = useState<DuendeMsgArquitecto[]>([])
  const [duendePanelOpen, setDuendePanelOpen] = useState(false)
  const hiloEndRef = useRef<HTMLDivElement>(null)
  const [campoModal, setCampoModal] = useState(false)
  const [campoHilo, setCampoHilo] = useState<DuendeMsgArquitecto[]>([])
  const [campoAnalizando, setCampoAnalizando] = useState(false)
  const [campoInput, setCampoInput] = useState('')
  const [campoReporteActivo, setCampoReporteActivo] = useState<string | null>(null)
  const campoHiloEndRef = useRef<HTMLDivElement>(null)
  type SugerenciaRuido = { id: string; email: string | null; contexto: string | null; razon: string; recomendacion: 'ruido' | 'archivar' }
  const [campoSugerencias, setCampoSugerencias] = useState<SugerenciaRuido[] | null>(null)
  const [campoSugerenciasSelec, setCampoSugerenciasSelec] = useState<Set<string>>(new Set())
  const [usuarioModal, setUsuarioModal] = useState<{
    email: string
    convs: DuendeConv[]
  } | null>(null)
  const [usuarioDuendePanelOpen, setUsuarioDuendePanelOpen] = useState(false)
  const [usuarioHilo, setUsuarioHilo] = useState<DuendeMsgArquitecto[]>([])
  const [usuarioAnalizando, setUsuarioAnalizando] = useState(false)
  const [usuarioInput, setUsuarioInput] = useState('')
  const usuarioHiloEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    hiloEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [hiloArquitecto])

  useEffect(() => {
    campoHiloEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [campoHilo])

  useEffect(() => {
    usuarioHiloEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [usuarioHilo])

  useEffect(() => {
    if (!usuarioModal) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [usuarioModal])

  useEffect(() => {
    if (!lenteModal) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [lenteModal])


  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }
      if (!ARQUITECTO_EMAILS.has(session.user.email ?? '')) { setStatus('forbidden'); return }

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

  async function actualizarEstadoConv(id: string, estado: DuendeConvEstado) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const res = await fetch('/api/admin/duende-chats', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ id, estado }),
    })
    if (res.ok) setConversaciones(prev => prev.map(c => c.id === id ? { ...c, estado } : c))
  }

  async function actualizarEstadoConvBulk(ids: string[], estado: DuendeConvEstado) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    await Promise.all(ids.map(id =>
      fetch('/api/admin/duende-chats', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ id, estado }),
      })
    ))
    setConversaciones(prev => prev.map(c => ids.includes(c.id) ? { ...c, estado } : c))
    setConvSeleccionados(new Set())
    setConvSeleccionModo(false)
  }

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

  async function abrirLenteModal(contexto: string) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const convsFiltradas = conversaciones.filter(
      c => (c.contexto_origen ?? '') === contexto && Array.isArray(c.mensajes) && c.mensajes.length > 0
    ).sort((a, b) => a.created_at.localeCompare(b.created_at))
    setLenteModal({ contexto, convs: convsFiltradas })
    setDuendePanelOpen(false)
    setAnalisisHistorial([])
    setAnalisisExpandido(null)
    setConsultaInput('')
    // Cargar análisis previos
    const res = await fetch(`/api/admin/duende-analisis?contexto=${encodeURIComponent(contexto)}`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    }).then(r => r.json())
    if (res.data) setAnalisisHistorial(res.data as Analisis[])
    setHiloArquitecto([])
  }

  function abrirUsuarioModal(email: string) {
    const convsFiltradas = conversaciones
      .filter(c => (c.email_participante ?? '(sin email)') === email && Array.isArray(c.mensajes) && c.mensajes.length > 0)
      .sort((a, b) => a.created_at.localeCompare(b.created_at))
    setUsuarioModal({ email, convs: convsFiltradas })
    setUsuarioDuendePanelOpen(false)
    setUsuarioHilo([])
    setUsuarioInput('')
  }

  async function ejecutarAnalisisUsuario() {
    if (!usuarioInput.trim() || usuarioAnalizando || !usuarioModal) return
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const consultaActual = usuarioInput.trim()
    setUsuarioInput('')
    setUsuarioAnalizando(true)
    const hiloActual: DuendeMsgArquitecto[] = [...usuarioHilo, { role: 'user', content: consultaActual }]
    setUsuarioHilo(hiloActual)
    try {
      const res = await fetch('/api/admin/duende-analisis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({
          contexto: `usuario:${usuarioModal.email}`,
          consulta: consultaActual,
          historial: usuarioHilo,
          conversaciones: usuarioModal.convs.map(c => ({
            id: c.id,
            email: c.email_participante,
            mensajes: c.mensajes,
          })),
        }),
      })
      const data = await res.json() as { respuesta?: string; error?: string }
      if (!res.ok || !data.respuesta) throw new Error(data.error ?? 'Sin respuesta')
      setUsuarioHilo(prev => [...prev, { role: 'assistant', content: data.respuesta! }])
    } catch (err) {
      console.error(err)
      setUsuarioHilo(prev => prev.slice(0, -1))
    } finally {
      setUsuarioAnalizando(false)
    }
  }

  async function ejecutarAnalisisCampo(consulta: string, reporteId?: string) {
    if (!consulta.trim() || campoAnalizando) return
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const esRuido = reporteId === 'ruido'
    setCampoAnalizando(true)
    setCampoInput('')

    if (esRuido) {
      const convPayload = conversaciones.filter(c => (c.estado ?? 'activa') === 'activa').map(c => ({
        id: c.id,
        email: c.email_participante,
        contexto_origen: c.contexto_origen,
        created_at: c.created_at,
        mensajes_n: c.mensajes?.length ?? 0,
        primer_msg: c.mensajes?.find(m => m.role === 'user')?.content?.slice(0, 200) ?? null,
      }))
      try {
        const res = await fetch('/api/admin/duende-analisis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
          body: JSON.stringify({ contexto: 'campo_completo', consulta, reporteId, conversaciones: convPayload }),
        })
        const data = await res.json() as { sugerencias?: SugerenciaRuido[]; error?: string }
        if (!res.ok || !data.sugerencias) throw new Error(data.error ?? 'Sin respuesta')
        setCampoSugerencias(data.sugerencias)
        setCampoSugerenciasSelec(new Set(data.sugerencias.map(s => s.id)))
      } catch (err) {
        console.error(err)
      } finally {
        setCampoAnalizando(false)
      }
      return
    }

    // Rama normal
    const consultaActual = consulta.trim()
    const hiloActual: DuendeMsgArquitecto[] = [...campoHilo, { role: 'user', content: consultaActual }]
    setCampoHilo(hiloActual)

    try {
      const res = await fetch('/api/admin/duende-analisis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({
          contexto: 'campo_completo',
          consulta: consultaActual,
          historial: campoHilo,
          conversaciones: conversaciones.map(c => ({ id: c.id, email: c.email_participante, mensajes: c.mensajes })),
        }),
      })
      const data = await res.json() as { respuesta?: string; error?: string }
      if (!res.ok || !data.respuesta) throw new Error(data.error ?? 'Sin respuesta')
      setCampoHilo(prev => [...prev, { role: 'assistant', content: data.respuesta! }])
    } catch (err) {
      console.error(err)
      setCampoHilo(prev => prev.slice(0, -1))
    } finally {
      setCampoAnalizando(false)
    }
  }

  async function ejecutarAnalisis() {
    if (!consultaInput.trim() || analizando || !lenteModal) return
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const consultaActual = consultaInput.trim()
    setConsultaInput('')
    setAnalizando(true)

    // Agregar mensaje del Arquitecto al hilo inmediatamente
    const hiloActual: DuendeMsgArquitecto[] = [...hiloArquitecto, { role: 'user', content: consultaActual }]
    setHiloArquitecto(hiloActual)

    try {
      const res = await fetch('/api/admin/duende-analisis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({
          contexto: lenteModal.contexto,
          consulta: consultaActual,
          historial: hiloArquitecto, // historial ANTES de este mensaje
          conversaciones: lenteModal.convs.map(c => ({
            id: c.id,
            email: c.email_participante,
            mensajes: c.mensajes,
          })),
        }),
      })
      const data = await res.json() as { respuesta?: string; fuentes?: Analisis['fuentes']; id?: string; error?: string }
      if (!res.ok || !data.respuesta) throw new Error(data.error ?? 'Sin respuesta')

      // Agregar respuesta del Duende al hilo
      setHiloArquitecto(prev => [...prev, { role: 'assistant', content: data.respuesta! }])

      // Guardar en historial de análisis para persistencia
      const nuevo: Analisis = {
        id: data.id ?? Date.now().toString(),
        consulta: consultaActual,
        respuesta: data.respuesta,
        fuentes: data.fuentes ?? [],
        conversaciones_n: lenteModal.convs.length,
        created_at: new Date().toISOString(),
      }
      setAnalisisHistorial(prev => [nuevo, ...prev])
      setAnalisisExpandido(nuevo.id)
    } catch (err) {
      console.error(err)
      // Sacar el mensaje del usuario del hilo si falló
      setHiloArquitecto(prev => prev.slice(0, -1))
    } finally {
      setAnalizando(false)
    }
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

  function renderMarkdown(text: string): React.ReactNode {
    const lines = text.split('\n')
    return (
      <div>
        {lines.map((line, i) => {
          if (!line.trim()) return <div key={i} style={{ height: 8 }} />
          if (line.match(/^###\s/)) return (
            <p key={i} style={{ fontSize: '0.78rem', fontWeight: 700, color: '#5a4a20', margin: '10px 0 3px', fontStyle: 'normal' }}>
              {line.replace(/^###\s/, '')}
            </p>
          )
          if (line.match(/^##\s/)) return (
            <p key={i} style={{ fontSize: '0.82rem', fontWeight: 700, color: '#18201e', margin: '12px 0 4px', fontStyle: 'normal' }}>
              {line.replace(/^##\s/, '')}
            </p>
          )
          if (line.match(/^[-*]\s/)) return (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 3 }}>
              <span style={{ color: '#8B6914', flexShrink: 0 }}>·</span>
              <span style={{ fontSize: '0.875rem', lineHeight: 1.75 }}>{parseBold(line.replace(/^[-*]\s/, ''))}</span>
            </div>
          )
          return (
            <p key={i} style={{ margin: '0 0 8px', lineHeight: 1.75, fontSize: '0.875rem' }}>
              {parseBold(line)}
            </p>
          )
        })}
      </div>
    )
  }

  function parseBold(text: string): React.ReactNode {
    const parts = text.split(/(\*\*[^*]+\*\*)/)
    if (parts.length === 1) return text
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} style={{ fontWeight: 700, fontStyle: 'normal', color: 'inherit' }}>{part.slice(2, -2)}</strong>
      }
      return part
    })
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

  const REPORTES_CAMPO = [
    { id: 'resonancias', label: '¿Qué está resonando más fuerte esta semana?' },
    { id: 'patrones',   label: '¿Qué patrones emergen entre lentes?' },
    { id: 'estado',     label: '¿En qué estado está el campo colectivo?' },
    { id: 'senales',    label: '¿Qué señales débiles están apareciendo?' },
    { id: 'silencio',   label: '¿Qué no se está nombrando en ningún lente?' },
    { id: 'ruido',      label: 'Sugerir conversaciones ruido' },
  ]

  const cajas: { id: string; nombre: string; conteo: number; desc: string; color: string }[] = [
    { id: 'analisis',       nombre: 'Análisis',       conteo: conversaciones.length,   desc: 'Leer el campo con el Duende',       color: '#8B6914' },
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
              onClick={() => {
                if (c.id === 'analisis') { setCampoModal(true); return }
                setModalAbierto(c.id as typeof modalAbierto)
              }}
              style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(34,58,54,0.10)', borderRadius: 14, padding: '22px 20px 18px', cursor: 'pointer', transition: 'box-shadow 0.15s', display: 'flex', flexDirection: 'column', gap: 6 }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 18px rgba(0,0,0,0.10)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = ''}
            >
              <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: c.color }}>{c.nombre}</div>
              {c.id === 'analisis'
                ? <div style={{ fontSize: '2rem', fontWeight: 400, color: '#8B6914', lineHeight: 1 }}>✦</div>
                : <div style={{ fontSize: '2.4rem', fontWeight: 700, letterSpacing: '-0.04em', color: '#18201e', lineHeight: 1 }}>{c.conteo}</div>
              }
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

                  // Filtro de estado: por defecto solo activas
                  const estadoActivo = convFiltroEstado ?? 'activa'
                  const conversacionesFiltradas = conversaciones.filter(c => (c.estado ?? 'activa') === estadoActivo)

                  // Derived data
                  const byUser = new Map<string, DuendeConv[]>()
                  const byLente = new Map<string, DuendeConv[]>()
                  for (const c of conversacionesFiltradas) {
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
                  const seccionTitulo = (label: string) => (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '18px 0 10px' }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: '#8a9e98', whiteSpace: 'nowrap' as const }}>{label}</span>
                      <div style={{ flex: 1, height: 1, background: 'rgba(34,58,54,.10)' }} />
                    </div>
                  )

                  const btnMini: React.CSSProperties = { background: 'none', border: '1px solid', borderRadius: 5, padding: '2px 8px', fontSize: '0.7rem', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' as const, lineHeight: 1.5 }

                  const ESTADO_CONV_COLORS: Record<DuendeConvEstado, string> = { activa: '#2e7d56', archivada: '#8B6914', ruido: '#9e3a3a' }
                  const ESTADO_CONV_BG: Record<DuendeConvEstado, string> = { activa: 'rgba(46,125,86,.1)', archivada: 'rgba(139,105,20,.1)', ruido: 'rgba(158,58,58,.1)' }

                  const convCard = (c: DuendeConv, showEmail: boolean) => {
                    const expanded = convExpandedMsgs.has(c.id)
                    const toggle = () => setConvExpandedMsgs(prev => { const s = new Set(prev); s.has(c.id) ? s.delete(c.id) : s.add(c.id); return s })
                    const estadoActual: DuendeConvEstado = (c.estado as DuendeConvEstado) ?? 'activa'
                    const seleccionado = convSeleccionados.has(c.id)
                    const toggleSeleccion = (e: React.MouseEvent) => { e.stopPropagation(); setConvSeleccionados(prev => { const s = new Set(prev); seleccionado ? s.delete(c.id) : s.add(c.id); return s }) }
                    return (
                      <div key={c.id} style={{ borderRadius: 8, background: seleccionado ? 'rgba(34,58,54,.06)' : 'rgba(255,255,255,.8)', border: `1px solid ${seleccionado ? 'rgba(34,58,54,.3)' : 'rgba(34,58,54,.08)'}`, overflow: 'hidden' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', gap: 8 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
                            {convSeleccionModo && (
                              <input type="checkbox" checked={seleccionado} onChange={() => {}} onClick={toggleSeleccion} style={{ width: 15, height: 15, cursor: 'pointer', flexShrink: 0, accentColor: '#18201e' }} />
                            )}
                            {showEmail && <span style={{ fontSize: '0.75rem', color: '#4eaa98', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{c.email_participante ?? '—'}</span>}
                            <span style={{ fontSize: '0.72rem', color: '#8a9e98', flexShrink: 0 }}>{fmt(c.created_at)}</span>
                            <span style={{ fontSize: '0.68rem', fontWeight: 600, color: ESTADO_CONV_COLORS[estadoActual], background: ESTADO_CONV_BG[estadoActual], borderRadius: 4, padding: '1px 6px', flexShrink: 0 }}>{estadoActual}</span>
                          </div>
                          <div style={{ display: 'flex', gap: 5, flexShrink: 0, alignItems: 'center' }}>
                            <select
                              value={estadoActual}
                              onChange={e => actualizarEstadoConv(c.id, e.target.value as DuendeConvEstado)}
                              onClick={e => e.stopPropagation()}
                              style={{ fontSize: '0.7rem', border: '1px solid rgba(34,58,54,.2)', borderRadius: 5, padding: '2px 4px', background: 'white', color: '#2c3830', cursor: 'pointer', fontFamily: 'inherit' }}
                            >
                              <option value="activa">Activa</option>
                              <option value="archivada">Archivada</option>
                              <option value="ruido">Ruido</option>
                            </select>
                            <button onClick={toggle} style={{ ...btnMini, color: '#8B6914', borderColor: 'rgba(139,105,20,.3)' }}>{expanded ? 'Cerrar' : 'Ver conversación'}</button>
                            <a href={`/admin/conversacion/${c.id}`} target="_blank" rel="noopener noreferrer" style={{ ...btnMini, color: '#66706d', borderColor: 'rgba(34,58,54,.2)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>↗</a>
                          </div>
                        </div>
                        {!expanded && (
                          <div style={{ padding: '0 12px 8px', fontSize: '0.78rem', color: '#2c3830', lineHeight: 1.5, fontStyle: 'italic', fontWeight: 300 }}>{firstUserMsg(c).slice(0, 120)}{firstUserMsg(c).length > 120 ? '…' : ''}</div>
                        )}
                        {expanded && (
                          <div style={{ padding: '0 10px 10px', display: 'flex', flexDirection: 'column', gap: 5, maxHeight: 380, overflowY: 'auto' as const }}>
                            {c.mensajes.map((m, i) => (
                              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                                <div style={{ maxWidth: '82%', padding: '7px 11px', borderRadius: m.role === 'user' ? '10px 10px 2px 10px' : '10px 10px 10px 2px', background: m.role === 'user' ? 'rgba(78,170,152,.13)' : 'rgba(247,243,232,.9)', border: '1px solid ' + (m.role === 'user' ? 'rgba(78,170,152,.22)' : 'rgba(34,58,54,.09)') }}>
                                  {m.timestamp && <p style={{ fontSize: '0.65rem', color: '#8a9e98', margin: '0 0 2px' }}>{new Date(m.timestamp).toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' })}</p>}
                                  <p style={{ fontSize: '0.8rem', color: '#2c3830', lineHeight: 1.6, margin: 0, fontStyle: m.role === 'assistant' ? 'italic' : 'normal', fontWeight: 300 }}>{m.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  }

                  const filtroBtn = (val: DuendeConvEstado | null, label: string, color: string) => (
                    <button
                      onClick={() => setConvFiltroEstado(val)}
                      style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid', cursor: 'pointer', fontSize: '0.72rem', fontFamily: 'inherit',
                        background: estadoActivo === (val ?? 'activa') ? `rgba(${color},.15)` : 'transparent',
                        borderColor: estadoActivo === (val ?? 'activa') ? `rgba(${color},.5)` : 'rgba(34,58,54,.15)',
                        color: estadoActivo === (val ?? 'activa') ? '#18201e' : '#8a9e98',
                        fontWeight: estadoActivo === (val ?? 'activa') ? 600 : 400 }}
                    >{label} <span style={{ opacity: 0.6 }}>({conversaciones.filter(c => (c.estado ?? 'activa') === (val ?? 'activa')).length})</span></button>
                  )

                  return (
                    <div>
                      {/* Filtro de estado + botón Seleccionar */}
                      <div style={{ display: 'flex', gap: 6, marginBottom: 14, alignItems: 'center', flexWrap: 'wrap' as const }}>
                        <span style={{ fontSize: '0.7rem', color: '#8a9e98', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginRight: 4 }}>Ver</span>
                        {filtroBtn(null, 'Activas', '46,125,86')}
                        {filtroBtn('archivada', 'Archivadas', '139,105,20')}
                        {filtroBtn('ruido', 'Ruido', '158,58,58')}
                        <div style={{ flex: 1 }} />
                        <button
                          onClick={() => { setConvSeleccionModo(prev => !prev); setConvSeleccionados(new Set()) }}
                          style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid', cursor: 'pointer', fontSize: '0.72rem', fontFamily: 'inherit',
                            background: convSeleccionModo ? 'rgba(34,58,54,.12)' : 'transparent',
                            borderColor: convSeleccionModo ? 'rgba(34,58,54,.4)' : 'rgba(34,58,54,.2)',
                            color: convSeleccionModo ? '#18201e' : '#66706d', fontWeight: convSeleccionModo ? 600 : 400 }}
                        >{convSeleccionModo ? 'Cancelar' : 'Seleccionar'}</button>
                      </div>

                      {/* Barra de acciones cuando hay seleccionados */}
                      {convSeleccionModo && convSeleccionados.size > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, padding: '10px 14px', background: 'rgba(34,58,54,.06)', borderRadius: 8, border: '1px solid rgba(34,58,54,.12)' }}>
                          <span style={{ fontSize: '0.78rem', color: '#18201e', fontWeight: 500 }}>{convSeleccionados.size} seleccionada{convSeleccionados.size !== 1 ? 's' : ''}</span>
                          <div style={{ flex: 1 }} />
                          <button
                            onClick={() => actualizarEstadoConvBulk([...convSeleccionados], 'ruido')}
                            style={{ padding: '5px 14px', borderRadius: 6, border: '1px solid rgba(158,58,58,.4)', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'inherit', background: 'rgba(158,58,58,.08)', color: '#9e3a3a', fontWeight: 500 }}
                          >Marcar como ruido</button>
                          <button
                            onClick={() => actualizarEstadoConvBulk([...convSeleccionados], 'archivada')}
                            style={{ padding: '5px 14px', borderRadius: 6, border: '1px solid rgba(139,105,20,.4)', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'inherit', background: 'rgba(139,105,20,.08)', color: '#8B6914', fontWeight: 500 }}
                          >Archivar</button>
                        </div>
                      )}

                      {conversacionesFiltradas.length === 0 && (
                        <p style={{ ...styles.empty, marginBottom: 16 }}>No hay conversaciones con estado &quot;{estadoActivo}&quot;.</p>
                      )}

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
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <span style={{ fontSize: '0.75rem', color: '#8a9e98' }}>{fmt(ultima.created_at)}</span>
                                    <button
                                      onClick={e => { e.stopPropagation(); abrirUsuarioModal(email) }}
                                      style={{ fontSize: '0.68rem', color: '#4eaa98', background: 'none', border: '1px solid rgba(78,170,152,.3)', borderRadius: 5, padding: '1px 7px', cursor: 'pointer', fontFamily: 'inherit' }}
                                    >Ver todo</button>
                                    <span style={{ color: '#8B6914', fontSize: 18, lineHeight: 1 }}>{isOpen ? '−' : '+'}</span>
                                  </div>
                                </div>
                                {isOpen && (
                                  <div style={{ padding: '0 16px 16px', background: 'rgba(139,105,20,.02)' }}>
                                    {(['lente', 'resonancia'] as const).map(tipo => {
                                      const entradas = [...porCtx.entries()].filter(([ctx]) => clasificarCtx(ctx) === tipo)
                                      if (entradas.length === 0) return null
                                      return (
                                        <div key={tipo}>
                                          {seccionTitulo(tipo === 'lente' ? 'Lentes' : 'Resonancias')}
                                          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                            {entradas.map(([ctx, ctxConvs]) => (
                                              <div key={ctx}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                                                  <span style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#8B6914' }}>{ctx}</span>
                                                  <a href={`/admin/conversacion/usuario/${encodeURIComponent(email)}/lente/${encodeURIComponent(ctx)}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.68rem', color: '#8B6914', textDecoration: 'none', border: '1px solid rgba(139,105,20,.28)', borderRadius: 5, padding: '1px 7px', background: 'none', flexShrink: 0 }}>Ver todo</a>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                                  {ctxConvs.map(c => convCard(c, false))}
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}

                      {/* POR LENTE */}
                      {convTab === 'lente' && (() => {
                        const renderFila = (lente: string, convs: DuendeConv[]) => {
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
                                  <span style={{ fontSize: '0.75rem', color: '#4eaa98', background: 'rgba(78,170,152,.12)', borderRadius: 10, padding: '2px 8px' }}>{convs.length} conv{convs.length !== 1 ? 's' : ''}</span>
                                  <span style={{ fontSize: '0.75rem', color: '#66706d' }}>{usuariosDistintos} usuario{usuariosDistintos !== 1 ? 's' : ''}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                  <button onClick={e => { e.stopPropagation(); abrirLenteModal(lente) }} style={{ fontSize: '0.68rem', color: '#4eaa98', background: 'none', border: '1px solid rgba(78,170,152,.3)', borderRadius: 5, padding: '1px 7px', cursor: 'pointer', fontFamily: 'inherit' }}>Ver todo</button>
                                  <span style={{ color: '#4eaa98', fontSize: 18, lineHeight: 1 }}>{isOpen ? '−' : '+'}</span>
                                </div>
                              </div>
                              {isOpen && (
                                <div style={{ padding: '8px 12px 12px', display: 'flex', flexDirection: 'column', gap: 6, background: 'rgba(78,170,152,.02)' }}>
                                  {sorted.map(c => convCard(c, true))}
                                </div>
                              )}
                            </div>
                          )
                        }
                        const lentesEntries = [...byLente.entries()].filter(([l]) => clasificarCtx(l) === 'lente')
                        const resonanciasEntries = [...byLente.entries()].filter(([l]) => clasificarCtx(l) === 'resonancia')
                        return (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {lentesEntries.length > 0 && <>{seccionTitulo('Lentes')}{lentesEntries.map(([l, c]) => renderFila(l, c))}</>}
                            {resonanciasEntries.length > 0 && <>{seccionTitulo('Resonancias')}{resonanciasEntries.map(([l, c]) => renderFila(l, c))}</>}
                          </div>
                        )
                      })()}

                      {/* POR USUARIO Y LENTE */}
                      {convTab === 'usuariolente' && (() => {
                        const todosUsuarios = [...new Set(conversacionesFiltradas.map(c => c.email_participante ?? '(sin email)'))]
                        const todasLentes = [...new Set(conversacionesFiltradas.map(c => c.contexto_origen ?? '(sin contexto)'))]

                        const lentesDelUsuario = convSelectedUser
                          ? [...new Set(conversacionesFiltradas.filter(c => (c.email_participante ?? '(sin email)') === convSelectedUser).map(c => c.contexto_origen ?? '(sin contexto)'))]
                          : todasLentes
                        const usuariosDelaLente = convSelectedLente
                          ? [...new Set(conversacionesFiltradas.filter(c => (c.contexto_origen ?? '(sin contexto)') === convSelectedLente).map(c => c.email_participante ?? '(sin email)'))]
                          : todosUsuarios

                        const convInterseccion = (convSelectedUser && convSelectedLente)
                          ? conversacionesFiltradas.filter(c =>
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
                                <div>
                                  {(['lente', 'resonancia'] as const).map(tipo => {
                                    const activas = todasLentes.filter(l => clasificarCtx(l) === tipo && lentesDelUsuario.includes(l))
                                    const inactivas = todasLentes.filter(l => clasificarCtx(l) === tipo && !lentesDelUsuario.includes(l))
                                    if (activas.length === 0 && inactivas.length === 0) return null
                                    return (
                                      <div key={tipo}>
                                        {seccionTitulo(tipo === 'lente' ? 'Lentes' : 'Resonancias')}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                          {activas.map(l => (
                                            <div key={l} onClick={() => setConvSelectedLente(convSelectedLente === l ? null : l)} style={itemStyle(convSelectedLente === l, '139,105,20')}>{l}</div>
                                          ))}
                                          {inactivas.map(l => (
                                            <div key={l} onClick={() => { setConvSelectedLente(convSelectedLente === l ? null : l); setConvSelectedUser(null) }} style={{ ...itemStyle(false, '139,105,20'), opacity: 0.35 }}>{l}</div>
                                          ))}
                                        </div>
                                      </div>
                                    )
                                  })}
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
                                      {convInterseccion.map(c => convCard(c, false))}
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

      {/* PORTAL 1 — overlay + modal de conversaciones */}
      {mounted && lenteModal && createPortal(
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.50)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={e => { if (e.target === e.currentTarget) { setLenteModal(null); setDuendePanelOpen(false) } }}
        >
          <div style={{ width: 'min(680px,92vw)', maxHeight: '88vh', background: '#f7f3e8', borderRadius: 18, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.25)' }}>
            {/* Header */}
            <div style={{ padding: '18px 24px 14px', borderBottom: '1px solid rgba(34,58,54,.10)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 650, color: '#18201e' }}>{lenteModal.contexto}</span>
                <span style={{ fontSize: '0.72rem', color: '#8a9e98' }}>{lenteModal.convs.length} conversación{lenteModal.convs.length !== 1 ? 'es' : ''} · {new Set(lenteModal.convs.map(c => c.email_participante)).size} usuario{new Set(lenteModal.convs.map(c => c.email_participante)).size !== 1 ? 's' : ''}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  onClick={() => setDuendePanelOpen(v => !v)}
                  style={{ background: duendePanelOpen ? 'rgba(139,105,20,.15)' : 'none', border: '1px solid rgba(139,105,20,.35)', borderRadius: 8, padding: '5px 12px', fontSize: '0.75rem', fontFamily: 'inherit', fontWeight: 500, color: '#8B6914', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <span style={{ fontSize: 12 }}>✦</span>
                  {duendePanelOpen ? 'Ocultar Duende' : 'Consultar al Duende'}
                </button>
                <button onClick={() => { setLenteModal(null); setDuendePanelOpen(false) }} style={{ background: 'none', border: 'none', fontSize: 20, color: '#8A7E70', cursor: 'pointer', lineHeight: 1, padding: 4 }}>✕</button>
              </div>
            </div>

            {/* Conversaciones — área scrolleable */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', gap: 0 }}>
              {lenteModal.convs.length === 0 && <p style={{ color: '#8a9e98', fontStyle: 'italic', fontSize: '0.875rem' }}>No hay conversaciones en este contexto.</p>}
              {lenteModal.convs.map((conv, idx) => (
                <div key={conv.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: idx === 0 ? '0 0 14px' : '24px 0 14px' }}>
                    <div style={{ flex: 1, height: 1, background: 'rgba(34,58,54,.10)' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, flexShrink: 0 }}>
                      <span style={{ fontSize: '0.72rem', color: '#4eaa98', fontWeight: 500 }}>{conv.email_participante ?? '—'}</span>
                      <span style={{ fontSize: '0.65rem', color: '#8a9e98' }}>{new Date(conv.created_at).toLocaleDateString('es-UY', { day: 'numeric', month: 'short', year: 'numeric' })} · {new Date(conv.created_at).toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div style={{ flex: 1, height: 1, background: 'rgba(34,58,54,.10)' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {conv.mensajes.map((m, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                        <div style={{ maxWidth: '72%', padding: '10px 14px', borderRadius: m.role === 'user' ? '14px 14px 3px 14px' : '14px 14px 14px 3px', background: m.role === 'user' ? 'rgba(78,170,152,.14)' : 'rgba(255,255,255,.92)', border: '1px solid ' + (m.role === 'user' ? 'rgba(78,170,152,.25)' : 'rgba(34,58,54,.10)'), boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
                          <p style={{ fontSize: '0.68rem', fontWeight: 600, color: m.role === 'user' ? '#4eaa98' : '#8B6914', margin: '0 0 4px', letterSpacing: '0.07em', textTransform: 'uppercase' as const }}>{m.role === 'user' ? (conv.nombre_participante || conv.email_participante || 'Usuario') : 'El Duende'}</p>
                          <p style={{ fontSize: '0.85rem', color: '#2c3830', lineHeight: 1.7, margin: 0, fontStyle: m.role === 'assistant' ? 'italic' : 'normal', fontWeight: 300, whiteSpace: 'pre-wrap' as const }}>{m.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* PORTAL 2 — panel flotante Duende bottom-right */}
      {mounted && lenteModal && duendePanelOpen && createPortal(
        <div style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 520, width: 'min(480px,90vw)', height: '60vh', background: 'rgba(252,248,240,0.98)', borderRadius: 16, boxShadow: '0 16px 48px rgba(0,0,0,0.22)', border: '1px solid rgba(139,105,20,.20)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Header del panel */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px 10px', borderBottom: '1px solid rgba(139,105,20,.15)', flexShrink: 0 }}>
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#a08030', marginBottom: 2 }}>Análisis del Duende</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 650, color: '#18201e', lineHeight: 1.2 }}>{lenteModal.contexto}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.65rem', color: '#8a9e98' }}>{lenteModal.convs.length} conv · Corpus Madre</span>
              <button onClick={() => setDuendePanelOpen(false)} style={{ background: 'none', border: 'none', fontSize: 16, color: '#8A7E70', cursor: 'pointer', lineHeight: 1, padding: 2 }}>✕</button>
            </div>
          </div>

          {/* Hilo conversacional + sesiones anteriores */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px 8px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {hiloArquitecto.length === 0 && analisisHistorial.length === 0 && (
              <p style={{ fontSize: '0.78rem', color: '#a08030', fontStyle: 'italic', textAlign: 'center', marginTop: 16 }}>
                Hacé tu primera consulta sobre este lente.
              </p>
            )}
            {hiloArquitecto.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '88%', padding: '10px 14px',
                  borderRadius: m.role === 'user' ? '14px 14px 3px 14px' : '14px 14px 14px 3px',
                  background: m.role === 'user' ? 'rgba(139,105,20,.12)' : 'rgba(255,255,255,.80)',
                  border: '1px solid ' + (m.role === 'user' ? 'rgba(139,105,20,.22)' : 'rgba(139,105,20,.12)'),
                }}>
                  <p style={{ fontSize: '0.65rem', fontWeight: 600, color: m.role === 'user' ? '#8B6914' : '#a08030', margin: '0 0 5px', letterSpacing: '0.07em', textTransform: 'uppercase' as const }}>
                    {m.role === 'user' ? 'Arquitecto' : 'Duende'}
                  </p>
                  {m.role === 'assistant'
                    ? <div style={{ fontSize: '0.85rem', color: '#2c3830', lineHeight: 1.75, fontStyle: 'normal', fontWeight: 300 }}>{renderMarkdown(m.content)}</div>
                    : <p style={{ fontSize: '0.85rem', color: '#2c3830', lineHeight: 1.7, margin: 0, fontWeight: 300 }}>{m.content}</p>
                  }
                </div>
              </div>
            ))}
            {analizando && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: '10px 14px', borderRadius: '14px 14px 14px 3px', background: 'rgba(255,255,255,.80)', border: '1px solid rgba(139,105,20,.12)' }}>
                  <p style={{ fontSize: '0.78rem', color: '#a08030', fontStyle: 'italic', margin: 0 }}>El Duende está pensando…</p>
                </div>
              </div>
            )}
            <div ref={hiloEndRef} />
            {analisisHistorial.length > 0 && (
              <>
                {hiloArquitecto.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '8px 0 4px' }}>
                    <div style={{ flex: 1, height: 1, background: 'rgba(139,105,20,.12)' }} />
                    <span style={{ fontSize: '0.62rem', color: '#a08030', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>sesiones anteriores</span>
                    <div style={{ flex: 1, height: 1, background: 'rgba(139,105,20,.12)' }} />
                  </div>
                )}
                {analisisHistorial.map(a => (
                  <div key={a.id} style={{ background: 'rgba(255,255,255,.55)', border: '1px solid rgba(139,105,20,.14)', borderRadius: 10, overflow: 'hidden' }}>
                    <div
                      onClick={() => setAnalisisExpandido(analisisExpandido === a.id ? null : a.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 13px', cursor: 'pointer' }}
                    >
                      <span style={{ flex: 1, fontSize: '0.78rem', color: '#2c3830', fontWeight: 500 }}>{a.consulta}</span>
                      <span style={{ fontSize: '0.62rem', color: '#a08030', flexShrink: 0 }}>{fmt(a.created_at)}</span>
                      <span style={{ color: '#8B6914', fontSize: 14, lineHeight: 1, flexShrink: 0 }}>{analisisExpandido === a.id ? '−' : '+'}</span>
                    </div>
                    {analisisExpandido === a.id && (
                      <div style={{ padding: '0 13px 13px', borderTop: '1px solid rgba(139,105,20,.10)' }}>
                        <div style={{ fontSize: '0.85rem', color: '#2c3830', lineHeight: 1.75, margin: '10px 0 10px', fontStyle: 'italic', fontWeight: 300 }}>
                          {renderMarkdown(a.respuesta)}
                        </div>
                        {a.fuentes.length > 0 && (
                          <div style={{ background: 'rgba(139,105,20,.07)', borderRadius: 8, padding: '8px 10px' }}>
                            <div style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#8B6914', marginBottom: 6 }}>Aportaron</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 5 }}>
                              {[...new Map(a.fuentes.map(f => [f.email, f])).values()].map(f => (
                                <button
                                  key={f.id}
                                  onClick={() => window.open(`/admin/conversacion/usuario/${encodeURIComponent(f.email ?? '')}/lente/${encodeURIComponent(f.contexto)}`, '_blank')}
                                  style={{ fontSize: '0.7rem', color: '#8B6914', background: 'rgba(139,105,20,.10)', border: '1px solid rgba(139,105,20,.20)', borderRadius: 20, padding: '2px 9px', cursor: 'pointer', fontFamily: 'inherit' }}
                                >
                                  {f.email ?? 'anónimo'}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Input */}
          <div style={{ flexShrink: 0, padding: '10px 16px 16px', display: 'flex', gap: 10, alignItems: 'flex-end', borderTop: '1px solid rgba(139,105,20,.10)' }}>
            <textarea
              value={consultaInput}
              onChange={e => setConsultaInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ejecutarAnalisis() } }}
              placeholder="¿Qué patrones emergen? ¿Qué no se está nombrando?"
              rows={2}
              disabled={analizando || lenteModal.convs.length === 0}
              style={{ flex: 1, resize: 'none', border: '1px solid rgba(139,105,20,.25)', borderRadius: 10, padding: '10px 14px', fontSize: '0.875rem', fontFamily: 'inherit', fontWeight: 300, color: '#2c3830', background: 'rgba(255,255,255,.7)', outline: 'none', lineHeight: 1.6 }}
            />
            <button
              onClick={ejecutarAnalisis}
              disabled={!consultaInput.trim() || analizando || lenteModal.convs.length === 0}
              style={{ flexShrink: 0, background: '#8B6914', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 18px', fontSize: '0.82rem', fontFamily: 'inherit', fontWeight: 500, cursor: 'pointer', opacity: (!consultaInput.trim() || analizando) ? 0.45 : 1, transition: 'opacity 0.2s', whiteSpace: 'nowrap' as const }}
            >
              {analizando ? 'Analizando…' : 'Consultar'}
            </button>
          </div>
        </div>,
        document.body
      )}

      {mounted && campoModal && createPortal(
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.50)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={e => { if (e.target === e.currentTarget) setCampoModal(false) }}
        >
          <div style={{ width: 'min(720px,94vw)', maxHeight: '88vh', background: '#f7f3e8', borderRadius: 18, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.22)' }}>
            {/* Header */}
            <div style={{ padding: '18px 24px 14px', borderBottom: '1px solid rgba(34,58,54,.10)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#8B6914' }}>Análisis del Duende</div>
                <span style={{ fontSize: '0.95rem', fontWeight: 650, color: '#18201e' }}>El campo completo</span>
                <span style={{ fontSize: '0.72rem', color: '#8a9e98' }}>{conversaciones.length} conversaciones · todos los lentes y resonancias</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                {(campoHilo.length > 0 || campoSugerencias !== null) && (
                  <button
                    onClick={() => { setCampoHilo([]); setCampoReporteActivo(null); setCampoInput(''); setCampoAnalizando(false); setCampoSugerencias(null); setCampoSugerenciasSelec(new Set()) }}
                    style={{ background: 'rgba(139,105,20,.08)', border: '1px solid rgba(139,105,20,.22)', borderRadius: 8, padding: '6px 12px', fontSize: '0.78rem', color: '#8B6914', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}
                  >
                    ← Menú
                  </button>
                )}
                <button onClick={() => setCampoModal(false)} style={{ background: 'none', border: 'none', fontSize: 20, color: '#8A7E70', cursor: 'pointer', lineHeight: 1, padding: 4 }}>✕</button>
              </div>
            </div>

            {/* Spinner mientras analiza ruido */}
            {campoAnalizando && campoSugerencias === null && campoHilo.length === 0 && (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
                <p style={{ fontSize: '0.875rem', color: '#a08030', fontStyle: 'italic' }}>El Duende está analizando las conversaciones…</p>
              </div>
            )}

            {/* Vista de sugerencias ruido */}
            {campoSugerencias !== null && !campoAnalizando && (
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <p style={{ fontSize: '0.75rem', color: '#8a9e98', margin: '0 0 4px', fontStyle: 'italic' }}>
                  {campoSugerencias.length === 0
                    ? 'El Duende no encontró conversaciones candidatas a ruido.'
                    : `${campoSugerencias.length} conversación${campoSugerencias.length !== 1 ? 'es' : ''} sugerida${campoSugerencias.length !== 1 ? 's' : ''}. Destildá las que no acordás y aplicá.`}
                </p>
                {campoSugerencias.map(s => {
                  const sel = campoSugerenciasSelec.has(s.id)
                  return (
                    <div key={s.id} onClick={() => setCampoSugerenciasSelec(prev => { const n = new Set(prev); sel ? n.delete(s.id) : n.add(s.id); return n })}
                      style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', borderRadius: 8, background: sel ? 'rgba(255,255,255,.9)' : 'rgba(255,255,255,.4)', border: `1px solid ${sel ? 'rgba(34,58,54,.2)' : 'rgba(34,58,54,.08)'}`, cursor: 'pointer', opacity: sel ? 1 : 0.5, transition: 'all 0.15s' }}>
                      <input type="checkbox" checked={sel} onChange={() => {}} onClick={e => e.stopPropagation()} style={{ marginTop: 2, width: 14, height: 14, cursor: 'pointer', accentColor: '#18201e', flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' as const }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 500, color: '#18201e' }}>{s.email ?? '(sin email)'}</span>
                          {s.contexto && <span style={{ fontSize: '0.68rem', color: '#8B6914', background: 'rgba(139,105,20,.1)', borderRadius: 4, padding: '1px 6px' }}>{s.contexto}</span>}
                          <span style={{ fontSize: '0.68rem', fontWeight: 600, color: s.recomendacion === 'ruido' ? '#9e3a3a' : '#8B6914', background: s.recomendacion === 'ruido' ? 'rgba(158,58,58,.1)' : 'rgba(139,105,20,.1)', borderRadius: 4, padding: '1px 6px', marginLeft: 'auto' }}>{s.recomendacion}</span>
                        </div>
                        <p style={{ fontSize: '0.78rem', color: '#4a5c58', margin: 0, lineHeight: 1.5, fontStyle: 'italic' }}>{s.razon}</p>
                      </div>
                    </div>
                  )
                })}
                {campoSugerencias.length > 0 && (
                  <button
                    disabled={campoSugerenciasSelec.size === 0}
                    onClick={async () => {
                      const ruido = [...campoSugerenciasSelec].filter(id => campoSugerencias.find(s => s.id === id)?.recomendacion === 'ruido')
                      const archivar = [...campoSugerenciasSelec].filter(id => campoSugerencias.find(s => s.id === id)?.recomendacion === 'archivar')
                      if (ruido.length > 0) await actualizarEstadoConvBulk(ruido, 'ruido')
                      if (archivar.length > 0) await actualizarEstadoConvBulk(archivar, 'archivada')
                      setCampoSugerencias(null)
                      setCampoSugerenciasSelec(new Set())
                    }}
                    style={{ marginTop: 8, background: '#18201e', color: '#f7f3e8', border: 'none', borderRadius: 10, padding: '11px 20px', fontSize: '0.875rem', fontFamily: 'inherit', fontWeight: 500, cursor: 'pointer', opacity: campoSugerenciasSelec.size === 0 ? 0.4 : 1, transition: 'opacity 0.15s' }}
                  >
                    Aplicar selección ({campoSugerenciasSelec.size})
                  </button>
                )}
              </div>
            )}

            {/* Si no hay hilo activo → mostrar menú de reportes */}
            {campoHilo.length === 0 && !campoAnalizando && campoSugerencias === null && (
              <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <p style={{ fontSize: '0.75rem', color: '#8a9e98', margin: '0 0 8px', fontStyle: 'italic' }}>
                  Elegí un reporte para que el Duende analice el campo completo, o escribí tu propia consulta abajo.
                </p>
                {REPORTES_CAMPO.map(r => (
                  <button
                    key={r.id}
                    onClick={() => { setCampoReporteActivo(r.id); ejecutarAnalisisCampo(r.label, r.id) }}
                    style={{ textAlign: 'left' as const, background: 'rgba(139,105,20,.06)', border: '1px solid rgba(139,105,20,.18)', borderRadius: 10, padding: '12px 16px', fontSize: '0.875rem', color: '#2c3830', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 400, lineHeight: 1.5, transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(139,105,20,.12)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(139,105,20,.06)')}
                  >
                    <span style={{ color: '#8B6914', marginRight: 8 }}>✦</span>{r.label}
                  </button>
                ))}
              </div>
            )}

            {/* Si hay hilo → mostrar conversación */}
            {campoSugerencias === null && (campoHilo.length > 0 || (campoAnalizando && campoHilo.length > 0)) && (
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {campoHilo.map((m, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                    <div style={{ maxWidth: '88%', padding: '11px 15px', borderRadius: m.role === 'user' ? '14px 14px 3px 14px' : '14px 14px 14px 3px', background: m.role === 'user' ? 'rgba(139,105,20,.10)' : 'rgba(255,255,255,.90)', border: '1px solid ' + (m.role === 'user' ? 'rgba(139,105,20,.20)' : 'rgba(34,58,54,.10)'), boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
                      <p style={{ fontSize: '0.65rem', fontWeight: 600, color: m.role === 'user' ? '#8B6914' : '#a08030', margin: '0 0 5px', letterSpacing: '0.07em', textTransform: 'uppercase' as const }}>
                        {m.role === 'user' ? 'Arquitecto' : 'Duende'}
                      </p>
                      {m.role === 'assistant'
                        ? <div style={{ fontSize: '0.875rem', color: '#2c3830', lineHeight: 1.8, fontStyle: 'normal', fontWeight: 300 }}>{renderMarkdown(m.content)}</div>
                        : <p style={{ fontSize: '0.875rem', color: '#2c3830', lineHeight: 1.7, margin: 0, fontWeight: 300 }}>{m.content}</p>
                      }
                    </div>
                  </div>
                ))}
                {campoAnalizando && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={{ padding: '11px 15px', borderRadius: '14px 14px 14px 3px', background: 'rgba(255,255,255,.90)', border: '1px solid rgba(34,58,54,.10)' }}>
                      <p style={{ fontSize: '0.78rem', color: '#a08030', fontStyle: 'italic', margin: 0 }}>El Duende está leyendo el campo…</p>
                    </div>
                  </div>
                )}
                <div ref={campoHiloEndRef} />
              </div>
            )}

            {/* Input — visible cuando hay hilo normal activo */}
            {campoSugerencias === null && (campoHilo.length > 0 || campoAnalizando) && (
              <div style={{ flexShrink: 0, padding: '12px 24px 18px', borderTop: '1px solid rgba(34,58,54,.08)', display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                <textarea
                  value={campoInput}
                  onChange={e => setCampoInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ejecutarAnalisisCampo(campoInput) } }}
                  placeholder="Seguí explorando el campo…"
                  rows={2}
                  disabled={campoAnalizando}
                  style={{ flex: 1, resize: 'none', border: '1px solid rgba(139,105,20,.25)', borderRadius: 10, padding: '10px 14px', fontSize: '0.875rem', fontFamily: 'inherit', fontWeight: 300, color: '#2c3830', background: 'rgba(255,255,255,.75)', outline: 'none', lineHeight: 1.6 }}
                />
                <button
                  onClick={() => ejecutarAnalisisCampo(campoInput)}
                  disabled={!campoInput.trim() || campoAnalizando}
                  style={{ flexShrink: 0, background: '#8B6914', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 18px', fontSize: '0.82rem', fontFamily: 'inherit', fontWeight: 500, cursor: 'pointer', opacity: (!campoInput.trim() || campoAnalizando) ? 0.45 : 1, whiteSpace: 'nowrap' as const }}
                >
                  Consultar
                </button>
              </div>
            )}

            {/* Botón para volver al menú si ya hay hilo */}
          </div>
        </div>,
        document.body
      )}

      {/* PORTAL — Modal conversaciones por usuario */}
      {mounted && usuarioModal && createPortal(
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.50)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={e => { if (e.target === e.currentTarget) { setUsuarioModal(null); setUsuarioDuendePanelOpen(false) } }}
        >
          <div style={{ width: 'min(680px,92vw)', maxHeight: '88vh', background: '#f7f3e8', borderRadius: 18, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.22)' }}>
            <div style={{ padding: '18px 24px 14px', borderBottom: '1px solid rgba(34,58,54,.10)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 650, color: '#18201e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{usuarioModal.email}</span>
                <span style={{ fontSize: '0.72rem', color: '#8a9e98' }}>{usuarioModal.convs.length} conversación{usuarioModal.convs.length !== 1 ? 'es' : ''} · {new Set(usuarioModal.convs.map(c => c.contexto_origen)).size} contextos</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <button
                  onClick={() => setUsuarioDuendePanelOpen(d => !d)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, background: usuarioDuendePanelOpen ? 'rgba(139,105,20,.18)' : 'rgba(139,105,20,.08)', border: '1px solid rgba(139,105,20,.30)', borderRadius: 8, padding: '6px 12px', fontSize: '0.78rem', color: '#8B6914', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}
                >
                  <span>✦</span> {usuarioDuendePanelOpen ? 'Ocultar Duende' : 'Consultar al Duende'}
                </button>
                <button onClick={() => { setUsuarioModal(null); setUsuarioDuendePanelOpen(false) }} style={{ background: 'none', border: 'none', fontSize: 20, color: '#8A7E70', cursor: 'pointer', lineHeight: 1, padding: 4 }}>✕</button>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 28px', display: 'flex', flexDirection: 'column', gap: 0 }}>
              {usuarioModal.convs.length === 0 && <p style={{ color: '#8a9e98', fontStyle: 'italic', fontSize: '0.875rem' }}>No hay conversaciones para este usuario.</p>}
              {usuarioModal.convs.map((conv, idx) => (
                <div key={conv.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: idx === 0 ? '0 0 14px' : '24px 0 14px' }}>
                    <div style={{ flex: 1, height: 1, background: 'rgba(34,58,54,.10)' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, flexShrink: 0 }}>
                      <span style={{ fontSize: '0.72rem', color: '#8B6914', fontWeight: 500 }}>{conv.contexto_origen ?? '—'}</span>
                      <span style={{ fontSize: '0.65rem', color: '#8a9e98' }}>{new Date(conv.created_at).toLocaleDateString('es-UY', { day: 'numeric', month: 'short', year: 'numeric' })} · {new Date(conv.created_at).toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div style={{ flex: 1, height: 1, background: 'rgba(34,58,54,.10)' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {conv.mensajes.map((m, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                        <div style={{ maxWidth: '72%', padding: '10px 14px', borderRadius: m.role === 'user' ? '14px 14px 3px 14px' : '14px 14px 14px 3px', background: m.role === 'user' ? 'rgba(78,170,152,.14)' : 'rgba(255,255,255,.92)', border: '1px solid ' + (m.role === 'user' ? 'rgba(78,170,152,.25)' : 'rgba(34,58,54,.10)'), boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
                          <p style={{ fontSize: '0.68rem', fontWeight: 600, color: m.role === 'user' ? '#4eaa98' : '#8B6914', margin: '0 0 4px', letterSpacing: '0.07em', textTransform: 'uppercase' as const }}>{m.role === 'user' ? (conv.nombre_participante || conv.email_participante || 'Usuario') : 'El Duende'}</p>
                          <p style={{ fontSize: '0.85rem', color: '#2c3830', lineHeight: 1.7, margin: 0, fontStyle: m.role === 'assistant' ? 'italic' : 'normal', fontWeight: 300, whiteSpace: 'pre-wrap' as const }}>{m.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* PORTAL — Ventana flotante Duende por usuario */}
      {mounted && usuarioModal && usuarioDuendePanelOpen && createPortal(
        <div style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 520, width: 'min(480px,90vw)', height: '60vh', background: 'linear-gradient(160deg,#fdf6e3,#f7edcf)', borderRadius: 18, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 32px 80px rgba(139,105,20,0.28), 0 0 0 1px rgba(139,105,20,0.20)' }}>
          <div style={{ padding: '14px 18px 12px', borderBottom: '1px solid rgba(139,105,20,.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#a08030', marginBottom: 2 }}>Análisis del Duende</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 650, color: '#18201e', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, maxWidth: 340 }}>{usuarioModal.email}</div>
            </div>
            <button onClick={() => setUsuarioDuendePanelOpen(false)} style={{ background: 'none', border: 'none', fontSize: 17, color: '#a08030', cursor: 'pointer', lineHeight: 1, padding: 4 }}>✕</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {usuarioHilo.length === 0 && !usuarioAnalizando && (
              <p style={{ fontSize: '0.78rem', color: '#a08030', fontStyle: 'italic', textAlign: 'center', marginTop: 20 }}>
                Preguntá al Duende sobre este usuario.
              </p>
            )}
            {usuarioHilo.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '88%', padding: '10px 13px', borderRadius: m.role === 'user' ? '14px 14px 3px 14px' : '14px 14px 14px 3px', background: m.role === 'user' ? 'rgba(139,105,20,.12)' : 'rgba(255,255,255,.80)', border: '1px solid ' + (m.role === 'user' ? 'rgba(139,105,20,.22)' : 'rgba(139,105,20,.12)') }}>
                  <p style={{ fontSize: '0.62rem', fontWeight: 600, color: m.role === 'user' ? '#8B6914' : '#a08030', margin: '0 0 4px', letterSpacing: '0.07em', textTransform: 'uppercase' as const }}>{m.role === 'user' ? 'Arquitecto' : 'Duende'}</p>
                  {m.role === 'assistant'
                    ? <div style={{ fontSize: '0.85rem', color: '#2c3830', lineHeight: 1.75, fontWeight: 300 }}>{renderMarkdown(m.content)}</div>
                    : <p style={{ fontSize: '0.85rem', color: '#2c3830', lineHeight: 1.7, margin: 0, fontWeight: 300 }}>{m.content}</p>
                  }
                </div>
              </div>
            ))}
            {usuarioAnalizando && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: '10px 13px', borderRadius: '14px 14px 14px 3px', background: 'rgba(255,255,255,.80)', border: '1px solid rgba(139,105,20,.12)' }}>
                  <p style={{ fontSize: '0.78rem', color: '#a08030', fontStyle: 'italic', margin: 0 }}>El Duende está pensando…</p>
                </div>
              </div>
            )}
            <div ref={usuarioHiloEndRef} />
          </div>
          <div style={{ flexShrink: 0, padding: '10px 18px 14px', borderTop: '1px solid rgba(139,105,20,.15)' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <textarea
                value={usuarioInput}
                onChange={e => setUsuarioInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ejecutarAnalisisUsuario() } }}
                placeholder="¿Qué está explorando este usuario? ¿Qué patrones tiene?"
                rows={2}
                disabled={usuarioAnalizando}
                style={{ flex: 1, resize: 'none', border: '1px solid rgba(139,105,20,.25)', borderRadius: 10, padding: '9px 12px', fontSize: '0.85rem', fontFamily: 'inherit', fontWeight: 300, color: '#2c3830', background: 'rgba(255,255,255,.75)', outline: 'none', lineHeight: 1.6 }}
              />
              <button
                onClick={ejecutarAnalisisUsuario}
                disabled={!usuarioInput.trim() || usuarioAnalizando}
                style={{ flexShrink: 0, background: '#8B6914', color: '#fff', border: 'none', borderRadius: 10, padding: '9px 16px', fontSize: '0.82rem', fontFamily: 'inherit', fontWeight: 500, cursor: 'pointer', opacity: (!usuarioInput.trim() || usuarioAnalizando) ? 0.45 : 1, whiteSpace: 'nowrap' as const }}
              >
                {usuarioAnalizando ? '…' : 'Consultar'}
              </button>
            </div>
          </div>
        </div>,
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
