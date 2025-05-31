import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nrbvwmmkfmpghbyhosow.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yYnZ3bW1rZm1wZ2hieWhvc293Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNTQ4NTYsImV4cCI6MjA2MzczMDg1Nn0.Rq42UBK_RuOANJ5DFPPOmAaIJmLRaq6rYQu3wOvH3LI'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn('Supabase environment variables are not set. Using hardcoded values.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for server-side operations
export const getServiceSupabase = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  
  if (!supabaseServiceKey) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY is not set')
    return createClient(url, 'placeholder-service-key')
  }
  return createClient(url, supabaseServiceKey)
}

// Alias for consistency with new API routes
export const createServiceRoleClient = getServiceSupabase

// Auth helpers
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const checkAdminAccess = async () => {
  const user = await getUser()
  if (!user) return false
  
  const { data } = await supabase
    .from('admin_users')
    .select('role')
    .eq('email', user.email)
    .single()
  
  return !!data
}