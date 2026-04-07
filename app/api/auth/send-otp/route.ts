import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export async function POST(request: Request) {
  try {
    const { email } = await request.json() as { email: string }

    if (!email?.trim()) {
      return NextResponse.json({ error: 'Email requerido' }, { status: 400 })
    }

    // Ensure the user exists with a confirmed email so signInWithOtp
    // sends OTP directly instead of a "Confirm your signup" email.
    const { error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: true,
    })

    // Ignore "already registered" — that just means the user exists, which is fine.
    if (createError && !createError.message.toLowerCase().includes('already')) {
      console.error('send-otp createUser error:', JSON.stringify(createError))
      return NextResponse.json({ error: 'Error al procesar el email' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('send-otp error:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
