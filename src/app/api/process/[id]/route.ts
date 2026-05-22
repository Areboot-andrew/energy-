import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { title, description, icon, order } = body;
    
    const step = await prisma.workStep.update({
      where: { id },
      data: {
        title,
        description,
        icon,
        order: Number(order) || 0,
      },
    });
    
    return NextResponse.json(step);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update work step" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.workStep.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete work step" }, { status: 500 });
  }
}
