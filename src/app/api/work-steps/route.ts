import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const steps = await prisma.workStep.findMany({
    orderBy: { order: 'asc' },
  });
  return NextResponse.json(steps);
}

export async function POST(req: Request) {
  const data = await req.json();
  const step = await prisma.workStep.create({
    data: {
      title: data.title,
      description: data.description,
      icon: data.icon,
      order: data.order,
    },
  });
  return NextResponse.json(step);
}
