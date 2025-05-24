import { NextRequest, NextResponse } from 'next/server'

// In-memory store for local development
const likesStore = new Map<string, Set<string>>()
const likeCounts = new Map<string, number>()

export async function POST(request: NextRequest) {
  try {
    const { itemId, itemType, userId } = await request.json()
    
    const userLikesKey = `${userId}:${itemType}`
    const itemCountKey = `${itemId}:${itemType}`
    
    // Get or create user likes set
    if (!likesStore.has(userLikesKey)) {
      likesStore.set(userLikesKey, new Set())
    }
    
    const userLikes = likesStore.get(userLikesKey)!
    const isLiked = userLikes.has(itemId)
    
    if (isLiked) {
      // Unlike
      userLikes.delete(itemId)
      const currentCount = likeCounts.get(itemCountKey) || 0
      likeCounts.set(itemCountKey, Math.max(0, currentCount - 1))
      
      return NextResponse.json({ liked: false, count: likeCounts.get(itemCountKey) || 0 })
    } else {
      // Like
      userLikes.add(itemId)
      const currentCount = likeCounts.get(itemCountKey) || 0
      likeCounts.set(itemCountKey, currentCount + 1)
      
      return NextResponse.json({ liked: true, count: likeCounts.get(itemCountKey) || 0 })
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

  const userLikesKey = `${userId}:${itemType || 'all'}`
  const userLikes = likesStore.get(userLikesKey) || new Set()
  
  return NextResponse.json({
    likedItems: Array.from(userLikes),
    counts: Object.fromEntries(likeCounts)
  })
}