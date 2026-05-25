"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import { useState, useEffect } from "react";
import { Plus, FolderGit2, Users, Search, X } from "lucide-react";
import Link from "next/link";

interface User {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
}

interface Project {
  id: string;
  title: string;
  description: string | null;
  status: string;
  createdAt: string;
  user: User;
  _count: {
    messages: number;
    quotes: number;
  };
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    userId: "",
  });

  const fetchData = async () => {
    const [projRes, usersRes] = await Promise.all([
      fetch("/api/admin/projects"),
      fetch("/api/admin/users")
    ]);
    if (projRes.ok) setProjects(await projRes.json());
    if (usersRes.ok) setUsers(await usersRes.json());
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userId) {
      alert("Виберіть клієнта!");
      return;
    }

    const res = await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setIsModalOpen(false);
      setFormData({ title: "", description: "", userId: "" });
      fetchData();
    } else {
      alert("Помилка створення");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Проєкти Клієнтів</h1>
            <p className="text-secondary-fixed-dim">Керування об'єктами, чат та призначення кошторисів.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary-fixed text-on-primary-fixed px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm hover:shadow-[0_0_20px_rgba(213,240,0,0.3)] transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            Створити Проєкт
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {projects.length === 0 ? (
            <div className="bg-surface-container p-12 rounded-2xl border border-outline-variant/20 text-center">
              <FolderGit2 className="mx-auto text-secondary-fixed-dim mb-4" size={48} />
              <h3 className="text-xl font-bold text-white mb-2">Проєктів ще немає</h3>
              <p className="text-secondary-fixed-dim">Створіть перший проєкт для клієнта.</p>
            </div>
          ) : (
            projects.map(project => (
              <Link 
                href={`/admin/projects/${project.id}`} 
                key={project.id}
                className="bg-surface-container border border-outline-variant/20 p-6 rounded-2xl hover:border-primary-fixed/50 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-fixed opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-primary-fixed transition-colors">{project.title}</h3>
                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
                      project.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-500' : 
                      project.status === 'PAUSED' ? 'bg-error/20 text-error' : 
                      'bg-primary-fixed/20 text-primary-fixed'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-secondary-fixed-dim">
                    <Users size={14} />
                    {project.user?.name || "Невідомо"} ({project.user?.email})
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-white shrink-0">
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-lg">{project._count.messages}</span>
                    <span className="text-secondary-fixed-dim text-xs uppercase tracking-widest">Повідомлень</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-lg">{project._count.quotes}</span>
                    <span className="text-secondary-fixed-dim text-xs uppercase tracking-widest">Кошторисів</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Create Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
            <div className="relative bg-surface-container border border-outline-variant/30 rounded-2xl w-full max-w-lg shadow-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Новий Проєкт</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-secondary-fixed-dim hover:text-white">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-secondary-fixed-dim block mb-1">Назва об'єкту / проєкту</label>
                  <input 
                    required 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    className="w-full bg-background border border-outline-variant/30 rounded-lg p-3 text-white focus:border-primary-fixed outline-none" 
                    placeholder="напр. Квартира ЖК Парус"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-secondary-fixed-dim block mb-1">Клієнт</label>
                  <select 
                    required 
                    value={formData.userId} 
                    onChange={e => setFormData({...formData, userId: e.target.value})}
                    className="w-full bg-background border border-outline-variant/30 rounded-lg p-3 text-white focus:border-primary-fixed outline-none appearance-none"
                  >
                    <option value="" disabled>Оберіть клієнта...</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.name || "Без імені"} ({u.email})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-secondary-fixed-dim block mb-1">Опис (опціонально)</label>
                  <textarea 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                    className="w-full bg-background border border-outline-variant/30 rounded-lg p-3 text-white focus:border-primary-fixed outline-none" 
                    rows={3}
                  />
                </div>
                <button type="submit" className="w-full bg-primary-fixed text-black py-4 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(213,240,0,0.3)] transition-all">
                  Створити
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
