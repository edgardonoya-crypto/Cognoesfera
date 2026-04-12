'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/app/lib/supabase'

const ARQUITECTO_EMAILS = new Set(['edgardo.noya@gmail.com', 'edgardo.noya@quanam.com'])
const LENTES_CONOCIDAS = new Set(['El ángulo propio', 'La pregunta viva', 'La intuición central', 'El hilo conector', 'El experimento pendiente'])

type DuendeMensaje = { role: 'user' | 'assistant'; content: string; timestamp?: string }
type DuendeConv = {
  id: string
  nombre_participante: string | null
  email_participante: string | null
  contexto_origen: string | null
  mensajes: DuendeMensaje[]
  created_at: string
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('es-UY', { day: 'numeric', month: 'long', year: 'numeric' })
}
function fmtHora(iso: string) {
  return new Date(iso).toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' })
}

export default function UsuarioLentePage() {
  const router = useRouter()
  const params = useParams()
  const email = decodeURIComponent(params.email as string)
  const contexto = decodeURIComponent(params.contexto as string)

  const [convs, setConvs] = useState<DuendeConv[]>([])
  const [status, setStatus] = useState<'loading' | 'unauth' | 'ok'>('loading')

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session || !ARQUITECTO_EMAILS.has(session.user.email ?? '')) { setStatus('unauth'); return }

      const res = await fetch('/api/admin/duende-chats', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      const json = await res.json()
      const todas: DuendeConv[] = json.data ?? []
      const filtradas = todas
        .filter(c =>
          (c.email_participante ?? '') === email &&
          (c.contexto_origen ?? '') === contexto &&
          Array.isArray(c.mensajes) && c.mensajes.length > 0
        )
        .sort((a, b) => a.created_at.localeCompare(b.created_at))
      setConvs(filtradas)
      setStatus('ok')
    }
    load()
  }, [email, contexto])

  const tipoCtx = LENTES_CONOCIDAS.has(contexto) ? 'Lente' : 'Resonancia'
  const colorCtx = tipoCtx === 'Lente' ? '#4a7040' : '#8B6914'
  const bgCtx    = tipoCtx === 'Lente' ? 'rgba(90,120,80,.10)' : 'rgba(139,105,20,.10)'

  if (status === 'loading') return <div style={s.center}>Cargando…</div>
  if (status === 'unauth')  return <div style={s.center}>Acceso no autorizado</div>

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.header}>
          <button onClick={() => router.push('/admin')} style={s.back}>← Volver al admin</button>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: '1rem', fontWeight: 600, color: '#18201e' }}>{email}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' as const }}>
              <span style={{ fontSize: '0.875rem', color: '#2c3830', fontWeight: 500 }}>{contexto}</span>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, padding: '2px 7px', borderRadius: 4, background: bgCtx, color: colorCtx, border: `1px solid ${colorCtx}44` }}>{tipoCtx}</span>
              <span style={{ fontSize: '0.78rem', color: '#8a9e98' }}>{convs.length} conversación{convs.length !== 1 ? 'es' : ''}</span>
            </div>
          </div>
        </div>

        {convs.length === 0 && <p style={s.empty}>No hay conversaciones para esta combinación.</p>}

        {convs.map((conv, idx) => (
          <div key={conv.id}>
            {/* Separador entre conversaciones */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: idx === 0 ? '0 0 16px' : '28px 0 16px' }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(34,58,54,.10)' }} />
              <span style={{ fontSize: '0.72rem', color: '#8a9e98', whiteSpace: 'nowrap' as const, flexShrink: 0 }}>{fmt(conv.created_at)} · {fmtHora(conv.created_at)}</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(34,58,54,.10)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {conv.mensajes.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '72%', padding: '10px 14px',
                    borderRadius: m.role === 'user' ? '14px 14px 3px 14px' : '14px 14px 14px 3px',
                    background: m.role === 'user' ? 'rgba(78,170,152,.14)' : 'rgba(255,255,255,.92)',
                    border: '1px solid ' + (m.role === 'user' ? 'rgba(78,170,152,.25)' : 'rgba(34,58,54,.10)'),
                    boxShadow: '0 1px 3px rgba(0,0,0,.04)',
                  }}>
                    <p style={{ fontSize: '0.72rem', fontWeight: 600, color: m.role === 'user' ? '#4eaa98' : '#8B6914', margin: '0 0 4px', letterSpacing: '0.07em', textTransform: 'uppercase' as const }}>
                      {m.role === 'user' ? (conv.nombre_participante || email) : 'El Duende'}
                    </p>
                    {m.timestamp && <p style={{ fontSize: '0.65rem', color: '#8a9e98', margin: '0 0 4px' }}>{fmtHora(m.timestamp)}</p>}
                    <p style={{ fontSize: '0.875rem', color: '#2c3830', lineHeight: 1.7, margin: 0, fontStyle: m.role === 'assistant' ? 'italic' : 'normal', fontWeight: 300, whiteSpace: 'pre-wrap' as const }}>{m.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: 'linear-gradient(180deg,#f7f3e8,#efe9da)', fontFamily: 'Inter,ui-sans-serif,system-ui,sans-serif', color: '#18201e', padding: '0 0 64px' },
  center: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter,sans-serif', color: '#66706d', background: 'linear-gradient(180deg,#f7f3e8,#efe9da)' },
  container: { maxWidth: 700, margin: '0 auto', padding: '0 24px' },
  header: { padding: '32px 0 24px', borderBottom: '1px solid rgba(34,58,54,.10)', marginBottom: 28, display: 'flex', flexDirection: 'column', gap: 16 },
  back: { background: 'none', border: '1px solid rgba(34,58,54,.18)', borderRadius: 8, padding: '5px 12px', fontSize: '0.78rem', color: '#66706d', cursor: 'pointer', fontFamily: 'inherit', alignSelf: 'flex-start' },
  empty: { color: '#8a9e98', fontStyle: 'italic', fontSize: '0.875rem', margin: '32px 0' },
}
