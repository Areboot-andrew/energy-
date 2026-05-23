import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let content = await prisma.pageContent.findUnique({
      where: { id: 'singleton' },
    });
    
    // Auto-update legacy contacts from demo data
    if (content && (content.contactPhone === "+38 (097) 555-01-99" || content.contactEmail === "info@voltpremium.ua")) {
      content = await prisma.pageContent.update({
        where: { id: 'singleton' },
        data: {
          contactPhone: "+38 098 732 85 63",
          contactEmail: "tarasbuina2@icloud.com",
          instagram: "https://www.instagram.com/electric_lviv?igsh=OGY2NDgwaGJsbDl3",
        }
      });
    }

    return NextResponse.json(content || {
      heroTitle: "Енергія Вашого Прогресу Під Ключ",
      heroSub: "Професійні інженерні рішення для преміальної нерухомості та комерційних об'єктів. Від щитка до повного 'Розумного дому'.",
      aboutTitle: "VOLT PREMIUM: Хірургічна точність у кожному контакті",
      aboutText: "Ми не просто прокладаємо дроти. Ми створюємо нервову систему вашого будинку. Наш підхід базується на скандинавських принципах якості: мінімалізм у виконанні, максимальна функціональність та бескомпромісна безпека.",
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const content = await prisma.pageContent.upsert({
      where: { id: 'singleton' },
      update: body,
      create: { id: 'singleton', ...body },
    });
    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
