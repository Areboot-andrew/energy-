"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json();
        alert(data.error || "Помилка при реєстрації");
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-background text-on-background font-body-md flex items-center justify-center px-margin-mobile md:px-margin-desktop py-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary-fixed/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary-fixed/10 blur-[120px] rounded-full"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[500px] w-full bg-surface-container rounded-2xl border border-outline-variant/20 p-8 md:p-12 shadow-2xl relative z-10 glass-card"
      >
        <div className="text-center mb-10">
          <Link href="/" className="font-display-lg text-headline-xl tracking-tighter text-primary-fixed flex items-center justify-center gap-2 mb-6">
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
            VOLT PREMIUM
          </Link>
          <h1 className="font-headline-xl text-white mb-2">Реєстрація клієнта</h1>
          <p className="text-secondary-fixed-dim font-body-md">Створіть кабінет для керування проєктами</p>
        </div>

        {status === "success" ? (
          <div className="text-center space-y-6">
             <span className="material-symbols-outlined text-primary-fixed text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
             <h2 className="text-2xl font-bold text-white">Вітаємо!</h2>
             <p className="text-secondary-fixed-dim">Ваш акаунт успішно створено. Тепер ви можете увійти в систему.</p>
             <Link href="/admin" className="block w-full bg-primary-fixed text-on-primary-fixed py-4 rounded-lg font-bold text-lg hover:shadow-[0_0_15px_rgba(213,240,0,0.3)] transition-all text-center">
                Увійти в кабінет
             </Link>
          </div>
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="font-label-sm text-secondary-fixed-dim ml-1">Прізвище та ім'я</label>
              <input 
                required 
                className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-4 text-white focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed outline-none transition-all" 
                placeholder="Коваль Олександр" 
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="font-label-sm text-secondary-fixed-dim ml-1">Телефон</label>
              <input 
                required 
                className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-4 text-white focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed outline-none transition-all" 
                placeholder="+380" 
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="font-label-sm text-secondary-fixed-dim ml-1">Email</label>
              <input 
                required 
                className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-4 text-white focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed outline-none transition-all" 
                placeholder="alex@example.com" 
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="font-label-sm text-secondary-fixed-dim ml-1">Пароль</label>
              <input 
                required 
                className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-4 text-white focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed outline-none transition-all" 
                placeholder="••••••••" 
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <button disabled={status === "loading"} className="w-full bg-primary-fixed text-on-primary-fixed py-5 rounded-lg font-bold text-lg hover:shadow-[0_0_15px_rgba(213,240,0,0.3)] transition-all flex items-center justify-center gap-2 mt-4">
              {status === "loading" && <span className="material-symbols-outlined animate-spin">progress_activity</span>}
              Зареєструватися
            </button>
            
            <p className="text-center text-secondary-fixed-dim text-sm mt-6">
              Вже маєте акаунт? <Link href="/admin" className="text-primary-fixed hover:underline">Увійти</Link>
            </p>
          </form>
        )}
      </motion.div>
    </main>
  );
};

export default RegisterPage;
