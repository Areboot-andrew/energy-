const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.user.findMany({
  select: { id: true, name: true, email: true, role: true }
}).then(users => {
  console.log(JSON.stringify(users, null, 2));
  prisma.$disconnect();
}).catch(err => {
  console.log('Error:', err.message);
  prisma.$disconnect();
});
