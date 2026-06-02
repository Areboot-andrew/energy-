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
  const [config, setConfig] = useState<any>({
    basePrice: 7500,
    sliderLabel: "Кількість кімнат",
    sliderMin: 1,
    sliderMax: 5,
    sliderStep: 1,
    sliderSuffix: " кімн.",
    packagesLabel: "Рівень інсталяції",
    packagesJson: "[{\"name\":\"Base\",\"multiplier\":1},{\"name\":\"Standard\",\"multiplier\":1.5},{\"name\":\"Premium\",\"multiplier\":2.5}]",
    resultLabel: "Орієнтовна вартість",
    resultPrefix: "від",
    resultCurrency: "₴"
  });
  const [packages, setPackages] = useState<{name: string, multiplier: number}[]>([]);
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [newPrice, setNewPrice] = useState({ name: "", unit: "", price: "", isPublic: true });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/calculator-config")
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        try {
          setPackages(JSON.parse(data.packagesJson || "[]"));
        } catch {
          setPackages([]);
        }
      });

    fetch("/api/prices")
      .then(res => res.json())
      .then(data => setPrices(data));
  }, []);

  const handleUpdateConfig = async () => {
    const dataToSave = {
      ...config,
      packagesJson: JSON.stringify(packages)
    };
    const res = await fetch("/api/calculator-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSave),
    });
    if (res.ok) alert("Налаштування калькулятора оновлено!");
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
          <div className="flex justify-between items-center border-b border-outline-variant/10 pb-4">
            <h2 className="text-xl font-bold text-white">Конфігурація калькулятора</h2>
            <button
              onClick={handleUpdateConfig}
              className="bg-primary-fixed text-on-primary-fixed px-6 py-3 rounded-lg font-bold uppercase tracking-widest text-sm hover:shadow-[0_0_15px_rgba(213,240,0,0.2)] transition-all"
            >
              Зберегти калькулятор
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-bold text-primary-fixed">Базові налаштування</h3>
              <div className="space-y-2">
                <label className="text-xs font-bold text-secondary-fixed-dim uppercase">Базова ціна (множник)</label>
                <input type="number" value={config.basePrice || 0} onChange={(e) => setConfig({ ...config, basePrice: e.target.value })} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-secondary-fixed-dim uppercase">Лейбл повзунка (Слайдера)</label>
                <input type="text" value={config.sliderLabel || ""} onChange={(e) => setConfig({ ...config, sliderLabel: e.target.value })} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-secondary-fixed-dim uppercase">Мін.</label>
                  <input type="number" value={config.sliderMin || 0} onChange={(e) => setConfig({ ...config, sliderMin: e.target.value })} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-secondary-fixed-dim uppercase">Макс.</label>
                  <input type="number" value={config.sliderMax || 0} onChange={(e) => setConfig({ ...config, sliderMax: e.target.value })} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-secondary-fixed-dim uppercase">Крок</label>
                  <input type="number" value={config.sliderStep || 0} onChange={(e) => setConfig({ ...config, sliderStep: e.target.value })} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-secondary-fixed-dim uppercase">Суфікс повзунка (напр. "од.")</label>
                <input type="text" value={config.sliderSuffix || ""} onChange={(e) => setConfig({ ...config, sliderSuffix: e.target.value })} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-primary-fixed">Результат</h3>
              <div className="space-y-2">
                <label className="text-xs font-bold text-secondary-fixed-dim uppercase">Текст "Орієнтовна вартість"</label>
                <input type="text" value={config.resultLabel || ""} onChange={(e) => setConfig({ ...config, resultLabel: e.target.value })} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-secondary-fixed-dim uppercase">Префікс (від)</label>
                  <input type="text" value={config.resultPrefix || ""} onChange={(e) => setConfig({ ...config, resultPrefix: e.target.value })} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-secondary-fixed-dim uppercase">Валюта (₴)</label>
                  <input type="text" value={config.resultCurrency || ""} onChange={(e) => setConfig({ ...config, resultCurrency: e.target.value })} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-outline-variant/10">
            <div className="space-y-2 mb-4">
              <label className="text-xs font-bold text-secondary-fixed-dim uppercase">Заголовок кнопок-пакетів</label>
              <input type="text" value={config.packagesLabel || ""} onChange={(e) => setConfig({ ...config, packagesLabel: e.target.value })} className="max-w-md w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none block" />
            </div>
            
            <h3 className="font-bold text-primary-fixed mb-4">Пакети (Опції)</h3>
            <div className="space-y-2">
              {packages.map((pkg, idx) => (
                <div key={idx} className="flex gap-2 items-center bg-background/50 p-2 rounded-lg border border-outline-variant/10">
                  <input type="text" placeholder="Назва пакету" value={pkg.name} onChange={(e) => {
                    const newPkgs = [...packages];
                    newPkgs[idx].name = e.target.value;
                    setPackages(newPkgs);
                  }} className="flex-grow bg-surface-container border border-outline-variant/30 rounded-lg px-4 py-2 text-white outline-none" />
                  <input type="number" step="0.1" placeholder="Множник (напр 1.5)" value={pkg.multiplier} onChange={(e) => {
                    const newPkgs = [...packages];
                    newPkgs[idx].multiplier = parseFloat(e.target.value) || 1;
                    setPackages(newPkgs);
                  }} className="w-32 bg-surface-container border border-outline-variant/30 rounded-lg px-4 py-2 text-white outline-none" />
                  <button onClick={() => setPackages(packages.filter((_, i) => i !== idx))} className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"><Trash2 size={20}/></button>
                </div>
              ))}
              <button onClick={() => setPackages([...packages, { name: "Новий пакет", multiplier: 1 }])} className="text-primary-fixed font-bold hover:underline flex items-center gap-1 mt-2 text-sm">
                <Plus size={16} /> Додати пакет
              </button>
            </div>
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
