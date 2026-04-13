"use client";

import { getNavItemsForRole } from "@/core/config/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function BottomNav({ role }: { role?: string }) {
  const pathname = usePathname();
  const navItems = getNavItemsForRole(role);

  return (
    <div className="lg:hidden">
      {/* Safe Area Spacer para que el contenido no quede oculto bajo la NavBar */}
      <div className="h-24 w-full shrink-0" />
      
      {/* NavBar Anclada (Sticky/Fixed) con Glassmorphism */}
      <div className="fixed bottom-0 left-0 right-0 w-full z-50 bg-zinc-950/90 backdrop-blur-xl border-t border-white/5 px-2 pt-3 pb-8">
        <div className="flex flex-row justify-around items-center max-w-md mx-auto">
          {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href} className="flex p-2 flex-col items-center gap-1 cursor-pointer">
              {isActive ? (
                <div className="rounded-full flex px-4 py-1 flex-col items-center gap-1 bg-[var(--color-primary)] transition-all">
                  <Icon className="size-5 text-[var(--color-primary-dark)]" />
                  <span className="font-bold text-[10px] uppercase tracking-tighter text-[var(--color-primary-dark)]">
                    {item.label}
                  </span>
                </div>
              ) : (
                <>
                  <Icon className="size-5 text-zinc-500 hover:text-white transition-colors" />
                  <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
                </>
              )}
            </Link>
          );
        })}
      </div>
    </div>
    </div>
  );
}
