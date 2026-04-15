import { Home, ClipboardList, Users, HandCoins, Car, LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

/**
 * @name NavigationConfig
 * @description Centralized configuration for the app's navigation.
 * Implements role-based visibility rules (RBAC).
 * Following SRP: Only handles the metadata and filtering of navigation items.
 */
export const allNavItems: NavItem[] = [
  { href: "/inicio", label: "Inicio", icon: Home },
  { href: "/avaluos", label: "Avalúos", icon: ClipboardList },
  { href: "/clientes", label: "Directorio", icon: Users },
  { href: "/apartados", label: "Seguimientos", icon: HandCoins },
  { href: "/", label: "Inventario", icon: Car },
];

/**
 * Filters the navigation items based on the user's role.
 * @param role The user's role (e.g., 'director', 'vendedor').
 * @returns An array of visible NavItems.
 */
export function getNavItemsForRole(role?: string): NavItem[] {
  return allNavItems.filter((item) => {
    // Business Rule: 'Avalúos' is restricted for 'vendedor'
    if (item.href === "/avaluos" && role === "vendedor") return false;
    return true;
  });
}
