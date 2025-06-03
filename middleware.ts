import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  const pathname = req.nextUrl.pathname
  
  // Permitir acceso a login y recursos públicos
  if (pathname === '/admin/login' || pathname === '/api/admin/check-access') {
    return res
  }
  
  // Proteger rutas admin
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      // No hay sesión, redirigir a login
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    
    // Hay sesión, verificar si es admin
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('id')
      .eq('email', session.user.email)
      .eq('is_active', true)
      .single()
    
    if (!adminUser) {
      // No es admin
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Sin permisos de administrador' }, { status: 403 })
      }
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }
  
  return res
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*']
}