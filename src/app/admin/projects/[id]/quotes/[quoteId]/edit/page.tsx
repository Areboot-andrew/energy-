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

  const handlePhotoUpload = async (file: File, groupId: string, itemId: string) => {
    if (file.size > 5 * 1024 * 1024) {
      alert("Файл занадто великий (макс 5 МБ)");
      return;
    }
    
    // Compress image
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;
    
    img.onload = async () => {
      URL.revokeObjectURL(objectUrl);
      const canvas = document.createElement("canvas");
      const MAX_WIDTH = 256;
      const MAX_HEIGHT = 256;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", { type: "image/jpeg" });
        
        const formData = new FormData();
        formData.append("file", compressedFile);
        
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData
        });
        
        if (res.ok) {
          const data = await res.json();
          updateItem(groupId, itemId, 'photoUrl', data.url);
        } else {
          alert("Помилка завантаження фото");
        }
      }, "image/jpeg", 0.7);
    };
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
                          <th className="py-3 px-2 w-[35%]">Найменування</th>
                          <th className="py-3 px-2 w-[10%]">Фото</th>
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
                                placeholder="Назва товару чи роботи"
                              />
                              <input 
                                className="w-full bg-transparent border border-outline-variant/10 rounded p-1.5 text-secondary-fixed-dim focus:text-white focus:border-primary-fixed outline-none text-xs italic"
                                value={item.description || ''}
                                onChange={e => updateItem(group.id, item.id, 'description', e.target.value)}
                                placeholder="Опис / Артикул (необов'язково)"
                              />
                            </td>
                            <td className="py-3 px-2">
                              <label className="cursor-pointer flex items-center justify-center w-12 h-12 bg-background border border-dashed border-outline-variant/30 rounded hover:border-primary-fixed transition-colors overflow-hidden relative group/upload">
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  accept="image/*"
                                  onChange={(e) => {
                                    if(e.target.files?.[0]) {
                                      handlePhotoUpload(e.target.files[0], group.id, item.id);
                                    }
                                  }}
                                />
                                {item.photoUrl ? (
                                  <>
                                    <img src={item.photoUrl} alt="item" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 hidden group-hover/upload:flex items-center justify-center">
                                      <UploadCloud size={16} className="text-white" />
                                    </div>
                                  </>
                                ) : (
                                  <ImageIcon size={16} className="text-secondary-fixed-dim" />
                                )}
                              </label>
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
