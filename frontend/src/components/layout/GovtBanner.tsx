'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Eye } from 'lucide-react';

export const GovtBanner: React.FC = () => {
  const [activeSize, setActiveSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [isHighContrast, setIsHighContrast] = useState(false);

  const handleSetSize = (size: 'sm' | 'base' | 'lg') => {
    setActiveSize(size);
    if (typeof document !== 'undefined') {
      if (size === 'sm') document.documentElement.style.fontSize = '14px';
      if (size === 'base') document.documentElement.style.fontSize = '16px';
      if (size === 'lg') document.documentElement.style.fontSize = '18px';
    }
  };

  const handleToggleContrast = () => {
    setIsHighContrast((prev) => {
      const next = !prev;
      if (typeof document !== 'undefined') {
        if (next) {
          document.documentElement.classList.add('high-contrast');
        } else {
          document.documentElement.classList.remove('high-contrast');
        }
      }
      return next;
    });
  };

  return (
    <header className="w-full bg-white border-b border-slate-200 shadow-sm">
      {/* 1. Tricolor Top Accent Strip */}
      <div className="h-1.5 w-full flex">
        <div className="h-full flex-1 bg-[#FF9933]" title="Saffron" />
        <div className="h-full flex-1 bg-white" title="White" />
        <div className="h-full flex-1 bg-[#138808]" title="India Green" />
      </div>

      {/* 2. GIGW Accessibility & National Utility Strip */}
      <div className="bg-[#f1f5f9] border-b border-slate-200 text-[11px] text-slate-700 py-1 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="font-semibold text-slate-900">भारत सरकार</span>
            <span className="text-slate-400">|</span>
            <span>Government of India</span>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4 font-medium text-slate-600">
            <a 
              href="#main-content" 
              className="hover:text-blue-800 transition-colors focus:underline"
            >
              Skip to Main Content
            </a>
            <span className="text-slate-300">|</span>

            {/* High Contrast Mode Toggle */}
            <button
              type="button"
              onClick={handleToggleContrast}
              className={`px-1.5 py-0.5 rounded border text-[10px] font-bold flex items-center gap-1 transition-all ${
                isHighContrast
                  ? 'bg-yellow-400 text-black border-yellow-500'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
              aria-label="Toggle High Contrast Accessibility Mode"
            >
              <Eye className="w-3 h-3" />
              <span>{isHighContrast ? 'Standard' : 'High Contrast'}</span>
            </button>

            <span className="text-slate-300">|</span>

            {/* Functional Font Size Controls */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] uppercase text-slate-500">Text Size:</span>
              <button 
                type="button" 
                onClick={() => handleSetSize('sm')}
                className={`px-1.5 py-0.5 rounded border text-[10px] font-bold transition-all ${
                  activeSize === 'sm' 
                    ? 'bg-[#002147] text-white border-[#002147]' 
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
                aria-label="Decrease text size"
              >
                A-
              </button>
              <button 
                type="button" 
                onClick={() => handleSetSize('base')}
                className={`px-1.5 py-0.5 rounded border text-[10px] font-bold transition-all ${
                  activeSize === 'base' 
                    ? 'bg-[#002147] text-white border-[#002147]' 
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
                aria-label="Standard text size"
              >
                A
              </button>
              <button 
                type="button" 
                onClick={() => handleSetSize('lg')}
                className={`px-1.5 py-0.5 rounded border text-[10px] font-bold transition-all ${
                  activeSize === 'lg' 
                    ? 'bg-[#002147] text-white border-[#002147]' 
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
                aria-label="Increase text size"
              >
                A+
              </button>
            </div>
            <span className="text-slate-300">|</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              GIGW 3.0 Verified
            </span>
          </div>
        </div>
      </div>

      {/* 3. Official Government Masthead with Ministry of AYUSH & Hon'ble PM */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 sm:py-4 flex flex-wrap items-center justify-between gap-4">
        {/* Ministry of AYUSH Emblem & Brand */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 bg-white rounded border border-slate-200 p-1 flex items-center justify-center shadow-xs">
            <Image
              src="/images/ayush_logo.jpg"
              alt="Ministry of AYUSH Government of India Emblem"
              width={64}
              height={64}
              className="object-contain max-h-full"
              priority
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-slate-800 tracking-wide uppercase">
                आयुष मंत्रालय
              </span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs sm:text-sm font-bold text-slate-800 tracking-wide uppercase">
                Ministry of AYUSH
              </span>
            </div>
            <h1 className="text-base sm:text-xl lg:text-2xl font-black text-[#002147] leading-tight">
              IP-SAKTI Sahayak
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-600 font-medium">
              National AI Statutory Copilot for Ayurvedic Intellectual Property & TKDL &bull; SIH 045
            </p>
          </div>
        </div>

        {/* Dignitary Profile: Hon'ble Prime Minister */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-2 sm:px-3 sm:py-2 shadow-xs">
          <div className="relative w-12 h-14 sm:w-14 sm:h-16 rounded-lg overflow-hidden border border-slate-300 flex-shrink-0 shadow-xs bg-white">
            <Image
              src="/images/pm_modi.jpg"
              alt="Shri Narendra Modi, Hon'ble Prime Minister of India"
              width={56}
              height={64}
              className="object-cover w-full h-full object-top"
              priority
            />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-[#002147] leading-tight">
              श्री नरेन्द्र मोदी
            </p>
            <p className="text-[11px] font-semibold text-slate-800 leading-tight">
              Shri Narendra Modi
            </p>
            <p className="text-[10px] text-slate-600 leading-tight mt-0.5 font-medium">
              Hon&apos;ble Prime Minister of India
            </p>
            <span className="inline-block mt-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
              Digital India &bull; AYUSH Mission
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
