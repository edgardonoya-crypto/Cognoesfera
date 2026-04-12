import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

function verificarToken(req: Request): boolean {
  const auth = req.headers.get('Authorization') ?? ''
  return auth.startsWith('Bearer ') && auth.length > 10
}

export async function GET(req: Request) {
  if (!verificarToken(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const contexto = searchParams.get('contexto')
  if (!contexto) return NextResponse.json({ error: 'Falta contexto' }, { status: 400 })
  const { data, error } = await supabase
    .from('duende_analisis')
    .select('*')
    .eq('contexto_origen', contexto)
    .order('created_at', { ascending: false })
    .limit(20)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(req: Request) {
  if (!verificarToken(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const body = await req.json() as {
    contexto: string
    consulta: string
    reporteId?: string
    conversaciones: Array<{
      id: string
      email: string | null
      mensajes?: Array<{ role: string; content: string }>
      mensajes_n?: number
      primer_msg?: string | null
      contexto_origen?: string | null
      created_at?: string
    }>
    historial?: Array<{ role: 'user' | 'assistant'; content: string }>
  }
  const { contexto, consulta, reporteId, conversaciones, historial = [] } = body
  if (!contexto || !consulta || !conversaciones)
    return NextResponse.json({ error: 'Faltan campos' }, { status: 400 })

  const esRuido = reporteId === 'ruido'

  // ── RAMA RUIDO: devuelve JSON estructurado ──────────────────────────────────
  if (esRuido) {
    const lineas = conversaciones.map(c =>
      `{"id":"${c.id}","email":${JSON.stringify(c.email)},"contexto":${JSON.stringify(c.contexto_origen)},"mensajes_n":${c.mensajes_n ?? 0},"primer_msg":${JSON.stringify(c.primer_msg ?? '')}}`
    ).join('\n')

    const systemRuido = `Sos un asistente de curación de datos. Analizás conversaciones y devolvés ÚNICAMENTE un array JSON válido — sin texto antes ni después, sin markdown, sin bloques de código.

Criterios para incluir una conversación como candidata a ruido o archivo:
- email null → ruido
- mensajes_n = 0 → ruido
- primer_msg vacío o genérico sin contenido real del usuario → ruido
- contexto null → ruido
- conversación claramente de prueba (mensajes muy cortos, sin aportes) → ruido
- conversación de valor real pero sin continuación → archivar

Si una conversación tiene contenido real del usuario (reflexión, pregunta, aporte), NO la incluyas.

Formato exacto de cada ítem:
{"id":"...","email":"...o null","contexto":"...o null","razon":"...","recomendacion":"ruido"}
recomendacion debe ser exactamente "ruido" o "archivar".`

    try {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        system: systemRuido,
        messages: [{ role: 'user', content: `Analizá estas ${conversaciones.length} conversaciones y devolvé el array JSON:\n\n${lineas}` }],
      })
      const raw = response.content.filter(b => b.type === 'text').map(b => (b as { type: 'text'; text: string }).text).join('').trim()

      // Extraer array JSON aunque venga envuelto en código
      const match = raw.match(/\[[\s\S]*\]/)
      const sugerencias = match ? JSON.parse(match[0]) : []

      return NextResponse.json({ sugerencias })
    } catch (err) {
      console.error('duende-analisis ruido error:', err)
      return NextResponse.json({ error: 'Error al analizar ruido' }, { status: 500 })
    }
  }

  // ── RAMA NORMAL: análisis de campo con texto libre ──────────────────────────
  const fuentes = conversaciones.map(c => ({ id: c.id, email: c.email ?? null, contexto }))

  const materialConversaciones = conversaciones.map((c, i) => {
    if (c.mensajes && c.mensajes.length > 0) {
      const turnos = c.mensajes
        .map(m => `  [${m.role === 'user' ? (c.email ?? 'Usuario') : 'Duende'}]: ${m.content}`)
        .join('\n')
      return `Conversación ${i + 1} — ${c.email ?? 'anónimo'} | ${c.contexto_origen ?? '(sin contexto)'}:\n${turnos}`
    }
    return `Conversación ${i + 1} — ID: ${c.id} | Email: ${c.email ?? 'null'} | Contexto: ${c.contexto_origen ?? 'null'} | Mensajes: ${c.mensajes_n ?? 0} | Primer msg: ${c.primer_msg ?? '(vacío)'}`
  }).join('\n\n---\n\n')

  const systemPrompt = `Sos el Duende-Arquitecto del Paradigma Aleph. Operás en modo de análisis de campo — leés el campo colectivo para el Arquitecto, no acompañás participantes individuales.

Tu función: identificar patrones, tensiones, señales débiles y emergencias del entre que aparecen en el conjunto de conversaciones. Operás desde el Corpus Madre (33 conceptos, 7 secciones) como lente de lectura.

Principios:
- Leé el campo completo, no conversación por conversación
- Nombrá lo que no se está nombrando explícitamente
- Señalá conexiones entre voces distintas
- Si algo resuena con un concepto del paradigma, nómbralo con precisión
- Sé breve y abrí territorio — no cerrés
- Cuando algo surgió de una conversación específica, mencioná el email entre paréntesis

Contexto que analizás: "${contexto}"
Total de conversaciones: ${conversaciones.length}`

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: systemPrompt + `\n\nMaterial de conversaciones del campo:\n\n${materialConversaciones}`,
      messages: historial.length === 0
        ? [{ role: 'user' as const, content: consulta }]
        : [...historial, { role: 'user' as const, content: consulta }],
    })
    const respuesta = response.content
      .filter(b => b.type === 'text')
      .map(b => (b as { type: 'text'; text: string }).text)
      .join('')

    const { data: guardado, error: insertErr } = await supabase
      .from('duende_analisis')
      .insert({ contexto_origen: contexto, consulta, respuesta, fuentes, conversaciones_n: conversaciones.length })
      .select()
      .single()
    if (insertErr) console.error('duende_analisis insert error:', insertErr)

    return NextResponse.json({ respuesta, fuentes, id: guardado?.id ?? null })
  } catch (err) {
    console.error('duende-analisis error:', err)
    return NextResponse.json({ error: 'Error al consultar al Duende' }, { status: 500 })
  }
}
