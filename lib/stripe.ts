import Stripe from 'stripe'

// Server-side Stripe instance - only initialize if we have the key
const stripeSecretKey = process.env.STRIPE_SECRET_KEY

export const stripe = stripeSecretKey 
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2025-04-30.basil',
      typescript: true,
    })
  : null as any

// Re-export client-side Stripe from separate file
export { getStripe } from './stripe-client'

// Precio de los servicios en Stripe (en céntimos)
export const STRIPE_PRICES = {
  basic_consultation: 4900, // 49.00 EUR
  premium_preparation: 14900, // 149.00 EUR
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

  if (!stripe) {
    throw new Error('Stripe is not configured. Please check your environment variables.')
  }

  try {
    const session = await stripe.checkout.sessions.create({
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
  if (!stripe) {
    throw new Error('Stripe is not configured. Please check your environment variables.')
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
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
  
  if (!stripe) {
    throw new Error('Stripe is not configured. Please check your environment variables.')
  }

  try {
    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret)
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