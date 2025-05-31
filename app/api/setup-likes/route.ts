import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Crear cliente admin con service role key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function POST(request: NextRequest) {
  try {
    // Verificar autorización (solo para setup inicial)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Setting up likes system...')
    
    // Verificar si la tabla ya existe
    const { data: existingTable } = await supabaseAdmin
      .from('user_likes')
      .select('id')
      .limit(1)

    if (existingTable) {
      return NextResponse.json({ 
        message: 'Likes system already exists',
        status: 'ready' 
      })
    }

    // Si llegamos aquí, la tabla no existe
    // Retornar el SQL necesario para crear el sistema
    const setupSQL = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_likes table
CREATE TABLE public.user_likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_session VARCHAR(255) NOT NULL,
  country_id VARCHAR(255),
  post_id UUID,
  like_type VARCHAR(50) NOT NULL CHECK (like_type IN ('country_dashboard', 'country_explorer', 'blog_post')),
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_user_likes_session ON public.user_likes(user_session);
CREATE INDEX idx_user_likes_country ON public.user_likes(country_id);
CREATE INDEX idx_user_likes_post ON public.user_likes(post_id);
CREATE INDEX idx_user_likes_type ON public.user_likes(like_type);
CREATE INDEX idx_user_likes_created ON public.user_likes(created_at DESC);

-- Create unique constraints
CREATE UNIQUE INDEX idx_user_likes_unique_blog 
ON public.user_likes(user_session, post_id) 
WHERE like_type = 'blog_post' AND post_id IS NOT NULL;

CREATE UNIQUE INDEX idx_user_likes_unique_country 
ON public.user_likes(user_session, country_id, like_type) 
WHERE like_type IN ('country_dashboard', 'country_explorer') AND country_id IS NOT NULL;

-- Add foreign keys
ALTER TABLE public.user_likes 
ADD CONSTRAINT fk_user_likes_blog_post 
FOREIGN KEY (post_id) 
REFERENCES public.blog_posts(id) 
ON DELETE CASCADE;

ALTER TABLE public.user_likes 
ADD CONSTRAINT fk_user_likes_country 
FOREIGN KEY (country_id) 
REFERENCES public.countries(id) 
ON DELETE CASCADE;

-- Add likes columns to countries if they don't exist
ALTER TABLE public.countries 
ADD COLUMN IF NOT EXISTS likes_dashboard INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS likes_explorer INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS likes_total INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS likes_blog INTEGER DEFAULT 0;

-- Update NULL values to 0
UPDATE public.countries 
SET 
  likes_dashboard = COALESCE(likes_dashboard, 0),
  likes_explorer = COALESCE(likes_explorer, 0),
  likes_total = COALESCE(likes_total, 0),
  likes_blog = COALESCE(likes_blog, 0)
WHERE 
  likes_dashboard IS NULL OR 
  likes_explorer IS NULL OR 
  likes_total IS NULL OR
  likes_blog IS NULL;

-- Add likes column to blog_posts if it doesn't exist
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;

-- Update NULL values to 0
UPDATE public.blog_posts 
SET likes = COALESCE(likes, 0)
WHERE likes IS NULL;

-- Create update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
DROP TRIGGER IF EXISTS update_user_likes_updated_at ON public.user_likes;
CREATE TRIGGER update_user_likes_updated_at 
BEFORE UPDATE ON public.user_likes 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.user_likes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Likes are viewable by everyone" ON public.user_likes;
CREATE POLICY "Likes are viewable by everyone" 
ON public.user_likes FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Anyone can create likes" ON public.user_likes;
CREATE POLICY "Anyone can create likes" 
ON public.user_likes FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Users can delete own likes" ON public.user_likes;
CREATE POLICY "Users can delete own likes" 
ON public.user_likes FOR DELETE 
USING (true);
    `.trim()

    // Guardar SQL en archivo
    const fs = require('fs').promises
    await fs.writeFile('./setup-likes-complete.sql', setupSQL)

    return NextResponse.json({
      status: 'setup_required',
      message: 'Likes table needs to be created',
      sql_file: 'setup-likes-complete.sql',
      instructions: {
        1: 'Go to Supabase SQL Editor',
        2: 'Execute the SQL from setup-likes-complete.sql',
        3: 'The likes system will be fully functional'
      },
      project_url: `https://app.supabase.com/project/${process.env.NEXT_PUBLIC_SUPABASE_URL?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1]}/sql`
    })

  } catch (error: any) {
    console.error('Setup error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check system status
    const status = {
      user_likes_table: false,
      countries_likes_columns: false,
      blog_posts_likes_column: false,
      total_likes_count: 0
    }

    // Check user_likes table
    const { data: likesData, error: likesError } = await supabaseAdmin
      .from('user_likes')
      .select('id', { count: 'exact', head: true })

    if (!likesError) {
      status.user_likes_table = true
      status.total_likes_count = likesData || 0
    }

    // Check countries columns
    const { data: countryData } = await supabaseAdmin
      .from('countries')
      .select('likes_dashboard, likes_explorer, likes_total')
      .limit(1)
      .single()

    if (countryData && 'likes_dashboard' in countryData) {
      status.countries_likes_columns = true
    }

    // Check blog_posts column
    const { data: blogData } = await supabaseAdmin
      .from('blog_posts')
      .select('likes')
      .limit(1)
      .single()

    if (blogData && 'likes' in blogData) {
      status.blog_posts_likes_column = true
    }

    const isFullySetup = status.user_likes_table && 
                         status.countries_likes_columns && 
                         status.blog_posts_likes_column

    return NextResponse.json({
      setup_complete: isFullySetup,
      status,
      message: isFullySetup 
        ? 'Likes system is fully operational' 
        : 'Likes system needs setup'
    })

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}