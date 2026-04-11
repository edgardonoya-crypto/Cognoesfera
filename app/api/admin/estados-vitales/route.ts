import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const ARQUITECTO_EMAIL = 'edgardo.noya@gmail.com'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  // Verificar que es el Arquitecto
  const auth = request.headers.get('Authorization')
  const token = auth?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { data: { user }, error: userErr } = await supabase.auth.getUser(token)
  if (userErr || !user || user.email !== ARQUITECTO_EMAIL) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  // Leer estados_vitales JOIN estados_situados
  const { data: estados, error: evErr } = await supabase
    .from('estados_vitales')
    .select('id, entidad_id, contexto, fecha_entrada, created_at, estado_situado:estados_situados(nombre_situado)')
    .eq('entidad_tipo', 'individuo')
    .order('created_at', { ascending: false })

  if (evErr) {
    console.error('estados-vitales admin error:', JSON.stringify(evErr))
    return NextResponse.json({ error: 'Error al leer estados vitales' }, { status: 500 })
  }

  if (!estados || estados.length === 0) {
    return NextResponse.json({ data: [] })
  }

  // Resolver emails desde auth.users
  const uuids = [...new Set(estados.map(e => (e as { entidad_id: string }).entidad_id))]
  const emailMap: Record<string, string> = {}

  for (const uuid of uuids) {
    const { data: authUser } = await supabase.auth.admin.getUserById(uuid)
    if (authUser?.user?.email) emailMap[uuid] = authUser.user.email
  }

  const result = estados.map(e => {
    const ev = e as unknown as {
      id: string
      entidad_id: string
      contexto: string
      fecha_entrada: string
      created_at: string
      estado_situado: { nombre_situado: string | null } | { nombre_situado: string | null }[] | null
    }
    const nombreEstado = Array.isArray(ev.estado_situado)
      ? (ev.estado_situado[0]?.nombre_situado ?? '—')
      : (ev.estado_situado?.nombre_situado ?? '—')
    const diasEnCampo = Math.floor((Date.now() - new Date(ev.fecha_entrada).getTime()) / 86_400_000)
    return {
      id: ev.id,
      email: emailMap[ev.entidad_id] ?? ev.entidad_id,
      contexto: ev.contexto,
      estado: nombreEstado,
      fecha_entrada: ev.fecha_entrada,
      dias_en_campo: diasEnCampo,
    }
  })

  return NextResponse.json({ data: result })
}
