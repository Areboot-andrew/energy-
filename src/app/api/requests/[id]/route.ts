import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;
    
    const updatedRequest = await prisma.clientRequest.update({
      where: { id },
      data: { status },
    });
    
    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error('Error updating request status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch the request first to see if it has an attached file
    const requestToDelete = await prisma.clientRequest.findUnique({
      where: { id }
    });

    if (requestToDelete && requestToDelete.attachedFile) {
      let filename = requestToDelete.attachedFile;
      if (filename.startsWith('/api/media/')) {
        filename = filename.replace('/api/media/', '');
      } else if (filename.startsWith('/uploads/')) {
        filename = filename.replace('/uploads/', '');
      } else {
        // If it's a full URL or something else, try to get the last part
        try {
          const urlObj = new URL(filename);
          filename = path.basename(urlObj.pathname);
        } catch (e) {
          // not a valid URL, treat as filename/path
          filename = path.basename(filename);
        }
      }

      if (filename) {
        const filepath = path.join(process.cwd(), 'public', 'uploads', filename);
        if (fs.existsSync(filepath)) {
          try {
            fs.unlinkSync(filepath);
          } catch (err) {
            console.error("Failed to delete request file:", filepath, err);
          }
        }
      }
    }

    await prisma.clientRequest.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

