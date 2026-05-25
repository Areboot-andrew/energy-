"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Settings, LogOut, Bell } from "lucide-react";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === "loading") {
    return <div className="min-h-screen bg-background flex items-center justify-center text-white">Завантаження...</div>;
  }

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col md:flex-row mt-20 md:mt-0">
      {/* Sidebar for Desktop */}
      <aside className="w-full md:w-64 bg-surface-container border-r border-outline-variant/20 flex-shrink-0 p-6 hidden md:flex flex-col h-screen sticky top-0">
        <Link href="/" className="font-headline-md text-white mb-8 flex items-center gap-2">
           <span className="material-symbols-outlined text-primary-fixed">bolt</span>
           Кабінет
        </Link>

        <nav className="space-y-2 flex-grow">
          <Link 
            href="/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${pathname === '/dashboard' || pathname.startsWith('/dashboard/project') ? 'bg-primary-fixed text-black' : 'text-secondary-fixed-dim hover:text-white hover:bg-surface-container-high'}`}
          >
            <LayoutDashboard size={20} />
            Мої проєкти
          </Link>
          <Link 
            href="/dashboard/quotes"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${pathname === '/dashboard/quotes' ? 'bg-primary-fixed text-black' : 'text-secondary-fixed-dim hover:text-white hover:bg-surface-container-high'}`}
          >
            <FileText size={20} />
            Кошториси
          </Link>
        </nav>

        <div className="pt-6 border-t border-outline-variant/20">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-full bg-primary-fixed/20 flex items-center justify-center text-primary-fixed font-bold">
               {session?.user?.name?.charAt(0) || "U"}
             </div>
             <div className="overflow-hidden">
               <p className="text-white font-bold text-sm truncate">{session?.user?.name}</p>
               <p className="text-secondary-fixed-dim text-xs truncate">{session?.user?.email}</p>
             </div>
          </div>
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-error hover:bg-error/10 transition-all"
          >
            <LogOut size={20} />
            Вийти
          </button>
        </div>
      </aside>

      {/* Mobile Nav */}
      <div className="md:hidden bg-surface-container p-4 border-b border-outline-variant/20 flex gap-2 overflow-x-auto">
        <Link 
          href="/dashboard"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold whitespace-nowrap ${pathname === '/dashboard' ? 'bg-primary-fixed text-black' : 'text-secondary-fixed-dim bg-surface-container-high'}`}
        >
          <LayoutDashboard size={18} />
          Проєкти
        </Link>
        <Link 
          href="/dashboard/quotes"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold whitespace-nowrap ${pathname === '/dashboard/quotes' ? 'bg-primary-fixed text-black' : 'text-secondary-fixed-dim bg-surface-container-high'}`}
        >
          <FileText size={18} />
          Кошториси
        </Link>
        <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-error bg-error/10 whitespace-nowrap ml-auto"
          >
            <LogOut size={18} />
          </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 md:max-h-screen md:overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
