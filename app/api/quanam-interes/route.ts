import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

type Msg = { role: 'user' | 'assistant'; content: string }

// Extrae palabras clave significativas del nombre de una iniciativa
function getKeywords(name: string): string[] {
  const stopwords = new Set(['de', 'en', 'una', 'un', 'y', 'o', 'a', 'el', 'la', 'los', 'las', 'que', 'con', 'por', 'del', 'varios', 'grupos'])
  return name
    .toLowerCase()
    .replace(/[—\-–]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopwords.has(w))
}

export async function POST(request: Request) {
  try {
    const {
      email,
      lente_origen,
      fragmento_origen,
      msgs,
    } = await request.json() as {
      email?: string
      lente_origen?: string
      fragmento_origen?: string
      msgs?: Msg[]
    }

    if (!email?.trim() || !msgs?.length) {
      return NextResponse.json({ ok: false })
    }

    // Obtener iniciativas visibles en la convocatoria
    const { data: iniciativas, error } = await supabase
      .from('iniciativas')
      .select('id, nombre')
      .eq('visible_convocatoria', true)

    if (error || !iniciativas?.length) return NextResponse.json({ ok: false })

    // Texto completo de mensajes del usuario
    const userText = msgs
      .filter(m => m.role === 'user')
      .map(m => m.content.toLowerCase())
      .join(' ')

    if (!userText.trim()) return NextResponse.json({ ok: false })

    const interesesDetectados: { iniciativa_id: string; momento: string }[] = []

    for (const ini of iniciativas) {
      const keywords = getKeywords(ini.nombre)
      const match = keywords.find(kw => userText.includes(kw))
      if (!match) continue

      // Evitar duplicado — mismo email + iniciativa
      const { data: existing } = await supabase
        .from('intereses_iniciativas')
        .select('id')
        .eq('email_participante', email.trim())
        .eq('iniciativa_id', ini.id)
        .maybeSingle()

      if (existing) continue

      // Extraer el fragmento del mensaje donde aparece la keyword
      const msgConMatch = msgs
        .filter(m => m.role === 'user')
        .find(m => m.content.toLowerCase().includes(match))
      const momento = msgConMatch?.content?.slice(0, 280) ?? ''

      interesesDetectados.push({ iniciativa_id: ini.id, momento })
    }

    if (interesesDetectados.length === 0) return NextResponse.json({ ok: false, detected: 0 })

    const rows = interesesDetectados.map(({ iniciativa_id, momento }) => ({
      iniciativa_id,
      email_participante: email.trim(),
      lente_origen: lente_origen ?? null,
      fragmento_origen: fragmento_origen ?? null,
      momento,
    }))

    const { error: insertErr } = await supabase.from('intereses_iniciativas').insert(rows)
    if (insertErr) console.error('intereses insert error:', JSON.stringify(insertErr))

    return NextResponse.json({ ok: true, detected: interesesDetectados.length })
  } catch (err) {
    console.error('quanam-interes error:', err)
    return NextResponse.json({ ok: false })
  }
}
