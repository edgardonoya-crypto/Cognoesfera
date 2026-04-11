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
    conversaciones: Array<{
      id: string
      email: string | null
      mensajes: Array<{ role: string; content: string }>
    }>
  }
  const { contexto, consulta, conversaciones } = body
  if (!contexto || !consulta || !conversaciones)
    return NextResponse.json({ error: 'Faltan campos' }, { status: 400 })

  const fuentes = conversaciones.map(c => ({ id: c.id, email: c.email ?? null, contexto }))

  const materialConversaciones = conversaciones.map((c, i) => {
    const turnos = c.mensajes
      .map(m => `  [${m.role === 'user' ? (c.email ?? 'Usuario') : 'Duende'}]: ${m.content}`)
      .join('\n')
    return `Conversación ${i + 1} — ${c.email ?? 'anónimo'}:\n${turnos}`
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

  const userPrompt = `Conversaciones del contexto "${contexto}":\n\n${materialConversaciones}\n\n---\n\nConsulta del Arquitecto: ${consulta}`

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
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
