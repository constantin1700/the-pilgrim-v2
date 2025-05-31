import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServiceRoleClient } from '@/lib/supabase'

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

    const supabase = createServiceRoleClient()

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        
        // Update reservation status to paid
        const { error } = await supabase
          .from('reservations')
          .update({ 
            status: 'paid',
            stripe_payment_intent_id: session.payment_intent as string,
            updated_at: new Date().toISOString()
          })
          .eq('stripe_session_id', session.id)

        if (error) {
          console.error('Error updating reservation:', error)
          throw error
        }

        // TODO: Send confirmation email
        console.log('Payment completed for session:', session.id)
        break

      case 'checkout.session.expired':
        const expiredSession = event.data.object as Stripe.Checkout.Session
        
        // Update reservation status to expired
        await supabase
          .from('reservations')
          .update({ 
            status: 'expired',
            updated_at: new Date().toISOString()
          })
          .eq('stripe_session_id', expiredSession.id)
        break

      case 'payment_intent.succeeded':
        const successIntent = event.data.object as Stripe.PaymentIntent
        console.log('Payment succeeded:', successIntent.id)
        break

      case 'payment_intent.payment_failed':
        const failedIntent = event.data.object as Stripe.PaymentIntent
        
        // Update reservation status to failed
        await supabase
          .from('reservations')
          .update({ 
            status: 'failed',
            updated_at: new Date().toISOString()
          })
          .eq('stripe_payment_intent_id', failedIntent.id)
        break

      case 'charge.refunded':
        const refund = event.data.object as Stripe.Charge
        
        // Update reservation status to refunded
        if (refund.payment_intent) {
          await supabase
            .from('reservations')
            .update({ 
              status: 'refunded',
              updated_at: new Date().toISOString()
            })
            .eq('stripe_payment_intent_id', refund.payment_intent)
        }
        break

      case 'charge.dispute.created':
        const dispute = event.data.object as Stripe.Dispute
        console.error('DISPUTE CREATED:', dispute.id, 'Amount:', dispute.amount)
        // TODO: Send alert to admin
        break

      case 'customer.created':
        const customer = event.data.object as Stripe.Customer
        console.log('New customer created:', customer.email)
        // TODO: Add to CRM or analytics
        break

      default:
        console.log(`Unhandled event type ${event.type}`)
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