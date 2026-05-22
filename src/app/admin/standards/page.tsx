"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import { useState, useEffect } from "react";
import { Save, Loader2, Plus, Trash2, Edit2 } from "lucide-react";
import IconPicker from "@/components/admin/IconPicker";

export default function StandardsAdminPage() {
  const [standards, setStandards] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "",
  });

  useEffect(() => {
    fetchStandards();
  }, []);

  const fetchStandards = async () => {
    const res = await fetch("/api/standards");
    if (res.ok) {
      const data = await res.json();
      setStandards(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const url = editingId ? `/api/standards/${editingId}` : "/api/standards";
    const method = editingId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("Збережено!");
      setFormData({ title: "", description: "", icon: "" });
      setEditingId(null);
      fetchStandards();
    } else {
      alert("Помилка збереження");
    }
    setLoading(false);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      description: item.description,
      icon: item.icon,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Ви впевнені?")) return;
    const res = await fetch(`/api/standards/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchStandards();
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ title: "", description: "", icon: "" });
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Стандарти якості</h1>
          <p className="text-secondary-fixed-dim">Управління пунктами стандартів.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-surface-container p-8 rounded-xl border border-outline-variant/20 h-fit">
            <h2 className="text-xl font-bold text-white border-b border-outline-variant/10 pb-4 mb-6">
              {editingId ? "Редагування стандарту" : "Новий стандарт"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Заголовок</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Іконка</label>
                <IconPicker
                  value={formData.icon}
                  onChange={(val) => setFormData({ ...formData, icon: val })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Опис</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none resize-none"
                ></textarea>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary-fixed text-on-primary-fixed py-3 rounded-lg font-bold flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                  Зберегти
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-surface-container-high text-white py-3 rounded-lg font-bold hover:bg-surface-container-highest"
                  >
                    Скасувати
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="space-y-4">
            {standards.map((item) => (
              <div key={item.id} className="bg-surface-container p-4 rounded-xl border border-outline-variant/20 flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(item)} className="p-2 text-primary-fixed hover:bg-primary-fixed/10 rounded-lg">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-error hover:bg-error/10 rounded-lg">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
            {standards.length === 0 && (
              <p className="text-secondary-fixed-dim text-center py-8">Немає доданих стандартів</p>
            )}
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}
