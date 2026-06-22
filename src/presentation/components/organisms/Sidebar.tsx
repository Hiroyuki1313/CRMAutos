"use client";

import { Car, Menu, ChevronLeft, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getNavItemsForRole } from "@/core/config/navigation";
import { LogoutButton } from "@/presentation/components/molecules/LogoutButton";
import { useState, useEffect } from "react";

interface SidebarProps {
  role?: string;
  userName?: string;
}

/**
 * @name Sidebar
 * @description Universal drawer navigation. Works on mobile AND desktop.
 * Toggle button fixed top-left. Drawer slides from left on all screen sizes.
 * Replaces BottomNav for mobile — single nav system.
 */
export const Sidebar = ({ role, userName }: SidebarProps) => {
  const pathname = usePathname();
  const navItems = getNavItemsForRole(role);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-[95] bg-slate-900/20 backdrop-blur-[2px] animate-in fade-in duration-300"
        />
      )}

      {/* Toggle Button - visible on ALL screen sizes */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        className={`
          fixed top-4 left-4 z-[110] size-11 flex items-center justify-center rounded-xl
          bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/30
          hover:scale-105 active:scale-95 transition-all duration-300
          ${isOpen ? "translate-x-[236px]" : "translate-x-0"}
        `}
      >
        {isOpen ? <ChevronLeft className="size-5" /> : <Menu className="size-5" />}
      </button>

      {/* Drawer Panel */}
      <aside
        className={`
          flex flex-col h-screen fixed top-0 left-0 w-[272px]
          bg-white/97 backdrop-blur-2xl border-r border-slate-200
          z-[100] shadow-2xl
          transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full overflow-hidden">

          {/* Logo */}
          <div className="flex items-center gap-3 px-8 py-7 border-b border-slate-100">
            <div className="rounded-xl bg-[var(--color-primary)] p-2 shadow-lg shadow-[var(--color-primary)]/20 flex-shrink-0">
              <Car className="size-5 text-white" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-slate-900">Autosuz</span>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 overflow-y-auto px-3 pt-4 pb-2 space-y-1 custom-scrollbar">
            <p className="px-3 pb-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Módulos
            </p>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm
                    transition-all duration-200 group
                    ${isActive
                      ? "bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/25"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}
                  `}
                >
                  <Icon className="size-5 flex-shrink-0 transition-transform group-hover:scale-110" />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white/60" />}
                </Link>
              );
            })}
          </nav>

          {/* User Footer */}
          <div className="border-t border-slate-100 p-3">
            <div className="bg-slate-50 rounded-2xl p-3 flex items-center gap-3">
              <div className="size-9 rounded-xl bg-white flex items-center justify-center border border-slate-200 shadow-sm flex-shrink-0">
                <User className="size-4 text-slate-400" />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-bold text-slate-900 truncate leading-tight">
                  {userName || "Usuario"}
                </span>
                <span className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-wider">
                  {role}
                </span>
              </div>
              <LogoutButton />
            </div>
          </div>

          <div className="pb-5 text-[10px] font-bold text-slate-300 text-center tracking-widest uppercase">
            © 2026 AutoCRM
          </div>
        </div>
      </aside>
    </>
  );
};
