'use client';

import React from 'react';
import { Globe, MapPin } from 'lucide-react';
import { Jurisdiction } from '@/lib/types';

interface Props {
  value: Jurisdiction;
  onChange: (val: Jurisdiction) => void;
}

export const JurisdictionToggle: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="inline-flex p-1 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-medium shadow-inner">
      <button
        type="button"
        onClick={() => onChange('IN')}
        className={`px-3.5 py-1.5 rounded-lg flex items-center gap-2 transition-all ${
          value === 'IN'
            ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold shadow-md shadow-emerald-950 border border-emerald-500/40'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <span className="text-sm">🇮🇳</span>
        <span>India National (Patents Act & BDA 2023)</span>
      </button>

      <button
        type="button"
        onClick={() => onChange('INTL')}
        className={`px-3.5 py-1.5 rounded-lg flex items-center gap-2 transition-all ${
          value === 'INTL'
            ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold shadow-md shadow-indigo-950 border border-indigo-500/40'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <span className="text-sm">🌐</span>
        <span>International (US FDA, EMA & WIPO)</span>
      </button>

      <button
        type="button"
        onClick={() => onChange('BOTH')}
        className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
          value === 'BOTH'
            ? 'bg-slate-700 text-white font-semibold border border-slate-600'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <span>Dual Analysis</span>
      </button>
    </div>
  );
};
