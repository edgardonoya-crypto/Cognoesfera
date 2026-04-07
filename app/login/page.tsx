'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/app/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Pre-confirm the user server-side so signInWithOtp sends OTP directly
    // instead of a "Confirm your signup" email for new users.
    const preRes = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    if (!preRes.ok) {
      setLoading(false)
      setError('No pudimos enviar el código. Verificá el email.')
      return
    }

    const { error: otpError } = await supabase.auth.signInWithOtp({ email })

    setLoading(false)

    if (otpError) {
      setError('No pudimos enviar el código. Verificá el email.')
      return
    }

    setStep('otp')
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    })

    setLoading(false)

    if (verifyError) {
      setError('Código incorrecto o expirado.')
      return
    }

    router.push('/dashboard')
  }

  function handleResend() {
    setToken('')
    setError('')
    setStep('email')
  }

  return (
    <div style={styles.screen}>
      <div style={styles.card}>
        <div style={styles.logo}>✦</div>
        <h2 style={styles.title}>Cognoesfera</h2>
        <p style={styles.subtitle}>Paradigma Aleph · Sistema de Inteligencia Colectiva</p>

        {step === 'email' ? (
          <form onSubmit={handleSendOtp} style={{ width: '100%' }}>
            <input
              style={styles.input}
              type="email"
              placeholder="Tu email…"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              onFocus={(e) => (e.target.style.borderColor = 'rgba(83,177,210,.50)')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(34,58,54,.10)')}
            />
            <button
              type="submit"
              style={styles.button}
              disabled={loading}
              onMouseOver={(e) => ((e.target as HTMLButtonElement).style.opacity = '0.88')}
              onMouseOut={(e) => ((e.target as HTMLButtonElement).style.opacity = '1')}
            >
              {loading ? 'Enviando…' : 'Enviar código'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} style={{ width: '100%' }}>
            <p style={styles.hint}>Ingresá el código que enviamos a <strong>{email}</strong></p>
            <input
              style={styles.input}
              type="text"
              placeholder="Código de 6 dígitos…"
              value={token}
              onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
              autoComplete="one-time-code"
              inputMode="numeric"
              required
              autoFocus
              onFocus={(e) => (e.target.style.borderColor = 'rgba(83,177,210,.50)')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(34,58,54,.10)')}
            />
            <button
              type="submit"
              style={styles.button}
              disabled={loading || token.length < 6}
              onMouseOver={(e) => ((e.target as HTMLButtonElement).style.opacity = '0.88')}
              onMouseOut={(e) => ((e.target as HTMLButtonElement).style.opacity = '1')}
            >
              {loading ? 'Verificando…' : 'Ingresar'}
            </button>
            <button type="button" onClick={handleResend} style={styles.resend}>
              Reenviar código
            </button>
          </form>
        )}

        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  screen: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '24px',
    background:
      'radial-gradient(circle at 12% 16%, rgba(109,188,173,.12), transparent 24%), radial-gradient(circle at 85% 18%, rgba(132,100,205,.10), transparent 22%), linear-gradient(180deg, #f7f3e8, #efe9da)',
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    color: '#18201e',
  },
  card: {
    background: 'linear-gradient(180deg, rgba(255,255,255,.72), rgba(255,255,255,.52))',
    border: '1px solid rgba(34,58,54,.10)',
    borderRadius: '32px',
    boxShadow: '0 22px 64px rgba(27,42,38,.10)',
    padding: '48px 40px',
    maxWidth: '420px',
    width: '100%',
    textAlign: 'center',
  },
  logo: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(72,170,152,.80), rgba(132,100,205,.70))',
    margin: '0 auto 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.6rem',
    boxShadow: '0 8px 32px rgba(72,170,152,.25)',
  },
  title: {
    margin: '0 0 6px',
    fontSize: '1.6rem',
    fontWeight: 650,
    letterSpacing: '-0.04em',
  },
  subtitle: {
    margin: '0 0 28px',
    color: '#66706d',
    fontSize: '0.95rem',
  },
  hint: {
    margin: '0 0 16px',
    fontSize: '0.88rem',
    color: '#66706d',
    lineHeight: 1.5,
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '14px',
    border: '1px solid rgba(34,58,54,.10)',
    background: 'rgba(255,255,255,.60)',
    fontSize: '1rem',
    color: '#18201e',
    outline: 'none',
    marginBottom: '12px',
    boxSizing: 'border-box',
    transition: 'border-color 200ms',
  },
  button: {
    width: '100%',
    padding: '13px',
    borderRadius: '14px',
    border: 'none',
    background: 'linear-gradient(135deg, rgba(72,170,152,.90), rgba(83,177,210,.85))',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'opacity 200ms',
  },
  resend: {
    marginTop: '14px',
    background: 'none',
    border: 'none',
    color: '#66706d',
    fontSize: '0.85rem',
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: 0,
  },
  error: {
    marginTop: '10px',
    fontSize: '0.85rem',
    color: 'rgba(180,60,60,.85)',
  },
}
