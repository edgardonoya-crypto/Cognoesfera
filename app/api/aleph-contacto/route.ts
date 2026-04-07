import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { checkRateLimit } from '@/app/api/_lib/rate-limit'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Demasiadas solicitudes' }, { status: 429 })
  }

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
