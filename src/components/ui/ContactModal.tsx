"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrice?: number;
}

const ContactModal = ({ isOpen, onClose, initialPrice }: ContactModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    serviceType: "Повний електромонтаж",
    comment: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

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
        setTimeout(() => {
          setStatus("idle");
          onClose();
        }, 5000);
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-surface-container border border-outline-variant/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 flex justify-between items-center border-b border-outline-variant/20 shrink-0">
          <h3 className="font-headline-sm text-white">Залишити заявку</h3>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors text-secondary-fixed-dim hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {status === "success" ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-20 h-20 bg-primary-fixed/10 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-primary-fixed text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">Дякуємо!</h3>
                <p className="text-secondary-fixed-dim">
                  Вашу заявку прийнято. Технічний спеціаліст зв'яжеться з вами найближчим часом.
                </p>
              </div>
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
              <div className="space-y-2">
                <label className="font-label-sm text-secondary-fixed-dim">Ім'я</label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed outline-none transition-all"
                  placeholder="Олександр"
                  type="text"
                />
              </div>
              <div className="space-y-2">
                <label className="font-label-sm text-secondary-fixed-dim">Телефон</label>
                <input
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed outline-none transition-all"
                  placeholder="+380"
                  type="tel"
                />
              </div>
              <div className="space-y-2">
                <label className="font-label-sm text-secondary-fixed-dim">Тип послуги</label>
                <div className="relative">
                  <select
                    value={formData.serviceType}
                    onChange={(e) => setFormData(prev => ({ ...prev, serviceType: e.target.value }))}
                    className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed outline-none transition-all appearance-none"
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
                  onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                  className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed outline-none transition-all"
                  placeholder="Опишіть ваш проєкт..."
                  rows={3}
                />
              </div>
              <button 
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-primary-fixed text-on-primary-fixed py-4 rounded-lg font-bold hover:shadow-[0_0_15px_rgba(213,240,0,0.3)] transition-all"
              >
                {status === "loading" ? "Відправка..." : "Відправити заявку"}
              </button>
              {status === "error" && (
                <p className="text-error text-center font-bold text-sm">
                  Помилка при відправці. Спробуйте ще раз.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
