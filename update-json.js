const fs = require('fs');
const data = JSON.parse(fs.readFileSync('prisma/initial-data.json', 'utf8'));

const featuredSlugs = [
  'elektromontazh',
  'sonyachni-stantsiyi',
  'zaryadni-stantsiyi',
  'rozumnyy-dim',
  'elektryka-pid-klyuch'
];

data.ServicePage.forEach(s => {
  s.isFeatured = featuredSlugs.includes(s.slug);
  
  // Set basic categories
  if (s.slug === 'elektromontazh' || s.slug === 'elektryka-pid-klyuch') {
    s.category = 'Електромонтаж';
  } else if (s.slug === 'sonyachni-stantsiyi' || s.slug === 'zaryadni-stantsiyi') {
    s.category = 'Альтернативна енергія';
  } else if (s.slug === 'rozumnyy-dim') {
    s.category = 'Розумний дім';
  } else {
    s.category = 'Додаткові послуги'; // For all the other ones
  }
});

fs.writeFileSync('prisma/initial-data.json', JSON.stringify(data, null, 2));
console.log('Updated JSON with featured flags and categories!');
