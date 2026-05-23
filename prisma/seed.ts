import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import initialData from './initial-data.json';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 0. ADMIN USER
  const adminEmail = 'admin@voltpremium.ua';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
      }
    });
    console.log('Admin user created (admin@voltpremium.ua / admin123)');
  }

  // 1. SERVICES
  if (initialData && initialData.ServicePage) {
    for (const s of initialData.ServicePage) {
      const { createdAt, updatedAt, ...data } = s;
      await prisma.servicePage.upsert({
        where: { slug: data.slug },
        update: data,
        create: data,
      });
    }
  }

  // 2. FAQs
  if (initialData && initialData.FAQ) {
    for (const f of initialData.FAQ) {
      const { createdAt, updatedAt, id, ...data } = f;
      // Because FAQ has no unique field besides ID, we will just delete all and recreate or find by ID
      const exists = await prisma.fAQ.findUnique({ where: { id } });
      if (exists) {
        await prisma.fAQ.update({ where: { id }, data });
      } else {
        await prisma.fAQ.create({ data: { ...data, id } });
      }
    }
  }

  // 3. WORK STEPS
  const steps = [
    { title: 'Виїзд та консультація', description: 'Інженер виїжджає на об\'єкт, оцінює масштаб робіт, знімає заміри та обговорює всі ваші побажання.', icon: 'engineering', order: 1 },
    { title: 'Проєктування', description: 'Створюємо детальний проєкт електропостачання, схему щита та специфікацію матеріалів. Ви отримуєте точний кошторис.', icon: 'architecture', order: 2 },
    { title: 'Чорновий монтаж', description: 'Прокладання кабельних трас, буріння підрозетників, монтаж ввідного щита. Працюємо чисто та акуратно.', icon: 'construction', order: 3 },
    { title: 'Чистовий монтаж та здача', description: 'Встановлення розеток, вимикачів, світильників. Пусконалагоджувальні роботи та здача об\'єкта в експлуатацію.', icon: 'task_alt', order: 4 },
  ];

  const workStepCount = await prisma.workStep.count();
  if (workStepCount === 0) {
    for (const s of steps) {
      await prisma.workStep.create({ data: s });
    }
  }

  // 4. STANDARDS
  const standards = [
    { title: 'Стандарти IEC та ГОСТ', description: 'Ми суворо дотримуємось міжнародних та державних стандартів безпеки при кожному монтажі.', icon: 'gpp_good', order: 1 },
    { title: 'Професійний інструмент', description: 'Використовуємо найкращий інструмент від Hilti, Knipex та Wera для бездоганної точності та швидкості.', icon: 'handyman', order: 2 },
    { title: 'Маркування та кабель-менеджмент', description: 'Кожен кабель промаркований. В щитку ідеальний порядок, щоб будь-який електрик міг легко розібратися.', icon: 'cable', order: 3 },
    { title: 'Чистота на об\'єкті', description: 'Ми прибираємо за собою кожен день. Використовуємо промислові пилососи при штробленні.', icon: 'cleaning_services', order: 4 },
  ];

  const standardCount = await prisma.standardItem.count();
  if (standardCount === 0) {
    for (const s of standards) {
      await prisma.standardItem.create({ data: s });
    }
  }

  // 5. PRICING
  const prices = [
    { name: 'Точка світла (прокладання кабелю + підключення)', unit: 'шт', price: 650, category: 'Монтаж кабелю' },
    { name: 'Розеткова група (1 механізм)', unit: 'шт', price: 500, category: 'Монтаж розеток' },
    { name: 'Збірка та підключення електрощитка (до 24 модулів)', unit: 'шт', price: 4500, category: 'Щитове обладнання' },
    { name: 'Встановлення та підключення стабілізатора напруги', unit: 'шт', price: 2500, category: 'Обладнання' },
    { name: 'Монтаж сонячних панелей (за 1 кВт)', unit: 'кВт', price: 3000, category: 'Альтернативна енергія' },
  ];

  const priceCount = await prisma.priceItem.count();
  if (priceCount === 0) {
    for (const p of prices) {
      await prisma.priceItem.create({ data: p });
    }
  }

  // 6. PORTFOLIO PROJECTS
  const portfolioCount = await prisma.portfolioProject.count();
  if (portfolioCount === 0 && initialData && initialData.PortfolioProject) {
    for (const p of initialData.PortfolioProject) {
      const { createdAt, updatedAt, ...data } = p;
      await prisma.portfolioProject.create({ data });
    }
    console.log('Restored Portfolio Projects');
  }

  // 7. BLOG POSTS
  const blogCount = await prisma.blogPost.count();
  if (blogCount === 0 && initialData && initialData.BlogPost) {
    for (const b of initialData.BlogPost) {
      const { createdAt, updatedAt, published, ...data } = b;
      await prisma.blogPost.create({ 
        data: { ...data, published: Boolean(published) } 
      });
    }
    console.log('Restored Blog Posts');
  }

  // 8. PROJECT MEDIA
  const mediaCount = await prisma.projectMedia.count();
  if (mediaCount === 0 && initialData && initialData.ProjectMedia) {
    for (const m of initialData.ProjectMedia) {
      const { createdAt, updatedAt, ...data } = m;
      await prisma.projectMedia.create({ data });
    }
    console.log('Restored Project Media');
  }

  // 9. CLIENT REQUESTS
  const requestCount = await prisma.clientRequest.count();
  if (requestCount === 0 && initialData && initialData.ClientRequest) {
    for (const r of initialData.ClientRequest) {
      const { createdAt, ...data } = r;
      await prisma.clientRequest.create({ data });
    }
    console.log('Restored Client Requests');
  }

  // 10. PAGE CONTENT
  const pageContentCount = await prisma.pageContent.count();
  if (pageContentCount === 0 && initialData && initialData.PageContent) {
    for (const p of initialData.PageContent) {
      const { createdAt, updatedAt, ...data } = p;
      await prisma.pageContent.create({ data });
    }
    console.log('Restored Page Content');
  }

  // 11. CALCULATOR CONFIG
  const calcCount = await prisma.calculatorConfig.count();
  if (calcCount === 0 && initialData && initialData.CalculatorConfig) {
    for (const c of initialData.CalculatorConfig) {
      const { createdAt, updatedAt, ...data } = c;
      await prisma.calculatorConfig.create({ data });
    }
    console.log('Restored Calculator Config');
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
