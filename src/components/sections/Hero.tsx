"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import ContactButton from "@/components/ui/ContactButton";

const Hero = () => {
  const [content, setContent] = useState({
    heroTitle: "Енергія Вашого Прогресу Під Ключ",
    heroBadgeText: "Turnkey Електромонтаж",
    heroSub: "Професійні інженерні рішення для преміальної нерухомості та комерційних об'єктів. Від щитка до повного 'Розумного дому'.",
    heroImage: null
  });

  useEffect(() => {
    fetch("/api/content").then(res => res.json()).then(data => {
      if (data.heroTitle) setContent(data);
    });
  }, []);

  return (
    <section className="relative min-h-[100vh] md:min-h-[921px] flex items-center overflow-hidden px-4 md:px-margin-desktop py-20 md:py-0">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10"></div>
        <img className="w-full h-full object-cover grayscale opacity-40" src={content.heroImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuChVJ1F6cbkh-npXnQ9rwyIEnw-UeToIqUIb-iXF4XFQSOPAK212xiOJ0H6TDgVABajS8N8_Y1tyRqChGbkT8OV3LjqOqgNIlXYCvDH3qiyCrTfYTOPGA3A-QzXvCD2oK7ahuZsSP2anP8txTU1sBpptQY_W3hQocStjN9D7z2xfzBCHJUU4qLEnRfeU6Y8ajrcP2QXWdL-OYyfEWvjyJqf5jpLL5SeGwDHtoxNXr204MhyK-xn-bR4c-CE2bWp6XNfzT7j_7eeJaHG"} alt="Hero"/>
      </div>
      <div className="relative z-20 max-w-container-max mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-gutter items-center">
        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary-fixed/30 bg-primary-fixed/5 text-primary-fixed font-label-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-fixed opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-fixed"></span>
            </span>
            {content.heroBadgeText}
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-display-lg text-4xl sm:text-5xl lg:text-display-lg leading-[1.1] md:leading-[1.05] tracking-tight text-white"
          >
            {content.heroTitle.includes("Під Ключ") ? (
              <>
                {content.heroTitle.split("Під Ключ")[0]}
                <span className="text-primary-fixed">Під Ключ</span>
              </>
            ) : (
              content.heroTitle
            )}
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p 
              className="text-secondary-fixed-dim font-body-lg md:font-body-xl mb-12 max-w-2xl mx-auto prose prose-invert prose-p:text-secondary-fixed-dim prose-a:text-primary-fixed"
              dangerouslySetInnerHTML={{ __html: content.heroSub }}
            />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row flex-wrap gap-4"
          >
            <ContactButton className="bg-primary-fixed text-on-primary-fixed px-10 py-5 rounded-lg font-bold text-lg hover:shadow-[0_0_20px_rgba(213,240,0,0.4)] transition-all w-full sm:w-auto text-center flex items-center justify-center">
              Безкоштовний прорахунок
            </ContactButton>
            <Link href="/portfolio" className="border border-white/20 text-white px-10 py-5 rounded-lg font-bold text-lg hover:bg-white/5 transition-all w-full sm:w-auto text-center flex items-center justify-center">
              Наші роботи
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
