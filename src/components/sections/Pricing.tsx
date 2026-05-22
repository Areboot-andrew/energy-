"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";

interface PriceItem {
  id: string;
  name: string;
  unit: string;
  price: number;
}

const defaultPrices = [
  { name: "Монтаж кабелю в гофрі", unit: "м.п.", price: 45 },
  { name: "Встановлення підрозетника", unit: "шт.", price: 120 },
  { name: "Збірка силового щита", unit: "модуль", price: 250 },
  { name: "Штроблення стін (бетон)", unit: "м.п.", price: 180 },
  { name: "Монтаж LED стрічки", unit: "м.п.", price: 150 },
];

const Pricing = () => {
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [content, setContent] = useState({ pricingTitle: "Прозоре ціноутворення", pricingSeoText: "" });

  useEffect(() => {
    fetch("/api/prices")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPrices(data);
        } else {
          setPrices(defaultPrices as PriceItem[]);
        }
      })
      .catch(() => {
        setPrices(defaultPrices as PriceItem[]);
      });
    
    fetch("/api/content").then(res => res.json()).then(data => {
      if (data.pricingTitle) setContent(data);
    });
  }, []);

  return (
    <section className="py-24 px-margin-desktop max-w-container-max mx-auto" id="pricing">
      <h2 className="font-headline-xl text-center mb-16">{content.pricingTitle}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/30">
              <th className="py-6 text-secondary-fixed-dim font-label-md">Послуга</th>
              <th className="py-6 text-secondary-fixed-dim font-label-md">Одиниця</th>
              <th className="py-6 text-secondary-fixed-dim font-label-md text-right">Ціна (₴)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {prices.slice(0, 5).map((item) => (
              <tr key={item.id || item.name} className="hover:bg-surface-container-low transition-colors group">
                <td className="py-6 font-body-lg group-hover:text-primary-fixed transition-colors">
                  {item.name}
                </td>
                <td className="py-6 text-secondary-fixed-dim">{item.unit}</td>
                <td className="py-6 text-right font-bold text-white">{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {content.pricingSeoText && (
        <div 
          className="mt-12 text-secondary-fixed-dim text-sm prose prose-invert prose-sm prose-p:text-secondary-fixed-dim max-w-4xl mx-auto"
          dangerouslySetInnerHTML={{ __html: content.pricingSeoText }}
        />
      )}

      <div className="mt-12 text-center">
        <Link 
          href="/pricing"
          className="inline-flex items-center justify-center px-8 py-4 bg-primary-fixed text-on-primary-fixed font-label-lg rounded-full hover:bg-primary-fixed-dim transition-colors shadow-lg shadow-primary-fixed/20 hover:shadow-primary-fixed/40 hover:-translate-y-1 active:translate-y-0"
        >
          Дивитись повний прайс-лист
        </Link>
      </div>
    </section>
  );
};

export default Pricing;
