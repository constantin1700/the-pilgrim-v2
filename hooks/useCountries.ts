import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Country } from '@/lib/types'

export function useCountries() {
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCountries()
    
    // Subscribe to realtime updates
    const subscription = supabase
      .channel('countries-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'countries' },
        () => {
          fetchCountries()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchCountries = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/countries')
      if (!response.ok) throw new Error('Failed to fetch countries')
      
      const data = await response.json()
      setCountries(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching countries:', err)
      setError('Error loading countries')
    } finally {
      setLoading(false)
    }
  }

  return { countries, loading, error, refetch: fetchCountries }
}