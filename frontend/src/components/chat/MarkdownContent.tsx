'use client';

import React from 'react';
import { InlineCitation } from './InlineCitation';

interface MarkdownContentProps {
  content: string;
}

// Regex matching statutory citations in bracketed or bolded forms
// Examples: [Patents Act, Sec 3(p)], [Section 3(p)], [Section 3(e)], [Section 3(d)], [Rule 158-B], [Rule 122-E], [1], [2]
const CITATION_REGEX = /(\[(?:Patents Act[^\]]*|Section 3\([pPedDa]\)|Section [367]|Rule 158-B|Rule 122-E|BDA[^\]]*|\d+)\]|\b(?:Section 3\([pPeEdD]\)|Rule 158-B|Rule 122-E)\b)/gi;

export const MarkdownContent: React.FC<MarkdownContentProps> = ({ content }) => {
  const paragraphs = content.split('\n\n');

  const parseLineWithCitations = (line: string) => {
    const parts = line.split(CITATION_REGEX);
    return parts.map((part, pIdx) => {
      if (!part) return null;

      // Check if this part matches a statutory citation pattern
      if (
        part.match(/Section 3\([pPeEdD]\)/i) || 
        part.match(/\[Patents Act/i) ||
        part.match(/Rule 158-B/i) ||
        part.match(/Rule 122-E/i) ||
        part.match(/\[Section/i) ||
        part.match(/^\[\d+\]$/)
      ) {
        return <InlineCitation key={pIdx} rawMatch={part} matchedText={part} />;
      }

      // Format simple bold text
      if (part.includes('**')) {
        const subParts = part.split(/(\*\*.*?\*\*)/g);
        return subParts.map((sub, sIdx) => {
          if (sub.startsWith('**') && sub.endsWith('**')) {
            return <strong key={sIdx} className="font-bold text-[#002147]">{sub.slice(2, -2)}</strong>;
          }
          return sub;
        });
      }

      return part;
    });
  };

  return (
    <div className="space-y-2.5 text-xs sm:text-sm text-slate-800 leading-relaxed">
      {paragraphs.map((para, idx) => {
        const trimmed = para.trim();

        // Headers
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="text-sm sm:text-base font-black text-[#002147] pt-1 pb-0.5 border-b border-slate-200">
              {trimmed.replace('### ', '')}
            </h4>
          );
        }

        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={idx} className="text-base sm:text-lg font-black text-[#002147] pt-1">
              {trimmed.replace('## ', '')}
            </h3>
          );
        }

        // Bullet points
        if (trimmed.includes('\n- ') || trimmed.includes('\n* ') || trimmed.includes('\n1. ') || trimmed.startsWith('- ') || trimmed.startsWith('1. ')) {
          const lines = trimmed.split('\n');
          return (
            <div key={idx} className="space-y-1.5 my-1.5 pl-2">
              {lines.map((line, lIdx) => (
                <div key={lIdx} className="flex items-start gap-1.5">
                  <span className="text-blue-700 font-bold select-none">&bull;</span>
                  <div className="flex-1">
                    {parseLineWithCitations(line.replace(/^[-*]\s+|\d+\.\s+/, ''))}
                  </div>
                </div>
              ))}
            </div>
          );
        }

        return (
          <p key={idx} className="leading-relaxed">
            {parseLineWithCitations(trimmed)}
          </p>
        );
      })}
    </div>
  );
};
