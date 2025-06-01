import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    env: {
      hasStripePublicKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
      hasStripeSecretKey: !!process.env.STRIPE_SECRET_KEY,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      stripePublicKeyPreview: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY?.substring(0, 20) + '...',
      supabaseUrlValue: process.env.NEXT_PUBLIC_SUPABASE_URL,
    }
  })
}