import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ─── Types ────────────────────────────────────────────────────────────────────

type EstadoSituadoRow = {
  id: string
  estado_madre_id: string
  contexto: string
  nombre_situado: string | null
  descripcion_situada: string | null
  prompt_duende: string | null
  señales_comportamiento: Record<string, unknown>
  activo: boolean
  created_at: string
}

type HistorialItem = {
  estado_situado_id: string
  fecha_salida: string
  señales_al_salir: Record<string, unknown>
  razon_transicion?: string
}

type EstadoVitalRow = {
  id: string
  entidad_tipo: string
  entidad_id: string
  contexto: string
  estado_situado_id: string | null
  fecha_entrada: string
  señales: Record<string, unknown>
  historia: HistorialItem[]
  created_at: string
  updated_at: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function getEstadoSituadoPorOrden(
  contexto: string,
  orden: number
): Promise<EstadoSituadoRow | null> {
  const { data: madre, error: madreErr } = await supabase
    .from('estados_madre')
    .select('id')
    .eq('orden', orden)
    .single()

  if (madreErr || !madre) return null

  const { data: situado, error: situadoErr } = await supabase
    .from('estados_situados')
    .select('*')
    .eq('contexto', contexto)
    .eq('estado_madre_id', madre.id)
    .eq('activo', true)
    .single()

  if (situadoErr || !situado) return null
  return situado as EstadoSituadoRow
}

async function getOrdenDeEstadoSituado(estadoSituadoId: string): Promise<number | null> {
  const { data: situado, error: situadoErr } = await supabase
    .from('estados_situados')
    .select('estado_madre_id')
    .eq('id', estadoSituadoId)
    .single()

  if (situadoErr || !situado) return null

  const { data: madre, error: madreErr } = await supabase
    .from('estados_madre')
    .select('orden')
    .eq('id', (situado as { estado_madre_id: string }).estado_madre_id)
    .single()

  if (madreErr || !madre) return null
  return (madre as { orden: number }).orden
}

// Evalúa si las señales actuales satisfacen las requeridas por un estado.
// boolean true → la señal debe estar presente y ser truthy
// number N → el valor actual debe ser >= N
function satisfaceSeñales(
  requeridas: Record<string, unknown>,
  actuales: Record<string, unknown>
): boolean {
  for (const [key, val] of Object.entries(requeridas)) {
    if (typeof val === 'boolean' && val) {
      if (!actuales[key]) return false
    } else if (typeof val === 'number') {
      const actual = actuales[key]
      if (typeof actual !== 'number' || actual < val) return false
    }
  }
  return true
}

async function getEstadoConJoin(id: string) {
  return supabase
    .from('estados_vitales')
    .select('*, estado_situado:estados_situados(*)')
    .eq('id', id)
    .single()
}

// ─── GET /api/estados?user_id=X&contexto=Y ───────────────────────────────────
// Devuelve el estado vital actual. Si no existe, crea uno con estado 1.

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const user_id = searchParams.get('user_id')
  const contexto = searchParams.get('contexto')

  if (!user_id || !contexto) {
    return NextResponse.json(
      { error: 'Faltan parámetros: user_id y contexto son requeridos' },
      { status: 400 }
    )
  }

  const { data: existente, error: fetchErr } = await supabase
    .from('estados_vitales')
    .select('*, estado_situado:estados_situados(*)')
    .eq('entidad_tipo', 'individuo')
    .eq('entidad_id', user_id)
    .eq('contexto', contexto)
    .single()

  if (fetchErr && fetchErr.code !== 'PGRST116') {
    console.error('estados_vitales GET error:', JSON.stringify(fetchErr))
    return NextResponse.json({ error: 'Error al obtener estado vital' }, { status: 500 })
  }

  if (existente) {
    return NextResponse.json({ estado: existente, creado: false })
  }

  // No existe — inicializar con estado 1 (La escucha)
  const estadoInicial = await getEstadoSituadoPorOrden(contexto, 1)
  if (!estadoInicial) {
    return NextResponse.json(
      { error: `No existe estado situado para contexto '${contexto}' orden 1` },
      { status: 404 }
    )
  }

  const { data: nuevo, error: insertErr } = await supabase
    .from('estados_vitales')
    .insert({
      entidad_tipo: 'individuo',
      entidad_id: user_id,
      contexto,
      estado_situado_id: estadoInicial.id,
      señales: {},
      historia: [],
    })
    .select('*, estado_situado:estados_situados(*)')
    .single()

  if (insertErr || !nuevo) {
    console.error('estados_vitales insert error:', JSON.stringify(insertErr))
    return NextResponse.json({ error: 'Error al crear estado vital' }, { status: 500 })
  }

  return NextResponse.json({ estado: nuevo, creado: true })
}

// ─── POST /api/estados ────────────────────────────────────────────────────────
// Recibe señales de comportamiento, evalúa y ejecuta transición si corresponde.

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      user_id: string
      contexto: string
      señales: Record<string, unknown>
    }

    const { user_id, contexto, señales: señalesEntrantes } = body

    if (!user_id || !contexto || !señalesEntrantes) {
      return NextResponse.json(
        { error: 'Faltan campos: user_id, contexto, señales' },
        { status: 400 }
      )
    }

    const { data: estadoVital, error: fetchErr } = await supabase
      .from('estados_vitales')
      .select('*')
      .eq('entidad_tipo', 'individuo')
      .eq('entidad_id', user_id)
      .eq('contexto', contexto)
      .single()

    if (fetchErr || !estadoVital) {
      return NextResponse.json(
        { error: 'Estado vital no encontrado. Usar GET primero para inicializarlo.' },
        { status: 404 }
      )
    }

    const vital = estadoVital as EstadoVitalRow

    // Merge señales: las nuevas se suman a las existentes (los números se acumulan)
    const señalesActualizadas: Record<string, unknown> = { ...vital.señales }
    for (const [key, val] of Object.entries(señalesEntrantes)) {
      if (typeof val === 'number' && typeof señalesActualizadas[key] === 'number') {
        señalesActualizadas[key] = (señalesActualizadas[key] as number) + val
      } else {
        señalesActualizadas[key] = val
      }
    }

    // Determinar orden actual
    if (!vital.estado_situado_id) {
      return NextResponse.json({ error: 'Estado vital sin estado_situado_id' }, { status: 500 })
    }

    const ordenActual = await getOrdenDeEstadoSituado(vital.estado_situado_id)
    if (ordenActual === null) {
      return NextResponse.json(
        { error: 'No se pudo determinar el orden del estado actual' },
        { status: 500 }
      )
    }

    let transitó = false

    if (ordenActual < 8) {
      const siguienteEstado = await getEstadoSituadoPorOrden(contexto, ordenActual + 1)

      if (
        siguienteEstado &&
        satisfaceSeñales(siguienteEstado.señales_comportamiento, señalesActualizadas)
      ) {
        const historialActualizado: HistorialItem[] = [
          ...(vital.historia ?? []),
          {
            estado_situado_id: vital.estado_situado_id,
            fecha_salida: new Date().toISOString(),
            señales_al_salir: señalesActualizadas,
          },
        ]

        await supabase
          .from('estados_vitales')
          .update({
            estado_situado_id: siguienteEstado.id,
            fecha_entrada: new Date().toISOString(),
            señales: señalesActualizadas,
            historia: historialActualizado,
            updated_at: new Date().toISOString(),
          })
          .eq('id', vital.id)

        transitó = true
      } else {
        await supabase
          .from('estados_vitales')
          .update({ señales: señalesActualizadas, updated_at: new Date().toISOString() })
          .eq('id', vital.id)
      }
    } else {
      // Estado 8 (La música) — solo actualizar señales, no transitar
      await supabase
        .from('estados_vitales')
        .update({ señales: señalesActualizadas, updated_at: new Date().toISOString() })
        .eq('id', vital.id)
    }

    const { data: estadoFinal } = await getEstadoConJoin(vital.id)
    return NextResponse.json({ estado: estadoFinal, transitó })
  } catch (err) {
    console.error('estados POST error:', err)
    return NextResponse.json({ error: 'Error al procesar señales' }, { status: 500 })
  }
}

// ─── PATCH /api/estados ───────────────────────────────────────────────────────
// Actualización manual del estado por el Duende. Solo server-side.
// Requiere header x-internal-token con el service role key.

export async function PATCH(request: Request) {
  const internalToken = request.headers.get('x-internal-token')
  if (!internalToken || internalToken !== process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json() as {
      user_id: string
      contexto: string
      nuevo_estado_orden: number
      razon?: string
    }

    const { user_id, contexto, nuevo_estado_orden, razon } = body

    if (!user_id || !contexto || !nuevo_estado_orden) {
      return NextResponse.json(
        { error: 'Faltan campos: user_id, contexto, nuevo_estado_orden' },
        { status: 400 }
      )
    }

    if (nuevo_estado_orden < 1 || nuevo_estado_orden > 8) {
      return NextResponse.json(
        { error: 'nuevo_estado_orden debe estar entre 1 y 8' },
        { status: 400 }
      )
    }

    const { data: estadoVital, error: fetchErr } = await supabase
      .from('estados_vitales')
      .select('*')
      .eq('entidad_tipo', 'individuo')
      .eq('entidad_id', user_id)
      .eq('contexto', contexto)
      .single()

    if (fetchErr || !estadoVital) {
      return NextResponse.json({ error: 'Estado vital no encontrado' }, { status: 404 })
    }

    const vital = estadoVital as EstadoVitalRow

    const estadoDestino = await getEstadoSituadoPorOrden(contexto, nuevo_estado_orden)
    if (!estadoDestino) {
      return NextResponse.json(
        { error: `No existe estado situado para orden ${nuevo_estado_orden} en contexto '${contexto}'` },
        { status: 404 }
      )
    }

    const historialActualizado: HistorialItem[] = [
      ...(vital.historia ?? []),
      {
        estado_situado_id: vital.estado_situado_id ?? '',
        fecha_salida: new Date().toISOString(),
        señales_al_salir: vital.señales ?? {},
        razon_transicion: razon ?? 'transición manual por Duende',
      },
    ]

    const { data: actualizado, error: updateErr } = await supabase
      .from('estados_vitales')
      .update({
        estado_situado_id: estadoDestino.id,
        fecha_entrada: new Date().toISOString(),
        historia: historialActualizado,
        updated_at: new Date().toISOString(),
      })
      .eq('id', vital.id)
      .select('*, estado_situado:estados_situados(*)')
      .single()

    if (updateErr || !actualizado) {
      console.error('estados_vitales PATCH error:', JSON.stringify(updateErr))
      return NextResponse.json({ error: 'Error al actualizar estado vital' }, { status: 500 })
    }

    return NextResponse.json({ estado: actualizado, transitó: true, razon: razon ?? null })
  } catch (err) {
    console.error('estados PATCH error:', err)
    return NextResponse.json({ error: 'Error al actualizar estado' }, { status: 500 })
  }
}
