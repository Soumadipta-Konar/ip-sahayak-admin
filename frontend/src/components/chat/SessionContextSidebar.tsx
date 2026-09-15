'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ShieldAlert, 
  Leaf, 
  Stethoscope, 
  Globe2, 
  RotateCcw, 
  Calculator, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Printer
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

export const SessionContextSidebar: React.FC = () => {
  const { classificationState, setClassificationState, setSelectedCitation } = useAppStore();

  const handleClear = () => {
    setClassificationState(null);
  };

  return (
    <aside className="w-full bg-white border border-slate-200 rounded-2xl shadow-xs p-4 sm:p-5 flex flex-col gap-4">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Sparkles className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <h3 className="text-xs font-black text-[#002147] uppercase tracking-wider">
              Session Case Dossier
            </h3>
            <p className="text-[10px] text-slate-500 font-medium">
              Active Statutory Baseline Context
            </p>
          </div>
        </div>

        {classificationState && (
          <button
            type="button"
            onClick={handleClear}
            className="text-[10px] text-slate-400 hover:text-red-600 flex items-center gap-1 font-semibold transition-colors print:hidden"
            title="Reset active case dossier"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Case Context Content */}
      {classificationState ? (
        <div className="space-y-3.5">
          {/* 1. Category Card */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-800 uppercase tracking-wide mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Diagnosed Statutory Category</span>
            </div>
            <h4 className="text-xs font-black text-[#002147] leading-snug">
              {classificationState.category}
            </h4>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">
              {classificationState.statute}
            </p>
          </div>

          {/* 2. Section 3 Patent Risk Meter */}
          <div className="p-3 rounded-xl border border-slate-200 bg-white shadow-2xs">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700 mb-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>Patents Act 1970 Posture</span>
            </div>
            <div className="mt-1">
              {classificationState.section_3_risk === 'HIGH_BAR_SEC_3P' && (
                <span className="inline-block px-2 py-0.5 rounded bg-red-50 border border-red-200 text-red-800 font-bold text-[10px]">
                  Barred under Section 3(p) (TKDL Prior Art)
                </span>
              )}
              {classificationState.section_3_risk === 'CONDITIONAL_SEC_3E' && (
                <span className="inline-block px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 font-bold text-[10px]">
                  High Section 3(e) Risk &bull; Synergism Required
                </span>
              )}
              {classificationState.section_3_risk === 'PATENTABLE_SEC_3D' && (
                <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-[10px]">
                  Highly Patentable &bull; Section 3(d) Compliant
                </span>
              )}
              {classificationState.section_3_risk === 'NOT_APPLICABLE' && (
                <span className="inline-block px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-800 font-bold text-[10px]">
                  Recipe Non-Patentable &bull; Trademarks / Designs
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-600 mt-1.5 leading-relaxed font-medium">
              {classificationState.patentability}
            </p>
          </div>

          {/* 3. Biodiversity (BDA 2023) Posture */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-900 mb-1">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              <span>BDA 2023 ABS Compliance</span>
            </div>
            <p className="text-[10px] text-slate-700 leading-relaxed">
              {classificationState.abs_posture}
            </p>
          </div>

          {/* 4. Licensing Authority */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-900 mb-1">
              <Stethoscope className="w-3.5 h-3.5 text-blue-700" />
              <span>Competent Licensing Authority</span>
            </div>
            <p className="text-[11px] font-bold text-slate-800">
              {classificationState.authority}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {classificationState.clinical_requirements}
            </p>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-col gap-2 print:hidden">
            <button
              type="button"
              onClick={() => window.print()}
              className="w-full py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#002147] text-xs font-bold text-center border border-blue-300 transition-colors flex items-center justify-center gap-2 shadow-2xs"
              title="Print or Save Statutory Dossier as PDF"
            >
              <Printer className="w-4 h-4 text-blue-700" />
              <span>Download / Save Dossier (PDF)</span>
            </button>

            <Link
              href="/wizard"
              className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#002147] text-xs font-bold text-center border border-slate-300 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Re-triage Formulation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            
            <Link
              href="/abs-calculator"
              className="w-full py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold text-center border border-amber-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <Calculator className="w-3.5 h-3.5 text-amber-700" />
              <span>Compute ABS Turnover Fee</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Untriaged State Guide */
        <div className="space-y-4 py-2">
          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#002147]">
              <AlertCircle className="w-4 h-4 text-blue-700" />
              <span>No Active Formulation Triage</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Ayurvedic IP law changes dramatically depending on whether your product is a <strong>Classical Medicine</strong> (Section 3p bar) or a <strong>Phytopharmaceutical</strong> (Rule 122-E patentable).
            </p>
          </div>

          <div className="space-y-2 text-[11px] text-slate-600 font-medium">
            <p className="font-bold text-[#002147]">Completing triage unlocks:</p>
            <div className="flex items-center gap-1.5 text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>Automatic Section 3(p) TKDL Defense check</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>BDA 2023 ABS exemption assessment</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>Targeted Bhashini voice prompts</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 flex flex-col gap-2 print:hidden">
            <Link
              href="/wizard"
              className="w-full py-2.5 px-3 rounded-xl bg-[#002147] hover:bg-[#001733] text-white text-xs font-bold text-center shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Launch Formulation Triage (Step 1)</span>
            </Link>

            <button
              type="button"
              onClick={() => window.print()}
              className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold text-center border border-slate-300 transition-colors flex items-center justify-center gap-1.5"
              title="Print or Download Statutory Framework Reference Guide"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Download Statutory Guidelines (PDF)</span>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
