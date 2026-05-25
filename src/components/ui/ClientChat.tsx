"use client";

import { useState, useEffect, useRef } from "react";
import { Send, User as UserIcon, ShieldAlert } from "lucide-react";

interface Message {
  id: string;
  content: string;
  isAdmin: boolean;
  createdAt: string;
  sender: {
    name: string | null;
  };
}

export default function ClientChat({ projectId, isAdminView = false }: { projectId: string, isAdminView?: boolean }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    const res = await fetch(`/api/messages?projectId=${projectId}`);
    if (res.ok) {
      const data = await res.json();
      setMessages(data);
    }
  };

  useEffect(() => {
    fetchMessages();
    // Simple polling for new messages every 10 seconds
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, [projectId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, content: input }),
    });

    if (res.ok) {
      setInput("");
      fetchMessages();
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[500px] bg-surface-container border border-outline-variant/20 rounded-2xl overflow-hidden relative">
      <div className="p-4 border-b border-outline-variant/20 bg-surface-container-high shrink-0">
        <h3 className="font-bold text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary-fixed animate-pulse"></span>
          Чат по проєкту
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-secondary-fixed-dim text-sm">
            Немає повідомлень. Напишіть першим!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = (isAdminView && msg.isAdmin) || (!isAdminView && !msg.isAdmin);
            
            return (
              <div key={msg.id} className={`flex gap-3 max-w-[80%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.isAdmin ? 'bg-primary-fixed text-black' : 'bg-surface-container-high text-white'}`}>
                  {msg.isAdmin ? <ShieldAlert size={14} /> : <UserIcon size={14} />}
                </div>
                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] text-secondary-fixed-dim mb-1 uppercase tracking-wider font-bold">
                    {msg.sender?.name || (msg.isAdmin ? "Адміністратор" : "Клієнт")} • {new Date(msg.createdAt).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <div className={`p-3 rounded-2xl text-sm ${isMe ? 'bg-primary-fixed text-black rounded-tr-sm' : 'bg-surface-container-high text-white rounded-tl-sm'}`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t border-outline-variant/20 bg-surface-container-high flex gap-2 shrink-0">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Написати повідомлення..."
          className="flex-1 bg-background border border-outline-variant/30 rounded-xl px-4 py-3 text-white focus:border-primary-fixed outline-none text-sm"
        />
        <button 
          type="submit" 
          disabled={loading || !input.trim()}
          className="bg-primary-fixed text-black w-12 h-12 rounded-xl flex items-center justify-center hover:shadow-[0_0_15px_rgba(213,240,0,0.3)] transition-all disabled:opacity-50"
        >
          <Send size={18} className={input.trim() ? 'ml-1' : ''} />
        </button>
      </form>
    </div>
  );
}
