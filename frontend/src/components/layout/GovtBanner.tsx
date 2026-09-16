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
              className={`px-2 py-0.5 rounded border text-[10px] font-bold flex items-center gap-1.5 transition-all ${
                isHighContrast
                  ? 'bg-slate-900 text-amber-300 border-amber-400 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
              aria-label="Toggle High Contrast Accessibility Mode"
            >
              <Eye className={`w-3 h-3 ${isHighContrast ? 'text-amber-400' : 'text-slate-600'}`} />
              <span>{isHighContrast ? 'Contrast: ON' : 'High Contrast'}</span>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 sm:py-5 flex flex-wrap items-center justify-between gap-6">
        {/* Ministry of AYUSH Emblem & Brand */}
        <div className="flex items-center gap-3.5 sm:gap-5">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex-shrink-0 bg-white rounded-xl border border-slate-200 p-1.5 flex items-center justify-center shadow-xs">
            <Image
              src="/images/ayush_logo.jpg"
              alt="Ministry of AYUSH Government of India Emblem"
              width={96}
              height={96}
              className="object-contain max-h-full"
              priority
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs sm:text-sm font-bold text-slate-800 tracking-wider uppercase">
                आयुष मंत्रालय
              </span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs sm:text-sm font-bold text-slate-800 tracking-wider uppercase">
                Ministry of AYUSH
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#002147] leading-tight">
              IP-SAKTI Sahayak
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xl mt-0.5">
              National AI Statutory Copilot for Ayurvedic Intellectual Property, TKDL Prior-Art & BDA 2023 &bull; SIH 045
            </p>
          </div>
        </div>

        {/* Dignitary Profile: Hon'ble Prime Minister of India */}
        <div className="flex items-center gap-3.5 sm:gap-4 bg-gradient-to-br from-white via-slate-50 to-blue-50/50 border border-slate-200/90 rounded-2xl p-2.5 sm:p-3.5 shadow-sm hover:shadow-md transition-shadow">
          {/* Large, stately framed portrait */}
          <div className="relative w-20 h-24 sm:w-28 sm:h-32 lg:w-32 lg:h-36 rounded-xl overflow-hidden border-2 border-slate-300 shadow-md ring-2 ring-[#FF9933]/50 flex-shrink-0 bg-white">
            <Image
              src="/images/pm_modi.jpg"
              alt="Shri Narendra Modi, Hon'ble Prime Minister of India"
              width={128}
              height={144}
              className="object-cover w-full h-full object-top hover:scale-105 transition-transform duration-300"
              priority
            />
          </div>
          
          <div className="text-left space-y-0.5">
            <p className="text-sm sm:text-base lg:text-lg font-black text-[#002147] leading-tight tracking-tight">
              श्री नरेन्द्र मोदी
            </p>
            <p className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
              Shri Narendra Modi
            </p>
            <p className="text-[11px] sm:text-xs text-slate-600 leading-tight font-semibold pt-0.5">
              Hon&apos;ble Prime Minister of India
            </p>
            
            <div className="pt-1.5 flex flex-col gap-1">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300/80 px-2 py-0.5 rounded-md w-fit shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                <span>Pradhan Mantri AYUSH Mission</span>
              </span>
              <span className="text-[9px] text-slate-500 font-medium">
                National Vision: Digital India &bull; Global AYUSH
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
