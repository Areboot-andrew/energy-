"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import HighlightedTitle from "@/components/ui/HighlightedTitle";

interface PortfolioProject {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
  shortDescription: string;
  category: string;
  totalPrice?: string;
}

const PortfolioCarousel = () => {
  const [items, setItems] = useState<PortfolioProject[]>([]);
  const [content, setContent] = useState({ 
    portfolioTitle: "Галерея виконаних робіт",
    portfolioBadge: "Галерея",
    portfolioLinkText: "Всі проєкти →"
  });

  useEffect(() => {
    fetch("/api/portfolio")
      .then((res) => res.json())
      .then((data) => setItems(data));
      
    fetch("/api/content").then(res => res.json()).then(data => {
      if (data) setContent(prev => ({ ...prev, ...data }));
    });
  }, []);

  if (items.length === 0) return null;

  const marqueeItems = [...items, ...items, ...items];

  return (
    <section className="py-16 md:py-24 overflow-hidden" id="portfolio">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-container-max mx-auto px-4 md:px-margin-desktop mb-8 md:mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4"
      >
        <div>
          <span className="text-primary-fixed font-label-md tracking-widest uppercase mb-2 md:mb-4 block">{content.portfolioBadge}</span>
          <HighlightedTitle text={content.portfolioTitle} className="font-headline-xl text-white" as="h2" />
        </div>
        <Link href="/portfolio" className="text-primary-fixed font-bold hover:underline mb-2 flex items-center gap-2">
          {content.portfolioLinkText}
        </Link>
      </motion.div>

      <div className="relative w-full max-w-container-max mx-auto px-4 md:px-margin-desktop flex overflow-hidden">
        <motion.div
          className="flex gap-6 px-3"
          animate={{ x: ["0%", "-33.333333%"] }}
          transition={{
            duration: items.length * 4,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {marqueeItems.map((item, index) => {
            const isVideo = item.coverImage.endsWith(".mp4") || item.coverImage.endsWith(".webm") || item.coverImage.includes("youtube.com") || item.coverImage.includes("youtu.be");
            return (
            <Link
              href={`/portfolio/${item.slug}`}
              key={`${item.id}-${index}`}
              className="group relative w-[280px] md:w-[350px] lg:w-[400px] aspect-[4/3] rounded-xl overflow-hidden flex-shrink-0 border border-outline-variant/20 bg-surface-container-low cursor-pointer block"
            >
              {isVideo ? (
                <div className="absolute inset-0 bg-black flex items-center justify-center z-0">
                  <span className="material-symbols-outlined text-white/40 text-6xl group-hover:scale-110 transition-transform">play_circle</span>
                </div>
              ) : (
                <Image
                  src={item.coverImage}
                  alt={item.title || "Project"}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-100 flex flex-col justify-end p-6 group-hover:from-black z-10">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-primary-fixed text-[10px] font-bold uppercase tracking-[0.2em] drop-shadow-md">
                    {item.category}
                  </span>
                  {item.totalPrice && (
                    <span className="text-primary-fixed font-bold text-sm bg-primary-fixed/10 px-2 py-1 rounded-md backdrop-blur-sm border border-primary-fixed/20">{item.totalPrice}</span>
                  )}
                </div>
                <h3 className="text-white font-bold text-lg mb-1 drop-shadow-md">{item.title}</h3>
                <p className="text-gray-300 text-sm line-clamp-2 drop-shadow-md">{item.shortDescription}</p>
              </div>
            </Link>
          )})}
        </motion.div>
      </div>
    </section>
  );
};

export default PortfolioCarousel;
