import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId, content } = await request.json();
    const isAdmin = session.user.role === "ADMIN";

    // Verify access
    if (!isAdmin) {
      const project = await prisma.project.findFirst({
        where: { id: projectId, userId: session.user.id }
      });
      if (!project) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const message = await prisma.message.create({
      data: {
        content,
        projectId,
        senderId: session.user.id,
        isAdmin,
      },
      include: {
        sender: {
          select: { name: true }
        }
      }
    });

    return NextResponse.json(message);
  } catch (error) {
    return NextResponse.json({ error: "Error sending message" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    
    if (!projectId) return NextResponse.json({ error: "Project ID required" }, { status: 400 });

    const isAdmin = session.user.role === "ADMIN";

    // Verify access
    if (!isAdmin) {
      const project = await prisma.project.findFirst({
        where: { id: projectId, userId: session.user.id }
      });
      if (!project) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const messages = await prisma.message.findMany({
      where: { projectId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: { name: true }
        }
      }
    });

    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching messages" }, { status: 500 });
  }
}
