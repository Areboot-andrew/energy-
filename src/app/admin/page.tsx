"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import { useState, useEffect } from "react";
import { Clock, Phone, Calculator, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Stat {
  label: string;
  value: number;
  color: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stat[]>([
    { label: "Заявки", value: 0, color: "text-primary-fixed" },
    { label: "Пости в блозі", value: 0, color: "text-white" },
    { label: "Зображень в галереї", value: 0, color: "text-white" },
  ]);
  const [latestRequests, setLatestRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then(res => res.json())
      .then(data => {
        setStats([
          { label: "Заявки", value: data.requestCount || 0, color: "text-primary-fixed" },
          { label: "Пости в блозі", value: data.blogCount || 0, color: "text-white" },
          { label: "Зображень в галереї", value: data.galleryCount || 0, color: "text-white" },
        ]);
        setLatestRequests(data.latestRequests || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Вітаємо, Адмін!</h1>
          <p className="text-secondary-fixed-dim">Огляд стану вашого проєкту VOLT PREMIUM.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-surface-container p-6 rounded-xl border border-outline-variant/20">
              <p className="text-secondary-fixed-dim text-sm uppercase tracking-widest mb-1">{stat.label}</p>
              <p className={`text-4xl font-bold ${stat.color}`}>
                {loading ? "..." : stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-surface-container rounded-xl border border-outline-variant/20 overflow-hidden">
          <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Останні заявки</h2>
            <Link href="/admin/requests" className="text-primary-fixed text-sm font-bold uppercase tracking-widest flex items-center gap-2 group">
              Всі заявки <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="divide-y divide-outline-variant/10">
            {loading ? (
              <div className="p-12 text-center text-secondary-fixed-dim">Завантаження...</div>
            ) : latestRequests.length === 0 ? (
              <div className="p-12 text-center text-secondary-fixed-dim">Наразі нових заявок немає.</div>
            ) : (
              latestRequests.map((request) => (
                <div key={request.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-all">
                  <div className="space-y-1">
                    <p className="text-white font-bold">{request.name}</p>
                    <div className="flex items-center gap-4 text-xs text-secondary-fixed-dim font-medium uppercase tracking-wider">
                      <span className="flex items-center gap-1"><Phone size={12} className="text-primary-fixed" /> {request.phone}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {new Date(request.createdAt).toLocaleDateString('uk-UA')}</span>
                    </div>
                  </div>
                  {request.totalPrice && (
                    <div className="text-primary-fixed font-black flex items-center gap-2 bg-primary-fixed/5 px-3 py-1 rounded-lg border border-primary-fixed/20">
                      <Calculator size={14} />
                      <span>{request.totalPrice.toLocaleString()} ₴</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
