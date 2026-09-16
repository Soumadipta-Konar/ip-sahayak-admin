import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookMarked } from 'lucide-react';
import { SessionHistory } from '@/components/history/SessionHistory';

export default function HistoryPage() {
  return (
    <div className="flex-1 flex flex-col space-y-6">
      {/* Sub-header Breadcrumb */}
      <div className="print:hidden flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-[#002147] font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Legal Copilot</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Repository:</span>
          <span className="text-xs font-mono font-bold text-[#002147] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            Official Ministry Statutory Repository &bull; Section 3(p) &bull; BDA 2023
          </span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <SessionHistory />
      </div>
    </div>
  );
}
