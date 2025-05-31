import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const id = searchParams.get('id');
    
    let query = supabase
      .from('countries')
      .select('*')
      .order('name', { ascending: true });
    
    if (id) {
      query = query.eq('id', id);
    }
    
    if (search) {
      query = query.or(`name.ilike.%${search}%,name_es.ilike.%${search}%`);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching countries:', error);
      return NextResponse.json({ error: 'Error fetching countries' }, { status: 500 });
    }
    
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'Country ID is required' }, { status: 400 });
    }
    
    // Ensure JSONB fields are properly structured
    const fieldsToUpdate = {
      ...updateData,
      updated_at: new Date().toISOString()
    };
    
    // Ensure JSONB fields are objects, not null
    if (fieldsToUpdate.work_visa_info === null) fieldsToUpdate.work_visa_info = {};
    if (fieldsToUpdate.cost_of_living === null) fieldsToUpdate.cost_of_living = {};
    if (fieldsToUpdate.climate_info === null) fieldsToUpdate.climate_info = {};
    if (fieldsToUpdate.cultural_tips === null) fieldsToUpdate.cultural_tips = {};
    if (fieldsToUpdate.job_market === null) fieldsToUpdate.job_market = {};
    
    const { data, error } = await supabase
      .from('countries')
      .update(fieldsToUpdate)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating country:', error);
      return NextResponse.json({ error: 'Error updating country: ' + error.message }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('countries')
      .insert(body)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating country:', error);
      return NextResponse.json({ error: 'Error creating country' }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}