"use client";

import { motion } from "framer-motion";
import { ChevronRight, LogOut, LayoutDashboard, FileText, Settings, Users, Image as ImageIcon, Edit3, Globe } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const menuItems = [
    { id: "dashboard", label: "Дашборд", icon: <LayoutDashboard size={18} />, href: "/admin" },
    { id: "edit-page", label: "Головна", icon: <Edit3 size={18} />, href: "/admin/edit-page" },
    { id: "services", label: "Послуги", icon: <LayoutDashboard size={18} />, href: "/admin/services" },
    { id: "how-we-work", label: "Як ми працюємо", icon: <FileText size={18} />, href: "/admin/how-we-work" },
    { id: "standards", label: "Стандарти", icon: <FileText size={18} />, href: "/admin/standards" },
    { id: "faq", label: "FAQ", icon: <FileText size={18} />, href: "/admin/faq" },
    { id: "portfolio", label: "Портфоліо", icon: <ImageIcon size={18} />, href: "/admin/portfolio" },
    { id: "requests", label: "Заявки", icon: <Users size={18} />, href: "/admin/requests" },
    { id: "settings", label: "Ціни", icon: <Settings size={18} />, href: "/admin/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-background text-on-background font-body-md">
      {/* Sidebar */}
      <aside className="w-72 bg-surface-container border-r border-outline-variant/30 flex flex-col sticky top-0 h-screen z-40 shadow-xl">
        <div className="p-8 border-b border-outline-variant/20">
          <Link href="/" className="font-display-lg text-headline-xl tracking-tighter text-primary-fixed flex items-center gap-2">
            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
            VOLT ADMIN
          </Link>
        </div>
        
        <nav className="flex-grow p-6 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary-fixed-dim mb-4 ml-2 opacity-50">Меню керування</p>
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center justify-between p-4 rounded-xl transition-all group ${
                pathname === item.href
                  ? "bg-primary-fixed text-on-primary-fixed font-bold shadow-[0_0_20px_rgba(213,240,0,0.15)]"
                  : "text-secondary-fixed-dim hover:bg-surface-container-highest hover:text-white"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={pathname === item.href ? "text-on-primary-fixed" : "text-primary-fixed group-hover:scale-110 transition-transform"}>
                  {item.icon}
                </span>
                <span className="text-sm font-bold uppercase tracking-widest">{item.label}</span>
              </div>
              {pathname === item.href && <ChevronRight size={16} />}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-outline-variant/20 space-y-4">
          <Link href="/" target="_blank" className="flex items-center gap-3 w-full p-4 text-secondary-fixed-dim hover:bg-white/5 rounded-xl transition-all text-xs font-bold uppercase tracking-widest">
            <Globe size={16} className="text-primary-fixed" />
            <span>На сайт</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-4 text-error hover:bg-error/10 rounded-xl transition-all text-xs font-bold uppercase tracking-widest"
          >
            <LogOut size={16} />
            <span>Вийти</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow overflow-y-auto bg-surface-dim relative">
        {/* Top Header Decor */}
        <div className="h-32 w-full bg-gradient-to-b from-surface-container to-transparent opacity-50 absolute top-0 left-0 pointer-events-none"></div>
        
        <div className="p-10 md:p-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="max-w-6xl mx-auto"
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
