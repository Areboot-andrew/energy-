import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const standard = await prisma.standardItem.update({
    where: { id: params.id },
    data: body,
  });
  return NextResponse.json(standard);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await prisma.standardItem.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
