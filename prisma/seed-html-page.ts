import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.pageContent.upsert({
    where: { id: "singleton" },
    update: {
      heroSub: "<p>Професійні інженерні рішення для <strong>преміальної нерухомості</strong> та комерційних об'єктів. Від базового щитка до повної системи <em>«Розумного дому»</em>.</p>",
      aboutText: "<p>Ми не просто прокладаємо дроти. Ми створюємо <strong>нервову систему</strong> вашого будинку, використовуючи лише сертифіковані європейські матеріали.</p><ul><li>Гарантія на роботи 10 років</li><li>100% відповідність нормам ПУЕ та IEC</li></ul>",
    },
    create: {
      id: "singleton",
      heroSub: "<p>Професійні інженерні рішення для <strong>преміальної нерухомості</strong> та комерційних об'єктів. Від базового щитка до повної системи <em>«Розумного дому»</em>.</p>",
      aboutText: "<p>Ми не просто прокладаємо дроти. Ми створюємо <strong>нервову систему</strong> вашого будинку, використовуючи лише сертифіковані європейські матеріали.</p><ul><li>Гарантія на роботи 10 років</li><li>100% відповідність нормам ПУЕ та IEC</li></ul>",
    }
  });

  console.log('✅ HTML Rich Text content seeded for PageContent successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
