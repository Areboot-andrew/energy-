import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json();
  const step = await prisma.workStep.update({
    where: { id: params.id },
    data: {
      title: data.title,
      description: data.description,
      icon: data.icon,
      order: data.order,
    },
  });
  return NextResponse.json(step);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await prisma.workStep.delete({
    where: { id: params.id },
  });
  return NextResponse.json({ success: true });
}
