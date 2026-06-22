import { Sidebar } from "../organisms/Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role?: string;
  userName?: string;
}

/**
 * @name DashboardLayout
 * @description The main layout wrapper for authenticated sections.
 * Uses a single unified Sidebar (drawer) for all screen sizes.
 * BottomNav removed — navigation is consolidated into the left drawer.
 */
export const DashboardLayout = ({ children, role, userName }: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-[var(--color-surface-bg)] text-[var(--color-text-main)] font-sans selection:bg-[var(--color-primary)] selection:text-[var(--color-primary-dark)]">
      
      {/* Universal Sidebar Drawer */}
      <Sidebar role={role} userName={userName} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        {/*
          pt-16 on mobile: leaves room for the 44px hamburger button + 16px top margin
          pt-8 on md+: same comfortable spacing since button is same position
          pb-8: breathing room at the bottom (no more bottom nav)
        */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 md:px-8 pt-16 md:pt-8 pb-8">
          {children}
        </div>
      </main>

    </div>
  );
};
