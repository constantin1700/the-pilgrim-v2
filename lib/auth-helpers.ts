import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { createServiceRoleClient } from './supabase'

export interface AdminUser {
  id: string
  email: string
  role: 'admin' | 'editor' | 'moderator'
  permissions: Record<string, boolean>
  is_active: boolean
}

/**
 * Verify admin access for API routes
 * @param request - NextRequest object
 * @returns Admin user object or throws error
 */
export async function requireAdmin(request: NextRequest): Promise<AdminUser> {
  try {
    // Get session from cookies
    const supabase = createServerComponentClient({ cookies })
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session?.user) {
      throw new Error('Unauthorized: No valid session')
    }

    // Verify admin access using service role
    const serviceSupabase = createServiceRoleClient()
    const { data: adminUser, error: adminError } = await serviceSupabase
      .from('admin_users')
      .select('*')
      .eq('email', session.user.email)
      .eq('is_active', true)
      .single()

    if (adminError || !adminUser) {
      throw new Error('Unauthorized: Not an admin')
    }

    // Update last activity
    await serviceSupabase
      .from('admin_users')
      .update({ 
        last_login: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', adminUser.id)

    return adminUser as AdminUser
  } catch (error) {
    console.error('Admin auth error:', error)
    throw error
  }
}

/**
 * Create unauthorized response
 */
export function unauthorizedResponse(message: string = 'Unauthorized') {
  return NextResponse.json(
    { error: message },
    { status: 401 }
  )
}

/**
 * Check if user has specific permission
 */
export function hasPermission(adminUser: AdminUser, permission: string): boolean {
  if (adminUser.role === 'admin') return true
  return adminUser.permissions?.[permission] === true
}

/**
 * Require specific permission
 */
export async function requirePermission(
  request: NextRequest, 
  permission: string
): Promise<AdminUser> {
  const adminUser = await requireAdmin(request)
  
  if (!hasPermission(adminUser, permission)) {
    throw new Error('Forbidden: Insufficient permissions')
  }
  
  return adminUser
}

/**
 * Log admin action for audit trail
 */
export async function logAdminAction(
  adminId: string,
  action: string,
  details: Record<string, any>
) {
  try {
    const serviceSupabase = createServiceRoleClient()
    await serviceSupabase
      .from('admin_activity_logs')
      .insert({
        admin_id: adminId,
        action,
        details,
        ip_address: details.ip_address,
        user_agent: details.user_agent,
        created_at: new Date().toISOString()
      })
  } catch (error) {
    console.error('Error logging admin action:', error)
  }
}