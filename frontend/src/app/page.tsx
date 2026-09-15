'use client';

import React from 'react';
import Link from 'next/link';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { Sparkles, Calculator, BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function HomePage() {
  const { classificationState } = useAppStore();

  return (
    <div className="flex-1 flex flex-col gap-6">
      {/* Top Government Service Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Formulation Triage */}
        <Link 
          href="/wizard" 
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-[#002147] hover:shadow-md transition-all group flex items-center justify-between shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-[#002147] group-hover:text-blue-900 transition-colors">
                  Formulation Triage Wizard
                </h3>
                {classificationState ? (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                    Triaged
                  </span>
                ) : (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300">
                    Step 1
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                Classify product into 1 of 6 statutory buckets
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#002147] group-hover:translate-x-1 transition-all" />
        </Link>

        {/* Card 2: ABS Calculator */}
        <Link 
          href="/abs-calculator" 
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-[#002147] hover:shadow-md transition-all group flex items-center justify-between shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 group-hover:scale-105 transition-transform">
              <Calculator className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-[#002147] group-hover:text-blue-900 transition-colors">
                BDA 2023 ABS Calculator
              </h3>
              <p className="text-[11px] text-slate-500">
                Compute statutory benefit-sharing obligations
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#002147] group-hover:translate-x-1 transition-all" />
        </Link>

        {/* Card 3: TKDL Statutory Guardrails */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-[#002147]">
              <BookOpen className="w-5 h-5 text-[#002147]" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-[#002147]">
                TKDL & Section 3 Guardrails
              </h3>
              <p className="text-[11px] text-slate-500">
                Zero hallucination statutory citation engine
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
            Active
          </span>
        </div>
      </div>

      {/* Main Interactive Statutory AI Copilot & Voice Interface */}
      <div className="flex-1 flex flex-col min-h-[580px]">
        <ChatContainer />
      </div>
    </div>
  );
}
