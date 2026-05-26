"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";

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
    if (!iconName) return <Icons.Zap className="text-primary-fixed mb-4" size={36} />;
    const IconComponent = (Icons as any)[iconName];
    if (IconComponent) {
      return <IconComponent className="text-primary-fixed mb-4" size={36} />;
    }
    return <Icons.Zap className="text-primary-fixed mb-4" size={36} />;
  };

  const getGridClasses = (index: number) => {
    const patternIndex = index % 5;
    if (patternIndex === 0) return "sm:col-span-2 lg:col-span-2 lg:row-span-1";
    if (patternIndex === 1) return "sm:col-span-1 lg:col-span-1 lg:row-span-2";
    if (patternIndex === 4) return "sm:col-span-2 lg:col-span-3 lg:row-span-1"; 
    return "sm:col-span-1 lg:col-span-1 lg:row-span-1";
  };

  return (
    <section className="py-16 md:py-24 px-4 md:px-margin-desktop max-w-container-max mx-auto" id="services">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-4"
      >
        <div className="max-w-xl">
          <span className="text-primary-fixed font-label-md tracking-widest uppercase mb-2 md:mb-4 block">{content.servicesSub}</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">{content.servicesTitle}</h2>
        </div>
        <div className="h-px bg-outline-variant/30 flex-grow mx-8 mb-4 hidden md:block"></div>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-4 md:gap-6 h-auto lg:min-h-[800px]">
        {servicesList.length > 0 ? servicesList.filter((s: any) => s.isFeatured).map((service, idx) => (
          <motion.div 
            key={service.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className={getGridClasses(idx)}
          >
            <Link 
              href={`/services/${service.slug}`} 
              className={`h-full w-full bg-surface-container rounded-xl p-6 md:p-8 border border-outline-variant/20 group hover:border-primary-fixed/40 transition-all flex flex-col justify-between overflow-hidden relative block`}
            >
              <div className="relative z-10">
                {renderIcon(service.icon)}
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{service.title}</h3>
                <p className="text-sm md:text-base text-secondary-fixed-dim max-w-md line-clamp-3">{service.description}</p>
              </div>
              {service.image && (
                <img 
                  className={`absolute right-0 bottom-0 ${idx % 5 === 1 ? 'w-full h-1/2' : 'w-1/2 h-full'} object-cover opacity-20 grayscale group-hover:scale-105 transition-transform`} 
                  src={service.image} 
                  alt={service.title}
                />
              )}
            </Link>
          </motion.div>
        )) : (
          <div className="col-span-3 text-center py-20 text-secondary-fixed-dim">
            Немає доданих послуг
          </div>
        )}
      </div>
      <div className="mt-16 text-center">
        <Link href="/services" className="inline-flex items-center gap-2 px-8 py-4 bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 hover:border-primary-fixed/50 rounded-full font-bold text-white transition-all group">
          Всі послуги
          <Icons.ArrowRight className="text-primary-fixed group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
};

export default Services;
