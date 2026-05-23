import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const services = await prisma.servicePage.findMany();
    let updatedCount = 0;

    for (const s of services) {
      const updateData: any = {};
      
      if (!s.content || s.content.trim() === "") {
        updateData.content = `<h2>Детальний опис послуги: ${s.title}</h2><p>Ми надаємо професійні послуги з використанням сучасних технологій та преміум-матеріалів. Кожен етап робіт строго контролюється нашими інженерами.</p><h3>Як ми працюємо:</h3><ul><li>Виїзд інженера та заміри</li><li>Складання детального кошторису</li><li>Виконання робіт згідно з графіком</li><li>Здача об'єкту та гарантія</li></ul>`;
      }
      
      if (!s.components || s.components.trim() === "null") {
        updateData.components = JSON.stringify([
          { name: "Преміум матеріали", desc: "Використовуємо тільки сертифіковані комплектуючі" },
          { name: "Професійний інструмент", desc: "Робота без пилу та шуму" }
        ]);
      }
      
      if (!s.included || s.included.trim() === "null") {
        updateData.included = JSON.stringify([
          "Консультація спеціаліста",
          "Закупівля та доставка матеріалів",
          "Виконання монтажних робіт",
          "Прибирання після ремонту"
        ]);
      }
      
      if (!s.estimatedPrice) {
        updateData.estimatedPrice = "від 10 000 ₴";
      }

      if (!s.metaTitle) {
        updateData.metaTitle = `${s.title} | VOLT PREMIUM`;
      }

      if (!s.metaDescription) {
        updateData.metaDescription = `Професійні послуги: ${s.title}. Гарантія якості, преміум матеріали та сучасні інженерні рішення від команди VOLT PREMIUM.`;
      }

      if (!s.image) {
        updateData.image = "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
      }

      if (Object.keys(updateData).length > 0) {
        await prisma.servicePage.update({
          where: { id: s.id },
          data: updateData
        });
        updatedCount++;
      }
    }

    return NextResponse.json({ success: true, message: `Updated ${updatedCount} services with missing demo data.` });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error', details: error }, { status: 500 });
  }
}
