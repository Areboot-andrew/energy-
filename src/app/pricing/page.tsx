"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import HighlightedTitle from "@/components/ui/HighlightedTitle";
import { Calculator, ShieldCheck, Zap, Star, Award, CheckCircle, Lightbulb, ThumbsUp, Activity, PenTool, Wrench, Battery, Cpu, Fingerprint } from "lucide-react";

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
  pricingFeatures?: any;
  termBackToHome?: string;
  termService?: string;
  termUnit?: string;
  termPrice?: string;
  termWhyUs?: string;
  termPricingGuarantee?: string;
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
    fetch("/api/prices?publicOnly=true")
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
      .then((data) => {
        if (data) {
          try { data.pricingFeatures = JSON.parse(data.pricingFeatures || "[]"); } catch { data.pricingFeatures = []; }
          setContent(data);
        }
      })
      .catch(() => setContent(null));
  }, []);

  const getFeatureIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'calculator': return <Calculator className="text-primary-fixed" size={28} />;
      case 'shieldcheck': return <ShieldCheck className="text-primary-fixed" size={28} />;
      case 'zap': return <Zap className="text-primary-fixed" size={28} />;
      case 'star': return <Star className="text-primary-fixed" size={28} />;
      case 'award': return <Award className="text-primary-fixed" size={28} />;
      case 'checkcircle': return <CheckCircle className="text-primary-fixed" size={28} />;
      case 'lightbulb': return <Lightbulb className="text-primary-fixed" size={28} />;
      case 'thumbsup': return <ThumbsUp className="text-primary-fixed" size={28} />;
      case 'activity': return <Activity className="text-primary-fixed" size={28} />;
      case 'pentool': return <PenTool className="text-primary-fixed" size={28} />;
      case 'wrench': return <Wrench className="text-primary-fixed" size={28} />;
      case 'battery': return <Battery className="text-primary-fixed" size={28} />;
      case 'cpu': return <Cpu className="text-primary-fixed" size={28} />;
      case 'fingerprint': return <Fingerprint className="text-primary-fixed" size={28} />;
      default: return <CheckCircle className="text-primary-fixed" size={28} />;
    }
  };

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
          &larr; {content?.termBackToHome || "Повернутися на головну"}
        </Link>
        
        <header className="mb-16">
          <HighlightedTitle 
            text={content?.pricingSeoTitle || "Повний прайс-лист на *електромонтажні* роботи"} 
            className="font-headline-xl text-4xl md:text-5xl lg:text-display-lg text-white mb-6" 
            as="h1" 
          />
          {content?.pricingSeoText ? (
            <div 
              className="font-body-lg text-secondary-fixed-dim max-w-3xl prose prose-invert prose-p:text-secondary-fixed-dim break-words whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: content.pricingSeoText }}
            />
          ) : (
            <p className="font-body-lg text-secondary-fixed-dim max-w-3xl break-words whitespace-pre-wrap">
              Ми пропонуємо прозорі ціни без прихованих платежів. Усі роботи виконуються професійним інструментом з дотриманням будівельних норм (ДБН, ПУЕ). Ми надаємо офіційну гарантію на всі виконані роботи та матеріали. Точна вартість розраховується після огляду об'єкта.
            </p>
          )}
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
                        <th className="py-4 text-secondary-fixed-dim font-label-md w-1/2">{content?.termService || "Послуга"}</th>
                        <th className="py-4 text-secondary-fixed-dim font-label-md">{content?.termUnit || "Одиниця"}</th>
                        <th className="py-4 text-secondary-fixed-dim font-label-md text-right">{content?.termPrice || "Ціна (₴)"}</th>
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
        
        <section className="mt-24 relative">
          <div className="text-center mb-12">
            <h3 className="font-headline-lg text-white mb-4">{content?.termWhyUs || "Чому обирають нас?"}</h3>
            <p className="text-secondary-fixed-dim max-w-2xl mx-auto">
              {content?.termPricingGuarantee || "Ми гарантуємо прозорість, надійність та безпеку на кожному етапі співпраці."}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {content?.pricingFeatures && content.pricingFeatures.length > 0 ? (
              content.pricingFeatures.map((feature: any, idx: number) => (
                <div key={idx} className="bg-surface-container rounded-3xl p-8 border border-outline-variant/20 hover:border-primary-fixed/40 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-fixed/5 blur-2xl rounded-full -mr-10 -mt-10 pointer-events-none group-hover:bg-primary-fixed/10 transition-colors"></div>
                  <div className="w-14 h-14 bg-surface-container-high rounded-2xl flex items-center justify-center mb-6 border border-outline-variant/30 group-hover:scale-110 transition-transform">
                    {getFeatureIcon(feature.icon)}
                  </div>
                  <h4 className="font-title-lg text-white mb-3">{feature.title}</h4>
                  <p className="text-secondary-fixed-dim leading-relaxed">{feature.description}</p>
                </div>
              ))
            ) : (
              <>
                <div className="bg-surface-container rounded-3xl p-8 border border-outline-variant/20 hover:border-primary-fixed/40 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-fixed/5 blur-2xl rounded-full -mr-10 -mt-10 pointer-events-none group-hover:bg-primary-fixed/10 transition-colors"></div>
                  <div className="w-14 h-14 bg-surface-container-high rounded-2xl flex items-center justify-center mb-6 border border-outline-variant/30 group-hover:scale-110 transition-transform">
                    <Calculator className="text-primary-fixed" size={28} />
                  </div>
                  <h4 className="font-title-lg text-white mb-3">Фіксований кошторис</h4>
                  <p className="text-secondary-fixed-dim leading-relaxed">Ціна не змінюється в процесі роботи. Ви знаєте точну вартість до початку монтажу.</p>
                </div>
                
                <div className="bg-surface-container rounded-3xl p-8 border border-outline-variant/20 hover:border-primary-fixed/40 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-fixed/5 blur-2xl rounded-full -mr-10 -mt-10 pointer-events-none group-hover:bg-primary-fixed/10 transition-colors"></div>
                  <div className="w-14 h-14 bg-surface-container-high rounded-2xl flex items-center justify-center mb-6 border border-outline-variant/30 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="text-primary-fixed" size={28} />
                  </div>
                  <h4 className="font-title-lg text-white mb-3">Офіційна гарантія</h4>
                  <p className="text-secondary-fixed-dim leading-relaxed">Ми надаємо гарантію на всі види робіт та матеріали терміном від 5 років.</p>
                </div>
                
                <div className="bg-surface-container rounded-3xl p-8 border border-outline-variant/20 hover:border-primary-fixed/40 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-fixed/5 blur-2xl rounded-full -mr-10 -mt-10 pointer-events-none group-hover:bg-primary-fixed/10 transition-colors"></div>
                  <div className="w-14 h-14 bg-surface-container-high rounded-2xl flex items-center justify-center mb-6 border border-outline-variant/30 group-hover:scale-110 transition-transform">
                    <Zap className="text-primary-fixed" size={28} />
                  </div>
                  <h4 className="font-title-lg text-white mb-3">Безпека понад усе</h4>
                  <p className="text-secondary-fixed-dim leading-relaxed">Використовуємо тільки сертифіковані матеріали, що не підтримують горіння.</p>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
