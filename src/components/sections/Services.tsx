"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const Services = () => {
  const [servicesList, setServicesList] = useState<any[]>([]);
  const [content, setContent] = useState({
    servicesTitle: "Комплексні рішення для будь-якої складності",
    servicesSub: "Що ми робимо"
  });

  useEffect(() => {
    fetch("/api/content").then(res => res.json()).then(data => {
      if (data.servicesTitle) setContent(data);
    });
    fetch("/api/services").then(res => res.json()).then(data => {
      setServicesList(data);
    });
  }, []);

  const renderIcon = (iconName: string) => {
    // If it's empty, use a fallback
    if (!iconName) return <span className="material-symbols-outlined text-primary-fixed text-4xl mb-4">settings_input_component</span>;
    // Check if it's an SVG (e.g., from our IconPicker, which usually outputs PascalCase names for Lucide or raw SVG).
    // For now we assume if it's a short word it's a material icon, or just render it. 
    // Wait, the new standard for services icon is from IconPicker which gives Lucide names. 
    // Actually, let's keep it simple. If it's a long string it might be SVG, otherwise material.
    // For maximum compatibility, let's just render the name if it's material-symbols or try to use it.
    // Assuming the user might use IconPicker, let's just use the icon string. If it's material, we use the span.
    return <span className="material-symbols-outlined text-primary-fixed text-4xl mb-4">{iconName}</span>;
  };

  const getGridClasses = (index: number) => {
    if (index === 0) return "md:col-span-2 md:row-span-1";
    if (index === 1) return "md:col-span-1 md:row-span-2";
    if (index === 4) return "md:col-span-3 md:row-span-1"; // Full width for the 5th item
    return "md:col-span-1 md:row-span-1";
  };

  return (
    <section className="py-24 px-margin-desktop max-w-container-max mx-auto" id="services">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
        <div className="max-w-xl">
          <span className="text-primary-fixed font-label-md tracking-widest uppercase mb-4 block">{content.servicesSub}</span>
          <h2 className="font-headline-xl text-display-lg-mobile md:text-headline-xl">{content.servicesTitle}</h2>
        </div>
        <div className="h-px bg-outline-variant/30 flex-grow mx-8 mb-4 hidden md:block"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-fr gap-6 h-auto md:min-h-[800px]">
        {servicesList.length > 0 ? servicesList.filter((s: any) => s.isFeatured).slice(0, 5).map((service, idx) => (
          <Link 
            key={service.id} 
            href={`/services/${service.slug}`} 
            className={`${getGridClasses(idx)} bg-surface-container rounded-xl p-8 border border-outline-variant/20 group hover:border-primary-fixed/40 transition-all flex flex-col justify-between overflow-hidden relative block`}
          >
            <div className="relative z-10">
              {renderIcon(service.icon)}
              <h3 className="font-headline-lg text-white mb-2">{service.title}</h3>
              <p className="text-secondary-fixed-dim max-w-md">{service.description}</p>
            </div>
            {service.image && (
              <img 
                className={`absolute right-0 bottom-0 ${idx === 1 ? 'w-full h-1/2' : 'w-1/2 h-full'} object-cover opacity-20 grayscale group-hover:scale-105 transition-transform`} 
                src={service.image} 
                alt={service.title}
              />
            )}
          </Link>
        )) : (
          <div className="col-span-3 text-center py-20 text-secondary-fixed-dim">
            Немає доданих послуг
          </div>
        )}
      </div>
      <div className="mt-16 text-center">
        <Link href="/services" className="inline-flex items-center gap-2 px-8 py-4 bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 hover:border-primary-fixed/50 rounded-full font-bold text-white transition-all group">
          Всі послуги
          <span className="material-symbols-outlined text-primary-fixed group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </Link>
      </div>
    </section>
  );
};

export default Services;
