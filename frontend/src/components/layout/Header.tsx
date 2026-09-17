'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Calculator, Globe, Mic, MessageSquare, CheckCircle2, Printer, Search, FileText, BookMarked } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export const Header: React.FC = () => {
  const { language, setLanguage, classificationState } = useAppStore();
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Legal Copilot', icon: MessageSquare },
    { href: '/wizard', label: 'Formulation Triage', icon: Sparkles },
    { href: '/abs-calculator', label: 'BDA 2023 ABS Calculator', icon: Calculator },
    { href: '/prior-art', label: 'TKDL Prior-Art Analyzer', icon: Search },
    { href: '/dossier', label: 'Statutory Dossier', icon: FileText },
    { href: '/history', label: 'Saved Citations', icon: BookMarked },
  ];

  return (
    <nav className="bg-[#002147] text-white sticky top-0 z-40 shadow-none border-b-2 border-[#001733]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-0 flex flex-wrap items-center justify-between gap-3">
        {/* Navigation Tabs (Official Government Flat Tabs) */}
        <div className="flex items-stretch gap-0.5 overflow-x-auto">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-2.5 text-xs font-bold flex items-center gap-2 transition-colors border-b-2 ${
                  isActive
                    ? 'bg-white text-[#002147] border-b-[#FF9933]'
                    : 'text-slate-200 hover:text-white hover:bg-[#001a38] border-b-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#002147]' : 'text-[#FF9933]'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right Area: Triage Status & Bhashini Controls */}
        <div className="flex items-center gap-2.5 py-1.5">
          {/* Active Triage Pill (Square Government Badge) */}
          {classificationState ? (
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950 border border-emerald-500 text-[11px] text-emerald-200 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="truncate max-w-[200px]">
                Triaged: {classificationState.category?.split('.')[1]?.trim() || classificationState.category}
              </span>
            </div>
          ) : (
            <Link
              href="/wizard"
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-[#b45309] border border-amber-400 text-[11px] text-amber-100 font-bold hover:bg-amber-700 transition-colors"
            >
              <span className="w-2 h-2 bg-amber-300 animate-pulse" />
              <span>Formulation Not Triaged</span>
            </Link>
          )}

          {/* Download PDF Quick Action */}
          <button
            type="button"
            onClick={() => window.print()}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-[#001733] hover:bg-[#002d60] border border-slate-400 text-xs text-white font-bold transition-colors"
            title="Download or Print Statutory Dossier / Page as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-slate-300" />
            <span>Download PDF</span>
          </button>

          {/* Language Selector (Bhashini) - Square Government Select */}
          <div className="flex items-center gap-1.5 bg-[#001733] border border-slate-400 px-2.5 py-1">
            <Globe className="w-3.5 h-3.5 text-slate-300" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label="Select Bhashini Language"
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer font-semibold"
            >
              <option value="en" className="bg-[#002147] text-white">English (EN)</option>
              <option value="hi" className="bg-[#002147] text-white">हिन्दी (Hindi)</option>
              <option value="ml" className="bg-[#002147] text-white">മലയാളം (Malayalam)</option>
              <option value="ta" className="bg-[#002147] text-white">தமிழ் (Tamil)</option>
              <option value="te" className="bg-[#002147] text-white">తెలుగు (Telugu)</option>
              <option value="bn" className="bg-[#002147] text-white">বাংলা (Bengali)</option>
            </select>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] text-emerald-200 font-bold px-2 py-1 bg-emerald-900 border border-emerald-500">
            <Mic className="w-3 h-3 text-emerald-400" />
            <span>Bhashini Ready</span>
          </div>
        </div>
      </div>
    </nav>
  );
};
