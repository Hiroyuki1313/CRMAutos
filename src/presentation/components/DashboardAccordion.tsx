'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface DashboardAccordionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function DashboardAccordion({ title, icon, children, defaultOpen = true }: DashboardAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsOpen(false);
    }
  }, []);

  return (
    <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-sm mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors focus:outline-none"
      >
        <div className="flex items-center space-x-3">
          {icon && <div className="text-cyan-500">{icon}</div>}
          <h2 className="text-lg font-bold text-slate-800">{title}</h2>
        </div>
        <div className="text-slate-400">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>
      
      {isOpen && (
        <div className="p-5 border-t border-slate-100">
          {children}
        </div>
      )}
    </div>
  );
}
