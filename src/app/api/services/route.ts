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
        advantages: body.advantages,
        category: body.category || 'Основні послуги',
        isFeatured: body.isFeatured || false,
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
        estimatedPrice: body.estimatedPrice,
        content: body.content,
        components: body.components,
        included: body.included,
        image: body.image,
      }
    });
    return NextResponse.json(service);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
