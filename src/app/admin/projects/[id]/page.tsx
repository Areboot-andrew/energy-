"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import { useState, useEffect } from "react";
import { ArrowLeft, MessageSquare, FileText, Settings, User as UserIcon } from "lucide-react";
import Link from "next/link";
import ClientChat from "@/components/ui/ClientChat";

interface Project {
  id: string;
  title: string;
  description: string | null;
  status: string;
  user: {
    name: string | null;
    email: string;
    phone: string | null;
  };
  quotes: any[];
}

export default function AdminProjectDetailsPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null);

  const fetchProject = async () => {
    // We can fetch from a generic api/admin/projects/[id] or just use a specific one.
    // For now, let's create api/admin/projects/[id]/route.ts next.
    const res = await fetch(`/api/admin/projects/${params.id}`);
    if (res.ok) setProject(await res.json());
  };

  useEffect(() => {
    fetchProject();
  }, [params.id]);

  if (!project) return <AdminLayout><div className="text-white">Завантаження...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <Link href="/admin/projects" className="inline-flex items-center gap-2 text-secondary-fixed-dim hover:text-white transition-colors mb-6 text-sm font-bold uppercase tracking-widest">
            <ArrowLeft size={16} /> Назад до проєктів
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{project.title}</h1>
              <div className="flex items-center gap-4 text-secondary-fixed-dim text-sm">
                <span className="flex items-center gap-1"><UserIcon size={14} /> {project.user.name || "Без імені"} ({project.user.email})</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <select 
                className="bg-surface-container border border-outline-variant/30 rounded-lg px-4 py-2 text-white font-bold text-sm outline-none"
                value={project.status}
                onChange={async (e) => {
                  await fetch(`/api/admin/projects/${project.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: e.target.value })
                  });
                  fetchProject();
                }}
              >
                <option value="ACTIVE">В роботі</option>
                <option value="PAUSED">Пауза</option>
                <option value="COMPLETED">Завершено</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <ClientChat projectId={project.id} isAdminView={true} />
          </div>
          
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-surface-container border border-outline-variant/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="text-primary-fixed" size={20} />
                  Кошториси
                </h3>
                <Link 
                  href={`/admin/projects/${project.id}/quotes/new`}
                  className="bg-primary-fixed/10 text-primary-fixed hover:bg-primary-fixed hover:text-black px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors"
                >
                  Створити
                </Link>
              </div>

              {project.quotes.length === 0 ? (
                <p className="text-secondary-fixed-dim text-sm">Поки немає кошторисів.</p>
              ) : (
                <div className="space-y-3">
                  {project.quotes.map(quote => (
                    <Link 
                      key={quote.id} 
                      href={`/admin/projects/${project.id}/quotes/${quote.id}`}
                      className="block p-4 rounded-xl border border-outline-variant/30 hover:border-primary-fixed/50 transition-colors group bg-surface-container-high"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-white text-sm group-hover:text-primary-fixed transition-colors">{quote.title}</span>
                        <span className="text-[10px] uppercase font-bold text-secondary-fixed-dim bg-background px-2 py-1 rounded">
                          {quote.status}
                        </span>
                      </div>
                      <div className="font-headline-sm text-white">
                        {quote.totalAmount.toLocaleString()} ₴
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-surface-container border border-outline-variant/20 rounded-2xl p-6">
              <h3 className="font-bold text-white mb-4">Деталі клієнта</h3>
              <ul className="space-y-2 text-sm text-secondary-fixed-dim">
                <li><strong className="text-white">Ім'я:</strong> {project.user.name || "-"}</li>
                <li><strong className="text-white">Телефон:</strong> {project.user.phone || "-"}</li>
                <li><strong className="text-white">Email:</strong> {project.user.email}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
