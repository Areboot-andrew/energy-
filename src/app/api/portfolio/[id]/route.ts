import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const project = await prisma.portfolioProject.findUnique({
      where: { id },
      include: { media: true }
    });
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await req.json();
    
    // Update basic fields
    const project = await prisma.portfolioProject.update({
      where: { id },
      data: {
        slug: data.slug,
        title: data.title,
        category: data.category,
        coverImage: data.coverImage,
        shortDescription: data.shortDescription,
        content: data.content,
        totalPrice: data.totalPrice,
      },
    });

    // Handle media updates if provided
    if (data.media) {
      // Delete existing media not in the new list
      const mediaIdsToKeep = data.media.filter((m: any) => m.id).map((m: any) => m.id);
      await prisma.projectMedia.deleteMany({
        where: {
          projectId: id,
          id: { notIn: mediaIdsToKeep }
        }
      });

      // Add new media
      const newMedia = data.media.filter((m: any) => !m.id);
      if (newMedia.length > 0) {
        await prisma.projectMedia.createMany({
          data: newMedia.map((m: any) => ({
            url: m.url,
            type: m.type,
            projectId: id
          }))
        });
      }
    }

    const updated = await prisma.portfolioProject.findUnique({
      where: { id },
      include: { media: true }
    });
    
    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.portfolioProject.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
