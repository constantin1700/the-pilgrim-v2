import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Country } from '@/lib/types'
import { mockCountries } from '@/lib/mock-data'

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
    setLoading(true)
    
    // TEMPORARY: Always use mock data until we fix the connection
    console.log('Using mock countries data (temporary fix)')
    setCountries(mockCountries.map(c => ({
      ...c,
      likesTotal: c.likes_total || 0,
      likesDashboard: c.likes_dashboard || 0,
      likesBlog: c.likesBlog || 0
    })) as Country[])
    setError(null)
    setLoading(false)
    
    // Original code commented out temporarily
    /*
    try {
      const response = await fetch('/api/countries')
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('API Error:', errorData)
        throw new Error(`Failed to fetch countries: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (!data || data.length === 0) {
        console.warn('No countries returned from API')
        throw new Error('No countries data available')
      }
      
      setCountries(data)
      setError(null)
    } catch (err: any) {
      console.error('Error fetching countries:', err)
      
      // Always use mock data as fallback
      console.log('Using mock countries data as fallback')
      setCountries(mockCountries.map(c => ({
        ...c,
        likesTotal: c.likes_total || 0,
        likesDashboard: c.likes_dashboard || 0,
        likesBlog: c.likesBlog || 0
      })) as Country[])
      
      // Show error but still display mock data
      setError(`Error loading live data: ${err.message}. Showing sample data.`)
    } finally {
      setLoading(false)
    }
    */
  }

  return { countries, loading, error, refetch: fetchCountries }
}