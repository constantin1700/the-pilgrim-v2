import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession, StripeProductId } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { productId, customerData } = await request.json()

    if (!productId || !customerData?.email || !customerData?.name) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      )
    }

    // Validar que el productId es válido
    const validProductIds: StripeProductId[] = ['basic_consultation', 'premium_preparation', 'cv_express']
    if (!validProductIds.includes(productId)) {
      return NextResponse.json(
        { error: 'Producto no válido' },
        { status: 400 }
      )
    }

    // Crear reserva en Supabase
    const { data: reservation, error: reservationError } = await supabase
      .from('reservations')
      .insert({
        service_id: productId === 'basic_consultation' ? '11111111-1111-1111-1111-111111111111' :
                   productId === 'premium_preparation' ? '22222222-2222-2222-2222-222222222222' :
                   '44444444-4444-4444-4444-444444444444',
        customer_name: customerData.name,
        customer_email: customerData.email,
        customer_phone: customerData.phone || null,
        customer_data: customerData,
        status: 'pending',
        amount: productId === 'basic_consultation' ? 49 :
                productId === 'premium_preparation' ? 149 : 29,
        currency: 'EUR'
      })
      .select()
      .single()

    if (reservationError) {
      console.error('Error creating reservation:', reservationError)
      return NextResponse.json(
        { error: 'Error creando la reserva' },
        { status: 500 }
      )
    }

    const origin = request.headers.get('origin') || 'http://localhost:3000'
    
    // Crear sesión de checkout en Stripe
    const session = await createCheckoutSession({
      productId,
      customerEmail: customerData.email,
      customerData: {
        ...customerData,
        reservation_id: reservation.id,
      },
      successUrl: `${origin}/servicios/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}/servicios?cancelled=true`,
    })

    // Actualizar reserva con session ID de Stripe
    await supabase
      .from('reservations')
      .update({ 
        stripe_session_id: session.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', reservation.id)

    return NextResponse.json({ 
      sessionId: session.id, 
      url: session.url,
      reservationId: reservation.id
    })

  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Error procesando el pago' },
      { status: 500 }
    )
  }
}