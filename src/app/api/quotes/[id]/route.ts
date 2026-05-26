import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const quote = await prisma.quote.findUnique({
      where: { id: params.id },
      include: {
        project: {
          include: {
            user: true
          }
        },
        groups: {
          orderBy: { order: 'asc' },
          include: {
            items: {
              orderBy: { order: 'asc' }
            }
          }
        },
        history: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    // Security check: only admin or the project owner can view
    const isAdmin = session.user.role === "ADMIN";
    const isOwner = quote.project.userId === session.user.id;
    
    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(quote);
  } catch (error) {
    console.error("Error fetching quote:", error);
    return NextResponse.json({ error: "Error fetching quote" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status, actionDetails } = await request.json();
    const isAdmin = session.user.role === "ADMIN";

    // Client can only APPROVE or REJECT
    if (!isAdmin && status && !["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Clients can only approve or reject" }, { status: 403 });
    }

    const quote = await prisma.quote.update({
      where: { id: params.id },
      data: { status }
    });

    // Record history
    await prisma.quoteHistory.create({
      data: {
        quoteId: params.id,
        action: "STATUS_CHANGED",
        details: actionDetails || `Статус змінено на: ${status}`,
        userId: session.user.id
      }
    });

    return NextResponse.json(quote);
  } catch (error) {
    console.error("Quote PATCH error:", error);
    return NextResponse.json({ error: "Error updating quote" }, { status: 500 });
  }
}
