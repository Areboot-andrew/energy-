"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import ImageUploader from "@/components/admin/ImageUploader";
import RichEditor from "@/components/admin/RichEditor";
import { useState, useEffect } from "react";
import { Save, Loader2, Globe, Instagram, Linkedin, Facebook, Phone, Mail } from "lucide-react";

const PageEditor = () => {
  const [content, setContent] = useState({
    heroTitle: "",
    heroBadgeText: "",
    heroSub: "",
    heroImage: "",
    aboutTitle: "",
    aboutText: "",
    aboutImage: "",
    aboutBadgeNumber: "",
    aboutBadgeText: "",
    aboutBullets: "[]",
    videoUrl: "",
    videos: "[]",
    instagram: "",
    linkedin: "",
    facebook: "",
    contactPhone: "",
    contactEmail: "",
    servicesTitle: "",
    servicesSub: "",
    portfolioTitle: "",
    pricingTitle: "",
    faqTitle: "",
    videoblogTitle: "",
    videoblogSub: "",
    blogTitle: "",
    pricingSeoTitle: "",
    pricingSeoText: "",
    portfolioSeoTitle: "",
    portfolioSeoText: "",
    portfolioVideoUrl: "",
    metaTitle: "",
    metaDescription: "",
    aboutPageSubtitle: "",
    aboutPageText: "",
    aboutValuesBlock: "[]",
    aboutStepsBlock: "[]",
  });
  const [loading, setLoading] = useState(false);

  const [bullets, setBullets] = useState<{icon: string, text: string}[]>([]);
  const [videoList, setVideoList] = useState<string[]>([]);
  const [aboutValues, setAboutValues] = useState<{icon: string, title: string, description: string}[]>([]);
  const [aboutSteps, setAboutSteps] = useState<{title: string, desc: string}[]>([]);

  useEffect(() => {
    fetch("/api/content").then(res => res.json()).then(data => {
      setContent(data);
      if (data.aboutBullets) {
        try { setBullets(JSON.parse(data.aboutBullets)); } catch(e) {}
      }
      if (data.videos) {
        try { setVideoList(JSON.parse(data.videos)); } catch(e) {}
      }
      if (data.aboutValuesBlock) {
        try { setAboutValues(JSON.parse(data.aboutValuesBlock)); } catch(e) {}
      }
      if (data.aboutStepsBlock) {
        try { setAboutSteps(JSON.parse(data.aboutStepsBlock)); } catch(e) {}
      }
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
      ...content,
      aboutBullets: JSON.stringify(bullets),
      videos: JSON.stringify(videoList),
      aboutValuesBlock: JSON.stringify(aboutValues),
      aboutStepsBlock: JSON.stringify(aboutSteps)
    };

    const res = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) alert("Зміни збережено!");
    setLoading(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Редагування сторінки</h1>
          <p className="text-secondary-fixed-dim">Зміна текстів та медіа-контенту головної сторінки.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-8 pb-20">
          {/* Hero Section */}
          <section className="bg-surface-container p-8 rounded-xl border border-outline-variant/20 space-y-6">
            <h2 className="text-xl font-bold text-white border-b border-outline-variant/10 pb-4">Головний екран (Hero)</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Значок (Бейдж) над заголовком</label>
                <input
                  type="text"
                  value={content.heroBadgeText || ""}
                  onChange={(e) => setContent(prev => ({ ...prev, heroBadgeText: e.target.value }))}
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Заголовок</label>
                <input
                  type="text"
                  value={content.heroTitle || ""}
                  onChange={(e) => setContent(prev => ({ ...prev, heroTitle: e.target.value }))}
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Підзаголовок / Опис (Rich Text)</label>
                <div className="bg-background rounded-lg border border-outline-variant/30 text-white">
                  <RichEditor
                    value={content.heroSub}
                    onChange={(val) => setContent(prev => ({ ...prev, heroSub: val }))}
                    placeholder="Напишіть тут текст..."
                  />
                </div>
              </div>
              <ImageUploader
                label="Головне зображення"
                value={content.heroImage}
                onChange={(url) => setContent(prev => ({ ...prev, heroImage: url }))}
              />
            </div>
          </section>

          {/* About Section */}
          <section className="bg-surface-container p-8 rounded-xl border border-outline-variant/20 space-y-6">
            <h2 className="text-xl font-bold text-white border-b border-outline-variant/10 pb-4">Про нас</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Заголовок секції</label>
                <input
                  type="text"
                  value={content.aboutTitle || ""}
                  onChange={(e) => setContent(prev => ({ ...prev, aboutTitle: e.target.value }))}
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Текст опису (Rich Text)</label>
                <div className="bg-background rounded-lg border border-outline-variant/30 text-white">
                  <RichEditor
                    value={content.aboutText || ""}
                    onChange={(val) => setContent(prev => ({ ...prev, aboutText: val }))}
                    placeholder="Напишіть тут текст..."
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Значок: Цифра (напр. 10+)</label>
                  <input
                    type="text"
                    value={content.aboutBadgeNumber || ""}
                    onChange={(e) => setContent(prev => ({ ...prev, aboutBadgeNumber: e.target.value }))}
                    className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Значок: Текст (напр. Років досвіду)</label>
                  <input
                    type="text"
                    value={content.aboutBadgeText || ""}
                    onChange={(e) => setContent(prev => ({ ...prev, aboutBadgeText: e.target.value }))}
                    className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-outline-variant/10">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Список переваг (Буліти)</label>
                {bullets.map((b, i) => (
                  <div key={i} className="flex gap-2">
                    <input type="text" placeholder="Іконка (SVG або Material name)" value={b.icon} onChange={(e) => { const nb = [...bullets]; nb[i].icon = e.target.value; setBullets(nb); }} className="w-1/3 bg-background border border-outline-variant/30 rounded-lg px-3 py-2 text-white outline-none" />
                    <input type="text" placeholder="Текст переваги" value={b.text} onChange={(e) => { const nb = [...bullets]; nb[i].text = e.target.value; setBullets(nb); }} className="flex-grow bg-background border border-outline-variant/30 rounded-lg px-3 py-2 text-white outline-none" />
                    <button type="button" onClick={() => setBullets(bullets.filter((_, idx) => idx !== i))} className="px-3 bg-error/20 text-error rounded-lg">X</button>
                  </div>
                ))}
                <button type="button" onClick={() => setBullets([...bullets, {icon: "check", text: ""}])} className="text-primary-fixed font-bold text-sm hover:underline">+ Додати пункт</button>
              </div>
              <ImageUploader
                label="Зображення про нас"
                value={content.aboutImage}
                onChange={(url) => setContent(prev => ({ ...prev, aboutImage: url }))}
              />

              <h3 className="text-sm font-bold text-secondary-fixed-dim uppercase pt-6 border-t border-outline-variant/10">Повна сторінка "Про нас" (/about)</h3>
              
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Підзаголовок сторінки</label>
                <input
                  type="text"
                  value={content.aboutPageSubtitle || ""}
                  onChange={(e) => setContent(prev => ({ ...prev, aboutPageSubtitle: e.target.value }))}
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Основний текст сторінки (Rich Text)</label>
                <div className="bg-background rounded-lg border border-outline-variant/30 text-white">
                  <RichEditor
                    value={content.aboutPageText || ""}
                    onChange={(val) => setContent(prev => ({ ...prev, aboutPageText: val }))}
                  />
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Блок: Наші цінності</label>
                {aboutValues.map((v, i) => (
                  <div key={i} className="flex gap-2 mb-2 p-3 border border-outline-variant/30 rounded-lg bg-background">
                    <input type="text" placeholder="Lucide Icon (e.g. Award)" value={v.icon} onChange={(e) => { const nv = [...aboutValues]; nv[i].icon = e.target.value; setAboutValues(nv); }} className="w-1/4 bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 text-white outline-none text-xs" />
                    <input type="text" placeholder="Заголовок" value={v.title} onChange={(e) => { const nv = [...aboutValues]; nv[i].title = e.target.value; setAboutValues(nv); }} className="w-1/4 bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 text-white outline-none text-xs" />
                    <textarea placeholder="Опис" value={v.description} onChange={(e) => { const nv = [...aboutValues]; nv[i].description = e.target.value; setAboutValues(nv); }} className="w-2/4 bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 text-white outline-none resize-none text-xs"></textarea>
                    <button type="button" onClick={() => setAboutValues(aboutValues.filter((_, idx) => idx !== i))} className="px-3 bg-error/20 text-error rounded-lg">X</button>
                  </div>
                ))}
                <button type="button" onClick={() => setAboutValues([...aboutValues, {icon: "Star", title: "", description: ""}])} className="text-primary-fixed font-bold text-sm hover:underline">+ Додати цінність</button>
              </div>

              <div className="space-y-2 pt-4">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Блок: Етапи співпраці</label>
                {aboutSteps.map((s, i) => (
                  <div key={i} className="flex gap-2 mb-2 p-3 border border-outline-variant/30 rounded-lg bg-background">
                    <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-black font-bold flex-shrink-0">{i + 1}</div>
                    <input type="text" placeholder="Заголовок етапу" value={s.title} onChange={(e) => { const ns = [...aboutSteps]; ns[i].title = e.target.value; setAboutSteps(ns); }} className="w-1/3 bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 text-white outline-none text-xs" />
                    <textarea placeholder="Опис етапу" value={s.desc} onChange={(e) => { const ns = [...aboutSteps]; ns[i].desc = e.target.value; setAboutSteps(ns); }} className="w-full bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 text-white outline-none resize-none text-xs"></textarea>
                    <button type="button" onClick={() => setAboutSteps(aboutSteps.filter((_, idx) => idx !== i))} className="px-3 bg-error/20 text-error rounded-lg">X</button>
                  </div>
                ))}
                <button type="button" onClick={() => setAboutSteps([...aboutSteps, {title: "", desc: ""}])} className="text-primary-fixed font-bold text-sm hover:underline">+ Додати етап</button>
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section className="bg-surface-container p-8 rounded-xl border border-outline-variant/20 space-y-6">
            <h2 className="text-xl font-bold text-white border-b border-outline-variant/10 pb-4">Секція: Послуги</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Заголовок секції</label>
                <input type="text" value={content.servicesTitle || ""} onChange={(e) => setContent(prev => ({ ...prev, servicesTitle: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Підзаголовок</label>
                <input type="text" value={content.servicesSub || ""} onChange={(e) => setContent(prev => ({ ...prev, servicesSub: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
              </div>
            </div>
          </section>

          {/* Portfolio Section */}
          <section className="bg-surface-container p-8 rounded-xl border border-outline-variant/20 space-y-6">
            <h2 className="text-xl font-bold text-white border-b border-outline-variant/10 pb-4">Секція: Портфоліо</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Головний заголовок секції</label>
                <input type="text" value={content.portfolioTitle || ""} onChange={(e) => setContent(prev => ({ ...prev, portfolioTitle: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
              </div>
              
              <div className="pt-4 border-t border-outline-variant/10 space-y-4">
                <h3 className="text-sm font-bold text-secondary-fixed-dim uppercase">SEO Опис під галереєю</h3>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-secondary-fixed-dim">SEO Заголовок</label>
                  <input type="text" value={content.portfolioSeoTitle || ""} onChange={(e) => setContent(prev => ({ ...prev, portfolioSeoTitle: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-secondary-fixed-dim">SEO Текст (Rich Text)</label>
                  <div className="bg-background rounded-lg border border-outline-variant/30 text-white">
                    <RichEditor value={content.portfolioSeoText || ""} onChange={(val) => setContent(prev => ({ ...prev, portfolioSeoText: val }))} placeholder="SEO текст для розділу портфоліо..." />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section className="bg-surface-container p-8 rounded-xl border border-outline-variant/20 space-y-6">
            <h2 className="text-xl font-bold text-white border-b border-outline-variant/10 pb-4">Секція: Ціни</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Головний заголовок секції</label>
                <input type="text" value={content.pricingTitle || ""} onChange={(e) => setContent(prev => ({ ...prev, pricingTitle: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
              </div>
              
              <div className="pt-4 border-t border-outline-variant/10 space-y-4">
                <h3 className="text-sm font-bold text-secondary-fixed-dim uppercase">SEO Опис під цінами</h3>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-secondary-fixed-dim">SEO Заголовок</label>
                  <input type="text" value={content.pricingSeoTitle || ""} onChange={(e) => setContent(prev => ({ ...prev, pricingSeoTitle: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-secondary-fixed-dim">SEO Текст (Rich Text)</label>
                  <div className="bg-background rounded-lg border border-outline-variant/30 text-white">
                    <RichEditor value={content.pricingSeoText || ""} onChange={(val) => setContent(prev => ({ ...prev, pricingSeoText: val }))} placeholder="SEO текст для розділу цін..." />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Video Blog Section */}
          <section className="bg-surface-container p-8 rounded-xl border border-outline-variant/20 space-y-6">
            <h2 className="text-xl font-bold text-white border-b border-outline-variant/10 pb-4">Секція: Відеоблог</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Заголовок секції</label>
                  <input type="text" value={content.videoblogTitle || ""} onChange={(e) => setContent(prev => ({ ...prev, videoblogTitle: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Підзаголовок</label>
                  <input type="text" value={content.videoblogSub || ""} onChange={(e) => setContent(prev => ({ ...prev, videoblogSub: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
                </div>
              </div>
              <div className="space-y-2 pt-4">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Список відео (YouTube URLs)</label>
                {videoList.map((url, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={url}
                      onChange={(e) => { const nl = [...videoList]; nl[i] = e.target.value; setVideoList(nl); }}
                      className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-2 text-white focus:border-primary-fixed outline-none"
                    />
                    <button type="button" onClick={() => setVideoList(videoList.filter((_, idx) => idx !== i))} className="px-4 bg-error/20 text-error rounded-lg">Видалити</button>
                  </div>
                ))}
                <button type="button" onClick={() => setVideoList([...videoList, ""])} className="text-primary-fixed font-bold text-sm hover:underline">+ Додати ще одне відео</button>
              </div>
            </div>
          </section>

          {/* FAQ & Blog Section */}
          <section className="bg-surface-container p-8 rounded-xl border border-outline-variant/20 space-y-6">
            <h2 className="text-xl font-bold text-white border-b border-outline-variant/10 pb-4">Секції: FAQ та Блог</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">FAQ - Заголовок</label>
                <input type="text" value={content.faqTitle || ""} onChange={(e) => setContent(prev => ({ ...prev, faqTitle: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Блог - Заголовок</label>
                <input type="text" value={content.blogTitle || ""} onChange={(e) => setContent(prev => ({ ...prev, blogTitle: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
              </div>
            </div>
          </section>

          {/* Global SEO */}
          <section className="bg-surface-container p-8 rounded-xl border border-outline-variant/20 space-y-6">
            <h2 className="text-xl font-bold text-white border-b border-outline-variant/10 pb-4">Глобальне SEO (Головна сторінка)</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Головний Meta Title</label>
                <input
                  type="text"
                  value={content.metaTitle || ""}
                  onChange={(e) => setContent(prev => ({ ...prev, metaTitle: e.target.value }))}
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Головний Meta Description</label>
                <textarea
                  rows={3}
                  value={content.metaDescription || ""}
                  onChange={(e) => setContent(prev => ({ ...prev, metaDescription: e.target.value }))}
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none resize-none"
                ></textarea>
              </div>
            </div>
          </section>

          {/* Contacts & Socials */}
          <section className="bg-surface-container p-8 rounded-xl border border-outline-variant/20 space-y-6">
            <h2 className="text-xl font-bold text-white border-b border-outline-variant/10 pb-4">Контакти та Соцмережі (Футер)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-secondary-fixed-dim uppercase border-b border-outline-variant/10 pb-2">Контакти</h3>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-secondary-fixed-dim flex items-center gap-2"><Phone size={14}/> Телефон</label>
                  <input type="text" value={content.contactPhone || ""} onChange={(e) => setContent(prev => ({ ...prev, contactPhone: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" placeholder="+38 (000) 000-00-00" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-secondary-fixed-dim flex items-center gap-2"><Mail size={14}/> Email</label>
                  <input type="text" value={content.contactEmail || ""} onChange={(e) => setContent(prev => ({ ...prev, contactEmail: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" placeholder="info@..." />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-secondary-fixed-dim uppercase border-b border-outline-variant/10 pb-2">Соцмережі (посилання)</h3>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-secondary-fixed-dim flex items-center gap-2"><Instagram size={14}/> Instagram</label>
                  <input type="text" value={content.instagram || ""} onChange={(e) => setContent(prev => ({ ...prev, instagram: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" placeholder="https://instagram.com/..." />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-secondary-fixed-dim flex items-center gap-2"><Facebook size={14}/> Facebook</label>
                  <input type="text" value={content.facebook || ""} onChange={(e) => setContent(prev => ({ ...prev, facebook: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" placeholder="https://facebook.com/..." />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-secondary-fixed-dim flex items-center gap-2"><Linkedin size={14}/> LinkedIn</label>
                  <input type="text" value={content.linkedin || ""} onChange={(e) => setContent(prev => ({ ...prev, linkedin: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" placeholder="https://linkedin.com/..." />
                </div>
              </div>
            </div>
          </section>

          <div className="fixed bottom-8 right-8 left-64 md:left-[304px] z-50 px-8">
             <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-fixed text-on-primary-fixed py-5 rounded-xl font-bold text-lg uppercase tracking-widest hover:shadow-[0_0_30px_rgba(213,240,0,0.5)] transition-all flex items-center justify-center gap-3 border-4 border-background"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Save />}
              Зберегти всі зміни на сайті
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default PageEditor;
