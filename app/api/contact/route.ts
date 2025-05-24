import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
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
        <p><strong>Mensaje:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
      text: `
        Nuevo mensaje de contacto
        
        Nombre: ${name}
        Email: ${email}
        ${phone ? `Teléfono: ${phone}` : ''}
        Asunto: ${subject}
        
        Mensaje:
        ${message}
      `,
    })

    if (error) {
      console.error('Error sending email:', error)
      return NextResponse.json(
        { error: 'Error sending email' },
        { status: 500 }
      )
    }

    // Send auto-reply to user
    await resend.emails.send({
      from: process.env.EMAIL_FROM_ADDRESS!,
      to: email,
      subject: 'Hemos recibido tu mensaje - The Pilgrim',
      html: `
        <h2>¡Gracias por contactarnos!</h2>
        <p>Hola ${name},</p>
        <p>Hemos recibido tu mensaje y te responderemos lo antes posible.</p>
        <p>Nuestro horario de atención es de 9:30 AM a 4:30 PM todos los días.</p>
        <br />
        <p>Saludos,<br />El equipo de The Pilgrim</p>
      `,
    })

    return NextResponse.json({ success: true, id: data?.id })
  } catch (error) {
    console.error('Error in contact API:', error)
    return NextResponse.json(
      { error: 'Error processing contact form' },
      { status: 500 }
    )
  }
}