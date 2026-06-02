"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import ImageUploader from "@/components/admin/ImageUploader";
import RichEditor from "@/components/admin/RichEditor";
import { useState, useEffect } from "react";
import { Save, Loader2, Globe, Instagram, Linkedin, Facebook, Phone, Mail } from "lucide-react";
import IconPicker from "@/components/admin/IconPicker";

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
    servicesTitle: "",
    servicesSub: "",
    portfolioTitle: "",
    pricingTitle: "",
    faqTitle: "",
    videoblogTitle: "",
    videoblogSub: "",
    blogTitle: "",
    metaTitle: "",
    metaDescription: "",
    aboutPageSubtitle: "",
    aboutPageText: "",
    aboutValuesBlock: "[]",
    aboutStepsBlock: "[]",
    heroButton1Text: "",
    heroButton2Text: "",
    servicesButtonText: "",
    howWeWorkBadge: "",
    howWeWorkTitle: "",
    howWeWorkSub: "",
    calculatorTitle: "",
    calculatorSub: "",
    calculatorButtonText: "",
    calcBasePrice: 0,
    calcSliderLabel: "",
    calcSliderMin: 0,
    calcSliderMax: 0,
    calcSliderStep: 0,
    calcSliderSuffix: "",
    calcPackagesLabel: "",
    calcPackagesJson: "",
    calcResultLabel: "",
    calcResultPrefix: "",
    calcResultCurrency: "",
    pricingSub: "",
    pricingButtonText: "",
    pricingPackagesJson: "",
    portfolioBadge: "",
    portfolioLinkText: "",
    videoblogLinkText: "",
    videoblogText: "",
    blogBadge: "",
    blogLinkText: "",
    faqBadge: "",
    contactsTitle: "",
    contactsSub: "",
    contactsButtonText: "",
    servicesPageCardLink: "",
    allVideosPageTitle: "",
    standardsPageTitle: "",
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-outline-variant/10">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Текст кнопки 1</label>
                  <input type="text" value={content.heroButton1Text || ""} onChange={(e) => setContent(prev => ({ ...prev, heroButton1Text: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Текст кнопки 2</label>
                  <input type="text" value={content.heroButton2Text || ""} onChange={(e) => setContent(prev => ({ ...prev, heroButton2Text: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
                </div>
              </div>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <div className="w-1/3">
                      <IconPicker 
                        value={b.icon} 
                        onChange={(val) => { const nb = [...bullets]; nb[i].icon = val; setBullets(nb); }} 
                      />
                    </div>
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


            </div>
          </section>

          {/* Services Section */}
          <section className="bg-surface-container p-8 rounded-xl border border-outline-variant/20 space-y-6">
            <h2 className="text-xl font-bold text-white border-b border-outline-variant/10 pb-4">Секція: Послуги</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Заголовок секції</label>
                <input type="text" value={content.servicesTitle || ""} onChange={(e) => setContent(prev => ({ ...prev, servicesTitle: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
                <p className="text-xs text-secondary-fixed-dim mt-1">Використовуйте *зірочки*, щоб виділити слово жовтим кольором (напр., Наші *послуги*).</p>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Підзаголовок</label>
                <input type="text" value={content.servicesSub || ""} onChange={(e) => setContent(prev => ({ ...prev, servicesSub: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
              </div>
            </div>
            <div className="space-y-2 pt-4 border-t border-outline-variant/10">
              <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Текст кнопки "Всі послуги"</label>
              <input type="text" value={content.servicesButtonText || ""} onChange={(e) => setContent(prev => ({ ...prev, servicesButtonText: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
            </div>
          </section>

          {/* How We Work Section */}
          <section className="bg-surface-container p-8 rounded-xl border border-outline-variant/20 space-y-6">
            <h2 className="text-xl font-bold text-white border-b border-outline-variant/10 pb-4">Секція: Як ми працюємо</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Бейдж (надпис над заголовком)</label>
                <input type="text" value={content.howWeWorkBadge || ""} onChange={(e) => setContent(prev => ({ ...prev, howWeWorkBadge: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Заголовок</label>
                <input type="text" value={content.howWeWorkTitle || ""} onChange={(e) => setContent(prev => ({ ...prev, howWeWorkTitle: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Підзаголовок</label>
                <textarea rows={2} value={content.howWeWorkSub || ""} onChange={(e) => setContent(prev => ({ ...prev, howWeWorkSub: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none resize-none" />
              </div>
            </div>
          </section>

          {/* Calculator Section */}
          <section className="bg-surface-container p-8 rounded-xl border border-outline-variant/20 space-y-6">
            <h2 className="text-xl font-bold text-white border-b border-outline-variant/10 pb-4">Секція: Калькулятор</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Заголовок</label>
                <input type="text" value={content.calculatorTitle || ""} onChange={(e) => setContent(prev => ({ ...prev, calculatorTitle: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Підзаголовок</label>
                <input type="text" value={content.calculatorSub || ""} onChange={(e) => setContent(prev => ({ ...prev, calculatorSub: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Текст кнопки</label>
                <input type="text" value={content.calculatorButtonText || ""} onChange={(e) => setContent(prev => ({ ...prev, calculatorButtonText: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
              </div>

              {/* Advanced Calculator Config from PageContent */}
              <div className="pt-6 border-t border-outline-variant/10">
                <h3 className="text-sm font-bold text-primary-fixed mb-4">Налаштування логіки калькулятора</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-secondary-fixed-dim uppercase">Базова ціна (множник)</label>
                      <input type="number" value={content.calcBasePrice || 0} onChange={(e) => setContent({ ...content, calcBasePrice: parseInt(e.target.value) })} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-secondary-fixed-dim uppercase">Лейбл повзунка</label>
                      <input type="text" value={content.calcSliderLabel || ""} onChange={(e) => setContent({ ...content, calcSliderLabel: e.target.value })} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-secondary-fixed-dim uppercase">Мін.</label>
                        <input type="number" value={content.calcSliderMin || 0} onChange={(e) => setContent({ ...content, calcSliderMin: parseInt(e.target.value) })} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-secondary-fixed-dim uppercase">Макс.</label>
                        <input type="number" value={content.calcSliderMax || 0} onChange={(e) => setContent({ ...content, calcSliderMax: parseInt(e.target.value) })} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-secondary-fixed-dim uppercase">Крок</label>
                        <input type="number" value={content.calcSliderStep || 0} onChange={(e) => setContent({ ...content, calcSliderStep: parseInt(e.target.value) })} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-secondary-fixed-dim uppercase">Суфікс повзунка (напр. "од.")</label>
                      <input type="text" value={content.calcSliderSuffix || ""} onChange={(e) => setContent({ ...content, calcSliderSuffix: e.target.value })} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-secondary-fixed-dim uppercase">Заголовок кнопок-пакетів</label>
                      <input type="text" value={content.calcPackagesLabel || ""} onChange={(e) => setContent({ ...content, calcPackagesLabel: e.target.value })} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-secondary-fixed-dim uppercase">Текст "Орієнтовна вартість"</label>
                      <input type="text" value={content.calcResultLabel || ""} onChange={(e) => setContent({ ...content, calcResultLabel: e.target.value })} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-secondary-fixed-dim uppercase">Префікс (від)</label>
                        <input type="text" value={content.calcResultPrefix || ""} onChange={(e) => setContent({ ...content, calcResultPrefix: e.target.value })} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-secondary-fixed-dim uppercase">Валюта (₴)</label>
                        <input type="text" value={content.calcResultCurrency || ""} onChange={(e) => setContent({ ...content, calcResultCurrency: e.target.value })} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-secondary-fixed-dim uppercase">Варіанти вибору (множники калькулятора)</label>
                  <div className="space-y-2 bg-background/50 p-4 rounded-xl border border-outline-variant/10">
                    {(() => {
                      let packages = [];
                      try { packages = JSON.parse(content.calcPackagesJson || "[]"); } catch (e) {}
                      return (
                        <>
                          {packages.map((pkg: any, index: number) => (
                            <div key={index} className="flex gap-2 items-center">
                              <input 
                                type="text" 
                                placeholder="Назва (напр. Стандарт)" 
                                value={pkg.name} 
                                onChange={(e) => {
                                  const newPackages = [...packages];
                                  newPackages[index].name = e.target.value;
                                  setContent({ ...content, calcPackagesJson: JSON.stringify(newPackages) });
                                }} 
                                className="flex-1 bg-background border border-outline-variant/30 rounded-lg px-3 py-2 text-white focus:border-primary-fixed outline-none text-sm" 
                              />
                              <input 
                                type="number" 
                                step="0.1"
                                placeholder="Множник (напр. 1.2)" 
                                value={pkg.multiplier} 
                                onChange={(e) => {
                                  const newPackages = [...packages];
                                  newPackages[index].multiplier = parseFloat(e.target.value) || 1;
                                  setContent({ ...content, calcPackagesJson: JSON.stringify(newPackages) });
                                }} 
                                className="w-24 bg-background border border-outline-variant/30 rounded-lg px-3 py-2 text-white focus:border-primary-fixed outline-none text-sm" 
                              />
                              <button 
                                type="button" 
                                onClick={() => {
                                  const newPackages = packages.filter((_: any, i: number) => i !== index);
                                  setContent({ ...content, calcPackagesJson: JSON.stringify(newPackages) });
                                }} 
                                className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                              >
                                <span className="material-symbols-outlined text-sm">delete</span>
                              </button>
                            </div>
                          ))}
                          <button 
                            type="button" 
                            onClick={() => {
                              const newPackages = [...packages, { name: "Новий пункт", multiplier: 1 }];
                              setContent({ ...content, calcPackagesJson: JSON.stringify(newPackages) });
                            }} 
                            className="mt-2 text-primary-fixed text-sm font-bold flex items-center gap-1 hover:underline"
                          >
                            <span className="material-symbols-outlined text-sm">add</span> Додати пункт
                          </button>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Portfolio Section */}
          <section className="bg-surface-container p-8 rounded-xl border border-outline-variant/20 space-y-6">
            <h2 className="text-xl font-bold text-white border-b border-outline-variant/10 pb-4">Секція: Портфоліо</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Бейдж (напр. Галерея)</label>
                  <input type="text" value={content.portfolioBadge || ""} onChange={(e) => setContent(prev => ({ ...prev, portfolioBadge: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Текст лінка (напр. Всі проєкти)</label>
                  <input type="text" value={content.portfolioLinkText || ""} onChange={(e) => setContent(prev => ({ ...prev, portfolioLinkText: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Головний заголовок секції</label>
                <input type="text" value={content.portfolioTitle || ""} onChange={(e) => setContent(prev => ({ ...prev, portfolioTitle: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
                <p className="text-xs text-secondary-fixed-dim mt-1">Використовуйте *зірочки*, щоб виділити слово жовтим кольором (напр., Усі *проєкти*).</p>
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
                <p className="text-xs text-secondary-fixed-dim mt-1">Використовуйте *зірочки*, щоб виділити слово жовтим кольором (напр., Прозоре *ціноутворення*).</p>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Підзаголовок</label>
                <textarea rows={2} value={content.pricingSub || ""} onChange={(e) => setContent(prev => ({ ...prev, pricingSub: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none resize-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Текст кнопки "Прайс-лист"</label>
                <input type="text" value={content.pricingButtonText || ""} onChange={(e) => setContent(prev => ({ ...prev, pricingButtonText: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
              </div>
              <div className="space-y-4 pt-4 border-t border-outline-variant/10">
                <label className="text-xs font-bold text-secondary-fixed-dim uppercase">Картки тарифів на головній</label>
                <div className="space-y-4 bg-background/50 p-4 rounded-xl border border-outline-variant/10">
                  {(() => {
                    let pPackages = [];
                    try { pPackages = JSON.parse(content.pricingPackagesJson || "[]"); } catch (e) {}
                    return (
                      <>
                        {pPackages.map((pkg: any, index: number) => (
                          <div key={index} className="space-y-3 p-4 bg-surface-container rounded-lg border border-outline-variant/20 relative">
                            <button 
                              type="button" 
                              onClick={() => {
                                const newPackages = pPackages.filter((_: any, i: number) => i !== index);
                                setContent({ ...content, pricingPackagesJson: JSON.stringify(newPackages) });
                              }} 
                              className="absolute top-2 right-2 p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-[10px] text-secondary-fixed-dim uppercase mb-1 block">Назва тарифу</label>
                                <input 
                                  type="text" 
                                  value={pkg.title || ""} 
                                  onChange={(e) => {
                                    const newPackages = [...pPackages];
                                    newPackages[index].title = e.target.value;
                                    setContent({ ...content, pricingPackagesJson: JSON.stringify(newPackages) });
                                  }} 
                                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-3 py-2 text-white outline-none text-sm" 
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-secondary-fixed-dim uppercase mb-1 block">Ціна (рядок)</label>
                                <input 
                                  type="text" 
                                  value={pkg.price || ""} 
                                  onChange={(e) => {
                                    const newPackages = [...pPackages];
                                    newPackages[index].price = e.target.value;
                                    setContent({ ...content, pricingPackagesJson: JSON.stringify(newPackages) });
                                  }} 
                                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-3 py-2 text-white outline-none text-sm" 
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-[10px] text-secondary-fixed-dim uppercase mb-1 flex items-center justify-between">
                                <span>Перелік послуг</span>
                                <button 
                                  type="button"
                                  onClick={() => {
                                    const newPackages = [...pPackages];
                                    if (!newPackages[index].features) newPackages[index].features = [];
                                    newPackages[index].features.push("Нова послуга");
                                    setContent({ ...content, pricingPackagesJson: JSON.stringify(newPackages) });
                                  }}
                                  className="text-primary-fixed hover:underline"
                                >
                                  + додати рядок
                                </button>
                              </label>
                              <div className="space-y-2 mt-2">
                                {(pkg.features || []).map((feat: string, featIndex: number) => (
                                  <div key={featIndex} className="flex gap-2">
                                    <input 
                                      type="text" 
                                      value={feat} 
                                      onChange={(e) => {
                                        const newPackages = [...pPackages];
                                        newPackages[index].features[featIndex] = e.target.value;
                                        setContent({ ...content, pricingPackagesJson: JSON.stringify(newPackages) });
                                      }} 
                                      className="flex-1 bg-background border border-outline-variant/30 rounded-lg px-3 py-2 text-white outline-none text-sm" 
                                    />
                                    <button 
                                      type="button" 
                                      onClick={() => {
                                        const newPackages = [...pPackages];
                                        newPackages[index].features = newPackages[index].features.filter((_: any, fI: number) => fI !== featIndex);
                                        setContent({ ...content, pricingPackagesJson: JSON.stringify(newPackages) });
                                      }}
                                      className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                                    >
                                      <span className="material-symbols-outlined text-sm">close</span>
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                        <button 
                          type="button" 
                          onClick={() => {
                            const newPackages = [...pPackages, { title: "Новий тариф", price: "від 100 ₴", features: ["Послуга 1"] }];
                            setContent({ ...content, pricingPackagesJson: JSON.stringify(newPackages) });
                          }} 
                          className="mt-2 text-primary-fixed text-sm font-bold flex items-center gap-1 hover:underline"
                        >
                          <span className="material-symbols-outlined text-sm">add</span> Додати тариф
                        </button>
                      </>
                    );
                  })()}
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
                <p className="text-xs text-secondary-fixed-dim mt-1">Використовуйте *зірочки*, щоб виділити слово жовтим кольором.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Підзаголовок</label>
                  <input type="text" value={content.videoblogSub || ""} onChange={(e) => setContent(prev => ({ ...prev, videoblogSub: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Текст лінка (Всі відео)</label>
                  <input type="text" value={content.videoblogLinkText || ""} onChange={(e) => setContent(prev => ({ ...prev, videoblogLinkText: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Короткий опис</label>
                  <input type="text" value={content.videoblogText || ""} onChange={(e) => setContent(prev => ({ ...prev, videoblogText: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
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
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-secondary-fixed-dim">FAQ - Бейдж</label>
                  <input type="text" value={content.faqBadge || ""} onChange={(e) => setContent(prev => ({ ...prev, faqBadge: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-secondary-fixed-dim">FAQ - Заголовок</label>
                  <input type="text" value={content.faqTitle || ""} onChange={(e) => setContent(prev => ({ ...prev, faqTitle: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Блог - Бейдж</label>
                  <input type="text" value={content.blogBadge || ""} onChange={(e) => setContent(prev => ({ ...prev, blogBadge: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Блог - Заголовок</label>
                  <input type="text" value={content.blogTitle || ""} onChange={(e) => setContent(prev => ({ ...prev, blogTitle: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Блог - Текст лінка</label>
                  <input type="text" value={content.blogLinkText || ""} onChange={(e) => setContent(prev => ({ ...prev, blogLinkText: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
                </div>
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
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Заголовок Секції Контактів</label>
                  <input type="text" value={content.contactsTitle || ""} onChange={(e) => setContent(prev => ({ ...prev, contactsTitle: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Текст кнопки</label>
                  <input type="text" value={content.contactsButtonText || ""} onChange={(e) => setContent(prev => ({ ...prev, contactsButtonText: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Підзаголовок</label>
                <textarea rows={2} value={content.contactsSub || ""} onChange={(e) => setContent(prev => ({ ...prev, contactsSub: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none resize-none" />
              </div>
            </div>
          </section>


          {/* Dedicated Pages Titles */}
          <section className="bg-surface-container p-8 rounded-xl border border-outline-variant/20 space-y-6">
            <h2 className="text-xl font-bold text-white border-b border-outline-variant/10 pb-4">Заголовки Окремих Сторінок</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Всі послуги (Кнопка на картці)</label>
                <input type="text" value={content.servicesPageCardLink || ""} onChange={(e) => setContent(prev => ({ ...prev, servicesPageCardLink: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Всі відео</label>
                <input type="text" value={content.allVideosPageTitle || ""} onChange={(e) => setContent(prev => ({ ...prev, allVideosPageTitle: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Стандарти якості</label>
                <input type="text" value={content.standardsPageTitle || ""} onChange={(e) => setContent(prev => ({ ...prev, standardsPageTitle: e.target.value }))} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
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
