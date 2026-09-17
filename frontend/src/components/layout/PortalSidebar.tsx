'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Sparkles, 
  Scale, 
  BookMarked, 
  Info, 
  Search, 
  Calculator, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  ShieldAlert,
  Menu,
  X
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

export const PortalSidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { classificationState } = useAppStore();

  const navItems = [
    { href: '/', label: 'Dashboard / Home', icon: Home },
    { href: '/wizard', label: 'Formulation Assessment', icon: Sparkles },
    { href: '/?tab=copilot', label: 'Legal AI Copilot (Chat)', icon: Scale },
    { href: '/prior-art', label: 'TKDL Prior-Art Analyzer', icon: Search },
    { href: '/abs-calculator', label: 'BDA 2023 ABS Calculator', icon: Calculator },
    { href: '/dossier', label: 'Statutory Compliance Dossier', icon: FileText },
    { href: '/history', label: 'Saved Citations & History', icon: BookMarked },
  ];

  return (
    <>
      {/* Mobile Toggle Button (Fixed on bottom-left for small screens) */}
      <div className="lg:hidden fixed bottom-4 left-4 z-50 print:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-3 rounded-full bg-[#002147] text-white shadow-lg border border-blue-900 flex items-center justify-center"
          aria-label="Toggle Navigation Portal Drawer"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40"
        />
      )}

      {/* Desktop Persistent Sidebar & Mobile Drawer */}
      <aside
        className={`fixed top-[152px] bottom-0 left-0 z-30 bg-white border-r border-slate-300 shadow-xs flex flex-col justify-between transition-all duration-200 print:hidden ${
          mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-16' : 'lg:w-64'}`}
      >
        {/* Top Header & Collapse Toggle */}
        <div>
          <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            {!isCollapsed && (
              <span className="text-[11px] font-bold text-slate-700 tracking-wider uppercase">
                Government Portal Nav
              </span>
            )}
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-1 rounded hover:bg-slate-200 text-slate-600 ml-auto transition-colors"
              title={isCollapsed ? 'Expand Navigation Sidebar' : 'Collapse Navigation Sidebar'}
              aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Nav Links */}
          <nav className="p-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href.includes('?') && pathname === '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#002147] text-white'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-600'}`} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Anchor: Government Disclaimer Banner */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 space-y-2">
          {!isCollapsed ? (
            <div className="p-2 rounded bg-amber-50 border border-amber-200/80 text-[10px] text-amber-900 leading-tight space-y-1">
              <div className="flex items-center gap-1 font-bold">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                <span>Statutory Disclaimer</span>
              </div>
              <p className="text-slate-600">
                AI guidance grounded in Indian statutes. Not a substitute for a registered IP attorney.
              </p>
            </div>
          ) : (
            <div className="flex justify-center" title="Statutory AI Disclaimer: Grounded in official statutes; not binding legal counsel.">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
            </div>
          )}

          {!isCollapsed && (
            <div className="text-[9px] text-slate-500 text-center font-medium">
              Ministry of AYUSH &bull; SIH 045
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
