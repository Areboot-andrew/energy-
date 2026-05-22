import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const services = await prisma.servicePage.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const service = await prisma.servicePage.create({
      data: {
        slug: body.slug,
        title: body.title,
        description: body.description,
        icon: body.icon,
        advantages: body.advantages, // Expected to be stringified JSON from client or we stringify here. If client sends JSON string, we just pass it. Let's assume client sends string.
      }
    });
    return NextResponse.json(service);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
