import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Anon client para operaciones de auth estándar (server-side, sin browser APIs)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

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

    // Attempt 1: send OTP directly
    const { error: otpError1 } = await supabase.auth.signInWithOtp({ email })

    if (!otpError1) {
      return NextResponse.json({ success: true })
    }

    console.error('send-otp attempt 1 error:', JSON.stringify(otpError1))

    // If email is not confirmed, confirm it via admin and retry
    if (otpError1.message.toLowerCase().includes('not confirmed') ||
        otpError1.message.toLowerCase().includes('email')) {

      const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers()

      if (listError) {
        console.error('send-otp listUsers error:', JSON.stringify(listError))
        return NextResponse.json({ success: false, error: otpError1.message })
      }

      const user = listData.users.find(u => u.email === email)

      if (user && !user.email_confirmed_at) {
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
          user.id,
          { email_confirm: true }
        )
        if (updateError) {
          console.error('send-otp updateUserById error:', JSON.stringify(updateError))
          return NextResponse.json({ success: false, error: otpError1.message })
        }
      }

      // Attempt 2: retry after confirming email
      const { error: otpError2 } = await supabase.auth.signInWithOtp({ email })

      if (otpError2) {
        console.error('send-otp attempt 2 error:', JSON.stringify(otpError2))
        return NextResponse.json({ success: false, error: otpError2.message })
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false, error: otpError1.message })
  } catch (err) {
    console.error('send-otp error:', err)
    return NextResponse.json({ success: false, error: 'Error interno' })
  }
}
