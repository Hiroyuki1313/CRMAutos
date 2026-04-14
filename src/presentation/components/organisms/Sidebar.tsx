"use client";

import { Car, LogOut, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getNavItemsForRole } from "@/core/config/navigation";
import { LogoutButton } from "@/presentation/components/molecules/LogoutButton";
import { useState } from "react";

interface SidebarProps {
  role?: string;
  userName?: string;
}

/**
 * @name Sidebar
 * @description Floating vertical navigation for desktop displays.
 * Collapses into a subtle line and expands to 280px on hover.
 */
export const Sidebar = ({ role, userName }: SidebarProps) => {
  const pathname = usePathname();
  const navItems = getNavItemsForRole(role);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Sidebar Container */}
      <aside 
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className={`
          hidden lg:flex flex-col h-screen fixed top-0 left-0 bg-white/80 backdrop-blur-xl border-r border-slate-200 z-[100] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-2xl
          ${isExpanded ? "w-[280px] opacity-100 translate-x-0" : "w-[8px] opacity-50 translate-x-[-4px] border-r-transparent shadow-none hover:opacity-100 hover:w-[12px]"}
        `}
      >
        
        {/* Dynamic Content wrapper to prevent layout jumps during expansion */}
        <div className={`flex flex-col h-full w-[280px] transition-opacity duration-300 ${isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          {/* Branding Section */}
          <div className="flex items-center gap-3 px-8 py-8">
            <div className="rounded-xl bg-[var(--color-primary)] p-2 shadow-xl shadow-[var(--color-primary)]/20">
              <Car className="size-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Autosuz</span>
          </div>

          {/* Navigation section */}
          <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
            <p className="px-4 pb-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
              Explorar
            </p>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                    ${isActive 
                      ? "bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}
                  `}
                >
                  <Icon className={`size-5 transition-transform duration-200 ${isActive ? "" : "group-hover:scale-110"}`} />
                  <span className="font-bold text-sm">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/50" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User & Settings Section */}
          <div className="p-4 mt-auto border-t border-slate-100">
            <div className="bg-slate-50 rounded-2xl p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-white flex items-center justify-center border border-slate-200 shadow-sm">
                    <User className="size-5 text-slate-400" />
                </div>
                <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-bold text-slate-900 line-clamp-2 leading-tight">{userName || "Usuario"}</span>
                    <span className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-wider">{role}</span>
                </div>
              </div>
              
              <div className="pt-2">
                <div className="flex justify-between items-center px-1">
                    <span className="text-xs font-bold text-slate-400">Sesión</span>
                    <LogoutButton />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 text-[10px] font-bold text-zinc-600 text-center tracking-widest uppercase">
            © 2026 AutoCRM
          </div>
        </div>
      </aside>
      
      {/* Proximity Trigger Zone (Extra sensitive area if needed) */}
      <div className="fixed top-0 left-0 w-2 h-screen z-50 pointer-events-none border-l-2 border-[var(--color-primary)] opacity-20" />
    </>
  );
};
