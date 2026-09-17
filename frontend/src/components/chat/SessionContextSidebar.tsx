'use client';

import React from 'react';
import { 
  Sparkles, 
  Leaf, 
  RotateCcw, 
  Calculator, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Printer,
  Search,
  BookOpen
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { ActiveWorkspaceTab } from '@/app/page';

interface SessionContextSidebarProps {
  onSelectTab?: (tab: ActiveWorkspaceTab) => void;
}

export const SessionContextSidebar: React.FC<SessionContextSidebarProps> = ({ onSelectTab }) => {
  const { 
    classificationState, 
    setClassificationState, 
    priorArtAnalysis, 
    absCalculation 
  } = useAppStore();

  const handleClear = () => {
    setClassificationState(null);
  };

  const navigateTo = (tab: ActiveWorkspaceTab, fallbackHref: string) => {
    if (onSelectTab) {
      onSelectTab(tab);
    } else {
      window.location.href = fallbackHref;
    }
  };

  return (
    <aside className="w-full bg-white border-2 border-slate-300 border-t-4 border-t-[#002147] shadow-none p-4 flex flex-col gap-3.5">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-2.5 border-b-2 border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-slate-100 border border-slate-300 text-[#002147]">
            <Sparkles className="w-4 h-4 text-[#002147]" />
          </div>
          <div>
            <h3 className="text-xs font-black text-[#002147] uppercase tracking-wide">
              Session Case Dossier
            </h3>
            <p className="text-[10px] text-slate-600 font-semibold">
              Active Statutory Baseline Context
            </p>
          </div>
        </div>

        {classificationState && (
          <button
            type="button"
            onClick={handleClear}
            className="text-[10px] text-slate-500 hover:text-red-700 flex items-center gap-1 font-bold transition-colors print:hidden"
            title="Reset active case dossier"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Case Context Content */}
      <div className="space-y-3">
        {/* 1. Formulation Triage Category Card */}
        {classificationState ? (
          <div className="p-3 bg-[#f8f9fa] border border-slate-300">
            <div className="flex items-center justify-between gap-1.5 mb-1">
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-900 uppercase tracking-wide">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                Diagnosed Category
              </span>
              <button
                type="button"
                onClick={() => navigateTo('wizard', '/wizard')}
                className="text-[10px] font-bold text-[#002147] hover:underline"
              >
                Change
              </button>
            </div>
            <h4 className="text-xs font-black text-[#002147] leading-snug">
              {classificationState.category}
            </h4>
            <p className="text-[10px] text-slate-600 font-mono mt-0.5">
              {classificationState.statute}
            </p>
          </div>
        ) : (
          <div className="p-3 bg-[#fff8e1] border border-amber-300 text-slate-900">
            <div className="flex items-center justify-between mb-1">
              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-950 uppercase tracking-wide">
                <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                Formulation Triage (Step 1)
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 bg-amber-200 text-amber-950 border border-amber-400">
                Pending
              </span>
            </div>
            <p className="text-[11px] text-slate-700 leading-snug mb-2 font-medium">
              Classify your recipe into 1 of 6 legal buckets (Classical, P&P, Phytopharmaceutical, or Food).
            </p>
            <button
              type="button"
              onClick={() => navigateTo('wizard', '/wizard')}
              className="w-full py-1.5 bg-[#002147] text-white text-xs font-bold flex items-center justify-center gap-1 hover:bg-[#001733] border border-[#001733] transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF9933]" />
              <span>Launch Triage Wizard</span>
            </button>
          </div>
        )}

        {/* 2. TKDL & Patentability Status Card */}
        {priorArtAnalysis ? (
          <div className="p-3 border border-slate-300 bg-white space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-800 uppercase tracking-wide">
                <Search className="w-3.5 h-3.5 text-[#002147]" />
                TKDL Prior-Art Screened
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 border ${
                priorArtAnalysis.patentability_risk_score >= 80
                  ? 'bg-red-50 text-red-900 border-red-300'
                  : 'bg-emerald-50 text-emerald-900 border-emerald-300'
              }`}>
                Risk: {priorArtAnalysis.patentability_risk_score}%
              </span>
            </div>
            <p className="text-[10px] text-slate-700 font-medium">
              {priorArtAnalysis.statutory_summary}
            </p>
            <button
              type="button"
              onClick={() => navigateTo('prior-art', '/prior-art')}
              className="text-[10px] font-bold text-[#002147] hover:underline flex items-center gap-1 pt-1"
            >
              <span>View Full Prior-Art Report ({priorArtAnalysis.tkdl_matches_count} TKDL hits)</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="p-3 border border-slate-300 bg-[#f8f9fa] space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-800 uppercase tracking-wide">
                <BookOpen className="w-3.5 h-3.5 text-[#002147]" />
                TKDL & Section 3(p) Screen
              </span>
              <span className="text-[9px] font-bold text-slate-500">Unscreened</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug font-medium">
              Screen herbs against Charaka/Sushruta Samhita prior-art and Section 3(p) bars.
            </p>
            <button
              type="button"
              onClick={() => navigateTo('prior-art', '/prior-art')}
              className="w-full py-1.5 bg-white hover:bg-slate-100 border border-slate-400 text-[#002147] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-[#002147]" />
              <span>Run TKDL Prior-Art Check</span>
            </button>
          </div>
        )}

        {/* 3. BDA 2023 ABS Assessment Card */}
        {absCalculation ? (
          <div className="p-3 bg-[#f8f9fa] border border-slate-300">
            <div className="flex items-center justify-between mb-1">
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-950 uppercase tracking-wide">
                <Leaf className="w-3.5 h-3.5 text-emerald-700" />
                BDA 2023 ABS Fee
              </span>
              <span className="text-[10px] font-mono font-bold text-[#002147]">
                ₹{absCalculation.calculatedFee.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-[10px] text-slate-700 leading-snug font-medium">
              {absCalculation.statutoryRateDescription}
            </p>
          </div>
        ) : (
          <div className="p-3 border border-slate-300 bg-[#f8f9fa] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-[10px] font-bold text-slate-800 uppercase tracking-wide">
                <Calculator className="w-3.5 h-3.5 text-[#b45309]" />
                BDA 2023 ABS Liability
              </span>
              <span className="text-[9px] font-bold text-slate-500">Not Computed</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug font-medium">
              Check statutory 0.5% turnover fee or Vaidya exemptions under BDA 2023.
            </p>
            <button
              type="button"
              onClick={() => navigateTo('abs', '/abs-calculator')}
              className="w-full py-1.5 bg-white hover:bg-slate-100 border border-slate-400 text-slate-900 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Calculator className="w-3.5 h-3.5 text-[#b45309]" />
              <span>Compute Benefit Sharing (ABS)</span>
            </button>
          </div>
        )}

        {/* 4. Action Row & Statutory Compliance Dossier Link */}
        <div className="pt-2 flex flex-col gap-2 print:hidden border-t-2 border-slate-200">
          <button
            type="button"
            onClick={() => navigateTo('dossier', '/dossier')}
            className="w-full py-2 px-3 bg-[#138808] hover:bg-[#0f6b06] text-white text-xs font-bold text-center transition-colors flex items-center justify-center gap-2 border border-[#0f6b06]"
            title="Open Statutory Compliance Dossier"
          >
            <FileText className="w-4 h-4 text-emerald-200" />
            <span>Open Statutory Compliance Dossier</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="w-full py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold text-center border border-slate-400 transition-colors flex items-center justify-center gap-1.5"
            title="Print or Save Page as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-slate-700" />
            <span>Print / Save Current View (PDF)</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
