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

const SettingsPage = () => {
  const [basePrice, setBasePrice] = useState(7500);
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [newPrice, setNewPrice] = useState({ name: "", unit: "", price: "", isPublic: true });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/calculator-config")
      .then(res => res.json())
      .then(data => setBasePrice(data.basePerRoom));

    fetch("/api/prices")
      .then(res => res.json())
      .then(data => setPrices(data));
  }, []);

  const handleUpdateBasePrice = async () => {
    const res = await fetch("/api/calculator-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ basePerRoom: basePrice }),
    });
    if (res.ok) alert("Базову ціну оновлено!");
  };

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

  return (
    <AdminLayout>
      <div className="space-y-12">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Налаштування</h1>
          <p className="text-secondary-fixed-dim">Керування цінами та конфігурацією калькулятора.</p>
        </div>

        {/* Calculator Config */}
        <section className="bg-surface-container p-8 rounded-xl border border-outline-variant/20 space-y-6">
          <h2 className="text-xl font-bold text-white">Конфігурація калькулятора</h2>
          <div className="max-w-md space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-secondary-fixed-dim uppercase tracking-widest">Базова ціна за кімнату (₴)</label>
              <input
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(parseFloat(e.target.value))}
                className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none"
              />
            </div>
            <button
              onClick={handleUpdateBasePrice}
              className="bg-primary-fixed text-on-primary-fixed px-6 py-3 rounded-lg font-bold uppercase tracking-widest text-sm hover:shadow-[0_0_15px_rgba(213,240,0,0.2)] transition-all"
            >
              Зберегти базову ціну
            </button>
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

export default SettingsPage;
