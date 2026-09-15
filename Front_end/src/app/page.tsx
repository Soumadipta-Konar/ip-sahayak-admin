import React from 'react';
import Link from 'next/link';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { Sparkles, Shield, Scale, Calculator, ArrowRight, BookOpen } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col gap-6">
      {/* Top Banner / Hero Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1 */}
        <Link 
          href="/wizard" 
          className="p-4 rounded-2xl glass-panel hover:border-emerald-500/50 transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                Formulation Triage Wizard
              </h3>
              <p className="text-[11px] text-slate-400">
                Classify product into 1 of 6 statutory buckets
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
        </Link>

        {/* Card 2 */}
        <Link 
          href="/abs-calculator" 
          className="p-4 rounded-2xl glass-panel hover:border-amber-500/50 transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 group-hover:scale-105 transition-transform">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                BDA 2023 ABS Calculator
              </h3>
              <p className="text-[11px] text-slate-400">
                Compute statutory benefit-sharing obligations
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
        </Link>

        {/* Card 3 */}
        <div className="p-4 rounded-2xl glass-panel flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                TKDL & Section 3 Guardrails
              </h3>
              <p className="text-[11px] text-slate-400">
                Zero hallucination statutory citation engine
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800">
            Active
          </span>
        </div>
      </div>

      {/* Main Interactive AI Copilot */}
      <div className="flex-1 flex flex-col min-h-[580px]">
        <ChatContainer />
      </div>
    </div>
  );
}
