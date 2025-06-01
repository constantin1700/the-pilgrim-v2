import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';
import { requireAdmin, unauthorizedResponse } from '@/lib/auth-helpers';

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    await requireAdmin(request);
    
    const supabase = createServiceRoleClient();
    
    // Fetch all statistics in parallel
    const [
      // Countries stats
      countriesResult,
      // Blog posts stats
      blogPostsResult,
      publishedPostsResult,
      // Comments stats
      commentsResult,
      pendingCommentsResult,
      // Services stats
      servicesResult,
      activeServicesResult,
      // Reservations stats
      reservationsResult,
      recentReservationsResult,
      // Contact messages stats
      messagesResult,
      unreadMessagesResult,
      // User analytics stats
      analyticsResult,
      todayAnalyticsResult,
      // Admin activity logs
      recentActivityResult
    ] = await Promise.all([
      // Countries
      supabase.from('countries').select('id', { count: 'exact', head: true }),
      
      // Blog posts
      supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
      supabase.from('blog_posts').select('id', { count: 'exact', head: true }).eq('published', true),
      
      // Comments
      supabase.from('comments').select('id', { count: 'exact', head: true }),
      supabase.from('comments').select('id', { count: 'exact', head: true }).eq('approved', false),
      
      // Services
      supabase.from('services').select('id', { count: 'exact', head: true }),
      supabase.from('services').select('id', { count: 'exact', head: true }).eq('active', true),
      
      // Reservations
      supabase.from('reservations').select('id', { count: 'exact', head: true }),
      supabase.from('reservations')
        .select('id, amount, currency, status')
        .order('created_at', { ascending: false })
        .limit(5),
      
      // Contact messages
      supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
      supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('status', 'unread'),
      
      // User analytics
      supabase.from('user_analytics').select('id', { count: 'exact', head: true }),
      supabase.from('user_analytics')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
      
      // Admin activity logs
      supabase.from('admin_activity_logs')
        .select('id, action, admin_id, created_at, admin_users!inner(email)')
        .order('created_at', { ascending: false })
        .limit(10)
    ]);

    // Calculate revenue stats from paid reservations
    const revenueResult = await supabase
      .from('reservations')
      .select('amount, currency')
      .eq('status', 'paid');

    let totalRevenue = 0;
    if (revenueResult.data) {
      totalRevenue = revenueResult.data.reduce((sum, res) => sum + (res.amount || 0), 0);
    }

    // Get popular countries
    const popularCountriesResult = await supabase
      .from('countries')
      .select('id, name, likes_total')
      .order('likes_total', { ascending: false })
      .limit(5);

    // Get most viewed blog posts
    const popularPostsResult = await supabase
      .from('blog_posts')
      .select('id, title, views')
      .order('views', { ascending: false })
      .limit(5);

    const stats = {
      overview: {
        countries: countriesResult.count || 0,
        blogPosts: {
          total: blogPostsResult.count || 0,
          published: publishedPostsResult.count || 0
        },
        comments: {
          total: commentsResult.count || 0,
          pending: pendingCommentsResult.count || 0
        },
        services: {
          total: servicesResult.count || 0,
          active: activeServicesResult.count || 0
        },
        reservations: {
          total: reservationsResult.count || 0,
          revenue: {
            total: totalRevenue,
            currency: 'EUR'
          }
        },
        contactMessages: {
          total: messagesResult.count || 0,
          unread: unreadMessagesResult.count || 0
        },
        analytics: {
          totalSessions: analyticsResult.count || 0,
          todaySessions: todayAnalyticsResult.count || 0
        }
      },
      popular: {
        countries: popularCountriesResult.data || [],
        blogPosts: popularPostsResult.data || []
      },
      recent: {
        reservations: recentReservationsResult.data || [],
        adminActivity: recentActivityResult.data || []
      }
    };
    
    return NextResponse.json(stats);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return unauthorizedResponse(error.message);
    }
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}