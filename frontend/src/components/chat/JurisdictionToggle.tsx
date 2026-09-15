'use client';

import React from 'react';
import { Globe, MapPin, Scale } from 'lucide-react';
import { Jurisdiction } from '@/lib/types';

interface Props {
  value: Jurisdiction;
  onChange: (val: Jurisdiction) => void;
}

export const JurisdictionToggle: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="inline-flex p-1 bg-slate-100 border border-slate-300 rounded-xl text-xs font-semibold shadow-inner">
      <button
        type="button"
        onClick={() => onChange('IN')}
        className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
          value === 'IN'
            ? 'bg-white text-emerald-900 font-bold shadow-xs border border-emerald-500'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
        }`}
        aria-label="Switch to Indian National Jurisdiction"
      >
        <span className="text-xs">🇮🇳</span>
        <span>India National (Patents Act & BDA 2023)</span>
      </button>

      <button
        type="button"
        onClick={() => onChange('INTL')}
        className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
          value === 'INTL'
            ? 'bg-indigo-900 text-white font-bold shadow-xs border border-indigo-700'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
        }`}
        aria-label="Switch to International Jurisdiction"
      >
        <span className="text-xs">🌐</span>
        <span>International (WIPO, US FDA & EMA)</span>
      </button>

      <button
        type="button"
        onClick={() => onChange('BOTH')}
        className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all ${
          value === 'BOTH'
            ? 'bg-[#002147] text-white font-bold shadow-xs'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
        }`}
        aria-label="Switch to Dual Jurisdiction"
      >
        <Scale className="w-3.5 h-3.5" />
        <span>Dual Mode</span>
      </button>
    </div>
  );
};
