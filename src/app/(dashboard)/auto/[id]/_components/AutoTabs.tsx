"use client";

import { useState } from "react";
import { Camera, FileText, Coins } from "lucide-react";

type TabId = "photos" | "docs" | "costs";

interface AutoTabsProps {
  photosContent: React.ReactNode;
  docsContent: React.ReactNode;
  costsContent: React.ReactNode;
  onTabChange?: (tab: TabId) => void;
}

const TABS: { id: TabId; label: string; Icon: React.ElementType }[] = [
  { id: "photos", label: "General", Icon: Camera },
  { id: "docs", label: "Expediente", Icon: FileText },
  { id: "costs", label: "Finanzas", Icon: Coins },
];

export function AutoTabs({ photosContent, docsContent, costsContent, onTabChange }: AutoTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("photos");

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Tab Navigation — fixed single row, equal width buttons */}
      <div className="flex items-center gap-2 bg-slate-100 rounded-2xl p-1.5">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => handleTabChange(id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === id
                ? "bg-white text-indigo-600 shadow-sm border border-slate-200"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Icon className="size-4 shrink-0" />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden text-[9px] font-black uppercase tracking-wide">{label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === "photos" && photosContent}
        {activeTab === "docs" && docsContent}
        {activeTab === "costs" && costsContent}
      </div>
    </div>
  );
}
