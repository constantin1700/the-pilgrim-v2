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

    // Generar ID temporal para la reserva (en lugar de usar la DB)
    const tempReservationId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const origin = request.headers.get('origin') || 'http://localhost:3000'
    
    // Crear sesión de checkout en Stripe
    const session = await createCheckoutSession({
      productId,
      customerEmail: customerData.email,
      customerData: {
        ...customerData,
        reservation_id: tempReservationId,
      },
      successUrl: `${origin}/servicios/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}/servicios?cancelled=true`,
    })

    return NextResponse.json({ 
      sessionId: session.id, 
      url: session.url,
      reservationId: tempReservationId
    })

  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Error procesando el pago' },
      { status: 500 }
    )
  }
}