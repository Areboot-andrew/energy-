"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import ImageUploader from "@/components/admin/ImageUploader";
import RichEditor from "@/components/admin/RichEditor";
import IconPicker from "@/components/admin/IconPicker";
import { useState, useEffect } from "react";
import { Save, Loader2, Plus, Trash2, Edit2 } from "lucide-react";

export default function ServicesAdminPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    description: "",
    icon: "",
    advantages: "",
    metaTitle: "",
    metaDescription: "",
    estimatedPrice: "",
    content: "",
    components: "",
    included: "",
    image: "",
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const res = await fetch("/api/services");
    if (res.ok) {
      const data = await res.json();
      setServices(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const advantagesArray = formData.advantages
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const payload = {
      ...formData,
      advantages: JSON.stringify(advantagesArray),
    };

    const url = editingId ? `/api/services/${editingId}` : "/api/services";
    const method = editingId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("Збережено!");
      setFormData({ slug: "", title: "", description: "", icon: "", advantages: "" });
      setEditingId(null);
      fetchServices();
    } else {
      alert("Помилка збереження");
    }
    setLoading(false);
  };

  const handleEdit = (service: any) => {
    setEditingId(service.id);
    let advantagesStr = "";
    try {
      const arr = JSON.parse(service.advantages);
      if (Array.isArray(arr)) {
        advantagesStr = arr.join("\n");
      }
    } catch (e) {}

    setFormData({
      slug: service.slug,
      title: service.title,
      description: service.description,
      icon: service.icon,
      advantages: advantagesStr,
      metaTitle: service.metaTitle || "",
      metaDescription: service.metaDescription || "",
      estimatedPrice: service.estimatedPrice || "",
      content: service.content || "",
      components: service.components || "",
      included: service.included || "",
      image: service.image || "",
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Ви впевнені?")) return;
    const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchServices();
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      slug: "", title: "", description: "", icon: "", advantages: "",
      metaTitle: "", metaDescription: "", estimatedPrice: "", content: "",
      components: "", included: "", image: ""
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Послуги</h1>
          <p className="text-secondary-fixed-dim">Управління сторінками послуг.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <section className="bg-surface-container p-8 rounded-xl border border-outline-variant/20 h-fit">
            <h2 className="text-xl font-bold text-white border-b border-outline-variant/10 pb-4 mb-6">
              {editingId ? "Редагування послуги" : "Нова послуга"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Slug (URL)</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none"
                />
              </div>
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
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Переваги (кожна з нового рядка)</label>
                <textarea
                  rows={5}
                  value={formData.advantages}
                  onChange={(e) => setFormData({ ...formData, advantages: e.target.value })}
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none resize-none"
                ></textarea>
              </div>

              {/* Extra Info */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Контент (детальний опис)</label>
                <RichEditor
                  value={formData.content}
                  onChange={(val) => setFormData({ ...formData, content: val })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Компоненти послуги (JSON або текст)</label>
                <textarea
                  rows={3}
                  value={formData.components}
                  onChange={(e) => setFormData({ ...formData, components: e.target.value })}
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none resize-none"
                ></textarea>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Що включено (JSON або текст)</label>
                <textarea
                  rows={3}
                  value={formData.included}
                  onChange={(e) => setFormData({ ...formData, included: e.target.value })}
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none resize-none"
                ></textarea>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Орієнтовна ціна</label>
                <input
                  type="text"
                  value={formData.estimatedPrice}
                  onChange={(e) => setFormData({ ...formData, estimatedPrice: e.target.value })}
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none"
                />
              </div>

              <ImageUploader
                label="Головне зображення послуги"
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
              />

              {/* SEO */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Meta Title</label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Meta Description</label>
                <textarea
                  rows={2}
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
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
            {services.map((service) => (
              <div key={service.id} className="bg-surface-container p-4 rounded-xl border border-outline-variant/20 flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-white">{service.title}</h3>
                  <p className="text-sm text-secondary-fixed-dim">/{service.slug}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(service)} className="p-2 text-primary-fixed hover:bg-primary-fixed/10 rounded-lg">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(service.id)} className="p-2 text-error hover:bg-error/10 rounded-lg">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
            {services.length === 0 && (
              <p className="text-secondary-fixed-dim text-center py-8">Немає доданих послуг</p>
            )}
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}
