"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import * as LucideIcons from "lucide-react";

// Динамічний імпорт для уникнення помилок SSR з Quill
const RichEditor = dynamic(() => import("@/components/admin/RichEditor"), { ssr: false });

export default function AboutPageEditor() {
  const [content, setContent] = useState<any>({
    aboutPageSubtitle: "",
    aboutPageText: "",
    aboutValuesBlock: "[]",
    aboutStepsBlock: "[]",
  });
  const [loading, setLoading] = useState(false);
  
  const [aboutValues, setAboutValues] = useState<{icon: string, title: string, description: string}[]>([]);
  const [aboutSteps, setAboutSteps] = useState<{title: string, desc: string}[]>([]);

  useEffect(() => {
    fetch("/api/content").then(res => res.json()).then(data => {
      setContent(data);
      if (data.aboutValuesBlock) {
        try { setAboutValues(JSON.parse(data.aboutValuesBlock)); } catch(e) {}
      }
      if (data.aboutStepsBlock) {
        try { setAboutSteps(JSON.parse(data.aboutStepsBlock)); } catch(e) {}
      }
    });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const payload = {
      ...content,
      aboutValuesBlock: JSON.stringify(aboutValues),
      aboutStepsBlock: JSON.stringify(aboutSteps)
    };

    const res = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) alert("Сторінку 'Про нас' успішно оновлено!");
    else alert("Помилка при збереженні.");
    setLoading(false);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display-lg text-white tracking-tight mb-2">Сторінка "Про нас"</h1>
          <p className="text-secondary-fixed-dim">Керування текстом, цінностями та етапами на сторінці /about</p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-primary-fixed text-on-primary-fixed px-6 py-3 rounded-lg font-bold hover:shadow-[0_0_15px_rgba(213,240,0,0.3)] transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? "Збереження..." : "Зберегти зміни"}
        </button>
      </div>

      <div className="bg-surface-container border border-outline-variant/20 rounded-2xl p-6 md:p-8 space-y-8">
        
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white mb-2">Основний контент сторінки</h2>
          
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Підзаголовок сторінки</label>
            <input
              type="text"
              value={content.aboutPageSubtitle || ""}
              onChange={(e) => setContent((prev: any) => ({ ...prev, aboutPageSubtitle: e.target.value }))}
              placeholder="Наприклад: Ми створюємо нервову систему вашого будинку"
              className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Повний текст (Абзаци)</label>
            <div className="bg-background rounded-lg border border-outline-variant/30 text-white">
              <RichEditor
                value={content.aboutPageText || ""}
                onChange={(val) => setContent((prev: any) => ({ ...prev, aboutPageText: val }))}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t border-outline-variant/10">
          <h2 className="text-xl font-bold text-white mb-2">Блок: Наші цінності</h2>
          <p className="text-sm text-secondary-fixed-dim">Введіть назву іконки з бібліотеки Lucide (напр. Award, Shield, Target, Zap, Clock, Users).</p>
          
          {aboutValues.map((v, i) => (
            <div key={i} className="flex gap-4 p-4 border border-outline-variant/30 rounded-lg bg-background">
              <div className="flex flex-col gap-3 w-1/4">
                <input type="text" placeholder="Назва іконки (Award)" value={v.icon} onChange={(e) => { const nv = [...aboutValues]; nv[i].icon = e.target.value; setAboutValues(nv); }} className="w-full bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 text-white outline-none text-sm" />
                <div className="w-12 h-12 flex items-center justify-center bg-surface-container rounded-lg border border-outline-variant/30 text-primary-fixed">
                  {(() => { const IconComp = (LucideIcons as any)[v.icon] || LucideIcons.CheckCircle2; return <IconComp size={24} />; })()}
                </div>
              </div>
              <div className="flex flex-col gap-3 flex-grow">
                <input type="text" placeholder="Заголовок (напр. Хірургічна точність)" value={v.title} onChange={(e) => { const nv = [...aboutValues]; nv[i].title = e.target.value; setAboutValues(nv); }} className="w-full bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 text-white outline-none font-bold text-sm" />
                <textarea placeholder="Детальний опис цінності..." value={v.description} onChange={(e) => { const nv = [...aboutValues]; nv[i].description = e.target.value; setAboutValues(nv); }} className="w-full h-full min-h-[60px] bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 text-white outline-none resize-none text-sm"></textarea>
              </div>
              <button type="button" onClick={() => setAboutValues(aboutValues.filter((_, idx) => idx !== i))} className="px-4 bg-error/10 text-error hover:bg-error/20 rounded-lg font-bold transition-colors">X</button>
            </div>
          ))}
          <button type="button" onClick={() => setAboutValues([...aboutValues, {icon: "Star", title: "", description: ""}])} className="text-primary-fixed font-bold text-sm hover:underline flex items-center gap-2">
            <span className="text-xl">+</span> Додати цінність
          </button>
        </div>

        <div className="space-y-4 pt-6 border-t border-outline-variant/10">
          <h2 className="text-xl font-bold text-white mb-2">Блок: Етапи співпраці</h2>
          
          {aboutSteps.map((s, i) => (
            <div key={i} className="flex gap-4 p-4 border border-outline-variant/30 rounded-lg bg-background items-start">
              <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-black font-bold flex-shrink-0 text-lg shadow-[0_0_15px_rgba(213,240,0,0.3)]">{i + 1}</div>
              <div className="flex flex-col gap-3 flex-grow">
                <input type="text" placeholder="Заголовок етапу (напр. Консультація та аудит)" value={s.title} onChange={(e) => { const ns = [...aboutSteps]; ns[i].title = e.target.value; setAboutSteps(ns); }} className="w-full bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 text-white outline-none font-bold text-sm" />
                <textarea placeholder="Опис етапу..." value={s.desc} onChange={(e) => { const ns = [...aboutSteps]; ns[i].desc = e.target.value; setAboutSteps(ns); }} className="w-full min-h-[60px] bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 text-white outline-none resize-none text-sm"></textarea>
              </div>
              <button type="button" onClick={() => setAboutSteps(aboutSteps.filter((_, idx) => idx !== i))} className="px-4 py-4 bg-error/10 text-error hover:bg-error/20 rounded-lg font-bold transition-colors h-full">X</button>
            </div>
          ))}
          <button type="button" onClick={() => setAboutSteps([...aboutSteps, {title: "", desc: ""}])} className="text-primary-fixed font-bold text-sm hover:underline flex items-center gap-2">
            <span className="text-xl">+</span> Додати етап
          </button>
        </div>

      </div>
    </AdminLayout>
  );
}
