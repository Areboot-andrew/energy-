import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// In-memory rate limiting map
const rateLimitMap = new Map<string, number>();

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const lastRequestTime = rateLimitMap.get(ip);
    
    // 5 minutes limit
    if (lastRequestTime && now - lastRequestTime < 300000) {
      return NextResponse.json({ error: 'Ви надсилаєте заявки занадто часто. Зачекайте 5 хвилин.' }, { status: 429 });
    }
    
    // Simple memory cleanup
    if (rateLimitMap.size > 1000) {
      rateLimitMap.clear();
    }
    rateLimitMap.set(ip, now);

    const body = await request.json();
    const { name, phone, serviceType, comment, totalPrice, attachedFile } = body;

    const newRequest = await prisma.clientRequest.create({
      data: {
        name,
        phone,
        serviceType,
        comment,
        attachedFile,
        totalPrice: totalPrice ? parseFloat(totalPrice) : null,
      },
    });

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    console.error('Error creating request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const requests = await prisma.clientRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
