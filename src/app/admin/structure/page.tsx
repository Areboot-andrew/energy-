"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Plus, Trash2, Globe, EyeOff, Eye } from "lucide-react";

export default function StructureSettingsPage() {
  const [content, setContent] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [navLinks, setNavLinks] = useState<any[]>([]);
  const [terminology, setTerminology] = useState<any>({});

  useEffect(() => {
    fetch("/api/content").then(res => res.json()).then(data => {
      if (data) {
        setContent(data);
        try { setNavLinks(JSON.parse(data.navLinks || "[]")); } catch { setNavLinks([]); }
        try { setTerminology(JSON.parse(data.terminology || "{}")); } catch { setTerminology({}); }
      }
    });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage("");

    try {
      const payload = {
        ...content,
        navLinks: JSON.stringify(navLinks),
        terminology: JSON.stringify(terminology),
      };

      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setMessage("✅ Зміни успішно збережено!");
      } else {
        setMessage("❌ Помилка збереження");
      }
    } catch (error) {
      setMessage("❌ Помилка збереження");
    }
    setIsSaving(false);
  };

  const blocks = [
    { id: "showHero", label: "Головний блок (Hero)" },
    { id: "showServices", label: "Послуги" },
    { id: "showHowWeWork", label: "Як ми працюємо" },
    { id: "showCalculator", label: "Калькулятор" },
    { id: "showPricing", label: "Ціни" },
    { id: "showPortfolio", label: "Портфоліо" },
    { id: "showVideoBlog", label: "Відеоблог" },
    { id: "showBlog", label: "Блог (Статті)" },
    { id: "showAbout", label: "Про нас" },
    { id: "showFAQ", label: "FAQ (Поширені питання)" },
    { id: "showContacts", label: "Контакти (Нижній блок)" },
  ];

  const adminMenuItems = [
    { key: "dashboard", default: "Дашборд" },
    { key: "structure", default: "Структура сайту" },
    { key: "homePage", default: "Головна" },
    { key: "aboutPage", default: "Про нас" },
    { key: "services", default: "Послуги" },
    { key: "howWeWork", default: "Як ми працюємо" },
    { key: "standards", default: "Стандарти" },
    { key: "faq", default: "FAQ" },
    { key: "portfolio", default: "Портфоліо" },
    { key: "blog", default: "Блог" },
    { key: "requests", default: "Заявки" },
    { key: "projects", default: "Проєкти Клієнтів" },
    { key: "prices", default: "Ціни" },
    { key: "settings", default: "Налаштування" },
  ];

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center bg-surface-container-low p-6 rounded-3xl border border-outline-variant/20 shadow-xl">
        <div>
          <h1 className="text-3xl font-display-sm font-bold text-white flex items-center gap-3">
            <Globe className="text-primary-fixed" size={32} />
            Структура та Термінологія
          </h1>
          <p className="text-secondary-fixed-dim mt-2">
            Тут ви можете приховати цілі блоки на головній сторінці, перейменувати пункти меню для клієнтів та змінити термінологію в адмін-панелі.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary-fixed text-on-primary-fixed px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-fixed-dim transition-colors shadow-[0_0_20px_rgba(213,240,0,0.2)] disabled:opacity-50"
        >
          <Save size={20} />
          {isSaving ? "Збереження..." : "Зберегти"}
        </button>
      </div>

      {message && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-surface-container rounded-xl text-white text-center">
          {message}
        </motion.div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Видимість блоків на головній */}
        <div className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/20">
          <h2 className="text-xl font-bold text-white mb-6 border-b border-outline-variant/20 pb-4">Блоки Головної Сторінки</h2>
          <div className="space-y-4">
            {blocks.map((block) => (
              <div key={block.id} className="flex justify-between items-center p-4 bg-background rounded-xl border border-outline-variant/30">
                <span className="text-white font-medium">{block.label}</span>
                <button 
                  onClick={() => setContent({ ...content, [block.id]: !content[block.id] })}
                  className={`w-14 h-8 rounded-full transition-colors flex items-center px-1 ${content[block.id] ? "bg-primary-fixed" : "bg-surface-container-highest"}`}
                >
                  <motion.div 
                    layout 
                    className="w-6 h-6 bg-black rounded-full" 
                    animate={{ x: content[block.id] ? 24 : 0 }} 
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Навігація (Header / Footer) */}
        <div className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/20">
          <div className="flex justify-between items-center mb-6 border-b border-outline-variant/20 pb-4">
            <h2 className="text-xl font-bold text-white">Меню Сайту (для клієнтів)</h2>
            <button 
              onClick={() => setNavLinks([...navLinks, { id: Date.now().toString(), label: "Новий пункт", href: "/", isVisible: true }])}
              className="text-primary-fixed hover:text-primary-fixed-dim flex items-center gap-1 text-sm font-bold"
            >
              <Plus size={16} /> Додати пункт
            </button>
          </div>
          <div className="space-y-3">
            {navLinks.map((link, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-3 p-4 bg-background rounded-xl border border-outline-variant/30 items-center">
                <div className="flex-1 w-full space-y-2">
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => {
                      const newLinks = [...navLinks];
                      newLinks[index].label = e.target.value;
                      setNavLinks(newLinks);
                    }}
                    placeholder="Назва (напр. Послуги)"
                    className="w-full bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 text-white text-sm"
                  />
                  <input
                    type="text"
                    value={link.href}
                    onChange={(e) => {
                      const newLinks = [...navLinks];
                      newLinks[index].href = e.target.value;
                      setNavLinks(newLinks);
                    }}
                    placeholder="Посилання (напр. /services)"
                    className="w-full bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 text-white text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      const newLinks = [...navLinks];
                      newLinks[index].isVisible = !newLinks[index].isVisible;
                      setNavLinks(newLinks);
                    }}
                    className={`p-2 rounded-lg transition-colors ${link.isVisible ? "bg-primary-fixed/20 text-primary-fixed" : "bg-surface-container-highest text-secondary-fixed-dim"}`}
                  >
                    {link.isVisible ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                  <button 
                    onClick={() => {
                      const newLinks = [...navLinks];
                      newLinks.splice(index, 1);
                      setNavLinks(newLinks);
                    }}
                    className="p-2 bg-error/10 text-error hover:bg-error hover:text-white rounded-lg transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8">
             <label className="text-sm font-bold uppercase text-secondary-fixed-dim block mb-2">Текст кнопки контактів (в меню)</label>
             <input
                type="text"
                value={content.contactButtonText || "Замовити дзвінок"}
                onChange={(e) => setContent({...content, contactButtonText: e.target.value})}
                className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none"
             />
          </div>
        </div>
      </div>

      {/* Термінологія в Адмін-панелі */}
      <div className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/20">
        <h2 className="text-xl font-bold text-white mb-6 border-b border-outline-variant/20 pb-4">Термінологія Адмін-панелі</h2>
        <p className="text-sm text-secondary-fixed-dim mb-6">
          Замініть назви пунктів бокового меню адмінки. Наприклад, якщо ваш бізнес не пов'язаний з Кошторисами, ви можете перейменувати пункт на "Інвойси".
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {adminMenuItems.map((item) => (
            <div key={item.key} className="space-y-1">
              <label className="text-xs font-bold text-secondary-fixed-dim uppercase">{item.default}</label>
              <input
                type="text"
                value={terminology[item.key] || ""}
                onChange={(e) => setTerminology({...terminology, [item.key]: e.target.value})}
                placeholder={item.default}
                className="w-full bg-background border border-outline-variant/30 rounded-lg px-3 py-2 text-white focus:border-primary-fixed outline-none text-sm"
              />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
