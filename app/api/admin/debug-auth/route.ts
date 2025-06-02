import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { createServiceRoleClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;
    
    // Debug info
    const debugInfo = {
      requestEmail: email,
      timestamp: new Date().toISOString(),
      checks: {}
    };

    // Check 1: Service role client works
    try {
      const serviceSupabase = createServiceRoleClient();
      debugInfo.checks.serviceRoleClient = 'OK';
      
      // Check 2: Can query admin_users table
      const { data: allAdmins, error: queryError } = await serviceSupabase
        .from('admin_users')
        .select('email, role, is_active');
        
      if (queryError) {
        debugInfo.checks.adminTableQuery = `ERROR: ${queryError.message}`;
      } else {
        debugInfo.checks.adminTableQuery = 'OK';
        debugInfo.checks.totalAdmins = allAdmins?.length || 0;
        debugInfo.checks.adminEmails = allAdmins?.map(a => a.email) || [];
      }
      
      // Check 3: Find specific user
      const { data: specificUser, error: userError } = await serviceSupabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .single();
        
      if (userError) {
        debugInfo.checks.specificUserQuery = `ERROR: ${userError.message}`;
        debugInfo.checks.userFound = false;
      } else {
        debugInfo.checks.specificUserQuery = 'OK';
        debugInfo.checks.userFound = true;
        debugInfo.checks.userData = {
          email: specificUser.email,
          role: specificUser.role,
          is_active: specificUser.is_active,
          id: specificUser.id
        };
      }
      
      // Check 4: Environment variables
      debugInfo.checks.envVars = {
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseAnon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasServiceRole: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...'
      };
      
    } catch (error) {
      debugInfo.checks.generalError = error instanceof Error ? error.message : 'Unknown error';
    }
    
    return NextResponse.json(debugInfo);
    
  } catch (error) {
    return NextResponse.json({
      error: 'Debug route error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}