import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const projects = await prisma.portfolioProject.findMany({
      include: { media: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const project = await prisma.portfolioProject.create({
      data: {
        slug: data.slug,
        title: data.title,
        category: data.category,
        coverImage: data.coverImage,
        shortDescription: data.shortDescription,
        content: data.content,
        totalPrice: data.totalPrice,
        media: {
          create: data.media || [],
        }
      },
      include: { media: true }
    });
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
