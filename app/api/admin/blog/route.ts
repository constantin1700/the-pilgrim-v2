import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServiceClient, getCurrentUser, isUserAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const user = await getCurrentUser();
    if (!user?.email || !(await isUserAdmin(user.email))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const supabase = createSupabaseServiceClient();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    
    let query = supabase
      .from('blog_posts')
      .select('*, countries(name, name_es)')
      .order('created_at', { ascending: false });
    
    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
    }
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching blog posts:', error);
      return NextResponse.json({ error: 'Error fetching blog posts' }, { status: 500 });
    }
    
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const user = await getCurrentUser();
    if (!user?.email || !(await isUserAdmin(user.email))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const supabase = createSupabaseServiceClient();
    const body = await request.json();
    
    // Set default values
    const postData = {
      ...body,
      author: body.author || 'The Pilgrim Team',
      status: body.status || 'draft',
      views: 0,
      likes: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('blog_posts')
      .insert(postData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating blog post:', error);
      return NextResponse.json({ error: 'Error creating blog post' }, { status: 500 });
    }
    
    // Log admin action
    const logSupabase = createSupabaseServiceClient();
    await logSupabase
      .from('admin_activity_logs')
      .insert({
        admin_id: user.id,
        action: 'CREATE_BLOG_POST',
        details: {
          post_title: postData.title,
          post_status: postData.status,
          ip_address: request.headers.get('x-forwarded-for') || 'unknown',
          user_agent: request.headers.get('user-agent') || 'unknown'
        },
        created_at: new Date().toISOString()
      });
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Verify admin access
    const user = await getCurrentUser();
    if (!user?.email || !(await isUserAdmin(user.email))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const supabase = createSupabaseServiceClient();
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'Blog post ID is required' }, { status: 400 });
    }
    
    updateData.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating blog post:', error);
      return NextResponse.json({ error: 'Error updating blog post' }, { status: 500 });
    }
    
    // Log admin action
    const logSupabase = createSupabaseServiceClient();
    await logSupabase
      .from('admin_activity_logs')
      .insert({
        admin_id: user.id,
        action: 'UPDATE_BLOG_POST',
        details: {
          post_id: id,
          changes: updateData,
          ip_address: request.headers.get('x-forwarded-for') || 'unknown',
          user_agent: request.headers.get('user-agent') || 'unknown'
        },
        created_at: new Date().toISOString()
      });
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify admin access
    const user = await getCurrentUser();
    if (!user?.email || !(await isUserAdmin(user.email))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const supabase = createSupabaseServiceClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Blog post ID is required' }, { status: 400 });
    }
    
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting blog post:', error);
      return NextResponse.json({ error: 'Error deleting blog post' }, { status: 500 });
    }
    
    // Log admin action
    const logSupabase = createSupabaseServiceClient();
    await logSupabase
      .from('admin_activity_logs')
      .insert({
        admin_id: user.id,
        action: 'DELETE_BLOG_POST',
        details: {
          post_id: id,
          ip_address: request.headers.get('x-forwarded-for') || 'unknown',
          user_agent: request.headers.get('user-agent') || 'unknown'
        },
        created_at: new Date().toISOString()
      });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}