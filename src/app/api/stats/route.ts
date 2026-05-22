import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [requestCount, blogCount, galleryCount, latestRequests] = await Promise.all([
      prisma.clientRequest.count(),
      prisma.blogPost.count(),
      prisma.galleryImage.count(),
      prisma.clientRequest.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return NextResponse.json({
      requestCount,
      blogCount,
      galleryCount,
      latestRequests,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
