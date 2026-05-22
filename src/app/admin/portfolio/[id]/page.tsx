"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import { useState, useEffect, use } from "react";
import { Save, Loader2, ArrowLeft, Trash2, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import RichEditor from "@/components/admin/RichEditor";
import ImageUploader from "@/components/admin/ImageUploader";
import MediaUploader from "@/components/admin/MediaUploader";

export default function EditPortfolioProject({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const isNew = resolvedParams.id === "new";
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!isNew);
  
  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    category: "Розумний Дім",
    coverImage: "",
    shortDescription: "",
    content: "",
    totalPrice: "",
    metaTitle: "",
    metaDescription: "",
  });

  const [media, setMedia] = useState<any[]>([]);

  useEffect(() => {
    if (!isNew) {
      fetchProject();
    }
  }, [isNew]);

  const fetchProject = async () => {
    const res = await fetch(`/api/portfolio/${resolvedParams.id}`);
    if (res.ok) {
      const data = await res.json();
      setFormData({
        slug: data.slug || "",
        title: data.title || "",
        category: data.category || "Розумний Дім",
        coverImage: data.coverImage || "",
        shortDescription: data.shortDescription || "",
        content: data.content || "",
        totalPrice: data.totalPrice || "",
        metaTitle: data.metaTitle || "",
        metaDescription: data.metaDescription || "",
      });
      setMedia(data.media || []);
    }
    setFetching(false);
  };

  const handleAddMedia = (url: string, type: "IMAGE" | "VIDEO") => {
    setMedia([...media, { url, type }]);
  };

  const handleRemoveMedia = (index: number) => {
    const newMedia = [...media];
    newMedia.splice(index, 1);
    setMedia(newMedia);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      media,
    };

    const url = isNew ? "/api/portfolio" : `/api/portfolio/${resolvedParams.id}`;
    const method = isNew ? "POST" : "PATCH";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("Збережено!");
      router.push("/admin/portfolio");
    } else {
      alert("Помилка збереження");
    }
    setLoading(false);
  };

  if (fetching) return <AdminLayout><div className="p-10 text-white">Завантаження...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-4xl">
        <div className="flex items-center gap-4">
          <Link href="/admin/portfolio" className="p-2 hover:bg-surface-container rounded-lg transition-colors text-secondary-fixed-dim hover:text-white">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">{isNew ? "Створення Проєкту" : "Редагування Проєкту"}</h1>
            <p className="text-secondary-fixed-dim">{isNew ? "Заповніть деталі нового кейсу." : "Оновіть інформацію про об'єкт."}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Main Info Section */}
          <section className="bg-surface-container p-8 rounded-xl border border-outline-variant/20 space-y-6">
            <h2 className="text-xl font-bold text-white border-b border-outline-variant/10 pb-4">Основна інформація</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Назва проєкту</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white"
                  placeholder="Монтаж Ajax в котеджі..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Slug (URL)</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white"
                  placeholder="ajax-cottage"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Категорія</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white"
                >
                  <option>Щити</option>
                  <option>Електромонтаж</option>
                  <option>Розумний Дім</option>
                  <option>Сонячні Станції</option>
                  <option>EV</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Загальна ціна (необов'язково)</label>
                <input
                  type="text"
                  value={formData.totalPrice}
                  onChange={(e) => setFormData({ ...formData, totalPrice: e.target.value })}
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white"
                  placeholder="від 120 000 ₴"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Короткий опис (для карточки на головній)</label>
              <textarea
                rows={3}
                required
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white resize-none"
                placeholder="2-кімнатна квартира, повна автоматизація..."
              ></textarea>
            </div>

            <ImageUploader
              label="Головне фото (Обкладинка)"
              value={formData.coverImage}
              onChange={(url) => setFormData({ ...formData, coverImage: url })}
            />
          </section>

          {/* Content Section */}
          <section className="bg-surface-container p-8 rounded-xl border border-outline-variant/20 space-y-6">
            <h2 className="text-xl font-bold text-white border-b border-outline-variant/10 pb-4">Детальний опис (Етапи робіт, Фінал)</h2>
            <div className="space-y-2">
              <RichEditor
                value={formData.content}
                onChange={(val) => setFormData({ ...formData, content: val })}
                placeholder="Напишіть тут повний опис проєкту, які роботи були виконані, які матеріали використані..."
              />
            </div>
          </section>

          {/* SEO Section */}
          <section className="bg-surface-container p-8 rounded-xl border border-outline-variant/20 space-y-6">
            <h2 className="text-xl font-bold text-white border-b border-outline-variant/10 pb-4">SEO Налаштування</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Meta Title</label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white"
                  placeholder="Заголовок для Google"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Meta Description</label>
                <textarea
                  rows={3}
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white resize-none"
                  placeholder="Опис для Google"
                ></textarea>
              </div>
            </div>
          </section>

          {/* Media Gallery Section */}
          <section className="bg-surface-container p-8 rounded-xl border border-outline-variant/20 space-y-6">
            <h2 className="text-xl font-bold text-white border-b border-outline-variant/10 pb-4">Внутрішня Галерея Проєкту (Фото/Відео)</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {media.map((m, idx) => {
                const isVideo = m.type === "VIDEO" || m.url.includes("youtube.com") || m.url.includes("youtu.be");
                return (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-outline-variant/30 group">
                    {isVideo ? (
                      <div className="w-full h-full bg-black flex items-center justify-center text-white/50">
                        ВІДЕО
                      </div>
                    ) : (
                      <img src={m.url} alt="" className="object-cover w-full h-full" />
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveMedia(idx)}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-error hover:text-red-400"
                    >
                      <Trash2 size={24} />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="bg-background p-6 rounded-xl border border-outline-variant/30 border-dashed">
              <MediaUploader
                value={""}
                type="IMAGE"
                onChange={handleAddMedia}
                label="Додати новий файл до галереї проєкту"
              />
            </div>
          </section>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-fixed text-on-primary-fixed py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#b8cc00] transition-colors"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Save size={24} />}
            Зберегти Проєкт
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
