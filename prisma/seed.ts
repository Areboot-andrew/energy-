import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

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
  const services = [
    {
      slug: 'elektromontazh',
      title: 'Монтаж щитків та кабелів',
      description: 'Професійна розводка та збірка силових щитів згідно стандартів IEC. Ідеальний кабель-менеджмент.',
      icon: 'settings_input_component',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000',
      advantages: '["Акуратне укладання кабелів","Маркування кожної лінії","Використання негорючих матеріалів","Відповідність ГОСТ та IEC"]'
    },
    {
      slug: 'sonyachni-stantsiyi',
      title: 'Сонячні станції та інвертори',
      description: 'Енергонезалежність вашого дому. Монтаж панелей, АКБ та налаштування інверторів для безперебійного живлення.',
      icon: 'solar_power',
      image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1000',
      advantages: '["Автономність до 48 годин","Економія на тарифах","Екологічна енергія","Захист від блекаутів"]'
    },
    {
      slug: 'zaryadni-stantsiyi',
      title: 'Зарядки для EV',
      description: 'Встановлення швидких зарядних станцій для Tesla, Audi e-tron та інших електрокарів.',
      icon: 'ev_station',
      image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=1000',
      advantages: '["Потужність до 22кВт","Динамічне балансування","Керування зі смартфона","Гарантія 3 роки"]'
    },
    {
      slug: 'rozumnyy-dim',
      title: 'Розумний Дім',
      description: 'Повна автоматизація світла, штор та клімату. Керування з вашого смартфона.',
      icon: 'home_iot_device',
      image: 'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=1000',
      advantages: '["Сценарії освітлення","Клімат-контроль","Голосове керування","Інтеграція Apple HomeKit"]'
    }
  ];

  for (const s of services) {
    await prisma.servicePage.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }

  // 2. FAQs
  const faqs = [
    { question: 'Скільки часу займає монтаж електрики у квартирі?', answer: 'Зазвичай чорновий електромонтаж у 2-кімнатній квартирі займає 7-10 робочих днів. Збірка та підключення щита – ще 1-2 дні.', order: 1 },
    { question: 'Які комплектуючі ви використовуєте?', answer: 'Ми працюємо виключно з перевіреними європейськими брендами: автоматика Hager, Schneider Electric, ABB. Кабельна продукція – Запорізький завод кольорових металів (ЗЗКМ) або Одескабель.', order: 2 },
    { question: 'Чи надаєте ви гарантію на роботи?', answer: 'Так, ми надаємо офіційну гарантію 5 років на всі електромонтажні роботи та 2 роки на встановлену автоматику.', order: 3 },
    { question: 'Що таке "Розумний дім" і чи потрібен він мені?', answer: 'Розумний дім дозволяє автоматизувати рутину: вимикати все світло однією кнопкою біля виходу, керувати кліматом та шторами зі смартфона. Ми можемо зробити як базову автоматизацію, так і повний комплекс.', order: 4 },
  ];
  
  const faqCount = await prisma.fAQ.count();
  if (faqCount === 0) {
    for (const f of faqs) {
      await prisma.fAQ.create({ data: f });
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
