import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          res.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check if the user is trying to access admin pages or admin API routes
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
  const isAdminAPI = req.nextUrl.pathname.startsWith('/api/admin')
  const isLoginPage = req.nextUrl.pathname === '/admin/login'
  
  if (isAdminRoute || isAdminAPI) {
    // Allow access to login page without authentication
    if (isLoginPage && !user) {
      return res
    }
    
    // Redirect authenticated users from login to dashboard
    if (isLoginPage && user) {
      // Verify admin access first
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('role, is_active')
        .eq('email', user.email)
        .single()
      
      if (adminUser?.is_active) {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url))
      }
    }
    
    // For all other admin routes, require authentication
    if (!user && !isLoginPage) {
      if (isAdminAPI) {
        // Return 401 for API routes
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
      // Redirect to login for UI routes
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }

    // Check if user has admin access
    if (user && !isLoginPage) {
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('role, is_active')
        .eq('email', user.email)
        .single()

      if (!adminUser || !adminUser.is_active) {
        if (isAdminAPI) {
          // Return 403 for API routes
          return NextResponse.json(
            { error: 'Forbidden: Admin access required' },
            { status: 403 }
          )
        }
        // User is authenticated but not an admin
        return NextResponse.redirect(new URL('/', req.url))
      }
    }
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}