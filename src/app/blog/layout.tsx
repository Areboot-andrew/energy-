import { Metadata } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function generateMetadata(): Promise<Metadata> {
  const content = await prisma.pageContent.findUnique({
    where: { id: "singleton" },
  });

  const title = content?.blogTitle ? `${content.blogTitle} | VOLT PREMIUM` : "Блог та корисні поради | VOLT PREMIUM";
  const description = "Експертні статті, поради та огляди у сфері електромонтажу, інтеграції систем Розумного дому та альтернативної енергетики.";

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

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
