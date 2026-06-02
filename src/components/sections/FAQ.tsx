"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HighlightedTitle from "@/components/ui/HighlightedTitle";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
}

const FAQSection = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [content, setContent] = useState({ 
    faqTitle: "Часті запитання",
    faqBadge: "Запитання-відповіді"
  });

  useEffect(() => {
    fetch("/api/faq")
      .then((res) => res.json())
      .then((data) => setFaqs(data));

    fetch("/api/content").then(res => res.json()).then(data => {
      if (data) setContent(prev => ({ ...prev, ...data }));
    });
  }, []);

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  if (faqs.length === 0) return null;

  return (
    <section className="py-24 px-margin-desktop max-w-3xl mx-auto" id="faq">
      <div className="text-center mb-12">
        <span className="text-primary-fixed font-label-md tracking-widest uppercase mb-4 block">{content.faqBadge}</span>
        <HighlightedTitle text={content.faqTitle} className="font-headline-xl text-3xl md:text-4xl lg:text-headline-xl text-white" as="h2" />
      </div>

      <div className="space-y-4">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className={`border rounded-xl transition-colors duration-300 ${
                isOpen ? "border-primary-fixed bg-surface-container-low" : "border-outline-variant/30 bg-surface-container-lowest hover:border-primary-fixed/50"
              }`}
            >
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
              >
                <span className={`font-bold text-lg transition-colors ${isOpen ? "text-primary-fixed" : "text-white"}`}>
                  {faq.question}
                </span>
                <span
                  className={`material-symbols-outlined text-primary-fixed transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  keyboard_arrow_down
                </span>
              </button>
              
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-0 text-secondary-fixed-dim text-base leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQSection;
