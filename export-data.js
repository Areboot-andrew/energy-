const Database = require('better-sqlite3');
const fs = require('fs');

const db = new Database('prisma/dev.db');

const data = {
  PortfolioProject: db.prepare('SELECT * FROM PortfolioProject').all(),
  ProjectMedia: db.prepare('SELECT * FROM ProjectMedia').all(),
  BlogPost: db.prepare('SELECT * FROM BlogPost').all(),
};

fs.writeFileSync('prisma/initial-data.json', JSON.stringify(data, null, 2));
console.log('Data exported to prisma/initial-data.json');
