const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'prisma', 'initial-data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Update Services
data.ServicePage.forEach(service => {
  // Set SEO
  service.metaTitle = `${service.title} | VOLT PREMIUM`;
  service.metaDescription = `Професійні послуги: ${service.title}. Гарантія якості, преміум матеріали та сучасні інженерні рішення.`;
  
  if (service.slug === 'elektryka-pid-klyuch') {
    service.components = JSON.stringify([
      { name: "Кабельна продукція", desc: "Мідний кабель ВВГнг-LS (Одескабель)" },
      { name: "Автоматика", desc: "Захист Hager, Schneider Electric або Eaton" },
      { name: "Електрощит", desc: "Вбудований або накладний щит на 36-72 модулі" }
    ]);
    service.included = JSON.stringify([
      "Розробка проєкту",
      "Закупівля матеріалів зі знижкою",
      "Штроблення та прокладання трас",
      "Збірка електрощита",
      "Встановлення механізмів (розеток, вимикачів)"
    ]);
    service.estimatedPrice = "від 1 200 ₴ / м²";
  }
  
  if (service.slug === 'elektromontazh') {
    service.components = JSON.stringify([
      { name: "Автоматичні вимикачі", desc: "Надійний захист від перевантажень" },
      { name: "ПЗВ", desc: "Захист людини від ураження струмом" },
      { name: "Реле напруги", desc: "ZUBR або Novatek для захисту техніки" }
    ]);
    service.included = JSON.stringify([
      "Безкоштовний виїзд та складання кошторису",
      "Монтаж підрозетників",
      "Прокладання силових ліній",
      "Гарантія 5 років"
    ]);
    service.estimatedPrice = "від 5 000 ₴ (за точку/роботу)";
  }
});

// Update Portfolio
data.PortfolioProject.forEach(project => {
  project.metaTitle = `Проєкт: ${project.title} | VOLT PREMIUM`;
  project.metaDescription = project.shortDescription || `Ознайомтесь із нашим реалізованим проєктом: ${project.title}.`;
  
  if (project.slug === 'smart-home-kyiv') {
    project.systemPower = "N/A";
    project.duration = "3 місяці";
  }
  if (project.slug === 'solar-5kw-odesa') {
    project.systemPower = "5 кВт";
    project.inverter = "Deye 5kW";
    project.panels = "Jinko Solar 540W";
    project.battery = "Pylontech 5kWh";
    project.duration = "2 дні";
  }
});

// Update Blog
data.BlogPost.forEach(post => {
  post.metaTitle = `${post.title} | Блог VOLT PREMIUM`;
  post.metaDescription = `Читайте нашу статтю про ${post.title.toLowerCase()}. Корисні поради від експертів.`;
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log('Successfully added rich demo data to initial-data.json!');
