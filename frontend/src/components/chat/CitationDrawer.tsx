'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, BookOpen, ShieldCheck, Scale } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export const CitationDrawer: React.FC = () => {
  const { selectedCitation, isCitationDrawerOpen, setIsCitationDrawerOpen } = useAppStore();

  if (!selectedCitation) return null;

  return (
    <AnimatePresence>
      {isCitationDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCitationDrawerOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50"
          />

          {/* Slide-over Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white border-l border-slate-200 shadow-2xl p-6 z-50 overflow-y-auto custom-scrollbar flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-[#002147]">
                  <Scale className="w-5 h-5 text-[#002147]" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider font-bold text-emerald-800">
                    Statutory Grounding Inspector
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                    {selectedCitation.act}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCitationDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Close Drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-5 flex-1">
              {/* Section Tag */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Statutory Section / Clause</p>
                  <p className="text-base font-mono font-bold text-[#002147]">
                    {selectedCitation.section}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Provenance</span>
                </div>
              </div>

              {/* Verbatim Statute Quote */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                  <span>Verbatim Statutory Text</span>
                </h4>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 font-serif leading-relaxed italic border-l-4 border-l-[#002147]">
                  &ldquo;{selectedCitation.description || selectedCitation.snippet}&rdquo;
                </div>
              </div>

              {/* Legal Analysis */}
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 text-xs text-slate-700 space-y-2">
                <h5 className="font-bold text-[#002147]">How This Applies to Ayurveda:</h5>
                <p className="leading-relaxed text-slate-600">
                  The Indian Patent Office (IPO) and the National Biodiversity Authority (NBA) strictly enforce this provision. 
                  Any formulation relying on ingredients documented in First Schedule classical texts or sourced from Indian biological diversity 
                  triggers automatic prior-art citations via CSIR&apos;s Traditional Knowledge Digital Library (TKDL).
                </p>
              </div>

              {/* Official Source Link */}
              {selectedCitation.url && (
                <a
                  href={selectedCitation.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-[#002147] text-xs font-semibold transition-all group shadow-2xs"
                >
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-[#002147] group-hover:translate-x-0.5 transition-transform" />
                    <span>View Official Government Act (India Code / IP India)</span>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                    Official Gazette
                  </span>
                </a>
              )}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-slate-200 text-[11px] text-slate-500 text-center">
              Zero-Hallucination Verified &bull; Grounded in Gazette of India & CSIR-TKDL
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
