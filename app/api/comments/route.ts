import { NextRequest, NextResponse } from 'next/server'
import { supabase, getServiceSupabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const postId = searchParams.get('postId')
  const approved = searchParams.get('approved')

  try {
    let query = supabase
      .from('comments')
      .select(`
        *,
        blog_posts (title)
      `)
      .order('created_at', { ascending: false })

    if (postId) {
      query = query.eq('post_id', postId)
    }

    if (approved !== null) {
      query = query.eq('approved', approved === 'true')
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Error fetching comments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const commentData = await request.json()
    
    // Get IP address
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    commentData.ip_address = ip

    const { data, error } = await supabase
      .from('comments')
      .insert(commentData)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Error creating comment' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Check admin authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id, approved } = await request.json()

    const serviceSupabase = getServiceSupabase()
    const { data, error } = await serviceSupabase
      .from('comments')
      .update({ approved })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating comment:', error)
    return NextResponse.json(
      { error: 'Error updating comment' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check admin authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await request.json()

    const serviceSupabase = getServiceSupabase()
    const { error } = await serviceSupabase
      .from('comments')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json(
      { error: 'Error deleting comment' },
      { status: 500 }
    )
  }
}