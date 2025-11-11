import type { APIRoute } from 'astro';
import { supabaseServer } from '../../../lib/supabase-server';
import { logger } from '../../../lib/logger';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return new Response(JSON.stringify({ 
        error: 'File too large. Maximum size is 10MB.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/webm', 'video/quicktime',
      'audio/mpeg', 'audio/wav', 'audio/ogg',
      'application/pdf', 'text/plain',
      'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      return new Response(JSON.stringify({ 
        error: 'File type not supported' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verify file content matches MIME type (magic number check)
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const fileSignature = Array.from(uint8Array.slice(0, 12))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();

    // File signature validation
    const signatures: Record<string, string[]> = {
      'image/jpeg': ['FFD8FF'],
      'image/png': ['89504E47'],
      'image/gif': ['47494638'],
      'image/webp': ['52494646'], // RIFF...WEBP (simplified check)
      'application/pdf': ['255044462D'], // %PDF-
    };

    const expectedSignatures = signatures[file.type];
    if (expectedSignatures) {
      const matches = expectedSignatures.some(sig => fileSignature.startsWith(sig));
      if (!matches) {
        logger.warn(`File signature mismatch for ${file.name}: expected ${file.type}, got signature ${fileSignature}`);
        return new Response(JSON.stringify({ 
          error: 'File content does not match declared type' 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop();
    const filename = `${timestamp}-${randomString}.${extension}`;
    
    // Determine media type
    let mediaType = 'document';
    if (file.type.startsWith('image/')) mediaType = 'image';
    else if (file.type.startsWith('video/')) mediaType = 'video';
    else if (file.type.startsWith('audio/')) mediaType = 'audio';

    // Upload to Supabase Storage
    const supabase = supabaseServer(cookies);
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('media')
      .upload(`uploads/${filename}`, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      logger.error('Upload error:', uploadError);
      return new Response(JSON.stringify({ 
        error: 'Failed to upload file',
        message: uploadError.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('media')
      .getPublicUrl(`uploads/${filename}`);

    // Get image dimensions if it's an image
    let width, height;
    if (mediaType === 'image') {
      try {
        const image = new Image();
        image.src = urlData.publicUrl;
        await new Promise((resolve, reject) => {
          image.onload = resolve;
          image.onerror = reject;
        });
        width = image.naturalWidth;
        height = image.naturalHeight;
      } catch (error) {
        logger.warn('Could not get image dimensions:', error);
      }
    }

    // Save to database
    const { data: mediaData, error: dbError } = await supabase
      .from('media_library')
      .insert([{
        filename,
        original_name: file.name,
        file_path: `uploads/${filename}`,
        file_url: urlData.publicUrl,
        media_type: mediaType,
        file_size: file.size,
        mime_type: file.type,
        width,
        height,
        alt_text: '',
        caption: '',
        description: '',
        folder_path: '/',
        tags: [],
        uploaded_by: (await supabase.auth.getUser()).data.user?.id
      }])
      .select()
      .single();

    if (dbError) {
      logger.error('Database error:', dbError);
      return new Response(JSON.stringify({ 
        error: 'Failed to save file metadata',
        message: dbError.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'File uploaded successfully',
      data: mediaData
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    logger.error('Upload error:', error);
    return new Response(JSON.stringify({ 
      error: 'Upload failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};