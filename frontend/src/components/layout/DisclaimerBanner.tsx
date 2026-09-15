import React from 'react';
import { AlertCircle, ShieldCheck } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <div className="bg-amber-950/50 border-b border-amber-500/20 px-4 py-2 text-center text-xs text-amber-200/90 flex items-center justify-center gap-2">
      <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
      <span>
        <strong>Statutory Information Notice:</strong> Guidance is AI-synthesized from official Indian statutes (Patents Act 1970 §3(p)/§3(e), Biological Diversity Act 2023, D&C Act 1940) and international treaties. Not a substitute for formal IP counsel.
      </span>
      <div className="hidden md:flex items-center gap-1 text-[11px] bg-amber-900/40 px-2 py-0.5 rounded border border-amber-500/30 text-amber-300">
        <ShieldCheck className="w-3 h-3" />
        <span>GIGW Compliant</span>
      </div>
    </div>
  );
};
