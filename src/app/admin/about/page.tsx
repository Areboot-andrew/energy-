"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import * as LucideIcons from "lucide-react";
import IconPicker from "@/components/admin/IconPicker";
import ImageUploader from "@/components/admin/ImageUploader";

// Динамічний імпорт для уникнення помилок SSR з Quill
const RichEditor = dynamic(() => import("@/components/admin/RichEditor"), { ssr: false });

export default function AboutPageEditor() {
  const [content, setContent] = useState<any>({
    aboutHeroTitle1: "VOLT",
    aboutHeroTitle2: "PREMIUM",
    aboutPageCoverImage: "",
    aboutPageSubtitle: "",
    aboutPageText: "",
    aboutValuesTitle: "Наші цінності",
    aboutValuesSubtitle: "Ми не йдемо на компроміси, коли справа стосується якості та безпеки.",
    aboutStepsTitle: "Етапи співпраці",
    aboutStatsBlock: "[]",
    aboutValuesBlock: "[]",
    aboutStepsBlock: "[]",
  });
  const [loading, setLoading] = useState(false);
  
  const [aboutStats, setAboutStats] = useState<{number: string, label: string}[]>([]);
  const [aboutValues, setAboutValues] = useState<{icon: string, title: string, description: string}[]>([]);
  const [aboutSteps, setAboutSteps] = useState<{title: string, desc: string}[]>([]);

  useEffect(() => {
    fetch("/api/content").then(res => res.json()).then(data => {
      setContent(data);
      if (data.aboutStatsBlock) {
        try { setAboutStats(JSON.parse(data.aboutStatsBlock)); } catch(e) {}
      }
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
      aboutStatsBlock: JSON.stringify(aboutStats),
      aboutValuesBlock: JSON.stringify(aboutValues),
      aboutStepsBlock: JSON.stringify(aboutSteps),
      aboutSeoTitle: content.aboutSeoTitle,
      aboutSeoDescription: content.aboutSeoDescription
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
          <p className="text-secondary-fixed-dim">Керування банером, текстом, цінностями та етапами на сторінці /about</p>
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
        
        {/* Налаштування SEO */}
        <div className="space-y-4 pb-6 border-b border-outline-variant/10">
          <h2 className="text-xl font-bold text-white mb-2">Налаштування SEO (для пошукових систем)</h2>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-secondary-fixed-dim">SEO Заголовок (Title)</label>
            <input type="text" value={content.aboutSeoTitle || ""} onChange={(e) => setContent((prev: any) => ({ ...prev, aboutSeoTitle: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-secondary-fixed-dim">SEO Опис (Description)</label>
            <textarea rows={3} value={content.aboutSeoDescription || ""} onChange={(e) => setContent((prev: any) => ({ ...prev, aboutSeoDescription: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none resize-none"></textarea>
          </div>
        </div>

        {/* Головний Банер */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white mb-2">Головний банер (Заголовок та Фото)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Двоколірний заголовок (Частина 1 - Біла)</label>
              <input
                type="text"
                value={content.aboutHeroTitle1 || ""}
                onChange={(e) => setContent((prev: any) => ({ ...prev, aboutHeroTitle1: e.target.value }))}
                placeholder="Наприклад: VOLT"
                className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Двоколірний заголовок (Частина 2 - Жовта)</label>
              <input
                type="text"
                value={content.aboutHeroTitle2 || ""}
                onChange={(e) => setContent((prev: any) => ({ ...prev, aboutHeroTitle2: e.target.value }))}
                placeholder="Наприклад: PREMIUM"
                className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Фотографія банера</label>
            <ImageUploader
              value={content.aboutPageCoverImage || ""}
              onChange={(url) => setContent((prev: any) => ({ ...prev, aboutPageCoverImage: url }))}
            />
          </div>

          <div className="space-y-2 pt-4">
            <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Підзаголовок під головним заголовком</label>
            <input
              type="text"
              value={content.aboutPageSubtitle || ""}
              onChange={(e) => setContent((prev: any) => ({ ...prev, aboutPageSubtitle: e.target.value }))}
              placeholder="Наприклад: Ми створюємо нервову систему вашого будинку"
              className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none"
            />
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t border-outline-variant/10">
          <h2 className="text-xl font-bold text-white mb-2">Основний текст та Статистика</h2>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Повний текст (Абзаци)</label>
            <div className="bg-background rounded-lg border border-outline-variant/30 text-white">
              <RichEditor
                value={content.aboutPageText || ""}
                onChange={(val) => setContent((prev: any) => ({ ...prev, aboutPageText: val }))}
              />
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <label className="text-xs font-bold uppercase text-secondary-fixed-dim">3 Малі картки статистики під текстом</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {aboutStats.map((s, i) => (
                <div key={i} className="p-4 border border-outline-variant/30 rounded-lg bg-background flex flex-col gap-3">
                  <input type="text" placeholder="Цифра (напр. 10+)" value={s.number} onChange={(e) => { const ns = [...aboutStats]; ns[i].number = e.target.value; setAboutStats(ns); }} className="w-full bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 text-primary-fixed font-display-lg text-xl outline-none" />
                  <input type="text" placeholder="Підпис (напр. РОКІВ ДОСВІДУ)" value={s.label} onChange={(e) => { const ns = [...aboutStats]; ns[i].label = e.target.value; setAboutStats(ns); }} className="w-full bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 text-secondary-fixed-dim font-bold text-xs uppercase outline-none" />
                  <button type="button" onClick={() => setAboutStats(aboutStats.filter((_, idx) => idx !== i))} className="w-full py-2 bg-error/10 text-error hover:bg-error/20 rounded-lg font-bold transition-colors text-xs">Видалити</button>
                </div>
              ))}
            </div>
            {aboutStats.length < 3 && (
              <button type="button" onClick={() => setAboutStats([...aboutStats, {number: "", label: ""}])} className="text-primary-fixed font-bold text-sm hover:underline mt-2">
                + Додати картку статистики
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t border-outline-variant/10">
          <h2 className="text-xl font-bold text-white mb-2">Блок: Наші цінності</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Заголовок блоку цінностей</label>
              <input type="text" value={content.aboutValuesTitle} onChange={(e) => setContent((prev: any) => ({ ...prev, aboutValuesTitle: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
              <p className="text-xs text-secondary-fixed-dim mt-1">Використовуйте *зірочки*, щоб виділити слово жовтим кольором.</p>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Підзаголовок блоку цінностей</label>
              <input
                type="text"
                value={content.aboutValuesSubtitle || ""}
                onChange={(e) => setContent((prev: any) => ({ ...prev, aboutValuesSubtitle: e.target.value }))}
                className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none"
              />
            </div>
          </div>

          {aboutValues.map((v, i) => (
            <div key={i} className="flex flex-col md:flex-row gap-4 p-4 border border-outline-variant/30 rounded-lg bg-background">
              <div className="flex flex-col gap-3 w-full md:w-1/4">
                <div className="w-full z-10 relative">
                  <IconPicker 
                    value={v.icon}
                    onChange={(val) => {
                      const nv = [...aboutValues];
                      nv[i].icon = val;
                      setAboutValues(nv);
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3 flex-grow">
                <input type="text" placeholder="Заголовок (напр. Хірургічна точність)" value={v.title} onChange={(e) => { const nv = [...aboutValues]; nv[i].title = e.target.value; setAboutValues(nv); }} className="w-full bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 text-white outline-none font-bold text-sm" />
                <textarea placeholder="Детальний опис цінності..." value={v.description} onChange={(e) => { const nv = [...aboutValues]; nv[i].description = e.target.value; setAboutValues(nv); }} className="w-full h-full min-h-[60px] bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 text-white outline-none resize-none text-sm"></textarea>
              </div>
              <button type="button" onClick={() => setAboutValues(aboutValues.filter((_, idx) => idx !== i))} className="px-4 py-4 md:py-0 bg-error/10 text-error hover:bg-error/20 rounded-lg font-bold transition-colors">X</button>
            </div>
          ))}
          <button type="button" onClick={() => setAboutValues([...aboutValues, {icon: "Star", title: "", description: ""}])} className="text-primary-fixed font-bold text-sm hover:underline flex items-center gap-2">
            <span className="text-xl">+</span> Додати цінність
          </button>
        </div>

        <div className="space-y-4 pt-6 border-t border-outline-variant/10">
          <h2 className="text-xl font-bold text-white mb-2">Блок: Етапи співпраці</h2>

          <div className="space-y-2 mb-6">
            <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Заголовок блоку етапів</label>
            <input type="text" value={content.aboutStepsTitle} onChange={(e) => setContent((prev: any) => ({ ...prev, aboutStepsTitle: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
            <p className="text-xs text-secondary-fixed-dim mt-1">Використовуйте *зірочки*, щоб виділити слово жовтим кольором.</p>
          </div>
          
          {aboutSteps.map((s, i) => (
            <div key={i} className="flex flex-col md:flex-row gap-4 p-4 border border-outline-variant/30 rounded-lg bg-background items-start">
              <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-black font-bold flex-shrink-0 text-lg shadow-[0_0_15px_rgba(213,240,0,0.3)]">{i + 1}</div>
              <div className="flex flex-col gap-3 flex-grow w-full">
                <input type="text" placeholder="Заголовок етапу (напр. Консультація та аудит)" value={s.title} onChange={(e) => { const ns = [...aboutSteps]; ns[i].title = e.target.value; setAboutSteps(ns); }} className="w-full bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 text-white outline-none font-bold text-sm" />
                <textarea placeholder="Опис етапу..." value={s.desc} onChange={(e) => { const ns = [...aboutSteps]; ns[i].desc = e.target.value; setAboutSteps(ns); }} className="w-full min-h-[60px] bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 text-white outline-none resize-none text-sm"></textarea>
              </div>
              <button type="button" onClick={() => setAboutSteps(aboutSteps.filter((_, idx) => idx !== i))} className="px-4 py-4 md:py-0 md:h-full w-full md:w-auto bg-error/10 text-error hover:bg-error/20 rounded-lg font-bold transition-colors">X</button>
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
