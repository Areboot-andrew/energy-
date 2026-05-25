import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET(
  req: Request,
  context: { params: Promise<{ file: string[] }> }
) {
  try {
    const params = await context.params;
    const filename = params.file.join('/');
    
    // Construct absolute path to the file in public/uploads
    const filepath = path.join(process.cwd(), 'public', 'uploads', filename);

    // Prevent directory traversal
    const normalizedPath = path.normalize(filepath);
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!normalizedPath.startsWith(uploadsDir)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    if (!fs.existsSync(filepath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Read the file buffer
    const fileBuffer = fs.readFileSync(filepath);

    // Determine content type
    let contentType = 'application/octet-stream';
    if (filename.endsWith('.webp') || filename.endsWith('.jpg') || filename.endsWith('.jpeg') || filename.endsWith('.png')) {
      contentType = 'image/' + (filename.endsWith('.webp') ? 'webp' : filename.endsWith('.png') ? 'png' : 'jpeg');
    } else if (filename.endsWith('.mp4')) {
      contentType = 'video/mp4';
    } else if (filename.endsWith('.webm')) {
      contentType = 'video/webm';
    } else if (filename.endsWith('.svg')) {
      contentType = 'image/svg+xml';
    }

    // Return the file buffer with appropriate headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return NextResponse.json({ error: 'Failed to serve file' }, { status: 500 });
  }
}
