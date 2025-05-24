import { NextRequest, NextResponse } from 'next/server'
import { supabase, getServiceSupabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .order('name')

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching countries:', error)
    return NextResponse.json(
      { error: 'Error fetching countries' },
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