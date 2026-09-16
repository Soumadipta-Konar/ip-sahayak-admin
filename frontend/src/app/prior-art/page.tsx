import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Scale } from 'lucide-react';
import { PriorArtAnalyzer } from '@/components/prior-art/PriorArtAnalyzer';

export default function PriorArtPage() {
  return (
    <div className="flex-1 flex flex-col space-y-6">
      {/* Statutory Standard Breadcrumb / Sub-header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-[#002147] font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Legal Copilot</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Statutory Corpus:</span>
          <span className="text-xs font-mono font-bold text-[#002147] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            The Indian Patents Act (1970) Sec 3(p) &bull; CSIR Traditional Knowledge Digital Library (TKDL)
          </span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <PriorArtAnalyzer />
      </div>
    </div>
  );
}
