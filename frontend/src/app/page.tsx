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
    if (tabParam && ['copilot', 'prior-art', 'dossier', 'wizard', 'abs', 'history'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  return (
    <div className="flex-1 flex flex-col gap-5">
      {/* 1. Top Government Service Modules (Official Sharp Tiles with Statutory Top Borders) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Formulation Triage */}
        <button 
          type="button"
          onClick={() => setActiveTab('wizard')}
          className={`p-3.5 border-2 text-left transition-all group flex items-center justify-between shadow-none border-t-4 ${
            activeTab === 'wizard'
              ? 'bg-blue-50 border-[#002147] border-t-[#002147]'
              : 'bg-white border-slate-300 border-t-[#002147] hover:border-slate-400'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-100 border border-slate-300 text-[#002147]">
              <Sparkles className="w-4 h-4 text-[#002147]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-bold text-[#002147] uppercase tracking-wide">
                  Formulation Triage
                </h3>
                {classificationState ? (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 bg-emerald-100 text-emerald-900 border border-emerald-400 flex items-center gap-0.5">
                    <CheckCircle2 className="w-2 h-2 text-emerald-700" />
                    Triaged
                  </span>
                ) : (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 bg-amber-100 text-amber-900 border border-amber-400">
                    Step 1
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 font-medium">
                Classify product into 6 buckets
              </p>
            </div>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#002147] transition-all" />
        </button>

        {/* Card 2: ABS Calculator */}
        <button 
          type="button"
          onClick={() => setActiveTab('abs')}
          className={`p-3.5 border-2 text-left transition-all group flex items-center justify-between shadow-none border-t-4 ${
            activeTab === 'abs'
              ? 'bg-amber-50/50 border-[#b45309] border-t-[#b45309]'
              : 'bg-white border-slate-300 border-t-[#b45309] hover:border-slate-400'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-50 border border-amber-300 text-amber-900">
              <Calculator className="w-4 h-4 text-amber-800" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-bold text-[#002147] uppercase tracking-wide">
                  BDA 2023 ABS Calculator
                </h3>
                {absCalculation && (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 bg-amber-100 text-amber-900 border border-amber-400">
                    Calculated
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 font-medium">
                Compute statutory benefit fees
              </p>
            </div>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#b45309] transition-all" />
        </button>

        {/* Card 3: TKDL Prior-Art Risk Analyzer */}
        <button 
          type="button"
          onClick={() => setActiveTab('prior-art')}
          className={`p-3.5 border-2 text-left transition-all group flex items-center justify-between shadow-none border-t-4 ${
            activeTab === 'prior-art'
              ? 'bg-blue-50 border-[#0B4F8A] border-t-[#0B4F8A]'
              : 'bg-white border-slate-300 border-t-[#0B4F8A] hover:border-slate-400'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 border border-blue-300 text-[#002147]">
              <BookOpen className="w-4 h-4 text-[#002147]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-bold text-[#002147] uppercase tracking-wide">
                  TKDL Prior-Art Risk
                </h3>
                {priorArtAnalysis && (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 bg-blue-100 text-blue-950 border border-blue-400">
                    Risk {priorArtAnalysis.patentability_risk_score}%
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 font-medium">
                Sec 3(p) & 3(e) patent screening
              </p>
            </div>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#0B4F8A] transition-all" />
        </button>

        {/* Card 4: Compliance Dossier & Export */}
        <button 
          type="button"
          onClick={() => setActiveTab('dossier')}
          className={`p-3.5 border-2 text-left transition-all group flex items-center justify-between shadow-none border-t-4 ${
            activeTab === 'dossier'
              ? 'bg-emerald-50/50 border-[#138808] border-t-[#138808]'
              : 'bg-white border-slate-300 border-t-[#138808] hover:border-slate-400'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 border border-emerald-300 text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-800" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#002147] uppercase tracking-wide">
                Statutory Dossier
              </h3>
              <p className="text-[11px] text-slate-600 font-medium">
                Print/Export official filings
              </p>
            </div>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#138808] transition-all" />
        </button>
      </div>

      {/* 2. Official Government Workspace Tab Bar (Flat, Sharp, Tricolor Accent) */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-1.5 border-2 border-slate-300 shadow-none">
        <div className="flex items-stretch gap-1 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab('copilot')}
            className={`px-3.5 py-2 text-xs font-bold flex items-center gap-2 transition-all border ${
              activeTab === 'copilot'
                ? 'bg-[#002147] text-white border-[#002147] border-b-2 border-b-[#FF9933]'
                : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>AI Legal Copilot (Chat & Voice)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('prior-art')}
            className={`px-3.5 py-2 text-xs font-bold flex items-center gap-2 transition-all border ${
              activeTab === 'prior-art'
                ? 'bg-[#002147] text-white border-[#002147] border-b-2 border-b-[#FF9933]'
                : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>TKDL Prior-Art Risk Analyzer</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dossier')}
            className={`px-3.5 py-2 text-xs font-bold flex items-center gap-2 transition-all border ${
              activeTab === 'dossier'
                ? 'bg-[#002147] text-white border-[#002147] border-b-2 border-b-[#FF9933]'
                : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Statutory Compliance Dossier & Export</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('wizard')}
            className={`px-3.5 py-2 text-xs font-bold flex items-center gap-2 transition-all border ${
              activeTab === 'wizard'
                ? 'bg-[#002147] text-white border-[#002147] border-b-2 border-b-[#FF9933]'
                : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Formulation Triage Wizard</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('abs')}
            className={`px-3.5 py-2 text-xs font-bold flex items-center gap-2 transition-all border ${
              activeTab === 'abs'
                ? 'bg-[#002147] text-white border-[#002147] border-b-2 border-b-[#FF9933]'
                : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>BDA ABS Calculator</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-2 text-xs font-bold flex items-center gap-2 transition-all border ${
              activeTab === 'history'
                ? 'bg-[#002147] text-white border-[#002147] border-b-2 border-b-[#FF9933]'
                : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
            }`}
          >
            <BookMarked className="w-3.5 h-3.5" />
            <span>Saved Citations & History</span>
          </button>
        </div>

        {activeTab !== 'copilot' && (
          <button
            type="button"
            onClick={() => setActiveTab('copilot')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#002147] hover:underline px-3 py-1.5 border border-slate-300 bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Copilot Chat</span>
          </button>
        )}
      </div>

      {/* 3. Tab Content Viewport */}
      {activeTab === 'copilot' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 items-start">
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
    <Suspense fallback={<div className="p-8 text-center text-xs font-bold text-slate-700 bg-white border border-slate-300">Loading Ministry Portal Workspace...</div>}>
      <MainWorkspace />
    </Suspense>
  );
}
