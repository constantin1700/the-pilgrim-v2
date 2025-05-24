import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { itemId, itemType, userId } = await request.json()

    // Check if user already liked this item
    const { data: existingLike } = await supabase
      .from('user_likes')
      .select()
      .eq('user_id', userId)
      .eq('item_id', itemId)
      .eq('item_type', itemType)
      .single()

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
      const { error: insertError } = await supabase
        .from('user_likes')
        .insert({
          user_id: userId,
          item_id: itemId,
          item_type: itemType
        })

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
    const query = supabase
      .from('user_likes')
      .select('item_id')
      .eq('user_id', userId)

    if (itemType) {
      query.eq('item_type', itemType)
    }

    const { data, error } = await query

    if (error) throw error

    const likedItems = data.map(item => item.item_id)
    return NextResponse.json({ likedItems })
  } catch (error) {
    console.error('Error fetching likes:', error)
    return NextResponse.json(
      { error: 'Error fetching likes' },
      { status: 500 }
    )
  }
}