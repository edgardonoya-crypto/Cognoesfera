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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const token = authHeader.slice(7)
  const { data: { user }, error: authError } = await supabasePublic.auth.getUser(token)
  if (authError || !user || user.email !== ARQUITECTO_EMAIL) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await params

  const { data, error } = await supabaseAdmin
    .from('duende_chats')
    .select('id, mensajes, created_at, nombre_participante, email_participante, contexto_origen')
    .eq('id', id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Conversación no encontrada' }, { status: 404 })
  }

  return NextResponse.json({ data })
}
