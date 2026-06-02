"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import { useState, useEffect } from "react";
import { Plus, Trash2, Edit } from "lucide-react";

interface PriceItem {
  id: string;
  name: string;
  unit: string;
  price: number;
  isPublic?: boolean;
}

const PricesAdminPage = () => {
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [newPrice, setNewPrice] = useState({ name: "", unit: "", price: "", isPublic: true });
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [content, setContent] = useState<any>({});
  const [isSavingContent, setIsSavingContent] = useState(false);

  useEffect(() => {
    fetch("/api/prices")
      .then(res => res.json())
      .then(data => setPrices(data));
      
    fetch("/api/content")
      .then(res => res.json())
      .then(data => {
        if (data) setContent(data);
      });
  }, []);

  const handleSubmitPrice = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? "PATCH" : "POST";
    const url = editingId ? `/api/prices/${editingId}` : "/api/prices";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPrice),
    });

    if (res.ok) {
      const item = await res.json();
      if (editingId) {
        setPrices(prices.map(p => p.id === editingId ? item : p));
      } else {
        setPrices([...prices, item]);
      }
      setNewPrice({ name: "", unit: "", price: "", isPublic: true });
      setEditingId(null);
    }
  };

  const handleEdit = (item: PriceItem) => {
    setEditingId(item.id);
    setNewPrice({ name: item.name, unit: item.unit, price: item.price.toString(), isPublic: item.isPublic ?? true });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Ви видаляєте позицію з прайсу. Продовжити?")) return;
    
    const res = await fetch(`/api/prices/${id}`, {
      method: "DELETE",
    });
    
    if (res.ok) {
      setPrices(prices.filter(p => p.id !== id));
    }
  };

  const handleSaveContent = async () => {
    setIsSavingContent(true);
    try {
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          termService: content.termService,
          termUnit: content.termUnit,
          termPrice: content.termPrice,
          termPricingGuarantee: content.termPricingGuarantee,
          pricingSeoTitle: content.pricingSeoTitle,
          pricingSeoText: content.pricingSeoText
        })
      });
      alert('Тексти успішно збережено!');
    } catch (e) {
      alert('Помилка при збереженні');
    } finally {
      setIsSavingContent(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-12">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Налаштування прайсу</h1>
          <p className="text-secondary-fixed-dim">Керування детальним прайс-листом послуг та текстами сторінки Прайс.</p>
        </div>

        {/* Dictionary Texts for Pricing */}
        <section className="bg-surface-container p-8 rounded-xl border border-outline-variant/20 space-y-6">
          <div className="flex justify-between items-center border-b border-outline-variant/10 pb-4">
            <h2 className="text-xl font-bold text-white">Тексти сторінки "Прайси"</h2>
            <button 
              onClick={handleSaveContent} 
              disabled={isSavingContent}
              className="bg-primary-fixed text-on-primary-fixed px-6 py-2 rounded-lg font-bold hover:shadow-lg disabled:opacity-50 transition-all text-sm"
            >
              {isSavingContent ? "Збереження..." : "Зберегти тексти"}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Назва колонки "Послуга"</label>
                <input type="text" value={content.termService || ""} onChange={(e) => setContent({ ...content, termService: e.target.value })} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Назва колонки "Од. виміру"</label>
                <input type="text" value={content.termUnit || ""} onChange={(e) => setContent({ ...content, termUnit: e.target.value })} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Назва колонки "Ціна"</label>
                <input type="text" value={content.termPrice || ""} onChange={(e) => setContent({ ...content, termPrice: e.target.value })} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-outline-variant/10">
              <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Головний H1 заголовок сторінки Ціни (/pricing)</label>
              <input type="text" value={content.pricingSeoTitle || ""} onChange={(e) => setContent({ ...content, pricingSeoTitle: e.target.value })} placeholder="Наприклад: Повний прайс-лист на електромонтажні роботи" className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold uppercase text-secondary-fixed-dim">SEO Текст під прайсом</label>
              <textarea rows={4} value={content.pricingSeoText || ""} onChange={(e) => setContent({ ...content, pricingSeoText: e.target.value })} placeholder="Детальний опис для пошукових систем..." className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none resize-none"></textarea>
            </div>
            
          <div className="space-y-2 mt-4">
            <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Текст-гарантія під прайсом</label>
            <textarea rows={2} value={content.termPricingGuarantee || ""} onChange={(e) => setContent({ ...content, termPricingGuarantee: e.target.value })} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none resize-none" />
          </div>
        </section>

        {/* Pricing Items */}
        <section className="bg-surface-container p-8 rounded-xl border border-outline-variant/20 space-y-6">
          <h2 className="text-xl font-bold text-white">{editingId ? "Редагувати позицію" : "Прайс-лист послуг"}</h2>
          
          <form onSubmit={handleSubmitPrice} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-background/50 p-4 rounded-lg border border-outline-variant/10">
            <div className="space-y-2">
              <label className="text-xs font-bold text-secondary-fixed-dim uppercase tracking-widest">Послуга</label>
              <input
                type="text"
                required
                value={newPrice.name}
                onChange={(e) => setNewPrice({ ...newPrice, name: e.target.value })}
                className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-2 text-white text-sm focus:border-primary-fixed outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-secondary-fixed-dim uppercase tracking-widest">Одиниця</label>
              <input
                type="text"
                required
                value={newPrice.unit}
                onChange={(e) => setNewPrice({ ...newPrice, unit: e.target.value })}
                className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-2 text-white text-sm focus:border-primary-fixed outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-secondary-fixed-dim uppercase tracking-widest">Ціна (₴)</label>
              <input
                type="number"
                required
                value={newPrice.price}
                onChange={(e) => setNewPrice({ ...newPrice, price: e.target.value })}
                className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-2 text-white text-sm focus:border-primary-fixed outline-none"
              />
            </div>
            <div className="flex gap-2 items-end pb-1">
              <label className="flex items-center gap-2 text-white text-sm bg-surface-container-highest px-3 py-2 rounded-lg cursor-pointer h-[42px] border border-outline-variant/30 hover:border-primary-fixed/50 transition-colors">
                <input
                  type="checkbox"
                  checked={newPrice.isPublic}
                  onChange={(e) => setNewPrice({ ...newPrice, isPublic: e.target.checked })}
                  className="accent-primary-fixed w-4 h-4"
                />
                Публічно
              </label>
            </div>
            <div className="flex gap-2 col-span-1 md:col-span-4 mt-2">
              <button
                type="submit"
                className="flex-grow bg-primary-fixed text-black p-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_10px_rgba(213,240,0,0.2)] transition-all h-[42px]"
              >
                {editingId ? <Edit size={18} /> : <Plus size={18} />}
                <span>{editingId ? "Оновити" : "Додати"}</span>
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => { setEditingId(null); setNewPrice({ name: "", unit: "", price: "", isPublic: true }); }}
                  className="bg-surface-container-highest text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </form>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-outline-variant/20">
                  <th className="py-4 text-xs font-bold text-secondary-fixed-dim uppercase">Послуга</th>
                  <th className="py-4 text-xs font-bold text-secondary-fixed-dim uppercase">Одиниця</th>
                  <th className="py-4 text-xs font-bold text-secondary-fixed-dim uppercase text-center">Публічно</th>
                  <th className="py-4 text-xs font-bold text-secondary-fixed-dim uppercase text-right">Ціна (₴)</th>
                  <th className="py-4 text-xs font-bold text-secondary-fixed-dim uppercase text-right">Дії</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {prices.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 text-white font-medium">{item.name}</td>
                    <td className="py-4 text-secondary-fixed-dim">{item.unit}</td>
                    <td className="py-4 text-center">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${item.isPublic !== false ? 'bg-primary-fixed/20 text-primary-fixed' : 'bg-surface-container-highest text-secondary-fixed-dim'}`}>
                        {item.isPublic !== false ? 'Так' : 'Ні'}
                      </span>
                    </td>
                    <td className="py-4 text-right font-bold text-white">{item.price.toLocaleString()}</td>
                    <td className="py-4 text-right space-x-2">
                      <button 
                        onClick={() => handleEdit(item)}
                        className="text-secondary-fixed-dim hover:text-primary-fixed p-1 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="text-secondary-fixed-dim hover:text-error p-1 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
};

export default PricesAdminPage;
