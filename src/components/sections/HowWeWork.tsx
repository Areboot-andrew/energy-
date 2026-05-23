"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface WorkStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

export default function HowWeWork() {
  const [steps, setSteps] = useState<WorkStep[]>([]);

  useEffect(() => {
    fetch("/api/work-steps").then(res => res.json()).then(data => setSteps(data));
  }, []);

  if (steps.length === 0) return null;

  return (
    <section className="py-16 md:py-24 px-4 md:px-margin-desktop max-w-container-max mx-auto border-t border-outline-variant/10">
      <div className="mb-12 md:mb-16 text-center max-w-3xl mx-auto">
        <span className="text-primary-fixed font-label-md tracking-widest uppercase mb-2 md:mb-4 block">Процес</span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">Як ми працюємо</h2>
        <p className="text-secondary-fixed-dim text-base md:text-lg">Прозорий та зрозумілий процес роботи над вашим об'єктом від першого дзвінка до здачі в експлуатацію.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
        {/* Connection Line */}
        <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-outline-variant/20 z-0"></div>

        {steps.map((step, index) => (
          <motion.div 
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="relative z-10 flex flex-col items-center text-center group"
          >
            <div className="w-24 h-24 rounded-3xl bg-surface-container border border-outline-variant/20 flex items-center justify-center mb-6 group-hover:border-primary-fixed/50 group-hover:shadow-[0_0_30px_rgba(213,240,0,0.15)] transition-all relative">
              <div className="absolute inset-0 rounded-3xl bg-primary-fixed/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              {step.icon.startsWith('<svg') ? (
                <div dangerouslySetInnerHTML={{ __html: step.icon }} className="w-10 h-10 text-primary-fixed" />
              ) : (
                <span className="material-symbols-outlined text-4xl text-primary-fixed">{step.icon || 'check_circle'}</span>
              )}
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed font-bold flex items-center justify-center text-sm border-4 border-background">
                {step.order || index + 1}
              </div>
            </div>
            <h3 className="font-bold text-white text-xl mb-3">{step.title}</h3>
            <div className="text-secondary-fixed-dim text-sm prose prose-invert prose-sm" dangerouslySetInnerHTML={{ __html: step.description }} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
