'use client';

import { cn } from '@/lib/utils';
import { createContext, useContext, useState, type ReactNode } from 'react';

interface TabsContextType { activeTab: string; setActiveTab: (t: string) => void; }
const TabsContext = createContext<TabsContextType | null>(null);

export function Tabs({ defaultValue, children, className }: { defaultValue: string; children: ReactNode; className?: string }) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return <TabsContext.Provider value={{ activeTab, setActiveTab }}><div className={className}>{children}</div></TabsContext.Provider>;
}

export function TabsList({ children, className, ariaLabel }: { children: ReactNode; className?: string; ariaLabel?: string }) {
  return <div role="tablist" aria-label={ariaLabel} className={cn('flex border-b border-white/20 overflow-x-auto', className)}>{children}</div>;
}

export function TabsTrigger({ value, children, className }: { value: string; children: ReactNode; className?: string }) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('TabsTrigger must be inside Tabs');
  const isActive = ctx.activeTab === value;
  return (
    <button role="tab" aria-selected={isActive} aria-controls={`tabpanel-${value}`} id={`tab-${value}`} tabIndex={isActive ? 0 : -1}
      onClick={() => ctx.setActiveTab(value)}
      className={cn('px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-all duration-200 border-b-2 -mb-px',
        isActive ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200', className)}>
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className }: { value: string; children: ReactNode; className?: string }) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('TabsContent must be inside Tabs');
  if (ctx.activeTab !== value) return null;
  return <div role="tabpanel" id={`tabpanel-${value}`} aria-labelledby={`tab-${value}`} tabIndex={0} className={cn('py-4', className)}>{children}</div>;
}
