import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const iconMap: Record<string, string> = {
  "settings_input_component": "Cable",
  "solar_power": "Sun",
  "ev_station": "Car",
  "home_iot_device": "Home",
  "electrical_services": "Zap",
  "lightbulb": "Lightbulb",
  "battery_charging_full": "BatteryCharging",
  "thunderstorm": "Zap",
  "architecture": "PenTool"
};

async function main() {
  const services = await prisma.servicePage.findMany();
  for (const s of services) {
    if (s.icon && iconMap[s.icon]) {
      await prisma.servicePage.update({
        where: { id: s.id },
        data: { icon: iconMap[s.icon] }
      });
      console.log(`Updated ${s.slug}: ${s.icon} -> ${iconMap[s.icon]}`);
    } else if (s.icon && s.icon.includes('_')) {
      // generic fallback for any other material icon
      await prisma.servicePage.update({
        where: { id: s.id },
        data: { icon: "Zap" }
      });
      console.log(`Updated ${s.slug}: ${s.icon} -> Zap`);
    } else if (s.icon && /^[a-z]+$/.test(s.icon)) {
      // also lower case single words
       await prisma.servicePage.update({
        where: { id: s.id },
        data: { icon: s.icon.charAt(0).toUpperCase() + s.icon.slice(1) }
      });
      console.log(`Capitalized ${s.slug}: ${s.icon}`);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
