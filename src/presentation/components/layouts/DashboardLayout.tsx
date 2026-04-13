import { Sidebar } from "../organisms/Sidebar";
import { BottomNav } from "../organisms/BottomNav";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role?: string;
  userName?: string;
}

/**
 * @name DashboardLayout
 * @description The main layout wrapper for authenticated sections.
 * Orchestrates the responsive navigation system (Sidebar vs BottomNav).
 * Following Clean Architecture: Centralizes layout concerns away from page logic.
 */
export const DashboardLayout = ({ children, role, userName }: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-zinc-950 text-neutral-50 font-sans selection:bg-[var(--color-primary)] selection:text-[var(--color-primary-dark)]">
      
      {/* Desktop Sidebar - Sticky/Fixed via container */}
      <Sidebar role={role} userName={userName} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
            {children}
        </div>

        {/* Mobile Navigation */}
        <BottomNav role={role} />
      </main>

    </div>
  );
};
