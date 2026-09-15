import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator, ShieldCheck } from 'lucide-react';
import { ABSCalculator } from '@/components/abs/ABSCalculator';

export default function ABSCalculatorPage() {
  return (
    <div className="flex-1 flex flex-col space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Chat Copilot</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Statutory Standard:</span>
          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
            Biological Diversity (Amendment) Act, 2023
          </span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <ABSCalculator />
      </div>
    </div>
  );
}
