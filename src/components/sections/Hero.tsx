"use client";

import { useState, useEffect } from "react";

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
    <section className="relative min-h-[921px] flex items-center overflow-hidden px-margin-desktop">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10"></div>
        <img className="w-full h-full object-cover grayscale opacity-40" src={content.heroImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuChVJ1F6cbkh-npXnQ9rwyIEnw-UeToIqUIb-iXF4XFQSOPAK212xiOJ0H6TDgVABajS8N8_Y1tyRqChGbkT8OV3LjqOqgNIlXYCvDH3qiyCrTfYTOPGA3A-QzXvCD2oK7ahuZsSP2anP8txTU1sBpptQY_W3hQocStjN9D7z2xfzBCHJUU4qLEnRfeU6Y8ajrcP2QXWdL-OYyfEWvjyJqf5jpLL5SeGwDHtoxNXr204MhyK-xn-bR4c-CE2bWp6XNfzT7j_7eeJaHG"} alt="Hero"/>
      </div>
      <div className="relative z-20 max-w-container-max mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-gutter items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary-fixed/30 bg-primary-fixed/5 text-primary-fixed font-label-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-fixed opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-fixed"></span>
            </span>
            {content.heroBadgeText}
          </div>
          <h1 className="font-display-lg text-display-lg leading-[1.05] tracking-tight">
            {content.heroTitle.includes("Під Ключ") ? (
              <>
                {content.heroTitle.split("Під Ключ")[0]}
                <span className="text-primary-fixed">Під Ключ</span>
              </>
            ) : (
              content.heroTitle
            )}
          </h1>
          <p 
          className="text-secondary-fixed-dim font-body-lg md:font-body-xl mb-12 max-w-2xl mx-auto prose prose-invert prose-p:text-secondary-fixed-dim prose-a:text-primary-fixed"
          dangerouslySetInnerHTML={{ __html: content.heroSub }}
        />
          <div className="flex flex-wrap gap-4">
            <a href="#contacts" className="bg-primary-fixed text-on-primary-fixed px-10 py-5 rounded-lg font-bold text-lg hover:shadow-[0_0_20px_rgba(213,240,0,0.4)] transition-all">
              Отримати консультацію
            </a>
            <a href="/portfolio" className="border border-white/20 text-white px-10 py-5 rounded-lg font-bold text-lg hover:bg-white/5 transition-all">
              Наші роботи
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
