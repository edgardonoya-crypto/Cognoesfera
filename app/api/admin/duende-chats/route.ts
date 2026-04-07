import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const ARQUITECTO_EMAIL = 'edgardo.noya@gmail.com'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: Request) {
  try {
    // Verify the caller is the Arquitecto
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const token = authHeader.slice(7)
    const { data: { user }, error: authError } = await supabasePublic.auth.getUser(token)

    if (authError || !user || user.email !== ARQUITECTO_EMAIL) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Fetch all conversations bypassing RLS
    const { data, error } = await supabaseAdmin
      .from('duende_chats')
      .select('id, mensajes, created_at, nombre_participante, email_participante, contexto_origen')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('duende-chats admin route error:', JSON.stringify(error))
      return NextResponse.json({ error: 'Error al leer conversaciones' }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (err) {
    console.error('duende-chats admin route error:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
