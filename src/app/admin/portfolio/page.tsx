"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function PortfolioAdminPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [content, setContent] = useState<any>({});
  const [isSavingContent, setIsSavingContent] = useState(false);

  useEffect(() => {
    fetchProjects();
    fetch("/api/content").then(res => res.json()).then(data => { if (data) setContent(data); });
  }, []);

  const fetchProjects = async () => {
    const res = await fetch("/api/portfolio");
    if (res.ok) {
      const data = await res.json();
      setProjects(data);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Ви впевнені? Це видалить проєкт та всі його медіафайли.")) return;
    const res = await fetch(`/api/portfolio/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchProjects();
    }
  };

  const handleSaveContent = async () => {
    setIsSavingContent(true);
    try {
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          termToAllProjects: content.termToAllProjects,
          termProjectGallery: content.termProjectGallery,
          allProjectsPageTitle: content.allProjectsPageTitle,
          portfolioSeoTitle: content.portfolioSeoTitle,
          portfolioSeoText: content.portfolioSeoText,
          portfolioVideoUrl: content.portfolioVideoUrl
        })
      });
      alert('Тексти успішно збережено!');
    } catch (e) {
      alert('Помилка при збереженні');
    } finally {
      setIsSavingContent(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Портфоліо Проєктів</h1>
            <p className="text-secondary-fixed-dim">Управління повноцінними кейсами, виконаними роботами та текстами для цих сторінок.</p>
          </div>
          <Link
            href="/admin/portfolio/new"
            className="bg-primary-fixed text-on-primary-fixed px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-[#b8cc00] transition-colors"
          >
            <Plus size={20} /> Створити Проєкт
          </Link>
        </div>

        {/* Dictionary Texts for Portfolio */}
        <section className="bg-surface-container p-8 rounded-xl border border-outline-variant/20 space-y-6">
          <div className="flex justify-between items-center border-b border-outline-variant/10 pb-4">
            <h2 className="text-xl font-bold text-white">Тексти сторінок портфоліо</h2>
            <button 
              onClick={handleSaveContent} 
              disabled={isSavingContent}
              className="bg-primary-fixed text-on-primary-fixed px-6 py-2 rounded-lg font-bold hover:shadow-lg disabled:opacity-50 transition-all text-sm"
            >
              {isSavingContent ? "Збереження..." : "Зберегти тексти"}
            </button>
          </div>
          
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Текст кнопки "Всі проєкти"</label>
                <input type="text" value={content.termToAllProjects || ""} onChange={(e) => setContent({ ...content, termToAllProjects: e.target.value })} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Слово "Галерея"</label>
                <input type="text" value={content.termProjectGallery || ""} onChange={(e) => setContent({ ...content, termProjectGallery: e.target.value })} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-outline-variant/10">
              <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Головний H1 заголовок сторінки Портфоліо (/portfolio)</label>
              <input type="text" value={content.allProjectsPageTitle || ""} onChange={(e) => setContent({ ...content, allProjectsPageTitle: e.target.value })} placeholder="Наприклад: Усі проєкти" className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold uppercase text-secondary-fixed-dim">SEO Заголовок (Title)</label>
              <input type="text" value={content.portfolioSeoTitle || ""} onChange={(e) => setContent({ ...content, portfolioSeoTitle: e.target.value })} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold uppercase text-secondary-fixed-dim">SEO Опис (Description)</label>
              <textarea rows={3} value={content.portfolioSeoText || ""} onChange={(e) => setContent({ ...content, portfolioSeoText: e.target.value })} className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none resize-none"></textarea>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Посилання на відео (YouTube URL)</label>
              <input type="text" value={content.portfolioVideoUrl || ""} onChange={(e) => setContent({ ...content, portfolioVideoUrl: e.target.value })} placeholder="https://youtube.com/..." className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none" />
            </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-surface-container rounded-xl overflow-hidden border border-outline-variant/20 flex flex-col group">
              <div className="relative aspect-video">
                <Image src={project.coverImage} alt={project.title} fill className="object-cover" />
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href={`/admin/portfolio/${project.id}`} className="p-2 bg-black/50 text-white rounded-lg hover:bg-primary-fixed hover:text-black backdrop-blur-sm transition-colors">
                    <Edit2 size={16} />
                  </Link>
                  <button onClick={() => handleDelete(project.id)} className="p-2 bg-black/50 text-white rounded-lg hover:bg-error hover:text-white backdrop-blur-sm transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-primary-fixed uppercase tracking-widest">{project.category}</span>
                  {project.totalPrice && <span className="text-xs text-secondary-fixed-dim font-bold">{project.totalPrice}</span>}
                </div>
                <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{project.title}</h3>
                <p className="text-sm text-secondary-fixed-dim line-clamp-2 flex-1">{project.shortDescription}</p>
                <div className="mt-4 pt-4 border-t border-outline-variant/10 text-xs text-secondary-fixed-dim flex justify-between">
                  <span>Slug: /{project.slug}</span>
                  <span>{project.media?.length || 0} медіафайлів</span>
                </div>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <div className="col-span-full text-center py-24 text-secondary-fixed-dim bg-surface-container/30 rounded-xl border border-outline-variant/10 border-dashed">
              <p className="mb-4">У вас ще немає жодного проєкту.</p>
              <Link href="/admin/portfolio/new" className="text-primary-fixed hover:underline font-bold">Створити перший проєкт</Link>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
