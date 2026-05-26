"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import { useState, useEffect } from "react";
import { Plus, Trash2, ArrowLeft, Save, Calculator, Image as ImageIcon, UploadCloud } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EditQuotePage({ params }: { params: { id: string, quoteId: string } }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [memoryItems, setMemoryItems] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/prices").then(res => res.json()).then(data => {
      if (Array.isArray(data)) setMemoryItems(data);
    }).catch(e => console.error("Memory fetch failed"));

    fetch(`/api/quotes/${params.quoteId}`)
      .then(res => res.json())
      .then(data => {
        setTitle(data.title);
        setGroups(data.groups);
        setLoading(false);
      });
  }, [params.quoteId]);

  const updateItem = (groupId: string, itemId: string, field: string, value: any) => {
    setGroups(prev => prev.map(group => {
      if (group.id !== groupId) return group;
      return {
        ...group,
        items: group.items.map((item: any) => {
          if (item.id !== itemId) return item;
          const updated = { ...item, [field]: value };
          
          if (field === 'name') {
            const found = memoryItems.find(m => m.name.toLowerCase() === value.toLowerCase());
            if (found) {
              updated.price = found.price;
              updated.unit = found.unit;
            }
          }

          if (field === 'quantity' || field === 'price') {
            updated.total = Number(updated.quantity) * Number(updated.price);
          } else {
            updated.total = Number(updated.quantity) * Number(updated.price);
          }
          return updated;
        })
      };
    }));
  };

  const addItem = (groupId: string) => {
    setGroups(prev => prev.map(group => {
      if (group.id !== groupId) return group;
      return {
        ...group,
        items: [...group.items, { id: crypto.randomUUID(), name: "", description: "", quantity: 1, unit: "шт", price: 0, total: 0, photoUrl: null }]
      };
    }));
  };

  const removeItem = (groupId: string, itemId: string) => {
    setGroups(prev => prev.map(group => {
      if (group.id !== groupId) return group;
      return { ...group, items: group.items.filter((i: any) => i.id !== itemId) };
    }));
  };

  const addGroup = () => {
    setGroups(prev => [
      ...prev,
      { id: crypto.randomUUID(), title: "Нова група", items: [] }
    ]);
  };

  const removeGroup = (groupId: string) => {
    setGroups(prev => prev.filter(g => g.id !== groupId));
  };

  const updateGroupTitle = (groupId: string, title: string) => {
    setGroups(prev => prev.map(g => g.id === groupId ? { ...g, title } : g));
  };

  const grandTotal = groups.reduce((sum, group) => {
    return sum + group.items.reduce((gSum: number, item: any) => gSum + item.total, 0);
  }, 0);

  const handleSave = async () => {
    setSaving(true);
    
    // Create new revision and archive old one, or just update?
    // Since we didn't make Quote editable directly in API, we can just POST a new quote and ARCHIVE the old one,
    // OR we create a PUT route. 
    // To save time, we can create a PUT /api/quotes/[id] endpoint.
    const res = await fetch(`/api/quotes/${params.quoteId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        totalAmount: grandTotal,
        groups
      })
    });
    
    if (res.ok) {
      router.push(`/admin/projects/${params.id}/quotes/${params.quoteId}`);
    } else {
      alert("Помилка збереження");
      setSaving(false);
    }
  };

  if (loading) return <AdminLayout><div className="text-white p-10">Завантаження...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6 pb-24">
        <datalist id="price-items-memory">
          {memoryItems.map(m => <option key={m.id} value={m.name} />)}
        </datalist>

        <Link href={`/admin/projects/${params.id}/quotes/${params.quoteId}`} className="inline-flex items-center gap-2 text-secondary-fixed-dim hover:text-white transition-colors mb-2 text-sm font-bold uppercase tracking-widest">
          <ArrowLeft size={16} /> Скасувати
        </Link>
        
        <h1 className="text-3xl font-bold text-white mb-8">Редагування Кошторису</h1>

        <div className="bg-surface-container border border-outline-variant/30 rounded-2xl p-6 shadow-2xl">
          <input 
            className="w-full bg-transparent border-b border-outline-variant/30 pb-4 text-2xl font-bold text-white focus:border-primary-fixed outline-none mb-8"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Назва кошторису"
          />

          <div className="space-y-12">
            {groups.map(group => {
              const groupTotal = group.items.reduce((sum: number, item: any) => sum + item.total, 0);
              
              return (
                <div key={group.id} className="space-y-4">
                  <div className="flex justify-between items-center bg-surface-container-highest p-4 rounded-xl border border-outline-variant/20">
                    <input 
                      className="bg-transparent text-xl font-bold text-primary-fixed outline-none flex-1"
                      value={group.title}
                      onChange={e => updateGroupTitle(group.id, e.target.value)}
                    />
                    <div className="flex items-center gap-6">
                      <span className="font-bold text-white">{groupTotal.toLocaleString()} ₴</span>
                      <button onClick={() => removeGroup(group.id)} className="text-secondary-fixed-dim hover:text-error transition-colors">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                      <thead>
                        <tr className="border-b border-outline-variant/20 text-secondary-fixed-dim text-xs uppercase tracking-widest">
                          <th className="py-3 px-2 w-[40%]">Найменування</th>
                          <th className="py-3 px-2 w-[15%]">Кіл-ть / Од.</th>
                          <th className="py-3 px-2 w-[15%]">Ціна (₴)</th>
                          <th className="py-3 px-2 w-[15%]">Сума (₴)</th>
                          <th className="py-3 px-2 w-[10%] text-center">Дія</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/10">
                        {group.items.map((item: any) => (
                          <tr key={item.id} className="group/row hover:bg-white/5 transition-colors">
                            <td className="py-3 px-2">
                              <input 
                                list="price-items-memory"
                                className="w-full bg-transparent border border-outline-variant/20 rounded p-2 text-white focus:border-primary-fixed outline-none text-sm mb-1"
                                value={item.name}
                                onChange={e => updateItem(group.id, item.id, 'name', e.target.value)}
                              />
                            </td>
                            <td className="py-3 px-2">
                              <div className="flex gap-2">
                                <input 
                                  type="number"
                                  className="w-16 bg-background border border-outline-variant/20 rounded p-2 text-white focus:border-primary-fixed outline-none text-sm"
                                  value={item.quantity}
                                  onChange={e => updateItem(group.id, item.id, 'quantity', e.target.value)}
                                />
                                <input 
                                  className="w-12 bg-background border border-outline-variant/20 rounded p-2 text-white focus:border-primary-fixed outline-none text-sm text-center"
                                  value={item.unit}
                                  onChange={e => updateItem(group.id, item.id, 'unit', e.target.value)}
                                />
                              </div>
                            </td>
                            <td className="py-3 px-2">
                              <input 
                                type="number"
                                className="w-full bg-background border border-outline-variant/20 rounded p-2 text-white focus:border-primary-fixed outline-none text-sm"
                                value={item.price}
                                onChange={e => updateItem(group.id, item.id, 'price', e.target.value)}
                              />
                            </td>
                            <td className="py-3 px-2">
                              <div className="font-bold text-white p-2">{item.total.toLocaleString()} ₴</div>
                            </td>
                            <td className="py-3 px-2 text-center">
                              <button onClick={() => removeItem(group.id, item.id)} className="p-2 text-secondary-fixed-dim hover:text-error transition-colors">
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button 
                    onClick={() => addItem(group.id)}
                    className="flex items-center gap-2 text-sm text-primary-fixed hover:bg-primary-fixed/10 px-3 py-2 rounded-lg transition-colors font-bold uppercase tracking-widest"
                  >
                    <Plus size={16} /> Додати рядок
                  </button>
                </div>
              );
            })}
          </div>

          <button 
            onClick={addGroup}
            className="mt-12 flex items-center gap-2 text-sm text-white bg-surface-container-highest hover:bg-white/10 px-4 py-3 rounded-lg border border-outline-variant/20 transition-colors font-bold uppercase tracking-widest w-full justify-center"
          >
            <Plus size={18} /> Додати нову групу (розділ)
          </button>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 md:left-72 right-0 bg-surface-container border-t border-outline-variant/30 p-4 shadow-2xl z-40 flex justify-between items-center">
        <div>
          <p className="text-secondary-fixed-dim text-xs font-bold uppercase tracking-widest">Загальна сума</p>
          <p className="text-2xl font-bold text-white">{grandTotal.toLocaleString()} ₴</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-primary-fixed text-on-primary-fixed px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:shadow-[0_0_30px_rgba(213,240,0,0.4)] transition-all flex items-center gap-2"
        >
          {saving ? "Збереження..." : <><Save size={20} /> Зберегти зміни</>}
        </button>
      </div>
    </AdminLayout>
  );
}
