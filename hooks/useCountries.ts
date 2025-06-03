import { useEffect, useState } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase-browser'
import { Country } from '@/lib/types'
import { mockCountries } from '@/lib/mock-data'

export function useCountries() {
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCountries()
    
    // Subscribe to realtime updates
    const supabase = getSupabaseBrowserClient()
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
    
    try {
      // Usar directamente Supabase para mejor performance
      const supabase = getSupabaseBrowserClient()
      const { data, error: supabaseError } = await supabase
        .from('countries')
        .select('*')
        .order('name', { ascending: true })

      if (supabaseError) {
        console.error('Supabase error:', supabaseError)
        throw new Error(`Supabase error: ${supabaseError.message}`)
      }

      if (!data || data.length === 0) {
        console.warn('No countries returned from Supabase, using mock data as fallback')
        throw new Error('No countries data available in database')
      }

      // Mapear datos de Supabase al formato esperado
      const mappedCountries = data.map(country => ({
        ...country,
        // Asegurar compatibilidad con campos legacy
        likesTotal: country.likes_total || 0,
        likesDashboard: country.likes_dashboard || 0,
        likes_explorer: country.likes_explorer || 0,
        likesBlog: country.likes_blog || 0,
        qualityOfLife: country.quality_of_life,
        averageSalary: country.average_salary,
        salaryExpenseRatio: country.salary_expense_ratio,
        socialIndex: country.social_index,
        bureaucracyEase: country.bureaucracy_ease
      })) as Country[]

      console.log(`✅ Loaded ${mappedCountries.length} countries from Supabase`)
      setCountries(mappedCountries)
      setError(null)
    } catch (err: any) {
      console.error('Error fetching countries from Supabase:', err)
      
      // Fallback a mock data solo si Supabase falla completamente
      console.log('🔄 Using mock countries data as fallback')
      setCountries(mockCountries.map(c => ({
        ...c,
        likesTotal: c.likes_total || 0,
        likesDashboard: c.likes_dashboard || 0,
        likesBlog: c.likesBlog || 0
      })) as Country[])
      
      setError(`Error loading from database: ${err.message}. Showing sample data.`)
    } finally {
      setLoading(false)
    }
  }

  return { countries, loading, error, refetch: fetchCountries }
}