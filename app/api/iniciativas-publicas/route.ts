import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export async function GET() {
  const { data, error } = await supabase
    .from('iniciativas')
    .select('id, nombre, descripcion')
    .eq('visible_convocatoria', true)
    .eq('estado', 'activa')
    .order('fecha_inicio', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ data: [] })
  return NextResponse.json({ data: data ?? [] })
}
