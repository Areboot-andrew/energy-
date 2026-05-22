import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const articles = [
    {
      slug: 'elektromontazh',
      estimatedPrice: 'від 20 600 ₴',
      content: `
        <div class="space-y-8">
          <div>
            <h2 class="text-3xl font-bold text-white mb-4">Комплексний електромонтаж "Під Ключ"</h2>
            <p class="text-gray-300 text-lg leading-relaxed mb-4">Надійна електропроводка — це кровоносна система вашого будинку. Ми виконуємо професійний монтаж згідно з нормами ПУЕ та ДБН, використовуючи сучасні технології, що гарантують безпеку та довговічність понад 50 років.</p>
          </div>
          
          <div class="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20">
            <h3 class="text-2xl font-bold text-primary-fixed mb-4">Орієнтовні розцінки (2024-2025)</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="border-b border-outline-variant/30 text-secondary-fixed-dim">
                    <th class="py-3 px-4">Вид робіт</th>
                    <th class="py-3 px-4">Одиниця</th>
                    <th class="py-3 px-4">Ціна (UAH)</th>
                  </tr>
                </thead>
                <tbody class="text-gray-300">
                  <tr class="border-b border-outline-variant/10 hover:bg-surface-container">
                    <td class="py-3 px-4">Монтаж підрозетника / розетки</td>
                    <td class="py-3 px-4">шт.</td>
                    <td class="py-3 px-4">від 100 ₴</td>
                  </tr>
                  <tr class="border-b border-outline-variant/10 hover:bg-surface-container">
                    <td class="py-3 px-4">Прокладання кабелю (ВВГнг-LS)</td>
                    <td class="py-3 px-4">м.п.</td>
                    <td class="py-3 px-4">від 40 ₴</td>
                  </tr>
                  <tr class="border-b border-outline-variant/10 hover:bg-surface-container">
                    <td class="py-3 px-4">Штроблення стін (цегла/бетон)</td>
                    <td class="py-3 px-4">м.п.</td>
                    <td class="py-3 px-4">від 60 ₴</td>
                  </tr>
                  <tr class="border-b border-outline-variant/10 hover:bg-surface-container">
                    <td class="py-3 px-4">Монтаж та збірка електрощита</td>
                    <td class="py-3 px-4">шт.</td>
                    <td class="py-3 px-4">від 1 500 ₴</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p class="text-sm text-secondary-fixed-dim mt-4">* Мінімальний розрахунок для 1-кімн. квартири стартує від 20 600 ₴ (без урахування матеріалів).</p>
          </div>

          <div>
            <h3 class="text-2xl font-bold text-white mb-4">Виробники та матеріали</h3>
            <p class="text-gray-300 mb-4">Ми працюємо виключно з перевіреними європейськими та українськими виробниками:</p>
            <ul class="list-disc list-inside text-gray-300 space-y-2">
              <li><strong class="text-white">Автоматика та Щити:</strong> Hager (Німеччина), Schneider Electric, ABB.</li>
              <li><strong class="text-white">Кабельна продукція:</strong> Одескабель, ЗЗЦМ (тільки мідний кабель ВВГнг-LS ГОСТ).</li>
              <li><strong class="text-white">Фурнітура:</strong> Legrand, Gira, Jung.</li>
            </ul>
          </div>
        </div>
      `
    },
    {
      slug: 'sonyachni-stantsiyi',
      estimatedPrice: 'від 200 000 ₴',
      content: `
        <div class="space-y-8">
          <div>
            <h2 class="text-3xl font-bold text-white mb-4">Гібридні Сонячні Електростанції</h2>
            <p class="text-gray-300 text-lg leading-relaxed mb-4">В умовах відключень світла власна сонячна станція (СЕС) з акумуляторами — це гарантія повної енергонезалежності. Ваша техніка (холодильники, котли, інтернет) працюватиме безперебійно.</p>
          </div>
          
          <div class="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20">
            <h3 class="text-2xl font-bold text-primary-fixed mb-4">Мінімальні розрахунки систем (Під ключ)</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-surface-container p-5 rounded-xl border border-outline-variant/10">
                <h4 class="text-xl font-bold text-white mb-2">Станція 5 кВт</h4>
                <p class="text-primary-fixed text-2xl font-bold mb-3">~ 200 000 ₴</p>
                <ul class="text-sm text-gray-400 space-y-2">
                  <li>✔ Інвертор Deye 5kW</li>
                  <li>✔ АКБ Pylontech 5.12 kWh</li>
                  <li>✔ Панелі 5 кВт</li>
                  <li>✔ Монтаж та пусконалагодження</li>
                </ul>
              </div>
              <div class="bg-surface-container p-5 rounded-xl border border-outline-variant/10">
                <h4 class="text-xl font-bold text-white mb-2">Станція 10-12 кВт</h4>
                <p class="text-primary-fixed text-2xl font-bold mb-3">~ 400 000 ₴</p>
                <ul class="text-sm text-gray-400 space-y-2">
                  <li>✔ 3-фазний інвертор Deye 12kW</li>
                  <li>✔ АКБ Pylontech 10-15 kWh</li>
                  <li>✔ Панелі 10 кВт</li>
                  <li>✔ Монтаж на даху</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-2xl font-bold text-white mb-4">Використовуване обладнання</h3>
            <p class="text-gray-300 mb-4">Ми є партнерами провідних світових брендів у сфері зеленої енергетики:</p>
            <ul class="list-disc list-inside text-gray-300 space-y-2">
              <li><strong class="text-white">Інвертори:</strong> Deye, Victron Energy, Huawei.</li>
              <li><strong class="text-white">Акумулятори (LiFePO4):</strong> Pylontech, Dyness. (Безпечні, ресурс понад 6000 циклів).</li>
              <li><strong class="text-white">Сонячні панелі:</strong> Tier-1 виробники (Longi Solar, JA Solar, Trina).</li>
            </ul>
          </div>
        </div>
      `
    },
    {
      slug: 'rozumnyy-dim',
      estimatedPrice: 'від 15 000 ₴',
      content: `
        <div class="space-y-8">
          <div>
            <h2 class="text-3xl font-bold text-white mb-4">Системи "Розумний Дім"</h2>
            <p class="text-gray-300 text-lg leading-relaxed mb-4">Автоматизація освітлення, клімат-контролю, безпеки та мультимедіа. Ми проектуємо системи, що роблять ваше життя комфортнішим, а дім — безпечнішим.</p>
          </div>
          
          <div class="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20">
            <h3 class="text-2xl font-bold text-primary-fixed mb-4">Варіанти реалізації та ціни</h3>
            <div class="space-y-6">
              <div class="border-l-4 border-primary-fixed pl-4">
                <h4 class="text-xl font-bold text-white mb-1">Базова автоматизація (Ajax Systems)</h4>
                <p class="text-gray-300 mb-2">Бездротове рішення. Ідеально для готових ремонтів. Управління кранами води, розетками, світлом та охорона.</p>
                <p class="text-primary-fixed font-bold">Бюджет: від 15 000 ₴</p>
              </div>
              <div class="border-l-4 border-primary-fixed pl-4">
                <h4 class="text-xl font-bold text-white mb-1">Професійні дротові системи (KNX, Loxone)</h4>
                <p class="text-gray-300 mb-2">Міжнародний стандарт автоматизації преміум-класу. Встановлюється на етапі чорнового ремонту. Інтеграція ВСЬОГО.</p>
                <p class="text-primary-fixed font-bold">Бюджет: від 150 000 ₴ (залежить від об'єкта)</p>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-2xl font-bold text-white mb-4">Основні виробники</h3>
            <ul class="list-none space-y-3 text-gray-300">
              <li class="flex items-center gap-3"><span class="material-symbols-outlined text-primary-fixed">verified</span> <strong>Loxone (Австрія):</strong> Мінісервер, що замінює десятки окремих контролерів.</li>
              <li class="flex items-center gap-3"><span class="material-symbols-outlined text-primary-fixed">verified</span> <strong>KNX:</strong> Відкритий протокол, підтримується сотнями брендів (Gira, Jung, ABB).</li>
              <li class="flex items-center gap-3"><span class="material-symbols-outlined text-primary-fixed">verified</span> <strong>Ajax (Україна):</strong> Найкраща в Європі бездротова система безпеки з елементами Smart Home.</li>
            </ul>
          </div>
        </div>
      `
    },
    {
      slug: 'zaryadni-stantsiyi',
      estimatedPrice: 'від 18 000 ₴',
      content: `
        <div class="space-y-8">
          <div>
            <h2 class="text-3xl font-bold text-white mb-4">Зарядні Станції для Електромобілів (EV)</h2>
            <p class="text-gray-300 text-lg leading-relaxed mb-4">Заряджайте свій автомобіль безпечно та швидко у власному гаражі або на паркінгу за нічним тарифом.</p>
          </div>
          
          <div class="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20">
            <h3 class="text-2xl font-bold text-primary-fixed mb-4">Орієнтовна вартість встановлення</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="border-b border-outline-variant/30 text-secondary-fixed-dim">
                    <th class="py-3 px-4">Послуга / Обладнання</th>
                    <th class="py-3 px-4">Ціна (UAH)</th>
                  </tr>
                </thead>
                <tbody class="text-gray-300">
                  <tr class="border-b border-outline-variant/10 hover:bg-surface-container">
                    <td class="py-3 px-4">Розумна зарядна станція (Wallbox 7-22 кВт)</td>
                    <td class="py-3 px-4">від 15 000 ₴</td>
                  </tr>
                  <tr class="border-b border-outline-variant/10 hover:bg-surface-container">
                    <td class="py-3 px-4">Монтаж станції та захисної автоматики</td>
                    <td class="py-3 px-4">від 3 000 ₴</td>
                  </tr>
                  <tr class="border-b border-outline-variant/10 hover:bg-surface-container">
                    <td class="py-3 px-4">Прокладання силового кабелю</td>
                    <td class="py-3 px-4">від 40 ₴ / метр</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 class="text-2xl font-bold text-white mb-4">Важливі нюанси</h3>
            <p class="text-gray-300 mb-2">Для підключення зарядної станції необхідно встановити <strong>ПЗВ типу B (або A-EV)</strong> для захисту від витоку постійного струму.</p>
            <p class="text-gray-300">Ми пропонуємо станції з функцією <strong>динамічного балансування потужності</strong> (Dynamic Load Balancing), яка не дозволить вибити ввідний автомат у вашому будинку під час заряджання авто.</p>
          </div>
        </div>
      `
    }
  ];

  for (const a of articles) {
    await prisma.servicePage.update({
      where: { slug: a.slug },
      data: {
        content: a.content,
        estimatedPrice: a.estimatedPrice
      }
    }).catch(e => console.log('Error updating', a.slug, e.message));
  }
  console.log('Structured articles updated in UAH!');
}

main().finally(() => prisma.$disconnect());
