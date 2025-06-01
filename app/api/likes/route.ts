import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// In-memory store for development
const likesStore = new Map<string, Set<string>>()

export async function POST(request: NextRequest) {
  try {
    const { itemId, itemType, userId } = await request.json()
    
    // Map itemType to like_type
    const likeType = itemType === 'country' ? 'country_dashboard' : 
                     itemType === 'explorer' ? 'country_explorer' : 
                     itemType === 'blog' ? 'blog_post' : itemType

    // Build query based on item type
    let query = supabase
      .from('user_likes')
      .select()
      .eq('user_session', userId)
      .eq('like_type', likeType)
    
    if (likeType === 'blog_post') {
      query = query.eq('post_id', itemId)
    } else {
      query = query.eq('country_id', itemId)
    }

    // Check if user already liked this item
    const { data: existingLike } = await query.single()

    if (existingLike) {
      // Unlike: remove the like
      const { error: deleteError } = await supabase
        .from('user_likes')
        .delete()
        .eq('id', existingLike.id)

      if (deleteError) throw deleteError

      // Update country likes count
      if (itemType === 'country_dashboard') {
        const { data: country } = await supabase
          .from('countries')
          .select('likes_dashboard, likes_total')
          .eq('id', itemId)
          .single()
        
        if (country) {
          await supabase
            .from('countries')
            .update({ 
              likes_dashboard: Math.max(0, country.likes_dashboard - 1),
              likes_total: Math.max(0, country.likes_total - 1)
            })
            .eq('id', itemId)
        }
      }

      return NextResponse.json({ liked: false })
    } else {
      // Like: add new like
      const insertData: any = {
        user_session: userId,
        like_type: likeType,
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
      }
      
      if (likeType === 'blog_post') {
        insertData.post_id = itemId
      } else {
        insertData.country_id = itemId
      }
      
      const { error: insertError } = await supabase
        .from('user_likes')
        .insert(insertData)

      if (insertError) throw insertError

      // Update country likes count
      if (itemType === 'country_dashboard') {
        const { data: country } = await supabase
          .from('countries')
          .select('likes_dashboard, likes_total')
          .eq('id', itemId)
          .single()
        
        if (country) {
          await supabase
            .from('countries')
            .update({ 
              likes_dashboard: country.likes_dashboard + 1,
              likes_total: country.likes_total + 1
            })
            .eq('id', itemId)
        }
      }

      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error('Error handling like:', error)
    return NextResponse.json(
      { error: 'Error processing like' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId')
  const itemType = searchParams.get('itemType')

  if (!userId) {
    return NextResponse.json(
      { error: 'User ID required' },
      { status: 400 }
    )
  }

  try {
    // Si la tabla no existe, devolver array vacío
    const { data: tables } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'user_likes')
      .single()

    if (!tables) {
      return NextResponse.json({ likedItems: [] })
    }
    // Map itemType to like_type
    const likeType = itemType === 'country' ? 'country_dashboard' : 
                     itemType === 'explorer' ? 'country_explorer' : 
                     itemType === 'blog' ? 'blog_post' : itemType
    
    const query = supabase
      .from('user_likes')
      .select('country_id, post_id, like_type')
      .eq('user_session', userId)

    if (likeType) {
      query.eq('like_type', likeType)
    }

    const { data, error } = await query

    if (error) throw error

    const likedItems = data.map(item => item.country_id || item.post_id).filter(Boolean)
    return NextResponse.json({ likedItems })
  } catch (error) {
    console.error('Error fetching likes:', error)
    return NextResponse.json(
      { error: 'Error fetching likes' },
      { status: 500 }
    )
  }
}