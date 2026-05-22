const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const prices = [
    { name: 'Монтаж кабелю в гофрі (цегла)', unit: 'м.п.', price: 55, category: 'Монтаж' },
    { name: 'Монтаж кабелю в гофрі (бетон)', unit: 'м.п.', price: 75, category: 'Монтаж' },
    { name: 'Встановлення підрозетника (цегла)', unit: 'шт.', price: 130, category: 'Монтаж' },
    { name: 'Встановлення підрозетника (бетон)', unit: 'шт.', price: 180, category: 'Монтаж' },
    { name: 'Збірка силового щита (1 модуль)', unit: 'модуль', price: 280, category: 'Щити' },
    { name: 'Встановлення ПЗВ / Диф.автомата', unit: 'шт.', price: 350, category: 'Щити' },
    { name: 'Монтаж LED профілю з підключенням', unit: 'м.п.', price: 250, category: 'Освітлення' },
    { name: 'Встановлення та підключення люстри', unit: 'шт.', price: 500, category: 'Освітлення' },
    { name: 'Монтаж розетки / вимикача', unit: 'шт.', price: 120, category: 'Фурнітура' },
  ];

  for (const p of prices) {
    await prisma.priceItem.upsert({
      where: { id: p.name },
      update: p,
      create: p,
    });
  }

  const gallery = [
    {
      title: 'Збірка щита Schneider Electric',
      url: 'https://images.unsplash.com/photo-1558216144-fef86b75da36?q=80&w=2000',
      description: 'Комплексна автоматизація преміальної квартири 120м2.',
      category: 'Щити',
    },
    {
      title: 'Сонячна станція 10кВт',
      url: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=2000',
      description: 'Автономна система з АКБ Pylontech.',
      category: 'Solar',
    },
    {
      title: 'Освітлення фасаду',
      url: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?q=80&w=2000',
      description: 'Архітектурна підсвітка приватного будинку.',
      category: 'Освітлення',
    },
    {
      title: 'Зарядна станція для Tesla',
      url: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=2000',
      description: 'Монтаж Wallbox з динамічним балансуванням потужності.',
      category: 'EV',
    },
  ];

  for (const img of gallery) {
    await prisma.galleryImage.create({ data: img });
  }

  const blog = [
    {
      title: 'Чому не можна економити на ПЗВ?',
      slug: 'why-rcd-is-important',
      content: 'Детальний розбір того, як захисний пристрій рятує життя та техніку...',
      published: true,
      image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?q=80&w=2000',
    },
    {
      title: 'ТОП-5 помилок при плануванні електрики',
      slug: 'top-5-electrical-mistakes',
      content: 'Відсутність прохідних вимикачів, мало розеток на кухні та інші нюанси...',
      published: true,
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2000',
    },
  ];

  for (const post of blog) {
    await prisma.blogPost.create({ data: post });
  }

  console.log('Seeding finished.');
}

main().finally(() => prisma.$disconnect());
