"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface ContactsProps {
  initialPrice?: number;
}

const Contacts = ({ initialPrice }: ContactsProps) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    serviceType: "Повний електромонтаж",
    comment: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [content, setContent] = useState({
    contactPhone: "+38 (097) 555-01-99",
    contactEmail: "info@voltpremium.ua"
  });

  useEffect(() => {
    fetch("/api/content").then(res => res.json()).then(data => {
      if (data.contactPhone) setContent(data);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          totalPrice: initialPrice,
        }),
      });
      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", phone: "", serviceType: "Повний електромонтаж", comment: "" });
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <section className="py-24 px-margin-desktop" id="contacts">
      <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div className="lg:col-span-5 space-y-12">
          <div>
            <h2 className="font-display-lg text-headline-xl mb-6">Готові розпочати проєкт?</h2>
            <p className="text-secondary-fixed-dim text-body-lg">
              Залиште заявку, і наш технічний спеціаліст зв'яжеться з вами для уточнення деталей.
            </p>
          </div>
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-surface-container rounded-lg border border-outline-variant/20">
                <span className="material-symbols-outlined text-primary-fixed text-3xl">phone_in_talk</span>
              </div>
              <div>
                <p className="text-secondary-fixed-dim text-sm">Телефон</p>
                <p className="text-white font-headline-lg">{content.contactPhone}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="p-4 bg-surface-container rounded-lg border border-outline-variant/20">
                <span className="material-symbols-outlined text-primary-fixed text-3xl">alternate_email</span>
              </div>
              <div>
                <p className="text-secondary-fixed-dim text-sm">Email</p>
                <p className="text-white font-headline-lg">{content.contactEmail}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <a className="w-12 h-12 rounded-lg bg-surface-container border border-outline-variant/20 flex items-center justify-center hover:bg-primary-fixed hover:text-black transition-all" href="#">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.247 2.242 1.308 3.607.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.332 2.633-1.308 3.608-.975.975-2.242 1.247-3.607 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.308-.975-.975-1.247-2.242-1.308-3.607-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.247 3.607-1.308 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.058-1.281.072-1.689.072-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a className="w-12 h-12 rounded-lg bg-surface-container border border-outline-variant/20 flex items-center justify-center hover:bg-primary-fixed hover:text-black transition-all" href="#">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          </div>
        </div>
        <div className="lg:col-span-7 bg-surface-container p-8 rounded-2xl border border-outline-variant/20">
          {status === "success" ? (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-20 h-20 bg-primary-fixed/10 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-primary-fixed text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-white">Дякуємо!</h3>
                <p className="text-secondary-fixed-dim text-lg">
                  Вашу заявку прийнято. Технічний спеціаліст зв'яжеться з вами найближчим часом.
                </p>
              </div>
              <button 
                onClick={() => setStatus("idle")} 
                className="bg-primary-fixed text-on-primary-fixed px-6 py-3 rounded-lg font-bold hover:shadow-[0_0_15px_rgba(213,240,0,0.3)] transition-all duration-200"
              >
                Надіслати ще одну
              </button>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {initialPrice && initialPrice > 0 && (
                <div className="bg-primary-fixed/5 border border-primary-fixed/20 p-4 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary-fixed">calculate</span>
                    <div>
                      <span className="text-white font-bold block text-sm">Попередній прорахунок</span>
                    </div>
                  </div>
                  <span className="text-primary-fixed font-bold text-xl">{initialPrice.toLocaleString()} ₴</span>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-label-sm text-secondary-fixed-dim">Ім'я</label>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-4 text-white focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed outline-none transition-all"
                    placeholder="Олександр"
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label-sm text-secondary-fixed-dim">Телефон</label>
                  <input
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-4 text-white focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed outline-none transition-all"
                    placeholder="+380"
                    type="tel"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-label-sm text-secondary-fixed-dim">Тип послуги</label>
                <div className="relative">
                  <select
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                    className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-4 text-white focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed outline-none transition-all appearance-none"
                  >
                    <option>Повний електромонтаж</option>
                    <option>Сонячні станції</option>
                    <option>Розумний дім</option>
                    <option>Встановлення EV зарядки</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-secondary-fixed-dim">expand_more</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-label-sm text-secondary-fixed-dim">Коментар</label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-4 text-white focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed outline-none transition-all"
                  placeholder="Опишіть ваш проєкт..."
                  rows={4}
                />
              </div>
              <button 
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-primary-fixed text-on-primary-fixed py-5 rounded-lg font-bold text-lg hover:shadow-[0_0_15px_rgba(213,240,0,0.3)] transition-all"
              >
                {status === "loading" ? "Відправка..." : "Відправити запит"}
              </button>
              {status === "error" && (
                <p className="text-red-500 text-center font-bold">
                  Помилка при відправці. Спробуйте ще раз або зателефонуйте нам.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contacts;
