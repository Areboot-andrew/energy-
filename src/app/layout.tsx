import type { Metadata } from "next";
import "@/styles/globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Script from "next/script";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const content = await prisma.pageContent.findUnique({
      where: { id: "singleton" },
    });

    const title = content?.metaTitle || "VOLT PREMIUM | Професійні електромонтажні рішення";
    const description = content?.metaDescription || "Професійні інженерні рішення для преміальної нерухомості та комерційних об'єктів. Від щитка до повного 'Розумного дому'.";
    
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: 'https://voltpremium.ua',
        siteName: content?.companyName || 'VOLT PREMIUM',
        images: [
          {
            url: content?.logoImageUrl || 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            width: 1200,
            height: 630,
            alt: content?.companyName || 'VOLT PREMIUM',
          },
        ],
        locale: 'uk_UA',
        type: 'website',
      },
    };
  } catch (error) {
    return {
      title: "VOLT PREMIUM | Професійні електромонтажні рішення",
      description: "Професійні інженерні рішення для преміальної нерухомості та комерційних об'єктів. Від щитка до повного 'Розумного дому'.",
    };
  }
}

import { Providers } from "@/components/Providers";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const prisma = new PrismaClient();
  const content = await prisma.pageContent.findUnique({
    where: { id: "singleton" },
    select: { googleAnalyticsId: true, googleSiteVerification: true }
  });

  return (
    <html lang="uk" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
        {content?.googleSiteVerification && (
          <meta name="google-site-verification" content={content.googleSiteVerification} />
        )}
      </head>
      <body className="bg-background text-on-background font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed overflow-x-hidden w-full">
        {content?.googleAnalyticsId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${content.googleAnalyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${content.googleAnalyticsId}');
              `}
            </Script>
          </>
        )}
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
