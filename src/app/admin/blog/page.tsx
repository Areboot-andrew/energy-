"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, FileText } from "lucide-react";
import Image from "next/image";
import RichEditor from "@/components/admin/RichEditor";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  image: string;
  metaTitle: string;
  metaDescription: string;
  published: boolean;
  createdAt: string;
}

const BlogAdmin = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentPost, setCurrentPost] = useState({ title: "", slug: "", image: "", content: "", metaTitle: "", metaDescription: "", published: true });

  useEffect(() => {
    fetch("/api/blog").then(res => res.json()).then(data => setPosts(data));
  }, []);

  const generateSlug = (text: string) => {
    const translit: { [key: string]: string } = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'h', 'ґ': 'g', 'д': 'd', 'е': 'e', 'є': 'ye', 'ж': 'zh', 'з': 'z', 'и': 'y', 'і': 'i', 'ї': 'yi', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ь': '', 'ю': 'yu', 'я': 'ya',
      ' ': '-', '_': '-', ',': '', '.': '', '?': '', '!': '', '(': '', ')': '', '"': '', "'": '', '«': '', '»': ''
    };
    return text.toLowerCase().split('').map(char => translit[char] || char).join('').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    if (!editingId && (!currentPost.slug || currentPost.slug === generateSlug(currentPost.title))) {
      setCurrentPost(prev => ({ ...prev, title: newTitle, slug: generateSlug(newTitle) }));
    } else {
      setCurrentPost(prev => ({ ...prev, title: newTitle }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? "PATCH" : "POST";
    const url = editingId ? `/api/blog/${editingId}` : "/api/blog";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentPost),
    });

    if (res.ok) {
      const post = await res.json();
      if (editingId) {
        setPosts(posts.map(p => p.id === editingId ? post : p));
      } else {
        setPosts([post, ...posts]);
      }
      resetForm();
    }
  };

  const handleEdit = (post: any) => {
    setEditingId(post.id);
    setCurrentPost({
      slug: post.slug || "",
      title: post.title || "",
      image: post.image || "",
      content: post.content || "",
      metaTitle: post.metaTitle || "",
      metaDescription: post.metaDescription || "",
      published: Boolean(post.published)
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Ви впевнені, що хочете видалити цю статтю?")) return;
    
    const res = await fetch(`/api/blog/${id}`, {
      method: "DELETE",
    });
    
    if (res.ok) {
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  const resetForm = () => {
    setCurrentPost({ title: "", slug: "", image: "", content: "", metaTitle: "", metaDescription: "", published: true });
    setEditingId(null);
    setIsEditing(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Блог та Відеоблог</h1>
            <p className="text-secondary-fixed-dim">Керування статтями та корисними матеріалами.</p>
          </div>
          <button
            onClick={() => isEditing ? resetForm() : setIsEditing(true)}
            className="bg-primary-fixed text-on-primary-fixed px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all"
          >
            {isEditing ? <Trash2 size={20} /> : <Plus size={20} />}
            {isEditing ? "Скасувати" : "Нова стаття"}
          </button>
        </div>

        {isEditing && (
          <form onSubmit={handleSubmit} className="bg-surface-container p-8 rounded-xl border border-outline-variant/20 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <h2 className="text-xl font-bold text-white">{editingId ? "Редагувати статтю" : "Нова стаття"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Заголовок</label>
                <input
                  type="text"
                  required
                  value={currentPost.title || ""}
                  onChange={handleTitleChange}
                  placeholder="Введіть заголовок статті..."
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Slug (URL)</label>
                <input
                  type="text"
                  required
                  value={currentPost.slug || ""}
                  onChange={(e) => setCurrentPost(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="napryklad-stattya"
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-secondary-fixed-dim">URL Зображення</label>
              <input
                type="text"
                required
                value={currentPost.image || ""}
                onChange={(e) => setCurrentPost(prev => ({ ...prev, image: e.target.value }))}
                placeholder="https://..."
                className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Контент (Текст статті)</label>
              <div className="bg-background rounded-lg border border-outline-variant/30 text-white">
                <RichEditor
                  value={currentPost.content || ""}
                  onChange={(val) => setCurrentPost(prev => ({ ...prev, content: val }))}
                  placeholder="Напишіть статтю..."
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-outline-variant/10">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Meta Title</label>
                <input
                  type="text"
                  value={currentPost.metaTitle || ""}
                  onChange={(e) => setCurrentPost(prev => ({ ...prev, metaTitle: e.target.value }))}
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none"
                  placeholder={currentPost.title ? `${currentPost.title} | Блог VOLT PREMIUM` : "SEO Заголовок"}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Meta Description</label>
                <textarea
                  rows={3}
                  required
                  value={currentPost.metaDescription || ""}
                  onChange={(e) => setCurrentPost(prev => ({ ...prev, metaDescription: e.target.value }))}
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none resize-none"
                  placeholder="SEO Опис"
                ></textarea>
              </div>
            </div>
            <button type="submit" className="w-full bg-primary-fixed text-on-primary-fixed py-4 rounded-lg font-bold hover:shadow-[0_0_20px_rgba(213,240,0,0.3)] transition-all uppercase tracking-widest">
              {editingId ? "Зберегти зміни" : "Опублікувати статтю"}
            </button>
          </form>
        )}

        <div className="grid grid-cols-1 gap-4">
          {posts.length === 0 ? (
            <div className="p-12 text-center text-secondary-fixed-dim bg-surface-container rounded-xl border border-outline-variant/20">
              Поки що немає жодної статті.
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-surface-container p-4 rounded-xl border border-outline-variant/20 flex items-center gap-6 group hover:border-primary-fixed/30 transition-all">
                <div className="relative w-32 aspect-video rounded-lg overflow-hidden border border-outline-variant/10 shrink-0">
                  <Image src={post.image} alt={post.title} fill className="object-cover" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-white mb-1">{post.title}</h3>
                  <p className="text-secondary-fixed-dim text-xs">
                    {new Date(post.createdAt).toLocaleDateString('uk-UA')} • /{post.slug}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(post)}
                    className="text-secondary-fixed-dim hover:text-primary-fixed p-2 transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(post.id)}
                    className="text-secondary-fixed-dim hover:text-error p-2 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default BlogAdmin;
