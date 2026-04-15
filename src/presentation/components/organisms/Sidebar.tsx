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
          ${isExpanded ? "w-[280px]" : "w-[80px]"}
        `}
      >
        
        <div className="flex flex-col h-full w-full overflow-hidden transition-all duration-500">
          {/* Branding Section */}
          <div className={`flex items-center gap-3 py-8 transition-all duration-500 ${isExpanded ? "px-8" : "px-0 justify-center"}`}>
            <div className="rounded-xl bg-[var(--color-primary)] p-2 shadow-xl shadow-[var(--color-primary)]/20 flex-shrink-0">
              <Car className="size-6 text-white" />
            </div>
            <span className={`text-xl font-bold tracking-tight text-slate-900 transition-all duration-500 ${isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 w-0 hidden"}`}>
              Autosuz
            </span>
          </div>

          {/* Navigation section */}
          <nav className={`flex-1 space-y-1.5 overflow-y-auto custom-scrollbar transition-all duration-500 ${isExpanded ? "px-4" : "px-2"}`}>
            <p className={`pb-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 transition-all duration-500 ${isExpanded ? "px-4 opacity-100" : "opacity-0 h-0 overflow-hidden"}`}>
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
                    flex items-center rounded-xl transition-all duration-200 group relative
                    ${isExpanded ? "gap-3 px-4 py-3" : "justify-center p-3"}
                    ${isActive 
                      ? "bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}
                  `}
                  title={!isExpanded ? item.label : ""}
                >
                  <Icon className={`size-5 transition-transform duration-200 flex-shrink-0 ${isActive ? "" : "group-hover:scale-110"}`} />
                  <span className={`font-bold text-sm whitespace-nowrap transition-all duration-500 ${isExpanded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 w-0 hidden"}`}>
                    {item.label}
                  </span>
                  {isActive && isExpanded && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/50" />
                  )}
                  {isActive && !isExpanded && (
                    <div className="absolute left-0 w-1 h-6 bg-white rounded-r-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User & Settings Section */}
          <div className="mt-auto border-t border-slate-100 overflow-hidden">
            <div className={`transition-all duration-500 ${isExpanded ? "p-4" : "p-2"}`}>
              <div className={`bg-slate-50 rounded-2xl transition-all duration-500 ${isExpanded ? "p-4 space-y-4" : "p-2 space-y-2 flex flex-col items-center"}`}>
                <div className={`flex items-center transition-all duration-500 ${isExpanded ? "gap-3" : "justify-center"}`}>
                  <div className="size-10 rounded-xl bg-white flex items-center justify-center border border-slate-200 shadow-sm flex-shrink-0">
                      <User className="size-5 text-slate-400" />
                  </div>
                  <div className={`flex flex-col overflow-hidden transition-all duration-500 ${isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"}`}>
                      <span className="text-sm font-bold text-slate-900 line-clamp-1 leading-tight">{userName || "Usuario"}</span>
                      <span className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-wider">{role}</span>
                  </div>
                </div>
                
                <div className={`transition-all duration-500 ${isExpanded ? "pt-2 w-full" : "pt-0 w-auto"}`}>
                  <div className={`flex items-center transition-all duration-500 ${isExpanded ? "justify-between px-1" : "justify-center"}`}>
                      <span className={`text-xs font-bold text-slate-400 transition-opacity duration-300 ${isExpanded ? "opacity-100" : "hidden"}`}>Sesión</span>
                      <LogoutButton />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`p-6 text-[10px] font-bold text-zinc-600 text-center tracking-widest uppercase transition-all duration-500 ${isExpanded ? "opacity-100" : "opacity-0 h-0 p-0 overflow-hidden"}`}>
            © 2026 AutoCRM
          </div>
        </div>
      </aside>
      
      {/* Proximity Trigger Zone (Extra sensitive area if needed) */}
      <div className="fixed top-0 left-0 w-2 h-screen z-50 pointer-events-none border-l-2 border-[var(--color-primary)] opacity-20" />
    </>
  );
};
