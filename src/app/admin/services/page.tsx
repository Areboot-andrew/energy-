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
    isFeatured: false,
    category: "Основні послуги",
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

  const generateSlug = (text: string) => {
    const translit: { [key: string]: string } = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'h', 'ґ': 'g', 'д': 'd', 'е': 'e', 'є': 'ye', 'ж': 'zh', 'з': 'z', 'и': 'y', 'і': 'i', 'ї': 'yi', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ь': '', 'ю': 'yu', 'я': 'ya',
      ' ': '-', '_': '-', ',': '', '.': '', '?': '', '!': '', '(': '', ')': '', '"': '', "'": '', '«': '', '»': ''
    };
    return text.toLowerCase().split('').map(char => translit[char] || char).join('').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    if (!editingId && (!formData.slug || formData.slug === generateSlug(formData.title))) {
      setFormData(prev => ({ ...prev, title: newTitle, slug: generateSlug(newTitle) }));
    } else {
      setFormData(prev => ({ ...prev, title: newTitle }));
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
      setFormData({ slug: "", title: "", description: "", icon: "", advantages: "", metaTitle: "", metaDescription: "", estimatedPrice: "", content: "", components: "", included: "", image: "", isFeatured: false, category: "Основні послуги" });
      setEditingId(null);
      fetchServices();
    } else {
      alert("Помилка збереження");
    }
    setLoading(false);
  };

  const handleEdit = (service: any) => {
    setEditingId(service.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    let advantagesStr = "";
    try {
      const arr = JSON.parse(service.advantages);
      if (Array.isArray(arr)) {
        advantagesStr = arr.join("\n");
      }
    } catch (e) {}

    setFormData({
      slug: service.slug || "",
      title: service.title || "",
      description: service.description || "",
      icon: service.icon || "",
      advantages: advantagesStr || "",
      metaTitle: service.metaTitle || "",
      metaDescription: service.metaDescription || "",
      estimatedPrice: service.estimatedPrice || "",
      content: service.content || "",
      components: service.components || "",
      included: service.included || "",
      image: service.image || "",
      isFeatured: Boolean(service.isFeatured),
      category: service.category || "Основні послуги",
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
      components: "", included: "", image: "", isFeatured: false, category: "Основні послуги"
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
                  value={formData.slug || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="napryklad-posluga"
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Заголовок</label>
                <input
                  type="text"
                  required
                  value={formData.title || ""}
                  onChange={handleTitleChange}
                  placeholder="Введіть заголовок (напр. Монтаж освітлення)"
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Категорія</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none"
                    placeholder="Напр: Електромонтаж"
                  />
                </div>
                <div className="space-y-2 flex flex-col justify-end">
                  <label className="flex items-center gap-3 cursor-pointer p-3 border border-outline-variant/30 rounded-lg bg-background hover:border-primary-fixed transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                      className="w-5 h-5 accent-primary-fixed"
                    />
                    <span className="text-sm font-bold text-white">Показувати на головній</span>
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Іконка</label>
                <IconPicker
                  value={formData.icon}
                  onChange={(val) => setFormData(prev => ({ ...prev, icon: val }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Опис</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Короткий опис послуги для карток на головній сторінці..."
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none resize-none"
                ></textarea>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Переваги (кожна з нового рядка)</label>
                <textarea
                  rows={5}
                  value={formData.advantages}
                  onChange={(e) => setFormData(prev => ({ ...prev, advantages: e.target.value }))}
                  placeholder="Швидкий монтаж&#10;Гарантія 5 років&#10;Безкоштовний проєкт"
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none resize-none"
                ></textarea>
              </div>

              {/* Extra Info */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Контент (детальний опис)</label>
                <RichEditor
                  value={formData.content}
                  onChange={(val) => setFormData(prev => ({ ...prev, content: val }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Компоненти послуги (JSON або текст)</label>
                <textarea
                  rows={3}
                  value={formData.components}
                  onChange={(e) => setFormData(prev => ({ ...prev, components: e.target.value }))}
                  placeholder='[{"name":"Кабель","desc":"Мідний ВВГнг"},{"name":"Автомат","desc":"Eaton"}]'
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none resize-none font-mono text-xs"
                ></textarea>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Що включено (JSON або текст)</label>
                <textarea
                  rows={3}
                  value={formData.included}
                  onChange={(e) => setFormData(prev => ({ ...prev, included: e.target.value }))}
                  placeholder='["Виїзд майстра", "Складання кошторису", "Закупівля матеріалів"]'
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none resize-none font-mono text-xs"
                ></textarea>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Орієнтовна ціна</label>
                <input
                  type="text"
                  value={formData.estimatedPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedPrice: e.target.value }))}
                  placeholder="від 15 000 грн"
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none"
                />
              </div>

              <ImageUploader
                label="Головне зображення послуги"
                value={formData.image}
                onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
              />

              {/* SEO */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Meta Title</label>
                <input
                  type="text"
                  value={formData.metaTitle || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                  placeholder={formData.title ? `${formData.title} | VOLT PREMIUM` : "SEO заголовок сторінки"}
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Meta Description</label>
                <textarea
                  rows={2}
                  value={formData.metaDescription || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                  placeholder={formData.description ? formData.description.slice(0, 150) + "..." : "SEO опис сторінки (до 160 символів)"}
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
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-white">{service.title}</h3>
                    {service.isFeatured && <span className="text-xs bg-primary-fixed/20 text-primary-fixed px-2 py-0.5 rounded">Головна</span>}
                  </div>
                  <p className="text-sm text-secondary-fixed-dim">/{service.slug} • {service.category}</p>
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
