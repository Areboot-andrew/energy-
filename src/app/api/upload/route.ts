import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import crypto from 'crypto';
import fs from 'fs';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Файл занадто великий (макс. 10MB)' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (isImage) {
      const filename = crypto.randomBytes(16).toString('hex') + '.webp';
      const filepath = path.join(uploadsDir, filename);

      await sharp(buffer)
        .webp({ quality: 80 })
        .toFile(filepath);

      return NextResponse.json({ url: `/api/media/${filename}`, type: 'IMAGE', originalName: file.name });
    } else if (isVideo) {
      const ext = file.name.split('.').pop() || 'mp4';
      const filename = crypto.randomBytes(16).toString('hex') + '.' + ext;
      const filepath = path.join(uploadsDir, filename);
      await writeFile(filepath, buffer);
      return NextResponse.json({ url: `/api/media/${filename}`, type: 'VIDEO', originalName: file.name });
    } else {
      // Treat everything else as generic document (PDF, DOCX, ZIP, etc)
      const ext = file.name.split('.').pop() || 'bin';
      const filename = crypto.randomBytes(16).toString('hex') + '.' + ext;
      const filepath = path.join(uploadsDir, filename);
      await writeFile(filepath, buffer);
      return NextResponse.json({ url: `/api/media/${filename}`, type: 'DOCUMENT', originalName: file.name });
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
