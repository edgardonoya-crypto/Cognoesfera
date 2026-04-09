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

    console.log('[send-otp] inicio →', email)

    if (!email?.trim()) {
      return NextResponse.json({ success: false, error: 'Email requerido' })
    }

    // Garantizar que el usuario existe y está confirmado.
    // Usamos createUser en lugar de listUsers para evitar el bug de paginación
    // (listUsers devuelve máximo 50 por página — puede no encontrar al usuario).
    const { error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: email.trim(),
      email_confirm: true,
    })

    if (createError) {
      const createErrAny = createError as unknown as Record<string, unknown>
      const errObj = { message: createError.message, status: createError.status, code: createErrAny.code }
      console.log('[send-otp] createUser result:', JSON.stringify(errObj))

      // "already registered" o "already exists" = usuario existente, no es un error real
      const alreadyExists =
        createError.message?.toLowerCase().includes('already') ||
        createError.message?.toLowerCase().includes('registered') ||
        createErrAny.code === 'user_already_exists' ||
        createError.status === 422

      if (!alreadyExists) {
        console.error('[send-otp] createUser error no esperado:', JSON.stringify(createError))
        return NextResponse.json({ success: false, error: 'Error al registrar usuario' })
      }

      // Usuario ya existe — asegurarse de que está confirmado
      console.log('[send-otp] usuario existente, verificando confirmación…')
      const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 })
      if (listError) {
        console.error('[send-otp] listUsers error:', JSON.stringify(listError))
        // No bloqueamos — intentamos el OTP igual
      } else {
        const user = listData.users.find(u => u.email === email.trim())
        if (user && !user.email_confirmed_at) {
          console.log('[send-otp] confirmando usuario sin confirmar, id:', user.id)
          const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, { email_confirm: true })
          if (updateError) {
            console.error('[send-otp] updateUser error:', JSON.stringify(updateError))
          }
        } else {
          console.log('[send-otp] usuario ya confirmado, email_confirmed_at:', user?.email_confirmed_at)
        }
      }
    } else {
      console.log('[send-otp] usuario nuevo creado y confirmado')
    }

    // Enviar OTP
    console.log('[send-otp] llamando signInWithOtp…')
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: false },
    })

    if (otpError) {
      const otpErrAny = otpError as unknown as Record<string, unknown>
      console.error('[send-otp] signInWithOtp error:', JSON.stringify({
        message: otpError.message,
        status: otpError.status,
        code: otpErrAny.code,
        name: otpError.name,
      }))
      return NextResponse.json({ success: false, error: otpError.message })
    }

    console.log('[send-otp] OTP enviado con éxito a', email)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[send-otp] catch general:', err)
    return NextResponse.json({ success: false, error: 'Error interno' })
  }
}
