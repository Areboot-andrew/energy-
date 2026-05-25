"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const About = () => {
  const [content, setContent] = useState({
    aboutTitle: "VOLT PREMIUM: Хірургічна точність у кожному контакті",
    aboutText: "Ми не просто прокладаємо дроти. Ми створюємо нервову систему вашого будинку. Наш підхід базується на скандинавських принципах якості: мінімалізм у виконанні, максимальна функціональність та бескомпромісна безпека.",
    aboutImage: null,
    aboutBadgeNumber: "10+",
    aboutBadgeText: "Років досвіду",
    aboutBullets: '[{"icon":"verified","text":"Сертифіковані інженери Schneider & ABB"},{"icon":"security","text":"Гарантія на роботи 5 років"},{"icon":"architecture","text":"Власна база дизайн-проєктів"}]'
  });

  useEffect(() => {
    fetch("/api/content").then(res => res.json()).then(data => {
      if (data.aboutTitle) setContent(data);
    });
  }, []);

  return (
    <section className="py-24 bg-surface-dim overflow-hidden relative" id="about">
      <div className="max-w-container-max mx-auto px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="relative">
          <div className="aspect-square rounded-2xl overflow-hidden relative z-10">
            <img className="w-full h-full object-cover" src={content.aboutImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuCCOglMuUShCLmdfVTl-9ihZary75cjlipfTJV0V-aZwwNVhmeqtvkTdPH9We9ihKiSbVWFkqILmPT9tN6RuigESbG3X08ytk4KDes3UmLbKmooUlCoVtIWgWt3gW73Qk3Sd4VlKg3gu0AYBcBN0n8iBNEppglJ1fQvkGOEt8GQ02fqGXWPerUor6Xwikid9WrkEEMGdbQsSk2_boSP93YiPQewcqUVtDAuDiSNwqQ3xazxjVOzd6nMDd-oppuDsJNNDHP27LZAp4UX"} alt="About"/>
          </div>
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary-fixed/20 blur-[100px] z-0"></div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="absolute top-10 left-10 p-6 glass-card rounded-xl border border-white/10 z-20"
          >
            <div className="text-4xl font-bold text-primary-fixed mb-1">{content.aboutBadgeNumber}</div>
            <div className="text-white font-label-sm uppercase tracking-widest">{content.aboutBadgeText}</div>
          </motion.div>
        </div>
        <div className="space-y-8">
          <h2 className="font-headline-xl">{content.aboutTitle}</h2>
          <div 
            className="text-secondary-fixed-dim font-body-lg leading-relaxed prose prose-invert prose-p:text-secondary-fixed-dim prose-a:text-primary-fixed"
            dangerouslySetInnerHTML={{ __html: content.aboutText }}
          />
          <ul className="space-y-4">
            {(JSON.parse(content.aboutBullets || "[]")).map((item: any, i: number) => (
              <motion.li 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-primary-fixed/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary-fixed text-xl">{item.icon}</span>
                </div>
                <span className="text-white font-body-md">{item.text}</span>
              </motion.li>
            ))}
          </ul>
          <div className="pt-8">
            <Link 
              href="/about"
              className="inline-flex items-center gap-3 px-8 py-4 border border-primary-fixed text-primary-fixed hover:bg-primary-fixed hover:text-on-primary-fixed font-bold rounded-full transition-all group"
            >
              Детальніше про компанію
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
