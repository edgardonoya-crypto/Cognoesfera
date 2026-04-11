import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

type DBMsg = { role: string; content: string; timestamp?: string }
type ConvEntry = { id: string; msgs: { role: 'user' | 'assistant'; content: string }[] }

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')?.trim()

  if (!email) return NextResponse.json({ convs: {} })

  const { data, error } = await supabase
    .from('duende_chats')
    .select('id, contexto_origen, mensajes')
    .eq('email_participante', email)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('[duende/history] error:', JSON.stringify(error))
    return NextResponse.json({ convs: {} })
  }

  // Una conversación por contexto_origen — la más reciente (ya viene ordenada)
  const convs: Record<string, ConvEntry> = {}
  for (const row of (data ?? [])) {
    const key = row.contexto_origen as string
    if (!key || convs[key]) continue
    const msgs = ((row.mensajes ?? []) as DBMsg[]).map(m => ({
      role: (m.role === 'assistant' ? 'assistant' : 'user') as 'user' | 'assistant',
      content: m.content ?? '',
    }))
    convs[key] = { id: row.id as string, msgs }
  }

  return NextResponse.json({ convs })
}
