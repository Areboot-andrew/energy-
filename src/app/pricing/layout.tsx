import { Metadata } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function generateMetadata(): Promise<Metadata> {
  const content = await prisma.pageContent.findUnique({
    where: { id: "singleton" },
  });

  const title = content?.pricingSeoTitle || "Прайс-лист на електромонтажні роботи | VOLT PREMIUM";
  const description = content?.pricingSeoText 
    ? content.pricingSeoText.replace(/<[^>]+>/g, ' ').substring(0, 160).trim() + "..."
    : "Прозорі ціни на послуги електромонтажу, розумного дому та сонячних станцій без прихованих платежів. Дізнайтеся точну вартість.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
