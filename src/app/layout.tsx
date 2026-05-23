import type { Metadata } from "next";
import "@/styles/globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const content = await prisma.pageContent.findUnique({
      where: { id: "singleton" },
    });

    return {
      title: content?.metaTitle || "VOLT PREMIUM | Професійні електромонтажні рішення",
      description: content?.metaDescription || "Професійні інженерні рішення для преміальної нерухомості та комерційних об'єктів. Від щитка до повного 'Розумного дому'.",
    };
  } catch (error) {
    return {
      title: "VOLT PREMIUM | Професійні електромонтажні рішення",
      description: "Професійні інженерні рішення для преміальної нерухомості та комерційних об'єктів. Від щитка до повного 'Розумного дому'.",
    };
  }
}

import { Providers } from "@/components/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
      </head>
      <body className="bg-background text-on-background font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed">
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
