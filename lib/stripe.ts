import Stripe from 'stripe'
import { loadStripe } from '@stripe/stripe-js'

// Server-side Stripe instance - lazy initialization
let stripeInstance: Stripe | null = null

export const stripe = () => {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Missing STRIPE_SECRET_KEY environment variable')
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-04-30.basil',
      typescript: true,
    })
  }
  return stripeInstance
}

// Client-side Stripe instance
export const getStripe = () => {
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!)
}

// Precio de los servicios en Stripe (en céntimos)
export const STRIPE_PRICES = {
  basic_consultation: 4900, // 49.00 EUR
  premium_preparation: 14900, // 149.00 EUR
  vip_mentoring: 29900, // 299.00 EUR
  cv_express: 2900, // 29.00 EUR
} as const

// Configuración de productos para Stripe
export const STRIPE_PRODUCTS = {
  basic_consultation: {
    name: 'Plan Básico - Orientación Inicial',
    description: 'Evaluación inicial de tu perfil profesional y recomendaciones personalizadas para empezar tu búsqueda laboral internacional.',
    price: STRIPE_PRICES.basic_consultation,
    currency: 'eur',
    features: [
      'Evaluación de CV',
      'Lista de países recomendados',
      'Guía de primeros pasos',
      '1 sesión de 30min por videollamada'
    ]
  },
  premium_preparation: {
    name: 'Plan Premium - Preparación Completa',
    description: 'Servicio integral para prepararte completamente para trabajar en el extranjero, incluyendo optimización de CV y preparación para entrevistas.',
    price: STRIPE_PRICES.premium_preparation,
    currency: 'eur',
    features: [
      'Optimización completa de CV',
      'Preparación para entrevistas',
      '2 sesiones de coaching',
      'Guía específica del país elegido',
      'Templates de cartas de presentación',
      'Acceso a ofertas de trabajo exclusivas'
    ]
  },
  vip_mentoring: {
    name: 'Plan Personalizado - Acompañamiento VIP',
    description: 'Servicio de acompañamiento personalizado durante todo el proceso de búsqueda y reubicación, con mentor dedicado.',
    price: STRIPE_PRICES.vip_mentoring,
    currency: 'eur',
    features: [
      'Mentor personal dedicado',
      'Plan de reubicación personalizado',
      'Asesoría legal y fiscal',
      'Networking con profesionales',
      '4 sesiones de coaching',
      'Soporte 24/7 durante 30 días',
      'Revisión de documentos oficiales'
    ]
  },
  cv_express: {
    name: 'Revisión Express de CV',
    description: 'Optimización rápida de tu CV para el mercado internacional con feedback profesional.',
    price: STRIPE_PRICES.cv_express,
    currency: 'eur',
    features: [
      'Revisión profesional de CV',
      'Feedback detallado',
      'Sugerencias de mejora',
      'Formato optimizado para ATS',
      'Entrega en 48h'
    ]
  }
} as const

export type StripeProductId = keyof typeof STRIPE_PRODUCTS

// Función para crear una sesión de checkout
export async function createCheckoutSession({
  productId,
  customerEmail,
  customerData,
  successUrl,
  cancelUrl,
}: {
  productId: StripeProductId
  customerEmail: string
  customerData?: Record<string, any>
  successUrl: string
  cancelUrl: string
}) {
  const product = STRIPE_PRODUCTS[productId]
  
  if (!product) {
    throw new Error(`Product ${productId} not found`)
  }

  try {
    const session = await stripe().checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: customerEmail,
      metadata: {
        product_id: productId,
        customer_data: JSON.stringify(customerData || {}),
      },
      line_items: [
        {
          price_data: {
            currency: product.currency,
            product_data: {
              name: product.name,
              description: product.description,
              metadata: {
                product_id: productId,
                features: JSON.stringify(product.features),
              },
            },
            unit_amount: product.price,
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['ES', 'DE', 'FR', 'IT', 'PT', 'GB', 'US', 'CA', 'AU', 'NL', 'BE', 'CH', 'AT', 'SE', 'NO', 'DK', 'FI', 'IE'],
      },
      payment_intent_data: {
        metadata: {
          product_id: productId,
          customer_email: customerEmail,
        },
      },
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // Expira en 30 minutos
    })

    return session
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error)
    throw error
  }
}

// Función para verificar el estado de un pago
export async function retrieveCheckoutSession(sessionId: string) {
  try {
    const session = await stripe().checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'customer'],
    })
    return session
  } catch (error) {
    console.error('Error retrieving Stripe checkout session:', error)
    throw error
  }
}

// Función para manejar webhooks de Stripe
export async function handleStripeWebhook(
  payload: string | Buffer,
  signature: string
) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
  
  try {
    const event = stripe().webhooks.constructEvent(payload, signature, webhookSecret)
    return event
  } catch (error) {
    console.error('Error verifying Stripe webhook signature:', error)
    throw error
  }
}

// Función para formatear moneda
export function formatPrice(amount: number, currency: string = 'EUR') {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100)
}