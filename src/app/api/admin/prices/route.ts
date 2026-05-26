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

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, price, unit } = await request.json();
    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const existing = await prisma.priceItem.findFirst({
      where: { name: name.trim() }
    });

    if (!existing) {
      const newItem = await prisma.priceItem.create({
        data: {
          name: name.trim(),
          unit: unit || "шт",
          price: parseFloat(price) || 0,
          category: "Додано вручну"
        }
      });
      return NextResponse.json(newItem);
    } else {
      if (existing.price !== parseFloat(price) || existing.unit !== unit) {
        const updated = await prisma.priceItem.update({
          where: { id: existing.id },
          data: { 
            price: parseFloat(price) || 0, 
            unit: unit || "шт" 
          }
        });
        return NextResponse.json(updated);
      }
      return NextResponse.json(existing);
    }
  } catch (error) {
    console.error("Error saving price:", error);
    return NextResponse.json({ error: "Error saving price" }, { status: 500 });
  }
}

