import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
})

export async function POST(request: NextRequest) {
  try {
    const { serviceId, customerData } = await request.json()

    // Get service details
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('*')
      .eq('id', serviceId)
      .single()

    if (serviceError || !service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    // Check availability for limited services
    if (service.monthly_limit) {
      const currentMonth = new Date().toISOString().slice(0, 7)
      const { count } = await supabase
        .from('reservations')
        .select('*', { count: 'exact', head: true })
        .eq('service_id', serviceId)
        .gte('created_at', `${currentMonth}-01`)
        .in('status', ['paid', 'completed'])

      if (count && count >= service.monthly_limit) {
        return NextResponse.json(
          { error: 'No hay disponibilidad para este servicio' },
          { status: 400 }
        )
      }
    }

    // Create reservation
    const { data: reservation, error: reservationError } = await supabase
      .from('reservations')
      .insert({
        service_id: serviceId,
        customer_name: customerData.name,
        customer_email: customerData.email,
        customer_phone: customerData.phone,
        status: 'pending'
      })
      .select()
      .single()

    if (reservationError) throw reservationError

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: service.title,
              description: service.description,
            },
            unit_amount: service.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/servicios/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/servicios`,
      metadata: {
        reservation_id: reservation.id,
        service_id: serviceId,
      },
      customer_email: customerData.email,
    })

    // Update reservation with Stripe session ID
    await supabase
      .from('reservations')
      .update({ stripe_session_id: session.id })
      .eq('id', reservation.id)

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    )
  }
}