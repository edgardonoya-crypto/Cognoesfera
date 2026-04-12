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

async function autenticarArquitecto(request: Request) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  const token = authHeader.slice(7)
  const { data: { user }, error } = await supabasePublic.auth.getUser(token)
  if (error || !user || user.email !== ARQUITECTO_EMAIL) return null
  return user
}

export async function GET(request: Request) {
  try {
    if (!await autenticarArquitecto(request)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { data, error } = await supabaseAdmin
      .from('duende_chats')
      .select('id, mensajes, created_at, nombre_participante, email_participante, contexto_origen, estado')
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

export async function PATCH(request: Request) {
  try {
    if (!await autenticarArquitecto(request)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id, estado } = await request.json()
    if (!id || !['activa', 'archivada', 'ruido'].includes(estado)) {
      return NextResponse.json({ error: 'Parámetros inválidos' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('duende_chats')
      .update({ estado })
      .eq('id', id)

    if (error) {
      console.error('duende-chats PATCH error:', JSON.stringify(error))
      return NextResponse.json({ error: 'Error al actualizar estado' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('duende-chats PATCH error:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
