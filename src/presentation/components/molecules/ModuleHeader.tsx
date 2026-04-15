
import { LucideIcon, Plus } from "lucide-react";
import Link from "next/link";

interface ModuleHeaderProps {
  title: string;
  subtitle?: string;
  Icon: LucideIcon;
  action?: {
    label: string;
    href: string;
    icon?: LucideIcon;
  };
}

/**
 * @name ModuleHeader
 * @description Standard header for modules, providing title, count/subtitle and a primary action button.
 * Follows SRP: Only handles module-level identification and entry points.
 */
export const ModuleHeader = ({ title, subtitle, Icon, action }: ModuleHeaderProps) => {
  return (
    <div className="flex flex-wrap justify-between items-center gap-6 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm transition-all hover:shadow-md animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex items-center gap-6">
        <div className="size-12 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center border border-[var(--color-primary)]/20">
          <Icon className="size-6 text-[var(--color-primary)]" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">{title}</h2>
          {subtitle && (
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              {subtitle}
            </span>
          )}
        </div>
      </div>

      {action && (
        <Link
          href={action.href}
          className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-[var(--color-primary)]/20 active:scale-95"
        >
          {action.icon ? <action.icon className="size-4" /> : <Plus className="size-4" />}
          <span>{action.label}</span>
        </Link>
      )}
    </div>
  );
};
