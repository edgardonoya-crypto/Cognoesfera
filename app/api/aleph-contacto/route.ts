import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const { nombre, email, mensaje, origen } = await request.json()

  if (!mensaje) {
    return NextResponse.json({ error: 'Falta el mensaje' }, { status: 400 })
  }

  const { error } = await supabase
    .from('aleph_contacto')
    .insert({ nombre: nombre || null, email: email || null, mensaje, origen: origen || null })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
