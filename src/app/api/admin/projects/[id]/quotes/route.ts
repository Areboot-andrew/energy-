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
        totalAmount,
        status: "SENT",
        groups: {
          create: groups.map((g: any, gIndex: number) => ({
            title: g.title,
            order: gIndex,
            items: {
              create: g.items.map((i: any, iIndex: number) => ({
                name: i.name,
                description: i.description || null,
                quantity: i.quantity,
                unit: i.unit,
                price: i.price,
                total: i.total,
                photoUrl: i.photoUrl || null,
                order: iIndex
              }))
            }
          }))
        }
      }
    });

    return NextResponse.json(quote);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error creating quote" }, { status: 500 });
  }
}
