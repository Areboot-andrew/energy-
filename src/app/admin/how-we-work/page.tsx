"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import { useState, useEffect } from "react";
import { Save, Loader2, Trash2, Edit2 } from "lucide-react";
import RichEditor from "@/components/admin/RichEditor";
import IconPicker from "@/components/admin/IconPicker";

export default function HowWeWorkAdminPage() {
  const [steps, setSteps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "",
    order: "0",
  });

  useEffect(() => {
    fetchSteps();
  }, []);

  const fetchSteps = async () => {
    const res = await fetch("/api/work-steps");
    if (res.ok) {
      const data = await res.json();
      setSteps(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const url = editingId ? `/api/work-steps/${editingId}` : "/api/work-steps";
    const method = editingId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, order: parseInt(formData.order) }),
    });

    if (res.ok) {
      alert("Збережено!");
      setFormData({ title: "", description: "", icon: "", order: "0" });
      setEditingId(null);
      fetchSteps();
    } else {
      alert("Помилка збереження");
    }
    setLoading(false);
  };

  const handleEdit = (step: any) => {
    setEditingId(step.id);
    setFormData({
      title: step.title,
      description: step.description,
      icon: step.icon,
      order: String(step.order),
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Ви впевнені?")) return;
    const res = await fetch(`/api/work-steps/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchSteps();
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ title: "", description: "", icon: "", order: "0" });
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Як ми працюємо</h1>
          <p className="text-secondary-fixed-dim">Управління кроками роботи (наприклад: 1. Дзвінок, 2. Проект...).</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-surface-container p-8 rounded-xl border border-outline-variant/20 h-fit">
            <h2 className="text-xl font-bold text-white border-b border-outline-variant/10 pb-4 mb-6">
              {editingId ? "Редагування кроку" : "Новий крок"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Порядок (сортування)</label>
                <input
                  type="number"
                  required
                  value={formData.order}
                  onChange={(e) => setFormData(prev => ({ ...prev, order: e.target.value }))}
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Назва етапу</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Іконка</label>
                <IconPicker
                  value={formData.icon}
                  onChange={(val) => setFormData(prev => ({ ...prev, icon: val }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Детальний опис (можна з форматуванням)</label>
                <RichEditor
                  value={formData.description}
                  onChange={(val) => setFormData(prev => ({ ...prev, description: val }))}
                />
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
            {steps.map((step) => (
              <div key={step.id} className="bg-surface-container p-4 rounded-xl border border-outline-variant/20 flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-white"><span className="text-primary-fixed mr-2">{step.order}.</span> {step.title}</h3>
                  <div className="text-sm text-secondary-fixed-dim mt-2 prose prose-invert prose-sm" dangerouslySetInnerHTML={{ __html: step.description }} />
                </div>
                <div className="flex gap-2 ml-4">
                  <button onClick={() => handleEdit(step)} className="p-2 text-primary-fixed hover:bg-primary-fixed/10 rounded-lg shrink-0">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(step.id)} className="p-2 text-error hover:bg-error/10 rounded-lg shrink-0">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
            {steps.length === 0 && (
              <p className="text-secondary-fixed-dim text-center py-8">Немає доданих кроків</p>
            )}
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}
