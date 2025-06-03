import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServiceClient } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServiceClient();
    
    // Get countries count
    const { count: countriesCount } = await supabase
      .from('countries')
      .select('*', { count: 'exact', head: true });

    // Get blog posts stats
    const { count: totalPosts } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true });
      
    const { count: publishedPosts } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published');

    // Get comments stats  
    const { count: totalComments } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true });
      
    const { count: pendingComments } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('approved', false);

    // Get services stats
    const { count: totalServices } = await supabase
      .from('services')
      .select('*', { count: 'exact', head: true });
      
    const { count: activeServices } = await supabase
      .from('services')
      .select('*', { count: 'exact', head: true })
      .eq('active', true);

    // Get reservations stats
    const { count: totalReservations } = await supabase
      .from('reservations')
      .select('*', { count: 'exact', head: true });

    // Get revenue
    const { data: revenueData } = await supabase
      .from('reservations')
      .select('amount')
      .eq('status', 'paid');
      
    const totalRevenue = revenueData?.reduce((sum: number, res: any) => sum + (res.amount || 0), 0) || 0;

    // Get popular countries (simplified)
    const { data: topCountries } = await supabase
      .from('countries')
      .select('name, likes_total')
      .order('likes_total', { ascending: false })
      .limit(5);

    // Get popular blog posts (simplified)
    const { data: topPosts } = await supabase
      .from('blog_posts')
      .select('title, views')
      .order('views', { ascending: false })
      .limit(5);

    // Get recent reservations
    const { data: recentReservations } = await supabase
      .from('reservations')
      .select('id, service_type, amount, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    // Build response
    const stats = {
      overview: {
        countries_count: countriesCount || 0,
        blog_posts_total: totalPosts || 0,
        blog_posts_published: publishedPosts || 0,
        comments_total: totalComments || 0,
        comments_pending: pendingComments || 0,
        services_total: totalServices || 0,
        services_active: activeServices || 0,
        reservations_total: totalReservations || 0,
        reservations_revenue: totalRevenue,
        contact_messages_total: 0,
        contact_messages_unread: 0,
        user_sessions_total: 0,
        user_sessions_today: 0
      },
      popular_items: {
        top_countries: topCountries?.map((c: any) => ({
          name: c.name,
          likes: c.likes_total || 0
        })) || [],
        top_blog_posts: topPosts?.map((p: any) => ({
          title: p.title,
          views: p.views || 0
        })) || []
      },
      recent_activity: {
        recent_reservations: recentReservations || [],
        recent_admin_logs: []
      }
    };
    
    return NextResponse.json(stats);
    
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ 
      error: 'Error loading stats',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}