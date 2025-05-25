import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getServiceSupabase } from '@/lib/supabase'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

if (!stripeSecretKey) {
  console.warn('Stripe secret key not set. Webhooks will not work.')
}

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, {
  apiVersion: '2025-04-30.basil',
}) : null

export async function POST(request: NextRequest) {
  // Check if Stripe is configured
  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { error: 'Stripe webhook not configured' },
      { status: 503 }
    )
  }

  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    const supabase = getServiceSupabase()

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        // Update reservation status
        const { error } = await supabase
          .from('reservations')
          .update({ status: 'paid' })
          .eq('stripe_session_id', session.id)

        if (error) {
          console.error('Error updating reservation:', error)
          return NextResponse.json(
            { error: 'Error updating reservation' },
            { status: 500 }
          )
        }

        // TODO: Send confirmation email to customer
        console.log('Payment successful for session:', session.id)
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        
        // Update reservation status
        await supabase
          .from('reservations')
          .update({ status: 'cancelled' })
          .eq('stripe_session_id', session.id)
        
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

