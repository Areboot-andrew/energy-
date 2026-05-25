import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import crypto from 'crypto';
import fs from 'fs';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

      if (file.type.startsWith('video/')) {
      const ext = file.name.split('.').pop() || 'mp4';
      const filename = crypto.randomBytes(16).toString('hex') + '.' + ext;
      const filepath = path.join(uploadsDir, filename);
      await writeFile(filepath, buffer);
      return NextResponse.json({ url: `/api/media/${filename}`, type: 'VIDEO' });
    } else {
      const filename = crypto.randomBytes(16).toString('hex') + '.webp';
      const filepath = path.join(uploadsDir, filename);

      await sharp(buffer)
        .webp({ quality: 80 })
        .toFile(filepath);

      return NextResponse.json({ url: `/api/media/${filename}`, type: 'IMAGE' });
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
