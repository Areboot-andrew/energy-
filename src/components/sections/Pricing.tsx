"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import HighlightedTitle from "@/components/ui/HighlightedTitle";
import { CheckCircle2, ArrowRight } from "lucide-react";

const Pricing = () => {
  const [content, setContent] = useState({ 
    pricingTitle: "Прозоре ціноутворення", 
    pricingSeoText: "",
    pricingSub: "Ми пропонуємо чесні ціни за найвищу якість роботи. Виберіть пакет послуг або ознайомтеся з повним прайс-листом для детального розрахунку.",
    pricingButtonText: "Дивитись повний прайс-лист"
  });

  useEffect(() => {
    fetch("/api/content").then(res => res.json()).then(data => {
      if (data) setContent(prev => ({ ...prev, ...data }));
    });
  }, []);

  const packages = [
    {
      title: "Чорновий монтаж",
      price: "від 150 ₴ / м.п.",
      features: ["Штроблення без пилу", "Прокладання кабелю в гофрі", "Встановлення підрозетників", "Збірка тимчасового щита"]
    },
    {
      title: "Електрика під ключ",
      price: "від 800 ₴ / м²",
      features: ["Повний комплекс робіт", "Збірка щита (Hager/ABB)", "Захист від перепадів напруги", "Встановлення розеток та світла"]
    },
    {
      title: "Розумний дім",
      price: "Індивідуально",
      features: ["Проєктування системи", "Управління освітленням", "Клімат-контроль", "Система антипотоп"]
    }
  ];

  return (
    <section className="py-24 px-margin-desktop max-w-container-max mx-auto" id="pricing">
      <div className="text-center mb-16">
        <HighlightedTitle 
          text={content.pricingTitle} 
          className="font-headline-xl text-4xl md:text-5xl lg:text-6xl text-white mb-6" 
          as="h2" 
        />
        <p className="text-secondary-fixed-dim text-lg max-w-2xl mx-auto">
          {content.pricingSub}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {packages.map((pkg, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="bg-surface-container border border-outline-variant/20 rounded-2xl p-8 flex flex-col hover:border-primary-fixed/40 transition-colors relative group overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-fixed/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary-fixed/10 transition-colors"></div>
            
            <h3 className="text-2xl font-bold text-white mb-2 relative z-10">{pkg.title}</h3>
            <div className="text-3xl font-headline-md text-primary-fixed mb-8 relative z-10">{pkg.price}</div>
            
            <ul className="space-y-4 mb-8 flex-grow relative z-10">
              {pkg.features.map((feature, fidx) => (
                <li key={fidx} className="flex items-start gap-3">
                  <CheckCircle2 className="text-primary-fixed shrink-0 mt-0.5" size={20} />
                  <span className="text-secondary-fixed-dim">{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
      
      {content.pricingSeoText && (
        <div 
          className="mt-12 text-secondary-fixed-dim text-sm prose prose-invert prose-sm prose-p:text-secondary-fixed-dim max-w-4xl mx-auto text-center"
          dangerouslySetInnerHTML={{ __html: content.pricingSeoText }}
        />
      )}

      <div className="mt-12 text-center">
        <Link 
          href="/pricing"
          className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary-fixed text-on-primary-fixed font-bold text-lg rounded-full hover:bg-primary-fixed-dim transition-all hover:shadow-[0_0_20px_rgba(213,240,0,0.3)] hover:-translate-y-1"
        >
          {content.pricingButtonText}
          <ArrowRight size={20} />
        </Link>
      </div>
    </section>
  );
};

export default Pricing;
