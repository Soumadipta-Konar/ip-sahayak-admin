'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Calculator, Globe, Mic, MessageSquare, CheckCircle2, Printer, Search, FileText } from 'lucide-react';
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
  ];

  return (
    <nav className="bg-[#002147] text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                  isActive
                    ? 'bg-white text-[#002147] shadow-xs'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#002147]' : 'text-emerald-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right Area: Triage Status & Bhashini Controls */}
        <div className="flex items-center gap-3">
          {/* Active Triage Pill */}
          {classificationState ? (
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-900/80 border border-emerald-500/50 text-[11px] text-emerald-200 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="truncate max-w-[200px]">
                Triaged: {classificationState.category?.split('.')[1]?.trim() || classificationState.category}
              </span>
            </div>
          ) : (
            <Link
              href="/wizard"
              className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/20 border border-amber-400/40 text-[11px] text-amber-200 font-medium hover:bg-amber-500/30 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Formulation Not Triaged</span>
            </Link>
          )}

          {/* Download PDF Quick Action */}
          <button
            type="button"
            onClick={() => window.print()}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#001733] hover:bg-[#002d60] border border-blue-900 text-xs text-white font-medium transition-colors shadow-2xs"
            title="Download or Print Statutory Dossier / Page as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-blue-300" />
            <span>Download PDF</span>
          </button>

          {/* Language Selector (Bhashini) */}
          <div className="flex items-center gap-1.5 bg-[#001733] border border-blue-900 rounded-lg px-2.5 py-1">
            <Globe className="w-3.5 h-3.5 text-slate-300" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label="Select Bhashini Language"
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="en" className="bg-[#002147] text-white">English (EN)</option>
              <option value="hi" className="bg-[#002147] text-white">हिन्दी (Hindi)</option>
              <option value="ml" className="bg-[#002147] text-white">മലയാളം (Malayalam)</option>
              <option value="ta" className="bg-[#002147] text-white">தமிழ் (Tamil)</option>
              <option value="te" className="bg-[#002147] text-white">తెలుగు (Telugu)</option>
              <option value="bn" className="bg-[#002147] text-white">বাংলা (Bengali)</option>
            </select>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] text-emerald-300 font-medium px-2 py-1 rounded bg-emerald-950/70 border border-emerald-800">
            <Mic className="w-3 h-3 text-emerald-400" />
            <span>Bhashini Ready</span>
          </div>
        </div>
      </div>
    </nav>
  );
};
