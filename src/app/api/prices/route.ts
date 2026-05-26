import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const publicOnly = searchParams.get('publicOnly') === 'true';

    const where = publicOnly ? { isPublic: true } : {};
    
    const prices = await prisma.priceItem.findMany({ where });
    return NextResponse.json(prices);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, unit, price, category } = body;
    const newPrice = await prisma.priceItem.create({
      data: { name, unit, price: parseFloat(price), category },
    });
    return NextResponse.json(newPrice, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
