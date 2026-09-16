'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { SessionContextSidebar } from '@/components/chat/SessionContextSidebar';
import { PriorArtAnalyzer } from '@/components/prior-art/PriorArtAnalyzer';
import { StatutoryDossier } from '@/components/dossier/StatutoryDossier';
import { FormulationWizard } from '@/components/wizard/FormulationWizard';
import { ABSCalculator } from '@/components/abs/ABSCalculator';
import { SessionHistory } from '@/components/history/SessionHistory';
import { 
  Sparkles, 
  Calculator, 
  BookOpen, 
  ArrowRight, 
  CheckCircle2, 
  MessageSquare, 
  Search, 
  FileText,
  Layers,
  ArrowLeft,
  BookMarked
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

export type ActiveWorkspaceTab = 'copilot' | 'prior-art' | 'dossier' | 'wizard' | 'abs' | 'history';

function MainWorkspace() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as ActiveWorkspaceTab) || 'copilot';

  const [activeTab, setActiveTab] = useState<ActiveWorkspaceTab>(initialTab);
  const { classificationState, priorArtAnalysis, absCalculation } = useAppStore();

  // Sync tab from URL search parameters if changed
  useEffect(() => {
    const tabParam = searchParams.get('tab') as ActiveWorkspaceTab;
    if (tabParam && ['copilot', 'prior-art', 'dossier', 'wizard', 'abs'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  return (
    <div className="flex-1 flex flex-col gap-6">
      {/* 1. Top Government Service Modules Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Formulation Triage */}
        <button 
          type="button"
          onClick={() => setActiveTab('wizard')}
          className={`p-3.5 rounded-xl border text-left transition-all group flex items-center justify-between shadow-xs ${
            activeTab === 'wizard'
              ? 'bg-blue-50/60 border-[#002147] ring-2 ring-[#002147]/20'
              : 'bg-white border-slate-200 hover:border-[#002147] hover:shadow-md'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-bold text-[#002147] group-hover:text-blue-900 transition-colors">
                  Formulation Triage
                </h3>
                {classificationState ? (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-0.5">
                    <CheckCircle2 className="w-2 h-2 text-emerald-600" />
                    Triaged
                  </span>
                ) : (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300">
                    Step 1
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                Classify product into 6 buckets
              </p>
            </div>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#002147] group-hover:translate-x-0.5 transition-all" />
        </button>

        {/* Card 2: ABS Calculator */}
        <button 
          type="button"
          onClick={() => setActiveTab('abs')}
          className={`p-3.5 rounded-xl border text-left transition-all group flex items-center justify-between shadow-xs ${
            activeTab === 'abs'
              ? 'bg-blue-50/60 border-[#002147] ring-2 ring-[#002147]/20'
              : 'bg-white border-slate-200 hover:border-[#002147] hover:shadow-md'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 group-hover:scale-105 transition-transform">
              <Calculator className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-bold text-[#002147] group-hover:text-blue-900 transition-colors">
                  BDA 2023 ABS Calculator
                </h3>
                {absCalculation && (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300">
                    Calculated
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                Compute statutory benefit fees
              </p>
            </div>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#002147] group-hover:translate-x-0.5 transition-all" />
        </button>

        {/* Card 3: TKDL Prior-Art Risk Analyzer */}
        <button 
          type="button"
          onClick={() => setActiveTab('prior-art')}
          className={`p-3.5 rounded-xl border text-left transition-all group flex items-center justify-between shadow-xs ${
            activeTab === 'prior-art'
              ? 'bg-blue-50/60 border-[#002147] ring-2 ring-[#002147]/20'
              : 'bg-white border-slate-200 hover:border-[#002147] hover:shadow-md'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-[#002147] group-hover:scale-105 transition-transform">
              <BookOpen className="w-4 h-4 text-[#002147]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-bold text-[#002147] group-hover:text-blue-900 transition-colors">
                  TKDL Prior-Art Risk
                </h3>
                {priorArtAnalysis && (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-900 border border-blue-300">
                    Risk {priorArtAnalysis.patentability_risk_score}%
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                Sec 3(p) & 3(e) patent screening
              </p>
            </div>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#002147] group-hover:translate-x-0.5 transition-all" />
        </button>

        {/* Card 4: Compliance Dossier & Export */}
        <button 
          type="button"
          onClick={() => setActiveTab('dossier')}
          className={`p-3.5 rounded-xl border text-left transition-all group flex items-center justify-between shadow-xs ${
            activeTab === 'dossier'
              ? 'bg-blue-50/60 border-[#002147] ring-2 ring-[#002147]/20'
              : 'bg-white border-slate-200 hover:border-[#002147] hover:shadow-md'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-4 h-4 text-indigo-700" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#002147] group-hover:text-blue-900 transition-colors">
                Statutory Dossier
              </h3>
              <p className="text-[11px] text-slate-500">
                Print/Export official filings
              </p>
            </div>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#002147] group-hover:translate-x-0.5 transition-all" />
        </button>
      </div>

      {/* 2. Unified Workspace Tab Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab('copilot')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'copilot'
                ? 'bg-[#002147] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>AI Legal Copilot (Chat & Voice)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('prior-art')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'prior-art'
                ? 'bg-[#002147] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-blue-400" />
            <span>TKDL Prior-Art Risk Analyzer</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dossier')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'dossier'
                ? 'bg-[#002147] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>Statutory Compliance Dossier & Export</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('wizard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'wizard'
                ? 'bg-[#002147] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Formulation Triage Wizard</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('abs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'abs'
                ? 'bg-[#002147] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-amber-500" />
            <span>BDA ABS Calculator</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'history'
                ? 'bg-[#002147] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookMarked className="w-3.5 h-3.5 text-indigo-400" />
            <span>Saved Citations & History</span>
          </button>
        </div>

        {activeTab !== 'copilot' && (
          <button
            type="button"
            onClick={() => setActiveTab('copilot')}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#002147] hover:underline px-2 py-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Copilot Chat</span>
          </button>
        )}
      </div>

      {/* 3. Tab Content Viewport */}
      {activeTab === 'copilot' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
          {/* Left Column: Interactive Legal Copilot & Voice Interface */}
          <div className="lg:col-span-8 flex flex-col min-h-[620px]">
            <ChatContainer />
          </div>

          {/* Right Column: Formulation Classification Sidebar / Session Context */}
          <div className="lg:col-span-4 sticky top-16">
            <SessionContextSidebar onSelectTab={(tab) => setActiveTab(tab)} />
          </div>
        </div>
      )}

      {activeTab === 'prior-art' && (
        <div className="flex-1">
          <PriorArtAnalyzer />
        </div>
      )}

      {activeTab === 'dossier' && (
        <div className="flex-1">
          <StatutoryDossier />
        </div>
      )}

      {activeTab === 'wizard' && (
        <div className="flex-1 flex items-center justify-center">
          <FormulationWizard />
        </div>
      )}

      {activeTab === 'abs' && (
        <div className="flex-1 flex items-center justify-center">
          <ABSCalculator />
        </div>
      )}

      {activeTab === 'history' && (
        <div className="flex-1">
          <SessionHistory />
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading Ministry Portal Workspace...</div>}>
      <MainWorkspace />
    </Suspense>
  );
}
