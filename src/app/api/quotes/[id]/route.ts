import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const quote = await prisma.quote.findUnique({
      where: { id: params.id },
      include: {
        project: {
          include: { user: true }
        },
        groups: {
          orderBy: { order: 'asc' },
          include: {
            items: { orderBy: { order: 'asc' } }
          }
        }
      }
    });

    if (!quote) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Verify access
    if (session.user.role !== "ADMIN" && quote.project.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(quote);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching quote" }, { status: 500 });
  }
}
