import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const ARQUITECTO_EMAILS = new Set(['edgardo.noya@gmail.com', 'edgardo.noya@quanam.com'])

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    // Verificar sesión del Arquitecto
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const token = authHeader.slice(7)
    const { data: { user }, error: authError } = await supabasePublic.auth.getUser(token)
    if (authError || !user || !ARQUITECTO_EMAILS.has(user.email ?? '')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id, email_participante, pregunta, respuesta } = await request.json() as {
      id: string
      email_participante: string
      pregunta: string
      respuesta: string
    }

    if (!id || !email_participante || !respuesta?.trim()) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    // Enviar email via Resend
    const { error: emailError } = await resend.emails.send({
      from: 'Cognoesfera <duende@cognoesferas.org>',
      to: email_participante,
      subject: 'Una respuesta del equipo Aleph',
      html: `
        <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #2C2820; padding: 32px 24px;">
          <p style="font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; color: #8B6914; margin: 0 0 24px;">Paradigma Aleph · Cognoesfera</p>
          <p style="font-size: 16px; line-height: 1.7; margin: 0 0 20px;">Tu pregunta llegó a quienes cuidan el paradigma.</p>

          <div style="border-left: 3px solid rgba(139,105,20,0.3); padding-left: 16px; margin: 0 0 24px;">
            <p style="font-size: 13px; color: #8A7E70; font-style: italic; margin: 0 0 6px;">Tu pregunta:</p>
            <p style="font-size: 15px; line-height: 1.65; margin: 0; font-style: italic;">${pregunta}</p>
          </div>

          <div style="border-left: 3px solid rgba(78,170,152,0.4); padding-left: 16px; margin: 0 0 32px;">
            <p style="font-size: 13px; color: #4eaa98; font-weight: 600; margin: 0 0 6px;">Respuesta:</p>
            <p style="font-size: 15px; line-height: 1.7; margin: 0;">${respuesta.replace(/\n/g, '<br>')}</p>
          </div>

          <p style="font-size: 13px; color: #8A7E70; margin: 0;">— El equipo Aleph</p>
        </div>
      `,
    })

    if (emailError) {
      console.error('responder-pregunta email error:', JSON.stringify(emailError))
      return NextResponse.json({ error: 'Error al enviar email' }, { status: 500 })
    }

    // Marcar como respondida en Supabase
    const { error: updateError } = await supabaseAdmin
      .from('preguntas_arquitectos')
      .update({
        estado: 'respondida',
        respuesta,
        respondida_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (updateError) {
      console.error('responder-pregunta update error:', JSON.stringify(updateError))
      return NextResponse.json({ error: 'Email enviado pero error al actualizar estado' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('responder-pregunta error:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
