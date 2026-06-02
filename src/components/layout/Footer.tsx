"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import ContactButton from "@/components/ui/ContactButton";
import { useSession } from "next-auth/react";
import { Instagram, Facebook, Linkedin, Mail, Send, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const { data: session } = useSession();
  const [settings, setSettings] = useState<any>({
    contactPhone: "+38 098 732 85 63",
    contactEmail: "tarasbuina2@icloud.com",
    contactAddress: "м. Львів, вул. Івана Огієнка, 15",
    logoText: "VOLT PREMIUM",
    companyName: "VOLT PREMIUM",
    footerText: "Професійні електромонтажні рішення для життя та бізнесу. Надійність, що вимірюється роками.",
    footerLinksTitle: "Швидкі посилання",
    footerScheduleTitle: "Графік роботи",
    footerSchedule: "Пн — Пт: 09:00 - 19:00\nСб: 10:00 - 16:00\nНд: Вихідний",
    footerOfficeText: "Офіс (для зустрічі):",
    footerCopyright: "Професійні електромонтажні рішення."
  });

  useEffect(() => {
    fetch("/api/content").then(res => res.json()).then(data => {
      if (data) {
        try { data.phones = JSON.parse(data.phones || "[]"); } catch { data.phones = []; }
        try { data.socials = JSON.parse(data.socials || "[]"); } catch { data.socials = []; }
        try { data.navLinks = JSON.parse(data.navLinks || "[]"); } catch { data.navLinks = []; }
        setSettings(data);
      }
    });
  }, []);

  const getSocialIcon = (network: string) => {
    switch (network.toLowerCase()) {
      case 'instagram': return <Instagram size={24} />;
      case 'facebook': return <Facebook size={24} />;
      case 'linkedin': return <Linkedin size={24} />;
      case 'telegram': return <Send size={24} />;
      case 'email': return <Mail size={24} />;
      default: return <span className="material-symbols-outlined text-2xl">public</span>;
    }
  };

  return (
    <footer className="w-full py-12 md:py-16 bg-surface-container-lowest border-t border-outline-variant/20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-gutter max-w-container-max mx-auto px-4 md:px-margin-desktop">
        <div className="space-y-6">
          <div className="font-headline-xl text-headline-xl font-bold text-primary-fixed">
            {settings.logoType === "IMAGE" && settings.logoImageUrl ? (
              <img src={settings.logoImageUrl} alt={settings.companyName} className="h-12 object-contain" />
            ) : settings.logoType === "SVG" && settings.logoSvgCode ? (
              <div dangerouslySetInnerHTML={{ __html: settings.logoSvgCode }} className="h-12 flex items-center" />
            ) : (
              settings.logoText || settings.companyName || "VOLT PREMIUM"
            )}
          </div>
          <p className="text-secondary-fixed-dim font-body-md max-w-xs whitespace-pre-wrap">
            {settings.footerText}
          </p>
          <div className="flex gap-4">
            {(settings.socials || []).filter((s: any) => s.isVisible).map((social: any, idx: number) => (
              <a
                key={idx}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-lg bg-surface-container border border-outline-variant/20 flex items-center justify-center hover:bg-primary-fixed hover:text-black transition-all"
              >
                {getSocialIcon(social.network)}
              </a>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <h4 className="text-white font-label-md uppercase tracking-widest">{settings.footerLinksTitle}</h4>
          <div className="flex flex-col gap-3">
            {(settings.navLinks || [
              { label: "Послуги", href: "/services", isVisible: true },
              { label: "Ціни", href: "/pricing", isVisible: true },
              { label: "Портфоліо", href: "/portfolio", isVisible: true },
              { label: "Контакти", href: "/#contacts", isVisible: true },
            ]).filter((item: any) => item.isVisible).map((item: any, idx: number) => {
              if (item.href === "/#contacts" || item.label.toLowerCase() === "контакти") {
                return (
                  <ContactButton key={idx} className="text-secondary-fixed-dim hover:text-primary-fixed transition-colors font-body-md text-left">
                    {item.label}
                  </ContactButton>
                );
              }
              return (
                <Link key={idx} className="text-secondary-fixed-dim hover:text-primary-fixed transition-colors font-body-md" href={item.href}>
                  {item.label}
                </Link>
              );
            })}
            <div className="h-px bg-outline-variant/20 my-1" />
            {session ? (
              <Link className="text-primary-fixed hover:text-primary-fixed-dim transition-colors font-body-md flex items-center gap-2" href="/admin">
                <span className="material-symbols-outlined text-base">admin_panel_settings</span>
                Панель керування
              </Link>
            ) : (
              <>
                <Link className="text-secondary-fixed-dim hover:text-primary-fixed transition-colors font-body-md" href="/login">Увійти</Link>
                <Link className="text-secondary-fixed-dim hover:text-primary-fixed transition-colors font-body-md" href="/register">Реєстрація</Link>
              </>
            )}
          </div>
        </div>
        <div className="space-y-6">
          <h4 className="text-white font-label-md uppercase tracking-widest">{settings.footerScheduleTitle}</h4>
          <div className="space-y-2 text-secondary-fixed-dim font-body-md whitespace-pre-wrap">
            {settings.footerSchedule}
          </div>
          <div className="space-y-3 pt-2">
            {settings.phones && settings.phones.length > 0 ? settings.phones.map((phone: string, idx: number) => (
              <a key={idx} href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="flex items-center gap-3 text-secondary-fixed-dim hover:text-primary-fixed transition-colors">
                <Phone className="text-primary-fixed" size={20} />
                {phone}
              </a>
            )) : (
              <a href={`tel:${settings.contactPhone?.replace(/[^\d+]/g, '')}`} className="flex items-center gap-3 text-secondary-fixed-dim hover:text-primary-fixed transition-colors">
                <Phone className="text-primary-fixed" size={20} />
                {settings.contactPhone}
              </a>
            )}
            <a href={`mailto:${settings.contactEmail}`} className="flex items-center gap-3 text-secondary-fixed-dim hover:text-primary-fixed transition-colors">
              <Mail className="text-primary-fixed" size={20} />
              {settings.contactEmail}
            </a>
            <div className="flex items-start gap-3 text-secondary-fixed-dim pt-2">
              <MapPin className="text-primary-fixed shrink-0 mt-1" size={20} />
              <span>
                {settings.footerOfficeText}<br/>
                {settings.contactAddress}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop mt-12 md:mt-16 pt-8 border-t border-outline-variant/10 text-center">
        <p className="text-secondary-fixed-dim font-label-sm">© {new Date().getFullYear()} {settings.companyName || "VOLT PREMIUM"}. {settings.footerCopyright}</p>
      </div>
    </footer>
  );
};

export default Footer;
