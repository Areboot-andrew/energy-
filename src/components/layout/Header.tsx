"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import ContactButton from "@/components/ui/ContactButton";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [content, setContent] = useState<any>({
    contactPhone: "+38 098 732 85 63",
    contactEmail: "tarasbuina2@icloud.com",
    logoType: "TEXT",
    logoText: "VOLT PREMIUM"
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/content").then(res => res.json()).then(data => {
      if (data) {
        try { data.phones = JSON.parse(data.phones || "[]"); } catch { data.phones = []; }
        try { data.navLinks = JSON.parse(data.navLinks || "[]"); } catch { data.navLinks = []; }
        setContent(data);
      }
    });
  }, []);

  return (
    <header className="w-full sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-outline-variant/30">
      <nav className="flex justify-between items-center max-w-container-max mx-auto px-margin-desktop py-base">
        <Link href="/" className="font-display-lg text-headline-xl tracking-tighter text-primary-fixed flex items-center gap-2">
          {content.logoType === "IMAGE" && content.logoImageUrl ? (
            <img src={content.logoImageUrl} alt={content.companyName || "Logo"} className="h-10 object-contain" />
          ) : content.logoType === "SVG" && content.logoSvgCode ? (
            <div dangerouslySetInnerHTML={{ __html: content.logoSvgCode }} className="h-10 flex items-center" />
          ) : (
            <>
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
              {content.logoText || content.companyName || "VOLT PREMIUM"}
            </>
          )}
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          {(content.navLinks || [
            { label: "Послуги", href: "/services", isVisible: true },
            { label: "Ціни", href: "/pricing", isVisible: true },
            { label: "Про нас", href: "/about", isVisible: true },
            { label: "Портфоліо", href: "/portfolio", isVisible: true },
            { label: "Блог", href: "/blog", isVisible: true },
            { label: "Контакти", href: "/#contacts", isVisible: true },
          ]).filter((item: any) => item.isVisible).map((item: any) => {
            const isActive = pathname === item.href;
            if (item.href === "/#contacts" || item.label.toLowerCase() === "контакти") {
              return (
                <ContactButton 
                  key={item.label}
                  className="transition-colors duration-300 font-label-md text-label-md text-secondary-fixed-dim hover:text-primary-fixed"
                >
                  {item.label}
                </ContactButton>
              );
            }
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
            <a href={`tel:${(content.phones && content.phones[0]) ? content.phones[0].replace(/[^\d+]/g, '') : content.contactPhone?.replace(/[^\d+]/g, '')}`} className="text-white font-bold text-sm hover:text-primary-fixed transition-colors">
              {(content.phones && content.phones[0]) ? content.phones[0] : content.contactPhone}
            </a>
            <a href={`mailto:${content.contactEmail}`} className="text-secondary-fixed-dim text-xs hover:text-primary-fixed transition-colors">
              {content.contactEmail}
            </a>
          </div>
          {session ? (
            <Link
              href={session.user?.role === "ADMIN" ? "/admin" : "/dashboard"}
              className="hidden md:flex items-center gap-2 text-secondary-fixed-dim hover:text-primary-fixed transition-colors duration-300 font-label-md text-label-md bg-surface-container-high px-4 py-2 rounded-full border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-lg">
                {session.user?.role === "ADMIN" ? "admin_panel_settings" : "account_circle"}
              </span>
              <span>{session.user?.name || "Кабінет"}</span>
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
          
          <button 
            className="md:hidden text-white hover:text-primary-fixed transition-colors ml-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-outline-variant/30 flex flex-col items-center py-6 gap-6 shadow-2xl animate-in slide-in-from-top-2">
          {(content.navLinks || [
            { label: "Послуги", href: "/services", isVisible: true },
            { label: "Ціни", href: "/pricing", isVisible: true },
            { label: "Про нас", href: "/about", isVisible: true },
            { label: "Портфоліо", href: "/portfolio", isVisible: true },
            { label: "Блог", href: "/blog", isVisible: true },
            { label: "Контакти", href: "/#contacts", isVisible: true },
          ]).filter((item: any) => item.isVisible).map((item: any) => {
            const isActive = pathname === item.href;
            if (item.href === "/#contacts" || item.label.toLowerCase() === "контакти") {
              return (
                <ContactButton 
                  key={item.label}
                  className="text-lg transition-colors duration-300 font-bold text-white hover:text-primary-fixed"
                >
                  {item.label}
                </ContactButton>
              );
            }
            return (
              <Link 
                key={item.label}
                className={`text-lg transition-colors duration-300 font-bold ${
                  isActive ? "text-primary-fixed" : "text-white hover:text-primary-fixed"
                }`} 
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
          
          <div className="flex flex-col items-center mt-4 border-t border-outline-variant/30 pt-6 w-3/4">
            <a href={`tel:${(content.phones && content.phones[0]) ? content.phones[0].replace(/[^\d+]/g, '') : content.contactPhone?.replace(/[^\d+]/g, '')}`} className="text-white font-bold text-lg hover:text-primary-fixed transition-colors mb-2">
              {(content.phones && content.phones[0]) ? content.phones[0] : content.contactPhone}
            </a>
            {session ? (
              <Link
                href={session.user?.role === "ADMIN" ? "/admin" : "/dashboard"}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-primary-fixed font-bold text-lg mt-4 flex items-center gap-2 bg-primary-fixed/10 px-6 py-3 rounded-full border border-primary-fixed/30"
              >
                <span className="material-symbols-outlined text-xl">
                  {session.user?.role === "ADMIN" ? "admin_panel_settings" : "account_circle"}
                </span>
                {session.user?.role === "ADMIN" ? "Адмін Панель" : "Особистий Кабінет"}
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-secondary-fixed-dim hover:text-primary-fixed transition-colors font-bold mt-4"
              >
                Увійти
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
