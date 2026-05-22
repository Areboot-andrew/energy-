import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.projectMedia.deleteMany();
  await prisma.portfolioProject.deleteMany();

  const projects = [
    {
      slug: "smart-home-fayna-town",
      title: "Розумний Дім Ajax у ЖК Файна Таун",
      category: "Розумний Дім",
      coverImage: "https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
      shortDescription: "Повна автоматизація 3-кімнатної квартири (110м²). Керування світлом, шторами, теплою підлогою та антипотоп.",
      totalPrice: "від 85 000 ₴",
      content: `
        <h2>Опис проєкту</h2>
        <p>Замовник звернувся з потребою зробити квартиру максимально комфортною та безпечною, не порушуючи мінімалістичний дизайн інтер'єру. Було обрано бездротову систему <strong>Ajax Systems</strong> як оптимальне рішення для готового ремонту.</p>
        
        <h3>Етапи виконання робіт:</h3>
        <ul>
          <li><strong>Проєктування:</strong> Створення плану розміщення датчиків та реле.</li>
          <li><strong>Монтаж системи безпеки:</strong> Встановлення Hub 2 Plus, датчиків руху MotionCam, датчиків відкриття DoorProtect.</li>
          <li><strong>Антипотоп:</strong> Інтеграція кранів з електроприводом Bonomi та 4 датчиків LeaksProtect у вологих зонах.</li>
          <li><strong>Автоматизація освітлення:</strong> Встановлення 12 смарт-реле Ajax WallSwitch для керування LED-стрічками та основними групами світла зі смартфону.</li>
        </ul>
        
        <h3>Фінальний результат</h3>
        <p>Клієнт отримав єдиний додаток для керування безпекою та комфортом. Налаштовано сценарії: <em>"Я пішов"</em> (вимикає все світло, перекриває воду, ставить на охорону) та <em>"Нічний режим"</em>.</p>
      `,
      media: [
        { url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", type: "IMAGE" },
        { url: "https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", type: "IMAGE" },
        { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", type: "VIDEO" }
      ]
    },
    {
      slug: "solar-station-10kw",
      title: "Гібридна Сонячна Станція 10 кВт",
      category: "Сонячні Станції",
      coverImage: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
      shortDescription: "Забезпечення повної енергонезалежності приватного будинку під Києвом. Інвертор Deye 10kW + АКБ 15kWh.",
      totalPrice: "від 380 000 ₴",
      content: `
        <h2>Опис проєкту</h2>
        <p>У зв'язку з частими відключеннями світла, замовник забажав забезпечити свій будинок резервним живленням. Було прийнято рішення встановити гібридну СЕС на 10 кВт з літій-залізо-фосфатними (LiFePO4) акумуляторами.</p>
        
        <h3>Встановлене обладнання:</h3>
        <ul>
          <li><strong>Інвертор:</strong> Гібридний 3-фазний інвертор Deye 10kW-SG04LP3-EU.</li>
          <li><strong>Акумулятори:</strong> 3 модулі Pylontech US5000 (загальна ємність 14.4 кВт·год).</li>
          <li><strong>Панелі:</strong> 24 монокристалічні панелі Longi Solar 540W (встановлені на південному схилі даху).</li>
        </ul>
        
        <h3>Економіка та Автономність</h3>
        <p>При відключенні світла система миттєво (за 10 мс) перемикає весь будинок на акумулятори. Влітку генерації достатньо для повного покриття потреб будинку та зарядки АКБ.</p>
      `,
      media: [
        { url: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", type: "IMAGE" },
        { url: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", type: "IMAGE" }
      ]
    },
    {
      slug: "electrical-wiring-cottage",
      title: "Комплексний електромонтаж котеджу",
      category: "Електромонтаж",
      coverImage: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
      shortDescription: "Монтаж 'під ключ' у будинку 250м². Розподільчий щит Hager на 144 модулі, кабель ВВГнг-LS.",
      totalPrice: "від 150 000 ₴",
      content: `
        <h2>Деталі об'єкта</h2>
        <p>Новий котедж площею 250 м². Завдання: розробити та реалізувати надійну систему електропостачання з урахуванням майбутнього підключення генератора та стабілізаторів напруги.</p>
        
        <h3>Етапи:</h3>
        <ol>
          <li>Прокладання 1500 метрів мідного кабелю ВВГнг-LS від заводу Одескабель.</li>
          <li>Облаштування контуру заземлення (опір 3.2 Ом).</li>
          <li>Штроблення та встановлення 120 підрозетників.</li>
          <li>Збірка та підключення головного розподільчого щита (ГРЩ) на базі автоматики Hager.</li>
        </ol>
        
        <h3>Особливості щита</h3>
        <p>Щит містить реле напруги Zubr на кожну фазу, ПЗВ типу А для захисту від витоку струму, а також перекидний рубильник I-0-II для ручного перемикання на генератор.</p>
      `,
      media: [
        { url: "https://images.unsplash.com/photo-1555963966-b7ae5404b6ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", type: "IMAGE" }
      ]
    }
  ];

  for (const p of projects) {
    const { media, ...projectData } = p;
    await prisma.portfolioProject.create({
      data: {
        ...projectData,
        media: {
          create: media
        }
      }
    });
  }

  console.log('Portfolio successfully seeded with rich text projects!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
