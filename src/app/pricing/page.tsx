"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface PriceItem {
  id?: string;
  name: string;
  unit: string;
  price: number;
  category?: string;
}

interface PageContent {
  pricingSeoTitle?: string;
  pricingSeoText?: string;
}

const defaultPrices: PriceItem[] = [
  { id: "1", name: "Монтаж кабелю в гофрі", unit: "м.п.", price: 45, category: "Прокладка кабелю" },
  { id: "2", name: "Прокладка кабелю відкрито", unit: "м.п.", price: 30, category: "Прокладка кабелю" },
  { id: "3", name: "Встановлення підрозетника (бетон)", unit: "шт.", price: 120, category: "Чорнові роботи" },
  { id: "4", name: "Встановлення підрозетника (цегла)", unit: "шт.", price: 90, category: "Чорнові роботи" },
  { id: "5", name: "Штроблення стін (бетон)", unit: "м.п.", price: 180, category: "Чорнові роботи" },
  { id: "6", name: "Штроблення стін (цегла)", unit: "м.п.", price: 120, category: "Чорнові роботи" },
  { id: "7", name: "Збірка силового щита", unit: "модуль", price: 250, category: "Електрощитове обладнання" },
  { id: "8", name: "Встановлення ПЗВ / Дифавтомата", unit: "шт.", price: 200, category: "Електрощитове обладнання" },
  { id: "9", name: "Встановлення розетки / вимикача", unit: "шт.", price: 100, category: "Чистовий монтаж" },
  { id: "10", name: "Монтаж світильника", unit: "шт.", price: 250, category: "Чистовий монтаж" },
  { id: "11", name: "Монтаж LED стрічки", unit: "м.п.", price: 150, category: "Чистовий монтаж" },
];

export default function PricingPage() {
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<PageContent | null>(null);

  useEffect(() => {
    fetch("/api/prices")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mappedData = data.map((item) => {
            let cat = item.category || "Інші роботи";
            if (!item.category) {
              const nameLower = item.name.toLowerCase();
              if (nameLower.includes("штроб") || nameLower.includes("підрозетн")) cat = "Чорнові роботи";
              else if (nameLower.includes("кабел")) cat = "Прокладка кабелю";
              else if (nameLower.includes("щит") || nameLower.includes("автомат")) cat = "Електрощитове обладнання";
              else if (nameLower.includes("світ") || nameLower.includes("розет") || nameLower.includes("вимик")) cat = "Чистовий монтаж";
            }
            return { ...item, category: cat };
          });
          setPrices(mappedData);
        } else {
          setPrices(defaultPrices);
        }
        setLoading(false);
      })
      .catch(() => {
        setPrices(defaultPrices);
        setLoading(false);
      });

    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => setContent(data))
      .catch(() => setContent(null));
  }, []);

  const groupedPrices = prices.reduce((acc, item) => {
    const cat = item.category || "Інші роботи";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, PriceItem[]>);

  return (
    <main className="min-h-screen pt-32 pb-24 px-margin-desktop bg-background text-white">
      <div className="max-w-container-max mx-auto">
        <Link href="/" className="inline-block mb-8 text-primary-fixed hover:text-primary-fixed-dim transition-colors">
          &larr; Повернутися на головну
        </Link>
        
        <header className="mb-16">
          <h1 className="font-headline-xl mb-6">{content?.pricingSeoTitle || "Повний прайс-лист на електромонтажні роботи"}</h1>
          <p className="font-body-lg text-secondary-fixed-dim max-w-3xl">
            {content?.pricingSeoText || "Ми пропонуємо прозорі ціни без прихованих платежів. Усі роботи виконуються професійним інструментом з дотриманням будівельних норм (ДБН, ПУЕ). Ми надаємо офіційну гарантію на всі виконані роботи та матеріали. Точна вартість розраховується після огляду об'єкта."}
          </p>
        </header>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-fixed mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-16">
            {Object.entries(groupedPrices).map(([category, items]) => (
              <motion.section 
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="font-headline-lg mb-8 text-primary-fixed border-b border-outline-variant/30 pb-4">{category}</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="border-b border-outline-variant/20">
                        <th className="py-4 text-secondary-fixed-dim font-label-md w-1/2">Послуга</th>
                        <th className="py-4 text-secondary-fixed-dim font-label-md">Одиниця</th>
                        <th className="py-4 text-secondary-fixed-dim font-label-md text-right">Ціна (₴)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10">
                      {items.map((item) => (
                        <tr key={item.id || item.name} className="hover:bg-surface-container-low transition-colors group">
                          <td className="py-4 font-body-lg group-hover:text-white text-gray-300 transition-colors">{item.name}</td>
                          <td className="py-4 text-secondary-fixed-dim">{item.unit}</td>
                          <td className="py-4 text-right font-bold text-white">{item.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.section>
            ))}
          </div>
        )}
        
        <section className="mt-24 bg-surface-container p-8 lg:p-12 rounded-3xl border border-outline-variant/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-fixed/5 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none"></div>
          <h3 className="font-headline-md mb-4 text-white">Чому обирають нас?</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 relative z-10">
            <li>
              <h4 className="font-title-md text-primary-fixed mb-2">Фіксований кошторис</h4>
              <p className="text-secondary-fixed-dim text-sm lg:text-base">Ціна не змінюється в процесі роботи. Ви знаєте точну вартість до початку монтажу.</p>
            </li>
            <li>
              <h4 className="font-title-md text-primary-fixed mb-2">Офіційна гарантія</h4>
              <p className="text-secondary-fixed-dim text-sm lg:text-base">Ми надаємо гарантію на всі види робіт терміном від 5 років.</p>
            </li>
            <li>
              <h4 className="font-title-md text-primary-fixed mb-2">Безпека понад усе</h4>
              <p className="text-secondary-fixed-dim text-sm lg:text-base">Використовуємо тільки сертифіковані матеріали, що не підтримують горіння.</p>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
