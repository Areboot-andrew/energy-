"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface GalleryItem {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filter, setFilter] = useState("Всі");

  useEffect(() => {
    fetch("/api/gallery").then((res) => res.json()).then((data) => setItems(data));
  }, []);

  const categories = ["Всі", ...new Set(items.map((item) => item.category))];
  const filteredItems = filter === "Всі" ? items : items.filter((item) => item.category === filter);

  return (
    <div className="min-h-screen py-24 px-margin-desktop max-w-container-max mx-auto bg-background">
      <div className="mb-16">
        <Link href="/" className="text-primary-fixed font-bold hover:underline mb-8 inline-block">← На головну</Link>
        <h1 className="font-display-lg text-4xl md:text-6xl mb-6">Всі проєкти</h1>
        <p className="text-secondary-fixed-dim text-lg max-w-3xl mb-8">
          Ознайомтесь із нашим повним портфоліо виконаних робіт. Ми пишаємося кожним проєктом: від розумних будинків до складних промислових електромонтажних рішень. Наші експерти забезпечують найвищу якість та надійність на кожному етапі, втілюючи в життя найсучасніші технологічні інновації.
        </p>
        
        <div className="flex flex-wrap gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all border ${
                filter === cat
                  ? "bg-primary-fixed text-on-primary-fixed border-primary-fixed"
                  : "border-outline-variant/30 text-secondary-fixed-dim hover:border-primary-fixed"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-outline-variant/20 bg-surface-container-low card-tech cursor-pointer"
          >
            <Image src={item.url} alt={item.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8 translate-y-4 group-hover:translate-y-0">
              <span className="text-primary-fixed text-[10px] font-bold uppercase tracking-[0.3em] mb-2">{item.category}</span>
              <h3 className="text-white font-bold text-xl mb-1">{item.title}</h3>
              <p className="text-secondary-fixed-dim text-sm leading-relaxed">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
