import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Anon client para signInWithOtp (server-side, sin browser APIs)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// Service role para crear/confirmar usuarios sin fricción
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export async function POST(request: Request) {
  try {
    const { email } = await request.json() as { email: string }

    if (!email?.trim()) {
      return NextResponse.json({ success: false, error: 'Email requerido' })
    }

    // Pre-garantizar que el usuario existe y está confirmado.
    // Esto evita que emails nuevos reciban "Confirm your signup" en lugar del OTP.
    const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers()

    if (listError) {
      console.error('send-otp listUsers error:', JSON.stringify(listError))
      return NextResponse.json({ success: false, error: 'Error al verificar usuario' })
    }

    const user = listData.users.find(u => u.email === email)

    if (!user) {
      // Usuario nuevo: crear con email ya confirmado
      const { error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        email_confirm: true,
      })
      if (createError) {
        console.error('send-otp createUser error:', JSON.stringify(createError))
        return NextResponse.json({ success: false, error: 'Error al registrar usuario' })
      }
    } else if (!user.email_confirmed_at) {
      // Usuario existente sin confirmar: confirmar ahora
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        user.id,
        { email_confirm: true }
      )
      if (updateError) {
        console.error('send-otp updateUser error:', JSON.stringify(updateError))
        return NextResponse.json({ success: false, error: 'Error al confirmar usuario' })
      }
    }

    // Enviar OTP. shouldCreateUser: false garantiza el camino de OTP puro
    // (el usuario ya existe y está confirmado, nunca llega el email de signup)
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    })

    if (otpError) {
      console.error('send-otp error:', JSON.stringify(otpError))
      return NextResponse.json({ success: false, error: otpError.message })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('send-otp error:', err)
    return NextResponse.json({ success: false, error: 'Error interno' })
  }
}
