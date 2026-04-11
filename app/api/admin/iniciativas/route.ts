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

// GET — lista de iniciativas + intereses
export async function GET(request: Request) {
  if (!(await verificarArquitecto(request))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  const { searchParams } = new URL(request.url)
  if (searchParams.get('tipo') === 'intereses') {
    const { data, error } = await supabaseAdmin
      .from('intereses_iniciativas')
      .select('id, iniciativa_id, email_participante, lente_origen, fragmento_origen, momento, created_at, iniciativas(nombre)')
      .order('created_at', { ascending: false })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data })
  }
  const { data, error } = await supabaseAdmin
    .from('iniciativas')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

// POST — crear nueva iniciativa
export async function POST(request: Request) {
  if (!(await verificarArquitecto(request))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  const body = await request.json() as { nombre?: string }
  if (!body.nombre?.trim()) {
    return NextResponse.json({ error: 'Nombre requerido' }, { status: 400 })
  }
  const { data, error } = await supabaseAdmin
    .from('iniciativas')
    .insert({ nombre: body.nombre.trim(), descripcion: '', responsable: '', estado: 'activa', visible_convocatoria: false })
    .select('*')
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

// PATCH — actualizar campo de iniciativa
export async function PATCH(request: Request) {
  if (!(await verificarArquitecto(request))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  const body = await request.json() as { id: string; field: string; value: unknown }
  if (!body.id || !body.field) {
    return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 })
  }
  const ALLOWED_FIELDS = ['nombre', 'descripcion', 'responsable', 'estado', 'fecha_inicio', 'visible_convocatoria']
  if (!ALLOWED_FIELDS.includes(body.field)) {
    return NextResponse.json({ error: 'Campo no permitido' }, { status: 400 })
  }
  const { error } = await supabaseAdmin
    .from('iniciativas')
    .update({ [body.field]: body.value })
    .eq('id', body.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
