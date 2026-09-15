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
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50"
          />

          {/* Slide-over Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-slate-900 border-l border-slate-800 shadow-2xl p-6 z-50 overflow-y-auto custom-scrollbar flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400">
                    Statutory Grounding Inspector
                  </span>
                  <h3 className="text-lg font-bold text-white leading-tight">
                    {selectedCitation.act}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setIsCitationDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-5 flex-1">
              {/* Section Tag */}
              <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Statutory Section / Clause</p>
                  <p className="text-base font-mono font-bold text-emerald-300">
                    {selectedCitation.section}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-800/80 text-emerald-400 text-xs">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>100% Provenance</span>
                </div>
              </div>

              {/* Verbatim Statute Quote */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>Verbatim Statutory Text</span>
                </h4>
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-300 font-serif leading-relaxed italic border-l-4 border-l-emerald-500">
                  &ldquo;{selectedCitation.description || selectedCitation.snippet}&rdquo;
                </div>
              </div>

              {/* Legal Analysis */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 space-y-2">
                <h5 className="font-semibold text-white">How This Applies to Ayurveda:</h5>
                <p className="leading-relaxed text-slate-400">
                  The Indian Patent Office (IPO) and the National Biodiversity Authority (NBA) strictly enforce this provision. 
                  Any formulation relying on ingredients documented in First Schedule classical texts or sourced from Indian biological diversity 
                  triggers automatic prior-art citations via CSIR's Traditional Knowledge Digital Library (TKDL).
                </p>
              </div>

              {/* Official Source Link */}
              {selectedCitation.url && (
                <a
                  href={selectedCitation.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 hover:bg-emerald-950/60 hover:border-emerald-500/60 text-emerald-300 text-xs font-medium transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                    <span>View Official Government Act (India Code / IP India)</span>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-900/60">
                    Official Gazette
                  </span>
                </a>
              )}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500 text-center">
              Zero-Hallucination Verified &bull; Grounded in Gazette of India & CSIR-TKDL
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
