'use client';
import React from 'react';
import Link from 'next/link';
import { Shield, Sparkles, Calculator, Globe, Mic } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export const Header: React.FC = () => {
  const { language, setLanguage, jurisdiction } = useAppStore();

  const isIndia = jurisdiction === 'IN';

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className={`p-2 rounded-xl border transition-transform group-hover:scale-105 ${
            isIndia ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
          }`}>
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-wide text-white">IP-SAKTI</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${
                isIndia 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                  : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
              }`}>
                Sahayak
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                SIH 045
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Ayurvedic IP, Patentability & Regulatory Copilot (Ministry of AYUSH)
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-2">
          <Link 
            href="/wizard" 
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-700 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Formulation Wizard</span>
          </Link>
          
          <Link 
            href="/abs-calculator" 
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-700 transition-all flex items-center gap-1.5"
          >
            <Calculator className="w-3.5 h-3.5 text-amber-400" />
            <span>ABS Calculator</span>
          </Link>
        </nav>

        {/* Language & Voice Selector (Bhashini Powered) */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label="Select Bhashini Language"
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="en" className="bg-slate-900">English (EN)</option>
              <option value="hi" className="bg-slate-900">हिन्दी (Hindi)</option>
              <option value="ml" className="bg-slate-900">മലയാളം (Malayalam)</option>
              <option value="ta" className="bg-slate-900">தமிழ் (Tamil)</option>
              <option value="te" className="bg-slate-900">తెలుగు (Telugu)</option>
              <option value="bn" className="bg-slate-900">বাংলা (Bengali)</option>
            </select>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] text-emerald-400 font-medium px-2 py-1 rounded bg-emerald-950/60 border border-emerald-800/60">
            <Mic className="w-3 h-3" />
            <span>Bhashini Ready</span>
          </div>
        </div>

      </div>
    </header>
  );
};
