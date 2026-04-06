import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const { nombre, lente, respuesta, email } = await request.json()

  if (!nombre || !lente || !respuesta) {
    return NextResponse.json({ error: 'Faltan campos' }, { status: 400 })
  }

  const { error } = await supabase
    .from('quanam_respuestas')
    .insert({ nombre, lente, respuesta, email: email || null })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
