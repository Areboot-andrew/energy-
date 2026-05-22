import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const config = await prisma.calculatorConfig.findUnique({
      where: { id: 'singleton' },
    });
    return NextResponse.json(config || { basePerRoom: 7500 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { basePerRoom } = body;
    const config = await prisma.calculatorConfig.upsert({
      where: { id: 'singleton' },
      update: { basePerRoom: parseFloat(basePerRoom) },
      create: { id: 'singleton', basePerRoom: parseFloat(basePerRoom) },
    });
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
