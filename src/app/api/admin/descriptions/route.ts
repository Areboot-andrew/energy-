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

    const items = await prisma.quoteItem.findMany({
      where: { 
        description: { not: null } 
      },
      select: { description: true },
      distinct: ['description'],
      orderBy: { description: 'asc' }
    });

    const descriptions = items.map(i => i.description).filter(Boolean);
    
    return NextResponse.json(descriptions);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching descriptions" }, { status: 500 });
  }
}
