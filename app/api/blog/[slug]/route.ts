import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    // Obtener el post por slug
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (error || !post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Mapear los campos para mantener consistencia
    const mappedPost = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      countryId: post.country_id,
      countryName: post.country_id === 'alemania' ? 'Alemania' :
                   post.country_id === 'singapur' ? 'Singapur' :
                   post.country_id === 'noruega' ? 'Noruega' :
                   post.country_id === 'dubai' ? 'Dubái' :
                   post.country_id === 'australia' ? 'Australia' : 'País',
      likes: post.likes || 0,
      readingTime: post.reading_time || 5,
      published: post.published || true,
      publishedAt: post.published_at || post.created_at,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
      coverImage: post.featured_image
    }

    return NextResponse.json(mappedPost)
  } catch (error: any) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json(
      { error: error.message || 'Error fetching post' },
      { status: 500 }
    )
  }
}