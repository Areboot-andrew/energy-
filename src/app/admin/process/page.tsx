"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Save, X } from "lucide-react";
import * as LucideIcons from "lucide-react";
import IconPicker from "@/components/admin/IconPicker";

interface WorkStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

const ProcessAdmin = () => {
  const [items, setItems] = useState<WorkStep[]>([]);
  const [newItem, setNewItem] = useState({ title: "", description: "", icon: "", order: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<WorkStep | null>(null);

  useEffect(() => {
    fetch("/api/process").then(res => res.json()).then(data => setItems(data));
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/process", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    });
    if (res.ok) {
      const item = await res.json();
      setItems([...items, item].sort((a, b) => a.order - b.order));
      setNewItem({ title: "", description: "", icon: "", order: 0 });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Ви впевнені, що хочете видалити цей етап?")) return;
    const res = await fetch(`/api/process/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const startEdit = (item: WorkStep) => {
    setEditingId(item.id);
    setEditItem({ ...item });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditItem(null);
  };

  const handleSaveEdit = async () => {
    if (!editItem) return;
    const res = await fetch(`/api/process/${editItem.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editItem),
    });
    if (res.ok) {
      const updated = await res.json();
      setItems(items.map(item => (item.id === updated.id ? updated : item)).sort((a, b) => a.order - b.order));
      setEditingId(null);
      setEditItem(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Як ми працюємо (Процес)</h1>
          <p className="text-secondary-fixed-dim">Керування етапами роботи.</p>
        </div>

        <form onSubmit={handleAdd} className="bg-surface-container p-6 rounded-xl border border-outline-variant/20 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Назва</label>
            <input
              type="text"
              required
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-2 text-white"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Опис</label>
            <input
              type="text"
              required
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-2 text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Іконка (Lucide)</label>
            <div className="w-full">
              <IconPicker
                value={newItem.icon}
                onChange={(val) => setNewItem({ ...newItem, icon: val })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Порядок (Сортування)</label>
            <input
              type="number"
              required
              value={newItem.order}
              onChange={(e) => setNewItem({ ...newItem, order: parseInt(e.target.value) || 0 })}
              className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-2 text-white"
            />
          </div>
          <button type="submit" className="bg-primary-fixed text-on-primary-fixed p-2 rounded-lg font-bold flex items-center justify-center gap-2 h-10 md:col-span-3">
            <Plus size={20} /> Додати етап
          </button>
        </form>

        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-surface-container p-6 rounded-xl border border-outline-variant/20 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              {editingId === item.id ? (
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
                  <input
                    type="text"
                    value={editItem?.title}
                    onChange={(e) => setEditItem({ ...editItem!, title: e.target.value })}
                    className="bg-background border border-outline-variant/30 rounded-lg px-4 py-2 text-white"
                  />
                  <input
                    type="text"
                    value={editItem?.description}
                    onChange={(e) => setEditItem({ ...editItem!, description: e.target.value })}
                    className="md:col-span-2 bg-background border border-outline-variant/30 rounded-lg px-4 py-2 text-white"
                  />
                  <div className="bg-background border border-outline-variant/30 rounded-lg w-full">
                    <IconPicker
                      value={editItem?.icon || ""}
                      onChange={(val) => setEditItem({ ...editItem!, icon: val })}
                    />
                  </div>
                  <input
                    type="number"
                    value={editItem?.order}
                    onChange={(e) => setEditItem({ ...editItem!, order: parseInt(e.target.value) || 0 })}
                    className="bg-background border border-outline-variant/30 rounded-lg px-4 py-2 text-white"
                  />
                </div>
              ) : (
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-8 h-8 flex items-center justify-center text-primary-fixed">
                      {(() => { const IconComp = (LucideIcons as any)[item.icon] || LucideIcons.CheckCircle2; return <IconComp size={24} />; })()}
                    </div>
                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                    <span className="bg-surface-container-highest px-2 py-1 rounded text-xs text-secondary-fixed-dim">Order: {item.order}</span>
                  </div>
                  <p className="text-secondary-fixed-dim">{item.description}</p>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                {editingId === item.id ? (
                  <>
                    <button onClick={handleSaveEdit} className="p-2 text-primary-fixed bg-primary-fixed/10 rounded-lg hover:bg-primary-fixed/20">
                      <Save size={20} />
                    </button>
                    <button onClick={cancelEdit} className="p-2 text-error bg-error/10 rounded-lg hover:bg-error/20">
                      <X size={20} />
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(item)} className="p-2 text-primary-fixed bg-primary-fixed/10 rounded-lg hover:bg-primary-fixed/20">
                      <Edit2 size={20} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-error bg-error/10 rounded-lg hover:bg-error/20">
                      <Trash2 size={20} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProcessAdmin;
