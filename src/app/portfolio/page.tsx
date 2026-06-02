import { PrismaClient } from "@prisma/client";
import { Metadata } from "next";
import Link from "next/link";
import { Play } from "lucide-react";
import HighlightedTitle from "@/components/ui/HighlightedTitle";

const prisma = new PrismaClient();

export async function generateMetadata(): Promise<Metadata> {
  const content = await prisma.pageContent.findUnique({
    where: { id: "singleton" },
  });

  const title = content?.portfolioSeoTitle || "Портфоліо робіт | Volt Premium";
  const description = content?.portfolioSeoText 
    ? content.portfolioSeoText.replace(/<[^>]+>/g, ' ').substring(0, 160).trim() + "..."
    : "Галерея виконаних проєктів з електромонтажу, розумного дому та сонячних станцій. Перегляньте наші найкращі роботи.";

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

export default async function PortfolioPage() {
  const items = await prisma.portfolioProject.findMany({
    orderBy: { createdAt: "desc" },
  });

  const content = await prisma.pageContent.findUnique({
    where: { id: "singleton" },
  });

  return (
    <main className="min-h-screen bg-background text-on-background pb-24 pt-32">
      <div className="max-w-container-max mx-auto px-margin-desktop">
        <div className="mb-12">
          <Link href="/" className="text-secondary-fixed-dim hover:text-white flex items-center gap-2 mb-6 w-fit">
            <span>←</span> На головну
          </Link>
          <span className="text-primary-fixed font-label-md tracking-widest uppercase mb-4 block">{content?.portfolioBadge || "Галерея"}</span>
          <HighlightedTitle 
            text={content?.allProjectsPageTitle || "Усі *проєкти*"} 
            className="font-headline-xl text-4xl md:text-5xl lg:text-display-lg text-white" 
            as="h1" 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => {
            const isVideo = item.coverImage.endsWith(".mp4") || item.coverImage.endsWith(".webm") || item.coverImage.includes("youtube.com") || item.coverImage.includes("youtu.be");
            
            return (
              <Link href={`/portfolio/${item.slug}`} key={item.id} className="group relative rounded-2xl overflow-hidden border border-outline-variant/20 bg-surface-container-low flex flex-col h-full hover:border-primary-fixed/50 transition-colors cursor-pointer">
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  {isVideo ? (
                    item.coverImage.includes("youtube.com") || item.coverImage.includes("youtu.be") ? (
                      <iframe 
                        src={item.coverImage.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")} 
                        className="w-full h-full object-cover pointer-events-none" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      />
                    ) : (
                      <video src={item.coverImage} className="w-full h-full object-cover" autoPlay loop muted playsInline />
                    )
                  ) : (
                    <img
                      src={item.coverImage}
                      alt={item.title || "Project"}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1 bg-surface-container/50">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-primary-fixed text-[10px] font-bold uppercase tracking-[0.2em]">{item.category}</span>
                    {item.totalPrice && (
                      <span className="text-primary-fixed font-bold text-sm bg-primary-fixed/10 px-2 py-1 rounded-md border border-primary-fixed/20">{item.totalPrice}</span>
                    )}
                  </div>
                  <h3 className="text-white font-bold text-xl mb-3 group-hover:text-primary-fixed transition-colors">{item.title}</h3>
                  <p className="text-secondary-fixed-dim text-sm leading-relaxed flex-1">
                    {item.shortDescription}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
        
        {items.length === 0 && (
          <div className="text-center py-20 text-secondary-fixed-dim">
            <p>Галерея поки порожня.</p>
          </div>
        )}
      </div>
    </main>
  );
}
