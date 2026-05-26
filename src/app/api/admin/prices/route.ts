import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prices = await prisma.priceItem.findMany({
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(prices);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching prices" }, { status: 500 });
  }
}
