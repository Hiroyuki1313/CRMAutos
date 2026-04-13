"use client";

import { Car, LogOut, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getNavItemsForRole } from "@/core/config/navigation";
import { LogoutButton } from "@/presentation/components/molecules/LogoutButton";

interface SidebarProps {
  role?: string;
  userName?: string;
}

/**
 * @name Sidebar
 * @description Sticky vertical navigation for desktop displays.
 * Implements role-based visibility and follows the premium AutoCRM design language.
 */
export const Sidebar = ({ role, userName }: SidebarProps) => {
  const pathname = usePathname();
  const navItems = getNavItemsForRole(role);

  return (
    <aside className="hidden lg:flex flex-col w-[280px] h-screen sticky top-0 left-0 bg-zinc-950 border-r border-white/5 z-40 selection:bg-[var(--color-primary)] selection:text-[var(--color-primary-dark)]">
      
      {/* Branding Section */}
      <div className="flex items-center gap-3 px-8 py-8">
        <div className="rounded-xl bg-[var(--color-primary)] p-2 shadow-lg shadow-[var(--color-primary)]/20">
          <Car className="size-6 text-[var(--color-primary-dark)]" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">Autosuz</span>
      </div>

      {/* Navigation section */}
      <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto custom-scrollbar">
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
                  ? "bg-[var(--color-primary)] text-[var(--color-primary-dark)] shadow-lg shadow-[var(--color-primary)]/10" 
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"}
              `}
            >
              <Icon className={`size-5 transition-transform duration-200 ${isActive ? "" : "group-hover:scale-110"}`} />
              <span className="font-bold text-sm">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-primary-dark)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User & Settings Section */}
      <div className="p-4 mt-auto border-t border-white/5">
        <div className="bg-zinc-900/50 rounded-2xl p-4 space-y-4">
          <div className="flex items-center gap-3">
             <div className="size-10 rounded-xl bg-zinc-800 flex items-center justify-center border border-white/5">
                <User className="size-5 text-zinc-500" />
             </div>
             <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold text-white line-clamp-2 leading-tight">{userName || "Usuario"}</span>
                <span className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-wider">{role}</span>
             </div>
          </div>
          
          <div className="pt-2">
             <div className="flex justify-between items-center px-1">
                <span className="text-xs font-bold text-zinc-400">Sesión</span>
                <LogoutButton />
             </div>
          </div>
        </div>
      </div>

      <div className="p-6 text-[10px] font-bold text-zinc-600 text-center tracking-widest uppercase">
        © 2026 AutoCRM
      </div>
    </aside>
  );
};
