"use client";

import { Car, ClipboardList, HandCoins, Home, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomNav({ role }: { role?: string }) {
  const pathname = usePathname();

  const allItems = [
    { href: "/inicio", label: "Inicio", icon: Home },
    { href: "/avaluos", label: "Avalúos", icon: ClipboardList },
    { href: "/clientes", label: "Clientes", icon: Users },
    { href: "/apartados", label: "Ventas", icon: HandCoins },
    { href: "/", label: "Inventario", icon: Car },
  ];

  // Filtrar Avalúos para vendedores
  const navItems = allItems.filter(item => {
    if (item.href === "/avaluos" && role === "vendedor") return false;
    return true;
  });

  return (
    <>
      {/* Safe Area Spacer para que el contenido no quede oculto bajo la NavBar */}
      <div className="h-24 w-full shrink-0" />
      
      {/* NavBar Anclada (Sticky/Fixed) con Glassmorphism */}
      <div className="fixed bottom-0 left-0 right-0 w-full z-50 bg-[var(--color-card-bg)]/90 backdrop-blur-xl border-white/10 border-t px-2 pt-3 pb-8">
        <div className="flex flex-row justify-around items-center max-w-md mx-auto">
          {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href} className="flex p-2 flex-col items-center gap-1 cursor-pointer">
              {isActive ? (
                <div className="rounded-full flex px-4 py-1 flex-col items-center gap-1 bg-[var(--color-primary)]">
                  <Icon className="size-5 text-[var(--color-primary-dark)]" />
                  <span className="font-semibold text-xs leading-4 text-[var(--color-primary-dark)]">
                    {item.label}
                  </span>
                </div>
              ) : (
                <>
                  <Icon className="size-5 text-[var(--color-text-muted)]" />
                  <span className="text-[var(--color-text-muted)] text-xs leading-4">{item.label}</span>
                </>
              )}
            </Link>
          );
        })}
      </div>
    </div>
    </>
  );
}
