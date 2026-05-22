import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const extremeFormattingHTML = `
    <h2 class="ql-align-center"><span class="ql-size-huge">🚀 Екстремальне форматування 🚀</span></h2>
    <p class="ql-align-center"><span class="ql-size-large">Цей текст розміщено по центру і має збільшений шрифт.</span></p>
    <p><br></p>
    <p class="ql-align-justify">Текст вирівняний по ширині (justify). Цей абзац демонструє, як текст розтягується від лівого до правого краю, створюючи рівні межі з обох сторін. Це ідеально підходить для довгих газетних статей або офіційних звітів, де важливий строгий вигляд.</p>
    <p><br></p>
    <p class="ql-align-right"><em>Цей текст вирівняно по правому краю і написано курсивом.</em></p>
    <p><br></p>
    <ul>
      <li><span style="color: rgb(255, 0, 0);">Червоний текст</span> у списку</li>
      <li><strong style="background-color: rgb(255, 255, 0);">Жовтий фон</strong> з жирним шрифтом</li>
      <li><u>Підкреслений</u> і <s>перекреслений</s> текст</li>
    </ul>
    <p><br></p>
    <blockquote>"Цитати виглядають просто чудово, якщо їх правильно виділяти. Розумний дім — це не майбутнє, це сьогодення!" 🧠💡</blockquote>
    <p><br></p>
    <p class="ql-align-center"><img src="https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Tech" width="600" /></p>
    <p class="ql-align-center"><em>Зображення по центру з підписом</em></p>
  `;

  // Create a brand new project to bypass any possible cache
  await prisma.portfolioProject.upsert({
    where: { slug: "extreme-formatting-demo" },
    update: { content: extremeFormattingHTML },
    create: {
      title: "Демо: Максимальне форматування",
      slug: "extreme-formatting-demo",
      category: "Тест",
      shortDescription: "Цей проєкт створений спеціально, щоб продемонструвати всі можливості нового текстового редактора.",
      coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      content: extremeFormattingHTML,
      metaTitle: "Максимальне форматування",
      metaDescription: "Огляд всіх доступних інструментів в редакторі.",
    }
  });

  // Also create a blog post just in case
  await prisma.blogPost.upsert({
    where: { slug: "extreme-formatting-blog" },
    update: { content: extremeFormattingHTML },
    create: {
      title: "Як ми робимо форматування тексту?",
      slug: "extreme-formatting-blog",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      published: true,
      content: extremeFormattingHTML,
      metaTitle: "Форматування Блогу",
      metaDescription: "Демонстрація всіх функцій.",
    }
  });

  console.log('✅ Formatting demo seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
