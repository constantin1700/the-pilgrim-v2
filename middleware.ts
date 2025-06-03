import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Solo aplicar middleware a rutas admin
  if (!req.nextUrl.pathname.startsWith('/admin')) {
    return res
  }
  
  // Permitir acceso directo a login
  if (req.nextUrl.pathname === '/admin/login') {
    return res
  }
  
  try {
    const supabase = createMiddlewareClient({ req, res })
    const { data: { session } } = await supabase.auth.getSession()
    
    // Si no hay sesión, redirigir a login
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    
    // Si hay sesión, continuar
    return res
    
  } catch (error) {
    console.error('Middleware error:', error)
    // En caso de error, permitir acceso para no bloquear
    return res
  }
}

export const config = {
  matcher: '/admin/((?!login).*)',
}