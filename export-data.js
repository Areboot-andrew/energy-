const Database = require('better-sqlite3');
const fs = require('fs');

const db = new Database('prisma/dev.db');

const data = {
  User: db.prepare('SELECT * FROM User').all(),
  PortfolioProject: db.prepare('SELECT * FROM PortfolioProject').all(),
  ProjectMedia: db.prepare('SELECT * FROM ProjectMedia').all(),
  BlogPost: db.prepare('SELECT * FROM BlogPost').all(),
  PriceItem: db.prepare('SELECT * FROM PriceItem').all(),
  ClientRequest: db.prepare('SELECT * FROM ClientRequest').all(),
  ServicePage: db.prepare('SELECT * FROM ServicePage').all(),
  FAQ: db.prepare('SELECT * FROM FAQ').all(),
  StandardItem: db.prepare('SELECT * FROM StandardItem').all(),
  WorkStep: db.prepare('SELECT * FROM WorkStep').all(),
  PageContent: db.prepare('SELECT * FROM PageContent').all(),
  CalculatorConfig: db.prepare('SELECT * FROM CalculatorConfig').all(),
};

fs.writeFileSync('prisma/initial-data.json', JSON.stringify(data, null, 2));
console.log('Data exported to prisma/initial-data.json');
