import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Temporarily disable email sending during build
export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await request.json()

    // Save to database instead of sending email
    const { data, error } = await supabase
      .from('contact_messages')
      .insert({
        name,
        email,
        subject,
        message,
        status: 'unread'
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ 
      success: true, 
      message: 'Tu mensaje ha sido recibido. Te contactaremos pronto.' 
    })
  } catch (error: any) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Error al enviar el mensaje' },
      { status: 500 }
    )
  }
}

// Original code with Resend commented out
/*
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST_ORIGINAL(request: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await request.json()

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM_ADDRESS!,
      to: process.env.EMAIL_FROM_ADDRESS!, // Send to admin
      replyTo: email,
      subject: `[The Pilgrim] ${subject}`,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Teléfono:</strong> ${phone}</p>` : ''}
        <p><strong>Asunto:</strong> ${subject}</p>
        <hr />
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    })

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Email send error:', error)
    return NextResponse.json(
      { error: 'Error sending email' },
      { status: 500 }
    )
  }
}
*/