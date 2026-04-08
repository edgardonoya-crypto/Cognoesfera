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

async function verificarArquitecto(request: Request): Promise<boolean> {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return false
  const token = authHeader.slice(7)
  const { data: { user }, error } = await supabasePublic.auth.getUser(token)
  return !error && user?.email === ARQUITECTO_EMAIL
}

export async function GET(request: Request) {
  try {
    if (!(await verificarArquitecto(request))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { data, error } = await supabaseAdmin
      .from('archivos_curaduria')
      .select('id, created_at, email_participante, contexto_origen, nombre_archivo, tipo_archivo, contenido_base64, mensaje_asociado, estado, notas_curador')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('archivos-curaduria GET error:', JSON.stringify(error))
      return NextResponse.json({ error: 'Error al leer archivos' }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (err) {
    console.error('archivos-curaduria GET error:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    if (!(await verificarArquitecto(request))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id, estado, notas_curador } = await request.json() as {
      id: string
      estado?: string
      notas_curador?: string
    }

    if (!id) return NextResponse.json({ error: 'Falta id' }, { status: 400 })

    const updates: Record<string, string> = {}
    if (estado !== undefined) updates.estado = estado
    if (notas_curador !== undefined) updates.notas_curador = notas_curador

    const { error } = await supabaseAdmin
      .from('archivos_curaduria')
      .update(updates)
      .eq('id', id)

    if (error) {
      console.error('archivos-curaduria PATCH error:', JSON.stringify(error))
      return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('archivos-curaduria PATCH error:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
