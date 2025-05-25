import { NextResponse } from 'next/server'

export async function GET() {
  // Only show if env vars exist, not their values
  const debug = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    vercel: process.env.VERCEL ? 'Yes' : 'No',
    variables: {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET',
    },
    // Check if we can read any env var
    canReadEnv: Object.keys(process.env).length > 0,
    envCount: Object.keys(process.env).length,
    // List all NEXT_PUBLIC vars (safe to show keys)
    publicVars: Object.keys(process.env)
      .filter(key => key.startsWith('NEXT_PUBLIC_'))
      .map(key => key)
  }

  return NextResponse.json(debug, {
    headers: {
      'Cache-Control': 'no-store'
    }
  })
}