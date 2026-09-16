'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BookMarked, 
  Search, 
  ExternalLink, 
  FileText, 
  Calendar, 
  ShieldCheck, 
  ArrowLeft, 
  Download, 
  Printer, 
  Layers,
  Scale,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { StatutoryCitation } from '@/lib/types';

// Canonical Statutory Repository of Common AYUSH Citations
const CANONICAL_CITATIONS: StatutoryCitation[] = [
  {
    id: 'hist-cit-1',
    act: 'The Patents Act, 1970',
    section: 'Section 3(p)',
    description: 'Statutory bar against patenting traditional knowledge or aggregations of traditionally known components.',
    snippet: 'An invention which in effect, is traditional knowledge or which is an aggregation or duplication of known properties of traditionally known component or components is not an invention.',
    url: 'https://www.ipindia.gov.in/patents.htm',
    jurisdiction: 'IN'
  },
  {
    id: 'hist-cit-2',
    act: 'The Patents Act, 1970',
    section: 'Section 3(e)',
    description: 'Mere admixture hurdle requiring pharmacological synergy data.',
    snippet: 'A substance obtained by a mere admixture resulting only in the aggregation of the properties of the components thereof is not patentable.',
    url: 'https://www.ipindia.gov.in/patents.htm',
    jurisdiction: 'IN'
  },
  {
    id: 'hist-cit-3',
    act: 'The Patents Act, 1970',
    section: 'Section 3(d)',
    description: 'Enhanced therapeutic efficacy threshold for new forms or extracts.',
    snippet: 'The mere discovery of a new form of a known substance which does not result in the enhancement of the known efficacy of that substance is barred.',
    url: 'https://www.ipindia.gov.in/patents.htm',
    jurisdiction: 'IN'
  },
  {
    id: 'hist-cit-4',
    act: 'Biological Diversity Act, 2002 (as amended 2023)',
    section: 'Section 6',
    description: 'Mandatory prior approval of the National Biodiversity Authority (NBA) before patent grant.',
    snippet: 'No person shall apply for any intellectual property right based on biological resources obtained from India without previous approval of NBA.',
    url: 'http://nbaindia.org/',
    jurisdiction: 'IN'
  },
  {
    id: 'hist-cit-5',
    act: 'Biological Diversity Act, 2002 (as amended 2023)',
    section: 'Section 7',
    description: 'Prior intimation to State Biodiversity Board and exemptions for codified Vaidyas.',
    snippet: 'Commercial utilization requires intimation to SBB, but exempts registered AYUSH local practitioners.',
    url: 'http://nbaindia.org/',
    jurisdiction: 'IN'
  },
  {
    id: 'hist-cit-6',
    act: 'Drugs and Cosmetics Rules, 1945',
    section: 'Rule 158-B',
    description: 'Proof of textual authority for classical Ayurvedic medicines versus P&P safety trials.',
    snippet: 'Requires manufacturing to strictly follow First Schedule classical authoritative texts for classical drug licensing.',
    url: 'https://ayush.gov.in',
    jurisdiction: 'IN'
  },
  {
    id: 'hist-cit-7',
    act: 'Drugs and Cosmetics Rules, 1945',
    section: 'Rule 122-E',
    description: 'Definition and clinical regulatory pathway for Phytopharmaceutical drugs.',
    snippet: 'Standardized purified fraction of medicinal plants with ≥4 bioactive markers eligible for pharmaceutical claims.',
    url: 'https://cdsco.gov.in',
    jurisdiction: 'IN'
  }
];

export const SessionHistory: React.FC = () => {
  const { setSelectedCitation, classificationState, priorArtAnalysis } = useAppStore();
  const [filterAct, setFilterAct] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredCitations = CANONICAL_CITATIONS.filter((cit) => {
    const matchesAct = filterAct === 'all' || cit.act.toLowerCase().includes(filterAct.toLowerCase());
    const matchesQuery = 
      cit.section.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cit.act.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cit.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAct && matchesQuery;
  });

  const handleExportJSON = () => {
    const sessionLog = {
      exported_at: new Date().toISOString(),
      classification: classificationState || null,
      prior_art_analysis: priorArtAnalysis || null,
      saved_citations: CANONICAL_CITATIONS
    };
    const blob = new Blob([JSON.stringify(sessionLog, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ip-sakti-audit-session-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header & Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-[#002147]">
            <BookMarked className="w-6 h-6 text-[#002147]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200">
                Audited Legal Corpus
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                DPDP Anonymized
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#002147] mt-0.5">
              Saved Citations & Session History
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Statutory clauses, classical provenance citations, and audit logs recorded during your legal consultation session.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 print:hidden">
          <button
            type="button"
            onClick={handleExportJSON}
            className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Audit JSON</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-1.5 rounded-lg bg-[#002147] hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-400" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Active Session Consultation Snapshot */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#002147] flex items-center gap-2 border-b border-slate-200 pb-2">
          <Scale className="w-4 h-4 text-[#002147]" />
          <span>Active Session Consultation Snapshot</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Triage Status */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 font-semibold block">Formulation Triage:</span>
            <div className="font-bold text-slate-900 mt-0.5">
              {classificationState?.category || 'Not Triaged (Step 1 Pending)'}
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              {classificationState?.statute || 'Use Formulation Wizard to classify product'}
            </p>
          </div>

          {/* Prior-Art Risk Status */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 font-semibold block">TKDL Prior-Art Screening:</span>
            <div className="font-bold text-slate-900 mt-0.5">
              {priorArtAnalysis ? `Risk Score: ${priorArtAnalysis.patentability_risk_score}%` : 'Unscreened Formulation'}
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              {priorArtAnalysis?.overall_status || 'Evaluate ingredients against Section 3(p)'}
            </p>
          </div>

          {/* Compliance Dossier Status */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-slate-500 font-semibold block">Filing Dossier:</span>
              <div className="font-bold text-emerald-800 mt-0.5">
                Ready for Generation
              </div>
            </div>
            <Link
              href="/dossier"
              className="text-[11px] font-bold text-[#002147] hover:underline mt-2 flex items-center gap-1"
            >
              <span>View Statutory Dossier</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-600">Filter Statute:</span>
          {['all', 'Patents', 'Biological Diversity', 'Drugs and Cosmetics'].map((statute) => (
            <button
              key={statute}
              type="button"
              onClick={() => setFilterAct(statute)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                filterAct === statute
                  ? 'bg-[#002147] text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {statute === 'all' ? 'All Statutes' : statute}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search section or keyword..."
            className="w-full text-xs px-3 py-1.5 pl-8 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-1 focus:ring-[#002147]"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Citations Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#002147]">
            Statutory Legal Provisions & Clauses ({filteredCitations.length})
          </h3>
          <span className="text-[10px] text-slate-500 font-medium">Click any clause to inspect raw text</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-[#002147] border-b border-slate-200 font-bold">
                <th className="py-2.5 px-4">Act & Legislation</th>
                <th className="py-2.5 px-4">Section / Rule</th>
                <th className="py-2.5 px-4">Statutory Meaning & Impact</th>
                <th className="py-2.5 px-4">Official Text Preview</th>
                <th className="py-2.5 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredCitations.map((cit) => (
                <tr key={cit.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 max-w-[200px]">
                    {cit.act}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-blue-900">
                    {cit.section}
                  </td>
                  <td className="py-3 px-4 text-slate-700 max-w-[280px]">
                    {cit.description}
                  </td>
                  <td className="py-3 px-4 text-slate-500 italic max-w-[240px] truncate">
                    &ldquo;{cit.snippet}&rdquo;
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedCitation(cit)}
                      className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[11px] font-bold text-[#002147] transition-colors inline-flex items-center gap-1"
                    >
                      <span>Inspect</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
