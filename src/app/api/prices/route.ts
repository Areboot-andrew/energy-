import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const prices = await prisma.priceItem.findMany();
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
