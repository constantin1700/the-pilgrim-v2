import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { cache } from 'react'

// Crear cliente de Supabase para server components
export const createSupabaseServerClient = cache(() => {
  const cookieStore = cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
})

// Crear cliente con service role para operaciones admin
export const createSupabaseServiceClient = () => {
  const { createClient } = require('@supabase/supabase-js')
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

// Verificar si el usuario es admin
export async function isUserAdmin(email: string): Promise<boolean> {
  try {
    const supabase = createSupabaseServiceClient()
    
    const { data, error } = await supabase
      .from('admin_users')
      .select('id, is_active')
      .eq('email', email)
      .eq('is_active', true)
      .single()
    
    return !error && !!data
  } catch {
    return false
  }
}

// Obtener sesión actual
export async function getCurrentUser() {
  try {
    const supabase = createSupabaseServerClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) return null
    
    return user
  } catch {
    return null
  }
}

// Verificar acceso admin para páginas
export async function requireAdminAccess() {
  const user = await getCurrentUser()
  
  if (!user?.email) {
    return { authorized: false, redirect: '/admin/login' }
  }
  
  const isAdmin = await isUserAdmin(user.email)
  
  if (!isAdmin) {
    return { authorized: false, redirect: '/admin/login' }
  }
  
  return { authorized: true, user }
}