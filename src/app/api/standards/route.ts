import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const standards = await prisma.standardItem.findMany();
  return NextResponse.json(standards);
}

export async function POST(req: Request) {
  const body = await req.json();
  const standard = await prisma.standardItem.create({ data: body });
  return NextResponse.json(standard);
}
