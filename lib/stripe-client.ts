import { loadStripe, Stripe } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null> | null = null

export const getStripe = () => {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
    
    if (!key) {
      console.error('Stripe public key not found. Make sure NEXT_PUBLIC_STRIPE_PUBLIC_KEY is set.')
      return Promise.resolve(null)
    }
    
    stripePromise = loadStripe(key)
  }
  
  return stripePromise
}