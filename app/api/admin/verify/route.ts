import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { createServiceRoleClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // Get the email from the request body
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Verify if the email exists in admin_users table and is active
    const serviceSupabase = createServiceRoleClient();
    const { data: adminUser, error } = await serviceSupabase
      .from('admin_users')
      .select('id, email, role, is_active')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (error || !adminUser) {
      return NextResponse.json(
        { 
          isAdmin: false,
          message: 'User is not an admin or is inactive'
        },
        { status: 200 }
      );
    }

    // Return success with admin details
    return NextResponse.json({
      isAdmin: true,
      role: adminUser.role,
      message: 'User has admin access'
    });

  } catch (error) {
    console.error('Admin verification error:', error);
    return NextResponse.json(
      { error: 'Server error during verification' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get session from cookies for GET requests
    const supabase = createServerComponentClient({ cookies });
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session?.user?.email) {
      return NextResponse.json(
        { 
          isAdmin: false,
          message: 'No valid session'
        },
        { status: 200 }
      );
    }

    // Verify if the logged-in user's email exists in admin_users table and is active
    const serviceSupabase = createServiceRoleClient();
    const { data: adminUser, error } = await serviceSupabase
      .from('admin_users')
      .select('id, email, role, is_active')
      .eq('email', session.user.email)
      .eq('is_active', true)
      .single();

    if (error || !adminUser) {
      return NextResponse.json(
        { 
          isAdmin: false,
          message: 'User is not an admin or is inactive'
        },
        { status: 200 }
      );
    }

    // Return success with admin details
    return NextResponse.json({
      isAdmin: true,
      role: adminUser.role,
      email: adminUser.email,
      message: 'User has admin access'
    });

  } catch (error) {
    console.error('Admin verification error:', error);
    return NextResponse.json(
      { error: 'Server error during verification' },
      { status: 500 }
    );
  }
}