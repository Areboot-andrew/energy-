const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const existing = await prisma.pageContent.findUnique({
      where: { id: "singleton" }
    });
    
    if (existing) {
      await prisma.pageContent.update({
        where: { id: "singleton" },
        data: {
          contactPhone: "+38 098 732 85 63",
          contactEmail: "tarasbuina2@icloud.com",
          instagram: "https://www.instagram.com/electric_lviv?igsh=OGY2NDgwaGJsbDl3",
        }
      });
      console.log("Updated existing PageContent.");
    }
  } catch (error) {
    console.error("Error updating contacts:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
