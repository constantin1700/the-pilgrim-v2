import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServiceClient, getCurrentUser, isUserAdmin } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const user = await getCurrentUser();
    if (!user?.email || !(await isUserAdmin(user.email))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const supabase = createSupabaseServiceClient();
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const countryId = formData.get('countryId') as string;
    const fieldType = formData.get('fieldType') as string || 'flag'; // flag, image, etc.
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    if (!countryId) {
      return NextResponse.json({ error: 'Country ID is required' }, { status: 400 });
    }
    
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${countryId}-${fieldType}-${Date.now()}.${fileExt}`;
    const filePath = `countries/${fileName}`;
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: true
      });
    
    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);
    
    // Update country with new image URL
    const updateField = fieldType === 'flag' ? 'flag_url' : 'featured_image';
    const { error: updateError } = await supabase
      .from('countries')
      .update({ [updateField]: publicUrl })
      .eq('id', countryId);
    
    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json({ error: 'Failed to update country' }, { status: 500 });
    }
    
    return NextResponse.json({ 
      url: publicUrl,
      success: true 
    });
    
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}