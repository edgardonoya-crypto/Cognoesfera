import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const ARQUITECTO_EMAILS = new Set(['edgardo.noya@gmail.com', 'edgardo.noya@quanam.com'])

const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const REPO = 'edgardonoya-crypto/Cognoesfera'
const BRANCH = 'main'

const DESTINOS: Record<string, string> = {
  concepto:     'corpus/conceptos',
  senal_debil:  'corpus/senales',
  pendiente:    'corpus/pendientes',
  actualizacion: 'corpus/actualizaciones',
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  const { data: { user }, error: authError } = await supabasePublic.auth.getUser(authHeader.slice(7))
  if (authError || !user || !ARQUITECTO_EMAILS.has(user.email ?? '')) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const token = process.env.GITHUB_TOKEN
  if (!token) {
    return NextResponse.json({ error: 'Token no configurado.' }, { status: 500 })
  }

  const body = await req.json()
  const { tipo, titulo, contenido, autor } = body

  if (!tipo || !titulo || !contenido || !autor) {
    return NextResponse.json({ error: 'Faltan campos requeridos.' }, { status: 400 })
  }

  const carpeta = DESTINOS[tipo]
  if (!carpeta) {
    return NextResponse.json({ error: 'Tipo inválido.' }, { status: 400 })
  }

  const slug = titulo
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  const fecha = new Date().toISOString().slice(0, 10)
  const path = `${carpeta}/${fecha}-${slug}.md`

  const contenidoMd = `# ${titulo}\n_Tipo: ${tipo} · Autor: ${autor} · Fecha: ${fecha}_\n\n${contenido}\n`
  const contentBase64 = Buffer.from(contenidoMd).toString('base64')

  const apiUrl = `https://api.github.com/repos/${REPO}/contents/${path}`
  const commitMsg = `corpus(${tipo}): ${titulo}`

  const ghRes = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: commitMsg,
      content: contentBase64,
      branch: BRANCH,
    }),
  })

  if (!ghRes.ok) {
    const err = await ghRes.json().catch(() => ({}))
    return NextResponse.json({ error: err.message || 'Error al commitear.' }, { status: 502 })
  }

  return NextResponse.json({ ok: true, path })
}
