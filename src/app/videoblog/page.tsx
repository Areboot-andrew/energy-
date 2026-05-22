"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function VideoBlogPage() {
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => {
        if (data.videoUrl) setVideoUrl(data.videoUrl);
      });
  }, []);

  const getEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const id = match && match[2].length === 11 ? match[2] : null;
    return id ? `https://www.youtube.com/embed/${id}` : null;
  };

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <div className="min-h-screen py-24 px-margin-desktop max-w-container-max mx-auto bg-background relative overflow-hidden">
      <div className="absolute top-1/4 right-0 -translate-y-1/2 w-96 h-96 bg-primary-fixed/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="relative z-10 mb-16">
        <Link href="/" className="text-primary-fixed font-bold hover:underline mb-8 inline-block">← На головну</Link>
        <h1 className="font-display-lg text-4xl md:text-6xl mb-6">Відеоблог</h1>
        <div className="prose prose-invert max-w-4xl text-secondary-fixed-dim text-lg">
          <p>
            Ласкаво просимо до нашого відеоблогу! Тут ми ділимося експертними думками щодо електромонтажу, встановлення систем "розумний дім" та сучасних технологічних рішень.
          </p>
          <p className="mt-4">
            Дивіться наші відео, щоб дізнатися більше про внутрішню кухню складних проєктів, отримати корисні поради та бути в курсі останніх трендів у сфері енергетики та автоматизації. Ми ретельно аналізуємо найважливіші аспекти безпеки та ефективності, щоб ваші системи працювали бездоганно.
          </p>
        </div>
      </div>

      {videoUrl && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="aspect-video w-full max-w-5xl mx-auto rounded-xl overflow-hidden border border-outline-variant/20 shadow-2xl bg-surface-container relative group mb-16"
        >
          <div className="absolute inset-0 border-2 border-primary-fixed/0 group-hover:border-primary-fixed/40 transition-all duration-700 pointer-events-none z-20 rounded-xl"></div>
          
          {embedUrl ? (
            <iframe
              width="100%"
              height="100%"
              src={`${embedUrl}?modestbranding=1&rel=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="relative z-10 transition-all duration-700"
            ></iframe>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-secondary-fixed-dim space-y-4">
              <span className="material-symbols-outlined text-6xl opacity-20">video_library</span>
              <p className="font-bold uppercase tracking-widest text-sm">Відео недоступне</p>
            </div>
          )}
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder for future video items. For now we only have the main one from the API. */}
        <div className="p-8 border border-outline-variant/20 rounded-xl bg-surface-container-low flex flex-col items-center justify-center text-center space-y-4">
           <span className="material-symbols-outlined text-4xl opacity-20 text-primary-fixed">upcoming</span>
           <h3 className="font-bold">Нові відео вже скоро</h3>
           <p className="text-secondary-fixed-dim text-sm">Ми готуємо для вас багато цікавого контенту. Слідкуйте за оновленнями!</p>
        </div>
      </div>
    </div>
  );
}
