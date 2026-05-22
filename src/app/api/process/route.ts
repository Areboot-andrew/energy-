import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const steps = await prisma.workStep.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(steps);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch work steps" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, icon, order } = body;
    
    const step = await prisma.workStep.create({
      data: {
        title,
        description,
        icon,
        order: Number(order) || 0,
      },
    });
    
    return NextResponse.json(step);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create work step" }, { status: 500 });
  }
}
