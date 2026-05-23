"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import { useState, useEffect } from "react";

const Header = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [content, setContent] = useState({
    contactPhone: "+38 (097) 555-01-99",
    contactEmail: "info@voltpremium.ua"
  });

  useEffect(() => {
    fetch("/api/content").then(res => res.json()).then(data => {
      if (data.contactPhone) setContent(data);
    });
  }, []);

  return (
    <header className="w-full sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-outline-variant/30">
      <nav className="flex justify-between items-center max-w-container-max mx-auto px-margin-desktop py-base">
        <Link href="/" className="font-display-lg text-headline-xl tracking-tighter text-primary-fixed flex items-center gap-2">
          <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
          VOLT PREMIUM
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "Послуги", href: "/services" },
            { label: "Ціни", href: "/#pricing" },
            { label: "Про нас", href: "/#about" },
            { label: "Стандарти якості", href: "/standards" },
            { label: "Контакти", href: "/#contacts" },
          ].map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.label}
                className={`transition-colors duration-300 font-label-md text-label-md ${
                  isActive 
                    ? "text-primary-fixed font-bold border-b-2 border-primary-fixed pb-1"
                    : "text-secondary-fixed-dim hover:text-primary-fixed"
                }`} 
                href={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden xl:flex flex-col items-end mr-4">
            <a href={`tel:${content.contactPhone.replace(/[^\d+]/g, '')}`} className="text-white font-bold text-sm hover:text-primary-fixed transition-colors">
              {content.contactPhone}
            </a>
            <a href={`mailto:${content.contactEmail}`} className="text-secondary-fixed-dim text-xs hover:text-primary-fixed transition-colors">
              {content.contactEmail}
            </a>
          </div>
          {session ? (
            <Link
              href="/admin"
              className="hidden md:flex items-center gap-2 text-secondary-fixed-dim hover:text-primary-fixed transition-colors duration-300 font-label-md text-label-md"
            >
              <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
              <span>{session.user?.name || "Адмін"}</span>
            </Link>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className="text-secondary-fixed-dim hover:text-primary-fixed transition-colors duration-300 font-label-md text-label-md"
              >
                Увійти
              </Link>
              <Link
                href="/register"
                className="border border-outline-variant/50 text-secondary-fixed-dim hover:border-primary-fixed/50 hover:text-primary-fixed px-4 py-2 rounded-lg transition-all duration-300 font-label-md text-label-md"
              >
                Реєстрація
              </Link>
            </div>
          )}

        </div>
      </nav>
    </header>
  );
};

export default Header;
