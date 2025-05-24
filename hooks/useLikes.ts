import { useEffect, useState } from 'react'

export function useLikes() {
  const [userId, setUserId] = useState<string>('')
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Generate or get user ID
    let storedUserId = localStorage.getItem('userId')
    if (!storedUserId) {
      storedUserId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      localStorage.setItem('userId', storedUserId)
    }
    setUserId(storedUserId)

    // Fetch liked items
    fetchLikedItems(storedUserId)
  }, [])

  const fetchLikedItems = async (uid: string) => {
    try {
      const response = await fetch(`/api/likes?userId=${uid}`)
      if (response.ok) {
        const data = await response.json()
        setLikedItems(new Set(data.likedItems))
      }
    } catch (error) {
      console.error('Error fetching likes:', error)
    }
  }

  const toggleLike = async (itemId: string, itemType: string) => {
    if (!userId) return false

    try {
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, itemId, itemType })
      })

      if (response.ok) {
        const { liked } = await response.json()
        
        setLikedItems(prev => {
          const newSet = new Set(prev)
          if (liked) {
            newSet.add(itemId)
          } else {
            newSet.delete(itemId)
          }
          return newSet
        })
        
        return liked
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    }
    
    return false
  }

  const isLiked = (itemId: string) => likedItems.has(itemId)

  return { userId, toggleLike, isLiked }
}