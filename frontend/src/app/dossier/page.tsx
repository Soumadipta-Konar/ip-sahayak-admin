import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Printer } from 'lucide-react';
import { StatutoryDossier } from '@/components/dossier/StatutoryDossier';

export default function DossierPage() {
  return (
    <div className="flex-1 flex flex-col space-y-6">
      {/* Sub-header Breadcrumb (Hidden during print) */}
      <div className="print:hidden flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-[#002147] font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Legal Copilot</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Export Standard:</span>
          <span className="text-xs font-mono font-bold text-[#002147] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            GIGW 3.0 &bull; Ministry of AYUSH Official Dossier Format
          </span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <StatutoryDossier />
      </div>
    </div>
  );
}
