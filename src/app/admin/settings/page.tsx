"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import { useState, useEffect } from "react";
import { Save, Plus, Trash2, Image as ImageIcon, Code, Type } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import dynamic from "next/dynamic";
import IconPicker from "@/components/admin/IconPicker";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/content")
      .then(res => res.json())
      .then(data => {
        // Parse JSON strings
        try { data.phones = JSON.parse(data.phones || "[]"); } catch { data.phones = []; }
        try { data.socials = JSON.parse(data.socials || "[]"); } catch { data.socials = []; }
        try { data.pricingFeatures = JSON.parse(data.pricingFeatures || "[]"); } catch { data.pricingFeatures = []; }
        setSettings(data);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...settings,
      phones: JSON.stringify(settings.phones || []),
      socials: JSON.stringify(settings.socials || []),
      pricingFeatures: JSON.stringify(settings.pricingFeatures || [])
    };

    const res = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    
    setSaving(false);
    if (res.ok) {
      alert("Налаштування успішно збережено!");
    } else {
      alert("Помилка збереження.");
    }
  };

  if (!settings) return <AdminLayout><div className="p-8 text-white">Завантаження...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Глобальні Налаштування</h1>
            <p className="text-secondary-fixed-dim">Керування логотипом, контактами та загальним контентом.</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-primary-fixed text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-fixed-dim transition-colors disabled:opacity-50"
          >
            <Save size={20} />
            {saving ? "Збереження..." : "Зберегти зміни"}
          </button>
        </div>

        <div className="flex gap-4 border-b border-outline-variant/20 pb-4 overflow-x-auto">
          {[
            { id: "general", label: "Загальні (Лого)" },
            { id: "contacts", label: "Контакти та Карта" },
            { id: "socials", label: "Соціальні мережі" },
            { id: "pricing", label: "Блок Прайс-листа" },
            { id: "seo", label: "SEO та Аналітика" }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-6 py-3 rounded-full font-bold whitespace-nowrap transition-colors ${activeTab === t.id ? "bg-primary-fixed text-black" : "bg-surface-container text-white hover:bg-surface-container-highest"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "general" && (
          <div className="space-y-8">
            <section className="bg-surface-container p-8 rounded-xl border border-outline-variant/20 space-y-6">
              <h2 className="text-xl font-bold text-white mb-6">Логотип та Назва сайту</h2>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-secondary-fixed-dim uppercase">Назва компанії (SEO та Текст)</label>
                <input
                  type="text"
                  value={settings.companyName || ""}
                  onChange={e => setSettings({...settings, companyName: e.target.value})}
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none"
                />
              </div>

              <div className="space-y-4 pt-4">
                <label className="text-sm font-bold text-secondary-fixed-dim uppercase">Тип Логотипу</label>
                <div className="flex gap-4">
                  {[
                    { id: "TEXT", icon: <Type size={18} />, label: "Текстовий" },
                    { id: "IMAGE", icon: <ImageIcon size={18} />, label: "Зображення" },
                    { id: "SVG", icon: <Code size={18} />, label: "SVG-код" }
                  ].map(type => (
                    <button
                      key={type.id}
                      onClick={() => setSettings({...settings, logoType: type.id})}
                      className={`flex-1 py-4 flex items-center justify-center gap-2 rounded-xl border ${settings.logoType === type.id ? "border-primary-fixed bg-primary-fixed/10 text-primary-fixed font-bold" : "border-outline-variant/30 bg-background text-secondary-fixed-dim hover:bg-white/5"}`}
                    >
                      {type.icon}
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {settings.logoType === "TEXT" && (
                <div className="space-y-2 animate-in fade-in">
                  <label className="text-sm font-bold text-secondary-fixed-dim uppercase">Текст логотипу</label>
                  <input
                    type="text"
                    value={settings.logoText || ""}
                    onChange={e => setSettings({...settings, logoText: e.target.value})}
                    className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none"
                  />
                </div>
              )}

              {settings.logoType === "IMAGE" && (
                <div className="space-y-2 animate-in fade-in">
                  <label className="text-sm font-bold text-secondary-fixed-dim uppercase">Завантажити Зображення</label>
                  <ImageUploader
                    label="Логотип (зображення)"
                    value={settings.logoImageUrl}
                    onChange={(url: string) => setSettings({...settings, logoImageUrl: url})}
                  />
                </div>
              )}

              {settings.logoType === "SVG" && (
                <div className="space-y-2 animate-in fade-in">
                  <label className="text-sm font-bold text-secondary-fixed-dim uppercase">SVG-код логотипу (разом з тегом &lt;svg&gt;)</label>
                  <textarea
                    rows={6}
                    value={settings.logoSvgCode || ""}
                    onChange={e => setSettings({...settings, logoSvgCode: e.target.value})}
                    className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none font-mono text-sm"
                  />
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab === "contacts" && (
          <div className="space-y-8">
            <section className="bg-surface-container p-8 rounded-xl border border-outline-variant/20 space-y-6">
              <h2 className="text-xl font-bold text-white mb-6">Контактні дані</h2>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-secondary-fixed-dim uppercase">Favicon (квадратне лого для вкладки)</label>
                <ImageUploader
                  value={settings.faviconUrl || ""}
                  onChange={(url) => setSettings({ ...settings, faviconUrl: url })}
                />
              </div>
              <div className="space-y-2 pt-4 border-t border-outline-variant/10">
                <label className="text-sm font-bold text-secondary-fixed-dim uppercase">Словник: Текст "Повернутися на головну"</label>
                <input
                  type="text"
                  value={settings.termBackToHome || ""}
                  onChange={(e) => setSettings({ ...settings, termBackToHome: e.target.value })}
                  className="w-full bg-background border border-outline-variant/30 rounded-xl px-4 py-3 text-white focus:border-primary-fixed outline-none"
                />
                <p className="text-xs text-secondary-fixed-dim">Використовується на різних сторінках для повернення на головну.</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-secondary-fixed-dim uppercase">Email адреса</label>
                <input
                  type="email"
                  value={settings.contactEmail || ""}
                  onChange={e => setSettings({...settings, contactEmail: e.target.value})}
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none"
                />
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex justify-between items-end">
                  <label className="text-sm font-bold text-secondary-fixed-dim uppercase">Номери телефонів</label>
                  <button 
                    onClick={() => setSettings({...settings, phones: [...(settings.phones || []), ""]})}
                    className="text-primary-fixed hover:text-white transition-colors flex items-center gap-1 text-sm font-bold"
                  >
                    <Plus size={16} /> Додати номер
                  </button>
                </div>
                
                {(settings.phones || []).map((phone: string, idx: number) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={phone}
                      onChange={e => {
                        const newPhones = [...settings.phones];
                        newPhones[idx] = e.target.value;
                        setSettings({...settings, phones: newPhones});
                      }}
                      className="flex-grow bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none"
                      placeholder="+38 (000) 000-00-00"
                    />
                    <button 
                      onClick={() => {
                        const newPhones = settings.phones.filter((_:any, i:number) => i !== idx);
                        setSettings({...settings, phones: newPhones});
                      }}
                      className="bg-surface-container-highest p-3 rounded-lg text-error hover:bg-error hover:text-white transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4">
                <label className="text-sm font-bold text-secondary-fixed-dim uppercase">Фізична адреса (Офіс)</label>
                <input
                  type="text"
                  value={settings.contactAddress || ""}
                  onChange={e => setSettings({...settings, contactAddress: e.target.value})}
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-secondary-fixed-dim uppercase">Google Картинка (Iframe код з Google Maps)</label>
                <textarea
                  rows={4}
                  value={settings.contactMapIframe || ""}
                  onChange={e => setSettings({...settings, contactMapIframe: e.target.value})}
                  placeholder='<iframe src="https://www.google.com/maps/embed?..." ...></iframe>'
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none font-mono text-sm"
                />
              </div>
            </section>
          </div>
        )}

        {activeTab === "socials" && (
          <section className="bg-surface-container p-8 rounded-xl border border-outline-variant/20 space-y-6">
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-xl font-bold text-white">Соціальні мережі</h2>
              <button 
                onClick={() => setSettings({...settings, socials: [...(settings.socials || []), { network: "viber", url: "", isVisible: true }]})}
                className="bg-primary-fixed text-black px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-primary-fixed-dim"
              >
                <Plus size={16} /> Додати соцмережу
              </button>
            </div>

            <div className="space-y-4">
              {(settings.socials || []).map((social: any, idx: number) => (
                <div key={idx} className="flex flex-wrap md:flex-nowrap gap-4 bg-background p-4 rounded-xl border border-outline-variant/30">
                  <div className="w-full md:w-1/4">
                    <label className="text-xs text-secondary-fixed-dim font-bold uppercase mb-1 block">Мережа (назва/іконка)</label>
                    <input
                      type="text"
                      value={social.network}
                      onChange={e => {
                        const newS = [...settings.socials];
                        newS[idx].network = e.target.value.toLowerCase();
                        setSettings({...settings, socials: newS});
                      }}
                      className="w-full bg-surface-container border border-outline-variant/30 rounded-lg px-4 py-2 text-white outline-none"
                      placeholder="instagram, facebook, telegram..."
                    />
                  </div>
                  <div className="w-full md:w-1/2">
                    <label className="text-xs text-secondary-fixed-dim font-bold uppercase mb-1 block">Посилання (URL)</label>
                    <input
                      type="url"
                      value={social.url}
                      onChange={e => {
                        const newS = [...settings.socials];
                        newS[idx].url = e.target.value;
                        setSettings({...settings, socials: newS});
                      }}
                      className="w-full bg-surface-container border border-outline-variant/30 rounded-lg px-4 py-2 text-white outline-none"
                    />
                  </div>
                  <div className="w-full md:w-auto flex items-end gap-4">
                    <label className="flex items-center gap-2 cursor-pointer pb-2">
                      <input
                        type="checkbox"
                        checked={social.isVisible}
                        onChange={e => {
                          const newS = [...settings.socials];
                          newS[idx].isVisible = e.target.checked;
                          setSettings({...settings, socials: newS});
                        }}
                        className="w-5 h-5 accent-primary-fixed rounded cursor-pointer"
                      />
                      <span className="text-white text-sm font-bold">Показувати</span>
                    </label>
                    <button 
                      onClick={() => {
                        const newS = settings.socials.filter((_:any, i:number) => i !== idx);
                        setSettings({...settings, socials: newS});
                      }}
                      className="bg-surface-container-highest p-2 rounded-lg text-error hover:bg-error hover:text-white transition-colors mb-1"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "pricing" && (
          <section className="bg-surface-container p-8 rounded-xl border border-outline-variant/20 space-y-6">
            <h2 className="text-xl font-bold text-white">Чому обирають нас? (Сторінка Цін)</h2>
            <p className="text-secondary-fixed-dim mb-6">Редагування 3-х карток переваг на сторінці прайс-листа.</p>

            <div className="space-y-6">
              {(settings.pricingFeatures || []).map((feature: any, idx: number) => (
                <div key={idx} className="bg-background p-6 rounded-xl border border-outline-variant/30 space-y-4 relative group">
                  <div className="absolute top-4 right-4 text-outline-variant/50 font-bold text-4xl pointer-events-none group-hover:text-primary-fixed/20 transition-colors">
                    {idx + 1}
                  </div>
                  
                  <div className="w-full md:w-1/3 z-10 relative">
                    <label className="text-xs text-secondary-fixed-dim font-bold uppercase mb-1 block">Іконка (Lucide)</label>
                    <IconPicker 
                      value={feature.icon}
                      onChange={(val) => {
                        const newF = [...settings.pricingFeatures];
                        newF[idx].icon = val;
                        setSettings({...settings, pricingFeatures: newF});
                      }}
                    />
                  </div>
                  <div className="w-full z-10 relative">
                    <label className="text-xs text-secondary-fixed-dim font-bold uppercase mb-1 block">Заголовок</label>
                    <input
                      type="text"
                      value={feature.title}
                      onChange={e => {
                        const newF = [...settings.pricingFeatures];
                        newF[idx].title = e.target.value;
                        setSettings({...settings, pricingFeatures: newF});
                      }}
                      className="w-full bg-surface-container border border-outline-variant/30 rounded-lg px-4 py-2 text-white outline-none font-bold text-lg"
                    />
                  </div>
                  <div className="w-full z-10 relative">
                    <label className="text-xs text-secondary-fixed-dim font-bold uppercase mb-1 block">Опис</label>
                    <textarea
                      rows={3}
                      value={feature.description}
                      onChange={e => {
                        const newF = [...settings.pricingFeatures];
                        newF[idx].description = e.target.value;
                        setSettings({...settings, pricingFeatures: newF});
                      }}
                      className="w-full bg-surface-container border border-outline-variant/30 rounded-lg px-4 py-2 text-white outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "seo" && (
          <div className="space-y-8">
            <section className="bg-surface-container p-8 rounded-xl border border-outline-variant/20 space-y-6">
              <h2 className="text-xl font-bold text-white mb-6">SEO та Аналітика (Google)</h2>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-secondary-fixed-dim uppercase">Google Analytics ID (G-XXXXXXX)</label>
                <input
                  type="text"
                  value={settings.googleAnalyticsId || ""}
                  onChange={e => setSettings({...settings, googleAnalyticsId: e.target.value})}
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none"
                  placeholder="G-..."
                />
                <p className="text-xs text-secondary-fixed-dim mt-1">Введіть ваш ідентифікатор Google Analytics для відстеження відвідуваності сайту.</p>
              </div>

              <div className="space-y-2 pt-4">
                <label className="text-sm font-bold text-secondary-fixed-dim uppercase">Google Site Verification</label>
                <input
                  type="text"
                  value={settings.googleSiteVerification || ""}
                  onChange={e => setSettings({...settings, googleSiteVerification: e.target.value})}
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none"
                  placeholder="Код з мета-тегу..."
                />
                <p className="text-xs text-secondary-fixed-dim mt-1">Використовується для підтвердження прав на сайт у Google Search Console.</p>
              </div>
            </section>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default SettingsPage;
