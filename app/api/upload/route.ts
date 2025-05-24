import { NextRequest, NextResponse } from 'next/server'
import { supabase, getServiceSupabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const bucket = formData.get('bucket') as string || 'images'
    const folder = formData.get('folder') as string || ''

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
    const filePath = folder ? `${folder}/${fileName}` : fileName

    // Upload to Supabase Storage
    const serviceSupabase = getServiceSupabase()
    const { data, error } = await serviceSupabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      return NextResponse.json(
        { error: 'Error uploading file' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: { publicUrl } } = serviceSupabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    return NextResponse.json({ 
      url: publicUrl,
      path: filePath,
      success: true 
    })
  } catch (error) {
    console.error('Error in upload API:', error)
    return NextResponse.json(
      { error: 'Error processing upload' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check admin authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { path, bucket = 'images' } = await request.json()

    if (!path) {
      return NextResponse.json(
        { error: 'No path provided' },
        { status: 400 }
      )
    }

    const serviceSupabase = getServiceSupabase()
    const { error } = await serviceSupabase.storage
      .from(bucket)
      .remove([path])

    if (error) {
      console.error('Delete error:', error)
      return NextResponse.json(
        { error: 'Error deleting file' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in delete API:', error)
    return NextResponse.json(
      { error: 'Error processing delete' },
      { status: 500 }
    )
  }
}