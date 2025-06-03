import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ isAdmin: false })
    }
    
    const supabase = createSupabaseServiceClient()
    
    const { data, error } = await supabase
      .from('admin_users')
      .select('id')
      .eq('email', email)
      .eq('is_active', true)
      .single()
    
    return NextResponse.json({ 
      isAdmin: !error && !!data 
    })
    
  } catch (error) {
    console.error('Error checking admin access:', error)
    return NextResponse.json({ isAdmin: false })
  }
}