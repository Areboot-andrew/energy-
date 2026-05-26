import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import fs from "fs";
import path from "path";

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
    return NextResponse.json({ error: "Error updating quote status" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, totalAmount, groups, editDetails } = await request.json();

    // Since Prisma nested updates can be complex (deleting old items and creating new ones),
    // we'll do a simple approach: Delete all existing groups and re-create them.
    await prisma.quoteGroup.deleteMany({
      where: { quoteId: params.id }
    });

    const quote = await prisma.quote.update({
      where: { id: params.id },
      data: {
        title,
        totalAmount: parseFloat(totalAmount) || 0,
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
                category: g.title
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

    // Record history
    await prisma.quoteHistory.create({
      data: {
        quoteId: params.id,
        action: "EDITED",
        details: editDetails || "Кошторис було відредаговано",
        userId: session.user.id
      }
    });

    return NextResponse.json(quote);
  } catch (error) {
    console.error("Quote PUT error:", error);
    return NextResponse.json({ error: "Error updating quote" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const quoteToDelete = await prisma.quote.findUnique({
      where: { id: params.id },
      include: {
        groups: {
          include: { items: true }
        }
      }
    });

    if (quoteToDelete) {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      for (const group of quoteToDelete.groups) {
        for (const item of group.items) {
          if (item.photoUrl && item.photoUrl.startsWith('/api/media/')) {
            const filename = item.photoUrl.replace('/api/media/', '');
            const filepath = path.join(uploadsDir, filename);
            if (fs.existsSync(filepath)) {
              try {
                fs.unlinkSync(filepath);
              } catch (err) {
                console.error("Failed to delete photo:", filepath, err);
              }
            }
          }
        }
      }
    }

    await prisma.quote.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Quote DELETE error:", error);
    return NextResponse.json({ error: "Error deleting quote" }, { status: 500 });
  }
}

