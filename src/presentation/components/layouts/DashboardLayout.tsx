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
    <div className="flex min-h-screen bg-[var(--color-surface-bg)] text-[var(--color-text-main)] font-sans selection:bg-[var(--color-primary)] selection:text-[var(--color-primary-dark)]">
      
      {/* Desktop Sidebar - Now Floating/Fixed */}
      <Sidebar role={role} userName={userName} />

      {/* Main Content Area - Now occupies 100% width with 5% padding */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        <div className="flex-1 overflow-y-auto custom-scrollbar px-[5%] pt-10 pb-24">
            {children}
        </div>

        {/* Mobile Navigation */}
        <BottomNav role={role} />
      </main>

    </div>
  );
};
