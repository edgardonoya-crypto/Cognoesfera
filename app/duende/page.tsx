'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/app/lib/supabase'

type Message = { role: 'user' | 'assistant'; content: string }

const css = {
  '--bg': '#f7f3e8',
  '--ink': '#18201e',
  '--gold': '#8B6914',
  '--muted': '#8A7E70',
  '--border': 'rgba(139,105,20,0.18)',
  '--bubble-user': '#18201e',
  '--bubble-duende': '#fff',
} as React.CSSProperties

export default function DuendePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [historial, setHistorial] = useState<Message[]>([])
  const [sesionId, setSesionId] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login')
      else setLoading(false)
    })
  }, [router])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [historial, sending])

  async function enviar() {
    const mensaje = input.trim()
    if (!mensaje || sending) return

    const nuevoHistorial: Message[] = [...historial, { role: 'user', content: mensaje }]
    setHistorial(nuevoHistorial)
    setInput('')
    setSending(true)

    try {
      const res = await fetch('/api/duende', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mensaje,
          historial,
          sesion_id: sesionId,
        }),
      })
      const data = await res.json()
      if (data.respuesta) {
        if (data.sesion_id) setSesionId(data.sesion_id)
        setHistorial(prev => [...prev, { role: 'assistant', content: data.respuesta }])
      } else {
        setHistorial(prev => [...prev, { role: 'assistant', content: '(El Duende no pudo responder en este momento.)' }])
      }
    } catch {
      setHistorial(prev => [...prev, { role: 'assistant', content: '(Error de conexión.)' }])
    } finally {
      setSending(false)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      enviar()
    }
  }

  if (loading) return (
    <div style={{ ...css, minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Karla, sans-serif', color: 'var(--ink)' } as React.CSSProperties}>
      Cargando…
    </div>
  )

  return (
    <div style={{ ...css, minHeight: '100vh', background: 'var(--bg)', fontFamily: 'Karla, sans-serif', color: 'var(--ink)', display: 'flex', flexDirection: 'column' } as React.CSSProperties}>

      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg)' }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 2 }}>Cognoesfera · Paradigma Aleph</div>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>El Duende</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => router.push('/dashboard')}
            style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 14px', fontSize: 13, fontFamily: 'Karla, sans-serif', color: 'var(--ink)', cursor: 'pointer' }}
          >
            ← Volver
          </button>
          <button
            onClick={async () => { await supabase.auth.signOut(); router.push('/login') }}
            style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 14px', fontSize: 13, fontFamily: 'Karla, sans-serif', color: 'var(--muted)', cursor: 'pointer' }}
          >
            Salir
          </button>
        </div>
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 0' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {historial.length === 0 && !sending && (
            <div style={{ textAlign: 'center', paddingTop: 60 }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>◈</div>
              <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.65, maxWidth: 420, margin: '0 auto' }}>
                El Duende custodia el metabolismo cognitivo del Paradigma Aleph.<br />
                Sugerís. El humano ve.
              </p>
            </div>
          )}

          {historial.map((msg, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', gap: 12, alignItems: 'flex-start' }}>
              {msg.role === 'assistant' && (
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#fff', flexShrink: 0, marginTop: 2 }}>◈</div>
              )}
              <div style={{
                maxWidth: '78%',
                background: msg.role === 'user' ? 'var(--bubble-user)' : 'var(--bubble-duende)',
                color: msg.role === 'user' ? '#f7f3e8' : 'var(--ink)',
                border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
                borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                padding: '12px 16px',
                fontSize: 15,
                lineHeight: 1.65,
                whiteSpace: 'pre-wrap',
              }}>
                {msg.content}
              </div>
            </div>
          ))}

          {sending && (
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#fff', flexShrink: 0, marginTop: 2 }}>◈</div>
              <div style={{ background: 'var(--bubble-duende)', border: '1px solid var(--border)', borderRadius: '16px 16px 16px 4px', padding: '12px 16px', fontSize: 15, color: 'var(--muted)', fontStyle: 'italic' }}>
                El Duende está pensando…
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div style={{ borderTop: '1px solid var(--border)', padding: '16px 24px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Escribí tu pregunta o señal… (Enter para enviar, Shift+Enter para nueva línea)"
            rows={2}
            style={{
              flex: 1,
              resize: 'none',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: '10px 14px',
              fontSize: 15,
              fontFamily: 'Karla, sans-serif',
              background: '#fff',
              color: 'var(--ink)',
              outline: 'none',
              lineHeight: 1.5,
            }}
          />
          <button
            onClick={enviar}
            disabled={!input.trim() || sending}
            style={{
              background: input.trim() && !sending ? 'var(--ink)' : 'rgba(24,32,30,0.15)',
              color: input.trim() && !sending ? '#f7f3e8' : 'var(--muted)',
              border: 'none',
              borderRadius: 12,
              padding: '10px 20px',
              fontSize: 14,
              fontFamily: 'Karla, sans-serif',
              fontWeight: 600,
              cursor: input.trim() && !sending ? 'pointer' : 'default',
              height: 44,
              transition: 'background 0.15s',
            }}
          >
            Enviar
          </button>
        </div>
        <div style={{ maxWidth: 680, margin: '6px auto 0', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.02em' }}>
          El Duende no valida — sugiere. La mente humana ve.
        </div>
      </div>

    </div>
  )
}
