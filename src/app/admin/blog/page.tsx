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
      title: post.title,
      slug: post.slug,
      image: post.image,
      content: post.content || "",
      metaTitle: post.metaTitle || "",
      metaDescription: post.metaDescription || "",
      published: post.published
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
                  value={currentPost.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setCurrentPost({ 
                      ...currentPost, 
                      title, 
                      slug: editingId ? currentPost.slug : title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') 
                    });
                  }}
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Slug (URL)</label>
                <input
                  type="text"
                  required
                  value={currentPost.slug}
                  onChange={(e) => setCurrentPost({ ...currentPost, slug: e.target.value })}
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-secondary-fixed-dim">URL Зображення</label>
              <input
                type="text"
                required
                value={currentPost.image}
                onChange={(e) => setCurrentPost({ ...currentPost, image: e.target.value })}
                className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Контент (Текст статті)</label>
              <div className="bg-background rounded-lg border border-outline-variant/30 text-white">
                <RichEditor
                  value={currentPost.content}
                  onChange={(val) => setCurrentPost({ ...currentPost, content: val })}
                  placeholder="Напишіть статтю (можна вставляти картинки, списки, жирний шрифт)..."
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-outline-variant/10">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Meta Title</label>
                <input
                  type="text"
                  value={currentPost.metaTitle}
                  onChange={(e) => setCurrentPost({ ...currentPost, metaTitle: e.target.value })}
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed outline-none"
                  placeholder="SEO Заголовок"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary-fixed-dim">Meta Description</label>
                <textarea
                  rows={3}
                  value={currentPost.metaDescription}
                  onChange={(e) => setCurrentPost({ ...currentPost, metaDescription: e.target.value })}
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
