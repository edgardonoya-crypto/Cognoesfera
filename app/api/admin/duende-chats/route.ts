import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const ARQUITECTO_EMAILS = new Set(['edgardo.noya@gmail.com', 'edgardo.noya@quanam.com'])

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
  if (error || !user || !ARQUITECTO_EMAILS.has(user.email ?? '')) return null
  return user
}

export async function GET(request: Request) {
  try {
    if (!await autenticarArquitecto(request)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { data, error } = await supabaseAdmin
      .from('duende_chats')
      .select('id, mensajes, created_at, nombre_participante, email_participante, contexto_origen, estado, mensajes_ruido')
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

    const body = await request.json()
    const { id, estado, mensajes_ruido } = body as { id: string; estado?: string; mensajes_ruido?: number[] }

    if (!id) return NextResponse.json({ error: 'Falta id' }, { status: 400 })

    const patch: Record<string, unknown> = {}
    if (estado !== undefined) {
      if (!['activa', 'archivada', 'ruido'].includes(estado))
        return NextResponse.json({ error: 'Estado inválido' }, { status: 400 })
      patch.estado = estado
    }
    if (mensajes_ruido !== undefined) {
      if (!Array.isArray(mensajes_ruido))
        return NextResponse.json({ error: 'mensajes_ruido debe ser array' }, { status: 400 })
      patch.mensajes_ruido = mensajes_ruido
    }
    if (Object.keys(patch).length === 0)
      return NextResponse.json({ error: 'Nada que actualizar' }, { status: 400 })

    const { error } = await supabaseAdmin
      .from('duende_chats')
      .update(patch)
      .eq('id', id)

    if (error) {
      console.error('duende-chats PATCH error:', JSON.stringify(error))
      return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('duende-chats PATCH error:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
