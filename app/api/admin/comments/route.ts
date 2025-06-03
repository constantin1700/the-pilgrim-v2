import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServiceClient } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Authentication temporarily disabled
    
    const supabase = createSupabaseServiceClient();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    let query = supabase
      .from('comments')
      .select(`
        *,
        blog_posts(title)
      `)
      .order('created_at', { ascending: false });
    
    if (status) {
      query = query.eq('approved', status === 'approved');
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching comments:', error);
      return NextResponse.json({ error: 'Error fetching comments' }, { status: 500 });
    }
    
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Authentication temporarily disabled
    
    const supabase = createSupabaseServiceClient();
    const body = await request.json();
    const { id, action } = body;
    
    if (!id || !action) {
      return NextResponse.json({ error: 'Comment ID and action are required' }, { status: 400 });
    }
    
    let updateData: any = {};
    
    switch (action) {
      case 'approve':
        updateData.approved = true;
        break;
      case 'reject':
        updateData.approved = false;
        break;
      case 'delete':
        const { error: deleteError } = await supabase
          .from('comments')
          .delete()
          .eq('id', id);
        
        if (deleteError) {
          console.error('Error deleting comment:', deleteError);
          return NextResponse.json({ error: 'Error deleting comment' }, { status: 500 });
        }
        
        return NextResponse.json({ success: true });
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
    
    const { data, error } = await supabase
      .from('comments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating comment:', error);
      return NextResponse.json({ error: 'Error updating comment' }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authentication temporarily disabled
    
    const supabase = createSupabaseServiceClient();
    const body = await request.json();
    const { ids, action } = body;
    
    if (!ids || !Array.isArray(ids) || !action) {
      return NextResponse.json({ error: 'Comment IDs array and action are required' }, { status: 400 });
    }
    
    switch (action) {
      case 'approve':
        const { error: approveError } = await supabase
          .from('comments')
          .update({ approved: true })
          .in('id', ids);
        
        if (approveError) {
          console.error('Error approving comments:', approveError);
          return NextResponse.json({ error: 'Error approving comments' }, { status: 500 });
        }
        break;
        
      case 'delete':
        const { error: deleteError } = await supabase
          .from('comments')
          .delete()
          .in('id', ids);
        
        if (deleteError) {
          console.error('Error deleting comments:', deleteError);
          return NextResponse.json({ error: 'Error deleting comments' }, { status: 500 });
        }
        break;
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}