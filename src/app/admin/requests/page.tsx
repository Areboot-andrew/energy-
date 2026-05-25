"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import { useState, useEffect } from "react";
import { Trash2, Phone, Mail, MessageSquare, Clock, Calculator, Paperclip } from "lucide-react";

interface ClientRequest {
  id: string;
  name: string;
  phone: string;
  serviceType: string;
  comment: string;
  totalPrice?: number;
  attachedFile?: string;
  status: string;
  createdAt: string;
}

const RequestsPage = () => {
  const [requests, setRequests] = useState<ClientRequest[]>([]);

  useEffect(() => {
    fetch("/api/requests")
      .then(res => res.json())
      .then(data => setRequests(data));
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    
    if (res.ok) {
      setRequests(requests.map(r => r.id === id ? { ...r, status } : r));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Ви впевнені, що хочете видалити цю заявку?")) return;
    
    const res = await fetch(`/api/requests/${id}`, {
      method: "DELETE",
    });
    
    if (res.ok) {
      setRequests(requests.filter(r => r.id !== id));
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Заявки від клієнтів</h1>
          <p className="text-secondary-fixed-dim">Перегляд та керування вхідними запитами.</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {requests.length === 0 ? (
            <div className="bg-surface-container p-12 rounded-xl border border-outline-variant/20 text-center">
              <p className="text-secondary-fixed-dim">Наразі нових заявок немає.</p>
            </div>
          ) : (
            requests.map((request) => (
              <div key={request.id} className={`bg-surface-container p-6 rounded-xl border transition-all flex flex-col md:flex-row justify-between gap-6 ${
                request.status === 'COMPLETED' ? 'border-outline-variant/10 opacity-60' : 'border-outline-variant/20 hover:border-primary-fixed/30'
              }`}>
                <div className="space-y-4 flex-grow">
                  <div className="flex items-center gap-4">
                    <span className="bg-primary-fixed/10 text-primary-fixed px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-primary-fixed/20">
                      {request.serviceType}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      request.status === 'NEW' ? 'bg-error/10 text-error border-error/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    }`}>
                      {request.status === 'NEW' ? 'Нова' : 'Виконано'}
                    </span>
                    <span className="text-secondary-fixed-dim text-xs flex items-center gap-1">
                      <Clock size={14} />
                      {new Date(request.createdAt).toLocaleString('uk-UA')}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-white">{request.name}</h3>
                    {request.totalPrice && (
                      <div className="flex items-center gap-2 bg-primary-fixed text-black px-4 py-1 rounded-lg font-black">
                        <Calculator size={16} />
                        <span>{request.totalPrice.toLocaleString()} ₴</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-6">
                    <a href={`tel:${request.phone}`} className="flex items-center gap-2 text-secondary-fixed-dim font-bold hover:text-primary-fixed transition-colors">
                      <Phone size={18} className="text-primary-fixed" />
                      <span>{request.phone}</span>
                    </a>
                  </div>

                  {request.comment && (
                    <div className="bg-background/50 p-4 rounded-lg border border-outline-variant/10 flex gap-3">
                      <MessageSquare size={18} className="text-primary-fixed shrink-0" />
                      <p className="text-secondary-fixed-dim text-sm italic">"{request.comment}"</p>
                    </div>
                  )}

                  {request.attachedFile && (
                    <div className="flex">
                      <a 
                        href={request.attachedFile} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-primary-fixed/10 text-primary-fixed border border-primary-fixed/20 px-4 py-3 rounded-lg hover:bg-primary-fixed/20 transition-all font-bold text-sm uppercase tracking-widest"
                      >
                        <Paperclip size={18} />
                        Завантажити прикріплений проєкт/файл
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex md:flex-col justify-end gap-2 shrink-0">
                  {request.status !== 'COMPLETED' && (
                    <button 
                      onClick={() => handleUpdateStatus(request.id, 'COMPLETED')}
                      className="bg-primary-fixed text-on-primary-fixed px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-widest hover:shadow-[0_0_10px_rgba(213,240,0,0.2)] transition-all"
                    >
                      Виконано
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(request.id)}
                    className="text-secondary-fixed-dim hover:text-error px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-widest border border-outline-variant/20 hover:border-error/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} />
                    Видалити
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

export default RequestsPage;
