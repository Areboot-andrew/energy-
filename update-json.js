const fs = require('fs');
const data = JSON.parse(fs.readFileSync('prisma/initial-data.json', 'utf8'));

// 1. Add FAQs
data.FAQ.push(
  { id: "faq-5", question: "Чи можна встановити розумний дім у готовій квартирі?", answer: "Так! Існують бездротові протоколи (наприклад Zigbee, Z-Wave, Apple HomeKit), які дозволяють інтегрувати розумні реле, вимикачі та датчики без прокладання нових проводів.", order: 5, createdAt: Date.now(), updatedAt: Date.now() },
  { id: "faq-6", question: "Які бренди сонячних панелей та інверторів ви ставите?", answer: "Ми працюємо з Tier-1 брендами: інвертори Deye, SunSynk, Victron Energy; панелі Jinko Solar, Risen, Trina; акумулятори Pylontech, Dyness. Це гарантує стабільну роботу на десятиліття.", order: 6, createdAt: Date.now(), updatedAt: Date.now() },
  { id: "faq-7", question: "Чи робите ви електромонтаж 'під ключ'?", answer: "Так, це наш основний напрямок! Від порожніх стін (бетону) до фінального встановлення кожної розетки, світильника і налаштування розумного дому. Ви отримуєте повністю готовий об'єкт.", order: 7, createdAt: Date.now(), updatedAt: Date.now() },
  { id: "faq-8", question: "Що входить у проєкт електропостачання?", answer: "Проєкт включає план розташування розеток і вимикачів, схему кабельних трас, однолінійну схему щита, розрахунок навантажень та повну специфікацію всіх матеріалів до останнього гвинтика.", order: 8, createdAt: Date.now(), updatedAt: Date.now() }
);

// 2. Add "Електрика під ключ" to ServicePage
data.ServicePage.push({
  id: "srv-turnkey",
  slug: "elektryka-pid-klyuch",
  title: "Електрика під ключ",
  description: "Повний цикл робіт від голого бетону до першого увімкнення світла. Безтурботний ремонт для власників.",
  icon: "key",
  advantages: JSON.stringify(["Проєкт у подарунок", "Закупівля матеріалів", "Гарантія 5 років", "Авторський нагляд"]),
  content: "<h2>Ремонт без стресу</h2><p>Послуга «Електрика під ключ» створена для тих, хто цінує свій час. Вам не потрібно бігати по магазинах і вибирати автомати. Ми беремо на себе абсолютно всі етапи:</p><ul><li><strong>Створення проєкту:</strong> розробка детального плану під ваш дизайн.</li><li><strong>Закупівля:</strong> ми самі привозимо якісний кабель та автоматику зі знижкою.</li><li><strong>Чорнові роботи:</strong> штроблення, прокладання трас, монтаж підрозетників.</li><li><strong>Збірка щита:</strong> серце вашої квартири з надійним захистом.</li><li><strong>Чистові роботи:</strong> встановлення розеток, люстр, LED-стрічок.</li></ul>",
  createdAt: Date.now(),
  updatedAt: Date.now()
});

// 3. Update existing "Сонячні станції" and "Розумний дім"
const solar = data.ServicePage.find(s => s.slug === 'sonyachni-stantsiyi');
if (solar) {
  solar.content = "<h2>Енергонезалежність преміум-класу</h2><p>Ми проєктуємо та встановлюємо гібридні та автономні сонячні електростанції. Ви забудете про відключення світла та зменшите рахунки за електроенергію.</p><h3>Наше обладнання (Tier-1):</h3><ul><li><strong>Інвертори:</strong> Deye, Victron Energy, SunSynk</li><li><strong>Панелі:</strong> Jinko Solar, Trina Solar (двосторонні N-type)</li><li><strong>Акумулятори:</strong> LiFePO4 від Pylontech та Dyness (ресурс понад 6000 циклів)</li></ul><h3>Що ви отримуєте:</h3><ol><li>Безперебійне живлення всього будинку при відключеннях.</li><li>Заробіток за 'Зеленим тарифом' або Net Billing.</li><li>Повний моніторинг системи з телефону 24/7.</li></ol>";
}

const smart = data.ServicePage.find(s => s.slug === 'rozumnyy-dim');
if (smart) {
  smart.content = "<h2>Комфорт на кінчиках пальців</h2><p>Розумний дім — це не іграшка, а інтелектуальна система, яка керує кліматом, безпекою та освітленням, підлаштовуючись під ваші звички.</p><h3>Що ми автоматизуємо:</h3><ul><li><strong>Освітлення:</strong> диміювання, сценарії 'Я вдома', 'Кіно', 'Ніч'.</li><li><strong>Клімат:</strong> керування кондиціонерами, теплою підлогою та котлом з однієї панелі.</li><li><strong>Безпека:</strong> захист від протікання води (Ajax, Neptun), імітація присутності.</li><li><strong>Моторизація:</strong> автоматичні штори та жалюзі (Somfy).</li></ul><h3>Бренди, яким ми довіряємо:</h3><p>Ми використовуємо надійні дротові рішення <strong>KNX, Loxone</strong> для великих будинків та бездротові екосистеми <strong>Apple HomeKit, Ajax, Aqara</strong> для квартир з готовим ремонтом.</p>";
}

fs.writeFileSync('prisma/initial-data.json', JSON.stringify(data, null, 2));
console.log('Updated JSON!');
