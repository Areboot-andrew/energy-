const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const services = await prisma.servicePage.findMany();
  console.log("Current services and their icons:");
  
  // A map of invalid icons to valid Lucide icons
  const iconMap = {
    "electrical_services": "Zap",
    "lightning": "Zap",
    "security": "Shield",
    "ventilation": "Wind",
    "smart_home": "Home",
    "ev_charger": "Car",
    "cctv": "Cctv",
    "shield_check": "ShieldCheck",
    "tools": "Wrench"
  };

  for (const s of services) {
    console.log(`- ${s.title}: ${s.icon}`);
    
    // Check if the icon is snake_case and try to fix it
    let newIcon = s.icon;
    
    if (iconMap[s.icon]) {
      newIcon = iconMap[s.icon];
    } else if (s.icon.includes('_')) {
      // PascalCase converter
      newIcon = s.icon.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
    }

    if (newIcon !== s.icon) {
      console.log(`  Updating ${s.icon} -> ${newIcon}`);
      await prisma.servicePage.update({
        where: { id: s.id },
        data: { icon: newIcon }
      });
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
