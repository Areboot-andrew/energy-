"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const Footer = () => {
  const { data: session } = useSession();
  const [socials, setSocials] = useState({
    instagram: "#",
    linkedin: "#",
    facebook: "#",
    contactPhone: "+38 (097) 555-01-99",
    contactEmail: "info@voltpremium.ua"
  });

  useEffect(() => {
    fetch("/api/content").then(res => res.json()).then(data => {
      if (data.instagram || data.contactPhone) setSocials(data);
    });
  }, []);

  return (
    <footer className="w-full py-16 bg-surface-container-lowest border-t border-outline-variant/20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter max-w-container-max mx-auto px-margin-desktop">
        <div className="space-y-6">
          <div className="font-headline-xl text-headline-xl font-bold text-primary-fixed">VOLT PREMIUM</div>
          <p className="text-secondary-fixed-dim font-body-md max-w-xs">
            Професійні електромонтажні рішення для життя та бізнесу. Надійність, що вимірюється роками.
          </p>
          <div className="flex gap-4">
            <a
              href={socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-lg bg-surface-container border border-outline-variant/20 flex items-center justify-center hover:bg-primary-fixed hover:text-black transition-all"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.247 2.242 1.308 3.607.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.332 2.633-1.308 3.608-.975.975-2.242 1.247-3.607 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.308-.975-.975-1.247-2.242-1.308-3.607-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.247 3.607-1.308 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.058-1.281.072-1.689.072-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a
              href={socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-lg bg-surface-container border border-outline-variant/20 flex items-center justify-center hover:bg-primary-fixed hover:text-black transition-all"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          </div>
        </div>
        <div className="space-y-6">
          <h4 className="text-white font-label-md uppercase tracking-widest">Швидкі посилання</h4>
          <div className="flex flex-col gap-3">
            <Link className="text-secondary-fixed-dim hover:text-primary-fixed transition-colors font-body-md" href="/#services">Послуги</Link>
            <Link className="text-secondary-fixed-dim hover:text-primary-fixed transition-colors font-body-md" href="/#pricing">Ціни</Link>
            <Link className="text-secondary-fixed-dim hover:text-primary-fixed transition-colors font-body-md" href="/portfolio">Наші роботи</Link>
            <Link className="text-secondary-fixed-dim hover:text-primary-fixed transition-colors font-body-md" href="/standards">Стандарти якості</Link>
            <Link className="text-secondary-fixed-dim hover:text-primary-fixed transition-colors font-body-md" href="/#contacts">Контакти</Link>
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
          <h4 className="text-white font-label-md uppercase tracking-widest">Графік роботи</h4>
          <div className="space-y-2 text-secondary-fixed-dim font-body-md">
            <p>Пн — Пт: 09:00 - 19:00</p>
            <p>Сб: 10:00 - 16:00</p>
            <p>Нд: Вихідний</p>
          </div>
          <div className="space-y-3 pt-2">
            <a href={`tel:${socials.contactPhone.replace(/[^\d+]/g, '')}`} className="flex items-center gap-3 text-secondary-fixed-dim hover:text-primary-fixed transition-colors">
              <span className="material-symbols-outlined text-primary-fixed text-xl">phone_in_talk</span>
              {socials.contactPhone}
            </a>
            <a href={`mailto:${socials.contactEmail}`} className="flex items-center gap-3 text-secondary-fixed-dim hover:text-primary-fixed transition-colors">
              <span className="material-symbols-outlined text-primary-fixed text-xl">alternate_email</span>
              {socials.contactEmail}
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-container-max mx-auto px-margin-desktop mt-16 pt-8 border-t border-outline-variant/10 text-center">
        <p className="text-secondary-fixed-dim font-label-sm">© {new Date().getFullYear()} VOLT PREMIUM. Професійні електромонтажні рішення.</p>
      </div>
    </footer>
  );
};

export default Footer;
