import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, totalAmount, groups } = await request.json();

    const quote = await prisma.quote.create({
      data: {
        title,
        projectId: params.id,
        totalAmount: parseFloat(totalAmount) || 0,
        status: "SENT",
        groups: {
          create: groups.map((g: any, gIndex: number) => ({
            title: g.title,
            order: gIndex,
            items: {
              create: g.items.map((i: any, iIndex: number) => ({
                name: i.name,
                description: i.description || null,
                quantity: parseFloat(i.quantity) || 0,
                unit: i.unit,
                price: parseFloat(i.price) || 0,
                total: parseFloat(i.total) || 0,
                photoUrl: i.photoUrl || null,
                order: iIndex
              }))
            }
          }))
        }
      }
    });

    // Save items to PriceItem memory for autocomplete
    for (const g of groups) {
      for (const i of g.items) {
        if (i.name && i.name.trim() !== "") {
          const existing = await prisma.priceItem.findFirst({
            where: { name: i.name }
          });
          if (!existing) {
            await prisma.priceItem.create({
              data: {
                name: i.name,
                unit: i.unit || "шт",
                price: parseFloat(i.price) || 0,
                category: g.title,
                isPublic: false
              }
            });
          } else {
            // Update price if it changed
            if (existing.price !== parseFloat(i.price)) {
              await prisma.priceItem.update({
                where: { id: existing.id },
                data: { price: parseFloat(i.price) || 0, unit: i.unit || "шт" }
              });
            }
          }
        }
      }
    }

    return NextResponse.json(quote);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error creating quote" }, { status: 500 });
  }
}
