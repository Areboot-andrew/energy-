const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  const password = 'admin123';
  const hashed = await bcrypt.hash(password, 12);
  
  try {
    const user = await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@voltpremium.ua',
        password: hashed,
        role: 'ADMIN',
      }
    });
    console.log('Admin created:');
    console.log('  Email:', user.email);
    console.log('  Password: admin123');
    console.log('  Role:', user.role);
  } catch (err) {
    if (err.code === 'P2002') {
      console.log('Admin already exists with email: admin@voltpremium.ua');
    } else {
      console.log('Error:', err.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
