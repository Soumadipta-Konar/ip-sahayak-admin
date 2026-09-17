'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookMarked, 
  Search, 
  ExternalLink, 
  Download, 
  Printer, 
  Scale, 
  Trash2,
  MessageSquare,
  Bookmark,
  Clock,
  ShieldCheck,
  Filter,
  CheckCircle2
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
    jurisdiction: 'IN',
    source: 'canonical'
  },
  {
    id: 'hist-cit-2',
    act: 'The Patents Act, 1970',
    section: 'Section 3(e)',
    description: 'Mere admixture hurdle requiring pharmacological synergy data.',
    snippet: 'A substance obtained by a mere admixture resulting only in the aggregation of the properties of the components thereof is not patentable.',
    url: 'https://www.ipindia.gov.in/patents.htm',
    jurisdiction: 'IN',
    source: 'canonical'
  },
  {
    id: 'hist-cit-3',
    act: 'The Patents Act, 1970',
    section: 'Section 3(d)',
    description: 'Enhanced therapeutic efficacy threshold for new forms or extracts.',
    snippet: 'The mere discovery of a new form of a known substance which does not result in the enhancement of the known efficacy of that substance is barred.',
    url: 'https://www.ipindia.gov.in/patents.htm',
    jurisdiction: 'IN',
    source: 'canonical'
  },
  {
    id: 'hist-cit-4',
    act: 'Biological Diversity Act, 2002 (as amended 2023)',
    section: 'Section 6',
    description: 'Mandatory prior approval of the National Biodiversity Authority (NBA) before patent grant.',
    snippet: 'No person shall apply for any intellectual property right based on biological resources obtained from India without previous approval of NBA.',
    url: 'http://nbaindia.org/',
    jurisdiction: 'IN',
    source: 'canonical'
  },
  {
    id: 'hist-cit-5',
    act: 'Biological Diversity Act, 2002 (as amended 2023)',
    section: 'Section 7',
    description: 'Prior intimation to State Biodiversity Board and exemptions for codified Vaidyas.',
    snippet: 'Commercial utilization requires intimation to SBB, but exempts registered AYUSH local practitioners.',
    url: 'http://nbaindia.org/',
    jurisdiction: 'IN',
    source: 'canonical'
  },
  {
    id: 'hist-cit-6',
    act: 'Drugs and Cosmetics Rules, 1945',
    section: 'Rule 158-B',
    description: 'Proof of textual authority for classical Ayurvedic medicines versus P&P safety trials.',
    snippet: 'Requires manufacturing to strictly follow First Schedule classical authoritative texts for classical drug licensing.',
    url: 'https://ayush.gov.in',
    jurisdiction: 'IN',
    source: 'canonical'
  },
  {
    id: 'hist-cit-7',
    act: 'Drugs and Cosmetics Rules, 1945',
    section: 'Rule 122-E',
    description: 'Definition and clinical regulatory pathway for Phytopharmaceutical drugs.',
    snippet: 'Standardized purified fraction of medicinal plants with ≥4 bioactive markers eligible for pharmaceutical claims.',
    url: 'https://cdsco.gov.in',
    jurisdiction: 'IN',
    source: 'canonical'
  }
];

export const SessionHistory: React.FC = () => {
  const { 
    setSelectedCitation, 
    classificationState, 
    priorArtAnalysis,
    savedCitations,
    removeSavedCitation,
    clearSavedCitations,
    chatMessages,
    sessionId,
    hydrateFromStorage
  } = useAppStore();

  const [scopeFilter, setScopeFilter] = useState<'all' | 'collected' | 'canonical'>('all');
  const [filterAct, setFilterAct] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isConfirmingClearCitations, setIsConfirmingClearCitations] = useState(false);

  // Client-side hydration from localStorage on mount
  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  // Combine canonical list with dynamically collected session citations, removing duplicates
  const allCombinedCitations = React.useMemo(() => {
    const list: StatutoryCitation[] = [...savedCitations];
    CANONICAL_CITATIONS.forEach((canon) => {
      const exists = list.some(
        (c) => c.act.toLowerCase() === canon.act.toLowerCase() && c.section.toLowerCase() === canon.section.toLowerCase()
      );
      if (!exists) {
        list.push(canon);
      }
    });
    return list;
  }, [savedCitations]);

  // Determine source pool based on scopeFilter
  const basePool = React.useMemo(() => {
    if (scopeFilter === 'collected') return savedCitations;
    if (scopeFilter === 'canonical') return CANONICAL_CITATIONS;
    return allCombinedCitations;
  }, [scopeFilter, savedCitations, allCombinedCitations]);

  // Apply statute & query filters
  const filteredCitations = basePool.filter((cit) => {
    const matchesAct = filterAct === 'all' || cit.act.toLowerCase().includes(filterAct.toLowerCase());
    const matchesQuery = 
      cit.section.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cit.act.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cit.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cit.snippet && cit.snippet.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesAct && matchesQuery;
  });

  const handleClearSaved = () => {
    if (!isConfirmingClearCitations) {
      setIsConfirmingClearCitations(true);
      setTimeout(() => setIsConfirmingClearCitations(false), 4000);
      return;
    }
    clearSavedCitations();
    setIsConfirmingClearCitations(false);
  };

  const handleExportJSON = () => {
    const sessionLog = {
      audit_meta: {
        exported_at: new Date().toISOString(),
        session_id: sessionId,
        system_version: "IP-SAKTI Sahayak v1.0 (SIH 045)",
        dpdp_anonymized: true
      },
      consultation_summary: {
        total_messages: chatMessages.length,
        total_saved_citations: savedCitations.length,
        formulation_triage: classificationState || null,
        prior_art_risk_analysis: priorArtAnalysis || null,
      },
      consultation_chat_history: chatMessages,
      session_collected_citations: savedCitations,
      canonical_statutory_repository: CANONICAL_CITATIONS
    };

    const blob = new Blob([JSON.stringify(sessionLog, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ip-sakti-statutory-audit-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5">
      {/* Header & Primary Controls */}
      <div className="bg-white border-2 border-slate-300 border-t-4 border-t-[#002147] p-5 shadow-none flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-100 border border-slate-300 text-[#002147]">
            <BookMarked className="w-6 h-6 text-[#002147]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-100 text-blue-900 border border-blue-300">
                Audited Legal Corpus
              </span>
              <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 border border-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-700" />
                DPDP Anonymized
              </span>
              <span className="text-[10px] font-bold text-slate-800 bg-slate-100 px-2 py-0.5 border border-slate-300">
                Client Vault Active
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#002147] mt-0.5 tracking-tight">
              Saved Citations & Session History
            </h1>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Live consultation statutory citations, verbatim clauses, and session transcripts recorded for your legal compliance audit.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 print:hidden">
          {savedCitations.length > 0 && (
            <button
              type="button"
              onClick={handleClearSaved}
              className={`px-3 py-1.5 border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                isConfirmingClearCitations
                  ? 'bg-red-700 text-white border-red-800 animate-pulse'
                  : 'border-slate-400 hover:bg-red-50 text-slate-800 hover:text-red-700 bg-white'
              }`}
              title="Clear only citations collected during this session"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isConfirmingClearCitations ? 'Confirm Clear?' : 'Clear Session Citations'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleExportJSON}
            className="px-3 py-1.5 border border-slate-400 hover:bg-slate-100 text-xs font-bold text-slate-900 flex items-center gap-1.5 transition-colors bg-white shadow-none"
            title="Download full session audit log, chat history & citations as JSON"
          >
            <Download className="w-3.5 h-3.5 text-slate-700" />
            <span>Export Audit JSON</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-1.5 bg-[#002147] hover:bg-[#001733] text-white text-xs font-bold flex items-center gap-1.5 transition-colors border border-[#001733] shadow-none"
            title="Print or save session as PDF dossier"
          >
            <Printer className="w-3.5 h-3.5 text-[#FF9933]" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Active Session Consultation Snapshot (4-Card Grid) */}
      <div className="bg-white border-2 border-slate-300 p-5 shadow-none space-y-3.5">
        <h3 className="text-xs font-black uppercase tracking-wider text-[#002147] flex items-center gap-2 border-b-2 border-slate-200 pb-2">
          <Scale className="w-4 h-4 text-[#002147]" />
          <span>Active Session Consultation Snapshot</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
          {/* Card 1: Triage Status */}
          <div className="p-3.5 bg-[#f8f9fa] border border-slate-300 flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wide block">Formulation Triage:</span>
              <div className="font-bold text-slate-900 mt-0.5 line-clamp-1">
                {classificationState?.category || 'Not Triaged (Step 1)'}
              </div>
              <p className="text-[10px] text-slate-600 mt-1 line-clamp-2">
                {classificationState?.statute || 'Launch wizard to classify product category'}
              </p>
            </div>
            <Link href="/wizard" className="text-[10px] font-bold text-[#002147] hover:underline mt-2 inline-flex items-center gap-1">
              <span>{classificationState ? 'Modify Triage' : 'Start Triage'}</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </Link>
          </div>

          {/* Card 2: Prior-Art Risk Status */}
          <div className="p-3.5 bg-[#f8f9fa] border border-slate-300 flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wide block">TKDL Prior-Art Screening:</span>
              <div className="font-bold text-slate-900 mt-0.5">
                {priorArtAnalysis ? `Risk Score: ${priorArtAnalysis.patentability_risk_score}%` : 'Unscreened Formulation'}
              </div>
              <p className="text-[10px] text-slate-600 mt-1 line-clamp-2">
                {priorArtAnalysis?.overall_status || 'Screen ingredients against Section 3(p) Traditional Knowledge'}
              </p>
            </div>
            <Link href="/?tab=prior-art" className="text-[10px] font-bold text-[#002147] hover:underline mt-2 inline-flex items-center gap-1">
              <span>Inspect Prior-Art</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </Link>
          </div>

          {/* Card 3: Consultation Session Audit (Option A & B metrics) */}
          <div className="p-3.5 bg-blue-50/50 border border-blue-300 flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-blue-950 font-bold uppercase tracking-wide block">Active Copilot Consultation:</span>
              <div className="font-bold text-[#002147] mt-0.5 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#002147]" />
                <span>{chatMessages.length} Messages Logged</span>
              </div>
              <p className="text-[10px] text-blue-900 mt-1 font-medium">
                <strong>{savedCitations.length} Citations</strong> auto-collected in active session.
              </p>
            </div>
            <Link href="/" className="text-[10px] font-bold text-[#002147] hover:underline mt-2 inline-flex items-center gap-1">
              <span>Return to Copilot</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </Link>
          </div>

          {/* Card 4: Compliance Dossier Status */}
          <div className="p-3.5 bg-[#f8f9fa] border border-slate-300 flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wide block">Filing Dossier:</span>
              <div className="font-bold text-emerald-900 mt-0.5">
                Ready for Generation
              </div>
              <p className="text-[10px] text-slate-600 mt-1 font-medium">
                Official statutory dossier formatted with all cited authorities.
              </p>
            </div>
            <Link
              href="/dossier"
              className="text-[10px] font-bold text-[#002147] hover:underline mt-2 flex items-center gap-1"
            >
              <span>View Statutory Dossier</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Scope Selector, Filter & Search Bar */}
      <div className="bg-white border-2 border-slate-300 p-4 shadow-none space-y-3 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Scope Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 border border-slate-300">
            <button
              type="button"
              onClick={() => setScopeFilter('all')}
              className={`px-3 py-1.5 text-xs font-bold transition-all border ${
                scopeFilter === 'all'
                  ? 'bg-[#002147] text-white border-[#002147]'
                  : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
              }`}
            >
              All Statutory Citations ({allCombinedCitations.length})
            </button>
            <button
              type="button"
              onClick={() => setScopeFilter('collected')}
              className={`px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 border ${
                scopeFilter === 'collected'
                  ? 'bg-[#002147] text-white border-[#002147]'
                  : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Bookmark className="w-3 h-3 text-[#FF9933]" />
              <span>Session Collected ({savedCitations.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setScopeFilter('canonical')}
              className={`px-3 py-1.5 text-xs font-bold transition-all border ${
                scopeFilter === 'canonical'
                  ? 'bg-[#002147] text-white border-[#002147]'
                  : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
              }`}
            >
              Canonical Library ({CANONICAL_CITATIONS.length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search section, act or keyword..."
              className="w-full text-xs px-3 py-1.5 pl-8 border-2 border-slate-400 bg-white text-slate-900 focus:border-[#002147] focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Statute Specific Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-200">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-500" />
            <span>Filter Statute:</span>
          </span>
          {['all', 'Patents', 'Biological Diversity', 'Drugs and Cosmetics'].map((statute) => (
            <button
              key={statute}
              type="button"
              onClick={() => setFilterAct(statute)}
              className={`px-2.5 py-1 text-[11px] font-bold transition-colors border ${
                filterAct === statute
                  ? 'bg-[#002147] text-white border-[#002147]'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
              }`}
            >
              {statute === 'all' ? 'All Statutes' : statute}
            </button>
          ))}
        </div>
      </div>

      {/* Citations Table */}
      <div className="bg-white border-2 border-slate-300 shadow-none overflow-hidden">
        <div className="p-3.5 bg-slate-100 border-b-2 border-slate-300 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#002147]">
              Statutory Legal Provisions & Clauses ({filteredCitations.length})
            </h3>
            {scopeFilter === 'collected' && (
              <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-200 text-amber-950 border border-amber-400">
                Live Consultation Collector Active
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-600 font-bold">Click any clause to inspect verbatim statutory text</span>
        </div>

        {filteredCitations.length === 0 ? (
          <div className="p-12 text-center text-slate-600 space-y-3">
            <BookMarked className="w-8 h-8 text-slate-400 mx-auto" />
            <div className="text-xs font-bold text-slate-800">
              {scopeFilter === 'collected' 
                ? 'No citations collected during this consultation session yet.' 
                : 'No statutory clauses matched your search criteria.'}
            </div>
            <p className="text-[11px] text-slate-600 max-w-md mx-auto">
              {scopeFilter === 'collected'
                ? 'Whenever the AI Copilot references an Act or Section in your conversation, or when you click the bookmark button in chat, it will automatically appear here.'
                : 'Try clearing your search query or selecting "All Statutes".'}
            </p>
            {scopeFilter === 'collected' && (
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#002147] hover:underline pt-2"
              >
                <span>Go to AI Copilot</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#002147] text-white border-b-2 border-[#001733] font-bold">
                  <th className="py-3 px-4 text-white border-r border-blue-900">Act & Legislation</th>
                  <th className="py-3 px-4 text-white border-r border-blue-900">Section / Rule</th>
                  <th className="py-3 px-4 text-white border-r border-blue-900">Provenance / Source</th>
                  <th className="py-3 px-4 text-white border-r border-blue-900">Statutory Meaning & Impact</th>
                  <th className="py-3 px-4 text-right text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                {filteredCitations.map((cit, idx) => {
                  const isSessionItem = savedCitations.some(
                    (s) => (s.id && cit.id && s.id === cit.id) ||
                    (s.act.toLowerCase() === cit.act.toLowerCase() && s.section.toLowerCase() === cit.section.toLowerCase())
                  );

                  return (
                    <tr key={cit.id || idx} className="hover:bg-blue-50/50 transition-colors even:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900 max-w-[180px] border-r border-slate-200">
                        <div>{cit.act}</div>
                        {cit.jurisdiction && (
                          <span className="text-[9px] font-mono text-slate-500">
                            Jurisdiction: {cit.jurisdiction}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#002147] whitespace-nowrap border-r border-slate-200">
                        {cit.section}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap border-r border-slate-200">
                        {isSessionItem ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-400">
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-700" />
                              <span>Session Collected</span>
                            </span>
                            {cit.collectedAt && (
                              <div className="text-[9px] text-slate-600 flex items-center gap-1 font-semibold">
                                <Clock className="w-2.5 h-2.5" />
                                <span>{cit.collectedAt}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-200 text-slate-800 border border-slate-300">
                            Canonical Library
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-800 max-w-[320px] border-r border-slate-200">
                        <div className="font-semibold">{cit.description}</div>
                        {cit.snippet && (
                          <div className="text-[11px] text-slate-600 italic mt-0.5 line-clamp-2">
                            &ldquo;{cit.snippet}&rdquo;
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            type="button"
                            onClick={() => setSelectedCitation(cit)}
                            className="px-2.5 py-1 bg-white hover:bg-blue-50 border border-[#002147] text-[11px] font-bold text-[#002147] transition-colors inline-flex items-center gap-1"
                            title="Inspect verbatim statutory clause"
                          >
                            <span>Inspect</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>

                          {isSessionItem && (
                            <button
                              type="button"
                              onClick={() => removeSavedCitation(cit.id || `${cit.act}::${cit.section}`)}
                              className="p-1 text-slate-500 hover:text-red-700 hover:bg-red-50 transition-colors border border-transparent hover:border-red-300"
                              title="Remove from saved session citations"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
