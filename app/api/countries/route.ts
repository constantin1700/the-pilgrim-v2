import { NextRequest, NextResponse } from 'next/server'
import { supabase, getServiceSupabase } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('API: Fetching countries...')
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set')
    
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .order('name')

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    console.log(`API: Found ${data?.length || 0} countries`)
    return NextResponse.json(data || [])
  } catch (error: any) {
    console.error('Error fetching countries:', error)
    return NextResponse.json(
      { 
        error: 'Error fetching countries',
        details: error.message,
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'URL is set' : 'URL not found'
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const updates = await request.json()
    const { id, ...updateData } = updates

    const { data, error } = await supabase
      .from('countries')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating country:', error)
    return NextResponse.json(
      { error: 'Error updating country' },
      { status: 500 }
    )
  }
}