"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react";
import ContactButton from "@/components/ui/ContactButton";

interface ContactsProps {
  initialPrice?: number;
}

const Contacts = ({ initialPrice }: ContactsProps) => {
  const [content, setContent] = useState({
    contactPhone: "+38 098 732 85 63",
    contactEmail: "tarasbuina2@icloud.com",
    instagram: "https://www.instagram.com/electric_lviv?igsh=OGY2NDgwaGJsbDl3",
    facebook: "",
  });

  useEffect(() => {
    fetch("/api/content").then(res => res.json()).then(data => {
      if (data.contactPhone) {
        setContent(prev => ({ ...prev, ...data }));
      }
    });
  }, []);

  // Map URL for Львів, Івана Огієнка 15
  const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2572.9348982352875!2d24.015291476884632!3d49.8436660309066!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x473add775bb05d8f%3A0xbcc0e2b467cb561!2z0LLRg9C70LjRhtGPINCG0LLQsNC90LAg0J7Qs9GW0ZTQvdC60LAsIDE1LCDQm9GM0LLRltCyLCDQm9GM0LLRltCy0YHRjNC60LAg0L7QsdC70LDRgdGC0YwsIDc5MDAw!5e0!3m2!1suk!2sua!4v1714571987515!5m2!1suk!2sua";

  return (
    <>
      <section className="py-24 px-margin-desktop bg-surface-dim" id="contacts">
        <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          <div className="lg:col-span-5 space-y-12">
            <div>
              <h2 className="font-headline-xl mb-6 text-white">Зв'яжіться з нами</h2>
              <p className="text-secondary-fixed-dim text-body-lg">
                Запрошуємо до нашого офісу для обговорення вашого проєкту або залиште заявку онлайн.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-surface-container rounded-lg border border-outline-variant/20 mt-1">
                  <MapPin className="text-primary-fixed" size={24} />
                </div>
                <div>
                  <p className="text-secondary-fixed-dim font-label-md uppercase tracking-wider mb-1">Офіс (Для зустрічі)</p>
                  <p className="text-white font-body-lg">Львів, вул. Івана Огієнка, 15</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-surface-container rounded-lg border border-outline-variant/20 mt-1">
                  <Phone className="text-primary-fixed" size={24} />
                </div>
                <div>
                  <p className="text-secondary-fixed-dim font-label-md uppercase tracking-wider mb-1">Телефон</p>
                  <a href={`tel:${content.contactPhone}`} className="text-white font-body-lg hover:text-primary-fixed transition-colors block">
                    {content.contactPhone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-surface-container rounded-lg border border-outline-variant/20 mt-1">
                  <Mail className="text-primary-fixed" size={24} />
                </div>
                <div>
                  <p className="text-secondary-fixed-dim font-label-md uppercase tracking-wider mb-1">Email</p>
                  <a href={`mailto:${content.contactEmail}`} className="text-white font-body-lg hover:text-primary-fixed transition-colors block">
                    {content.contactEmail}
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-outline-variant/20">
              <p className="text-secondary-fixed-dim font-label-md uppercase tracking-wider mb-4">Ми в соцмережах</p>
              <div className="flex gap-4">
                {content.instagram && (
                  <a href={content.instagram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-lg bg-surface-container border border-outline-variant/20 flex items-center justify-center hover:bg-primary-fixed hover:text-black transition-all">
                    <Instagram size={24} />
                  </a>
                )}
                {content.facebook && (
                  <a href={content.facebook} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-lg bg-surface-container border border-outline-variant/20 flex items-center justify-center hover:bg-primary-fixed hover:text-black transition-all">
                    <Facebook size={24} />
                  </a>
                )}
              </div>
            </div>

            <div className="pt-4">
              <ContactButton className="w-full sm:w-auto bg-primary-fixed text-on-primary-fixed px-10 py-5 rounded-xl font-bold uppercase tracking-widest text-sm hover:shadow-[0_0_30px_rgba(213,240,0,0.4)] transition-all flex items-center justify-center gap-2">
                <span>Залишити заявку онлайн</span>
              </ContactButton>
            </div>
          </div>

          <div className="lg:col-span-7 h-[400px] lg:h-auto rounded-2xl overflow-hidden border border-outline-variant/20 shadow-2xl relative bg-surface-container group">
            <div className="absolute inset-0 bg-primary-fixed/5 group-hover:bg-transparent transition-colors z-10 pointer-events-none"></div>
            <iframe 
              src={mapUrl}
              width="100%" 
              height="100%" 
              style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) contrast(1.1)" }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
            ></iframe>
          </div>
        </div>
      </section>

      <ContactModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialPrice={initialPrice}
      />
    </>
  );
};

export default Contacts;
