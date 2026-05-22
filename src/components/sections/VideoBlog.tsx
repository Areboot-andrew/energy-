"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";

const VideoBlog = () => {
  const [videos, setVideos] = useState<string[]>([]);
  const [content, setContent] = useState({
    videoblogTitle: "Експертний погляд",
    videoblogSub: "Відеоблог"
  });

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => {
        if (data.videos) {
          try {
            const parsed = JSON.parse(data.videos);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setVideos(parsed);
            } else if (data.videoUrl) {
              setVideos([data.videoUrl]);
            }
          } catch(e) {
            if (data.videoUrl) setVideos([data.videoUrl]);
          }
        } else if (data.videoUrl) {
          setVideos([data.videoUrl]);
        }
        if (data.videoblogTitle) setContent(data);
      });
  }, []);

  if (videos.length === 0) return null;

  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const id = match && match[2].length === 11 ? match[2] : null;
    return id ? `https://www.youtube.com/embed/${id}` : null;
  };

  const mainEmbedUrl = getEmbedUrl(videos[0]);

  return (
    <section className="py-24 px-margin-desktop max-w-container-max mx-auto bg-background relative overflow-hidden" id="videoblog">
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-primary-fixed/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div className="max-w-xl space-y-4">
            <span className="text-primary-fixed font-label-md tracking-[0.3em] uppercase block">{content.videoblogSub}</span>
            <div className="flex flex-wrap items-center gap-4">
              <h2 className="font-display-lg text-4xl md:text-5xl">{content.videoblogTitle}</h2>
              <Link href="/videoblog" className="text-primary-fixed font-bold hover:underline mb-4">Всі відео →</Link>
            </div>
            <p className="text-secondary-fixed-dim text-lg">Показуємо внутрішню кухню складних проєктів та ділимося досвідом у форматі відео.</p>
          </div>
          <div className="h-px bg-outline-variant/30 flex-grow mx-8 mb-4 hidden md:block"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="aspect-video w-full max-w-5xl mx-auto rounded-xl overflow-hidden border border-outline-variant/20 shadow-2xl bg-surface-container relative group"
        >
          <div className="absolute inset-0 border-2 border-primary-fixed/0 group-hover:border-primary-fixed/40 transition-all duration-700 pointer-events-none z-20 rounded-xl"></div>
          
          {mainEmbedUrl ? (
            <iframe
              width="100%"
              height="100%"
              src={`${mainEmbedUrl}?modestbranding=1&rel=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="relative z-10 grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
            ></iframe>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-secondary-fixed-dim space-y-4">
              <span className="material-symbols-outlined text-6xl opacity-20">video_library</span>
              <p className="font-bold uppercase tracking-widest text-sm">Посилання на відео очікується</p>
            </div>
          )}
        </motion.div>

        {videos.length > 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 max-w-5xl mx-auto">
            {videos.slice(1).map((vidUrl, idx) => {
              const eUrl = getEmbedUrl(vidUrl);
              if (!eUrl) return null;
              return (
                <div key={idx} className="aspect-video w-full rounded-xl overflow-hidden border border-outline-variant/20 shadow-lg bg-surface-container relative group">
                  <div className="absolute inset-0 border-2 border-primary-fixed/0 group-hover:border-primary-fixed/40 transition-all duration-500 pointer-events-none z-20 rounded-xl"></div>
                  <iframe
                    width="100%"
                    height="100%"
                    src={`${eUrl}?modestbranding=1&rel=0`}
                    title={`YouTube video player ${idx + 2}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="relative z-10 grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
                  ></iframe>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default VideoBlog;
