"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import { useState, useEffect } from "react";
import { Save, Loader2, Trash2, Edit2 } from "lucide-react";

export default function FAQAdminPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    order: "0",
  });

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    const res = await fetch("/api/faq");
    if (res.ok) {
      const data = await res.json();
      setFaqs(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const url = editingId ? `/api/faq/${editingId}` : "/api/faq";
    const method = editingId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, order: parseInt(formData.order) }),
    });

    if (res.ok) {
      alert("Збережено!");
      setFormData({ question: "", answer: "", order: "0" });
      setEditingId(null);
      fetchFaqs();
    } else {
      alert("Помилка збереження");
    }
    setLoading(false);
  };

  const handleEdit = (faq: any) => {
    setEditingId(faq.id);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      order: String(faq.order),
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Ви впевнені?")) return;
    const res = await fetch(`/api/faq/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchFaqs();
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ question: "", answer: "", order: "0" });
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">FAQ</h1>
          <p className="text-secondary-fixed-dim">Управління питаннями та відповідями.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <section className="bg-surface-container p-8 rounded-xl border border-outline-variant/20 h-fit">
            <h2 className="text-xl font-bold text-white border-b border-outline-variant/10 pb-4 mb-6">
              {editingId ? "Редагування FAQ" : "Нове питання"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Порядок (сортування)</label>
                <input
                  type="number"
                  required
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Питання</label>
                <input
                  type="text"
                  required
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Відповідь</label>
                <textarea
                  rows={4}
                  required
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
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

          {/* List */}
          <section className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="bg-surface-container p-4 rounded-xl border border-outline-variant/20 flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-white">{faq.question}</h3>
                  <p className="text-sm text-secondary-fixed-dim mt-2">{faq.answer}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button onClick={() => handleEdit(faq)} className="p-2 text-primary-fixed hover:bg-primary-fixed/10 rounded-lg shrink-0">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(faq.id)} className="p-2 text-error hover:bg-error/10 rounded-lg shrink-0">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
            {faqs.length === 0 && (
              <p className="text-secondary-fixed-dim text-center py-8">Немає доданих FAQ</p>
            )}
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}
