import { NextRequest, NextResponse } from 'next/server'
import { supabase, getServiceSupabase } from '@/lib/supabase'
import { generateSlug } from '@/lib/utils'
import { mockBlogPosts } from '@/lib/mock-data'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const countryId = searchParams.get('countryId')
  const published = searchParams.get('published')

  try {
    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        countries (name)
      `)
      .order('published_at', { ascending: false })

    if (countryId) {
      query = query.eq('country_id', countryId)
    }

    if (published === 'true') {
      query = query.eq('published', true)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    // Return mock data in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Using mock blog posts data')
      let filteredPosts = mockBlogPosts
      
      if (countryId) {
        filteredPosts = filteredPosts.filter(post => post.country_id === countryId)
      }
      
      if (published === 'true') {
        filteredPosts = filteredPosts.filter(post => post.published)
      }
      
      return NextResponse.json(filteredPosts)
    }
    
    return NextResponse.json(
      { error: 'Error fetching blog posts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const postData = await request.json()
    
    // Generate slug if not provided
    if (!postData.slug) {
      postData.slug = generateSlug(postData.title)
    }

    // Calculate reading time
    postData.reading_time = Math.ceil(postData.content.split(' ').length / 200)

    // Set published_at if publishing
    if (postData.published && !postData.published_at) {
      postData.published_at = new Date().toISOString()
    }

    const serviceSupabase = getServiceSupabase()
    const { data, error } = await serviceSupabase
      .from('blog_posts')
      .insert(postData)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json(
      { error: 'Error creating blog post' },
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

    const updates = await request.json()
    const { id, ...updateData } = updates

    // Recalculate reading time if content changed
    if (updateData.content) {
      updateData.reading_time = Math.ceil(updateData.content.split(' ').length / 200)
    }

    // Set published_at if publishing for the first time
    if (updateData.published && !updates.published_at) {
      updateData.published_at = new Date().toISOString()
    }

    const serviceSupabase = getServiceSupabase()
    const { data, error } = await serviceSupabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating blog post:', error)
    return NextResponse.json(
      { error: 'Error updating blog post' },
      { status: 500 }
    )
  }
}