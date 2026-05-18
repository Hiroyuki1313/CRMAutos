"use client";

import { useState } from "react";
import { Camera, FileText } from "lucide-react";

interface AutoTabsProps {
  photosContent: React.ReactNode;
  docsContent: React.ReactNode;
}

export function AutoTabs({ photosContent, docsContent }: AutoTabsProps) {
  const [activeTab, setActiveTab] = useState<"photos" | "docs">("photos");

  return (
    <div className="flex flex-col gap-8">
      {/* Tab Navigation */}
      <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
        <button
          onClick={() => setActiveTab("photos")}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
            activeTab === "photos"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
              : "bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-slate-200"
          }`}
        >
          <Camera className="size-5" />
          Fotos del Vehículo
        </button>
        
        <button
          onClick={() => setActiveTab("docs")}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
            activeTab === "docs"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
              : "bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-slate-200"
          }`}
        >
          <FileText className="size-5" />
          Expediente Digital
        </button>
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === "photos" && photosContent}
        {activeTab === "docs" && docsContent}
      </div>
    </div>
  );
}
