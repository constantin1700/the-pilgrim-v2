import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const pathname = req.nextUrl.pathname
  
  // Solo proteger rutas admin
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api/admin')) {
    return res
  }
  
  // Permitir login sin autenticación
  if (pathname === '/admin/login') {
    return res
  }
  
  const supabase = createMiddlewareClient({ req, res })
  
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      // No hay sesión - redirigir a login
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    
    // Verificar si es admin
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('id')
      .eq('email', session.user.email)
      .eq('is_active', true)
      .single()
    
    if (!adminUser) {
      // No es admin
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'No tienes permisos de administrador' }, { status: 403 })
      }
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    
    // Es admin - permitir acceso
    return res
    
  } catch (error) {
    console.error('Middleware error:', error)
    // En caso de error, redirigir a login
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Error de servidor' }, { status: 500 })
    }
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*']
}