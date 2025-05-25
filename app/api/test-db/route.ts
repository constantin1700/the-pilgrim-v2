import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const diagnostics = {
    env: {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET',
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
      supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET',
    },
    connection: {
      status: 'unknown',
      error: null as any,
      countriesCount: 0
    }
  }

  try {
    // Test simple query
    const { data, error } = await supabase
      .from('countries')
      .select('id, name')
      .limit(5)

    if (error) {
      diagnostics.connection.status = 'failed'
      diagnostics.connection.error = {
        message: error.message,
        code: error.code,
        details: error.details
      }
    } else {
      diagnostics.connection.status = 'success'
      diagnostics.connection.countriesCount = data?.length || 0
    }
  } catch (e: any) {
    diagnostics.connection.status = 'error'
    diagnostics.connection.error = {
      message: e.message,
      stack: e.stack
    }
  }

  return NextResponse.json(diagnostics)
}