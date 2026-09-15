'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Scale, ShieldAlert, Sparkles, AlertTriangle, ExternalLink, HelpCircle } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { ChatMessage, StatutoryCitation } from '@/lib/types';
import { askLegalQuestion } from '@/lib/apiClient';
import { JurisdictionToggle } from './JurisdictionToggle';
import { AudioRecorder } from '../voice/AudioRecorder';

export const ChatContainer: React.FC = () => {
  const { jurisdiction, setJurisdiction, language, setSelectedCitation, setIsEscalationOpen } = useAppStore();
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `### Namaste & Welcome to IP-SAKTI Sahayak (SIH 045)\n\nI am your AI legal copilot grounded in **The Indian Patents Act (1970)**, **The Biological Diversity (Amendment) Act (2023)**, **CSIR Traditional Knowledge Digital Library (TKDL)**, and international botanical drug frameworks.\n\nHow may I evaluate your Ayurvedic formulation today?`,
      timestamp: '10:00 AM',
      jurisdiction: 'IN',
      confidenceScore: 0.98,
      citations: [
        {
          id: 'welcome-cit-1',
          act: 'The Patents Act, 1970',
          section: 'Section 3(p)',
          description: 'Traditional Knowledge Non-Patentability Bar',
          jurisdiction: 'IN',
        },
        {
          id: 'welcome-cit-2',
          act: 'Biological Diversity Act, 2002 (as amended 2023)',
          section: 'Section 6',
          description: 'Prior NBA Approval for IPR on Indian Biological Resources',
          jurisdiction: 'IN',
        }
      ]
    },
  ]);

  const handleSend = async (queryText?: string) => {
    const query = queryText || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      jurisdiction,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await askLegalQuestion(query, jurisdiction);
      setMessages((prev) => [...prev, response]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQueries = [
    "Can I patent a ginger and honey cough syrup?",
    "What are my ABS requirements under BDA 2023 for Ashwagandha?",
    "Can I patent an Ayurveda-Aahar health biscuit under FSSAI 2022?",
    "How does US FDA regulate an Ayurvedic botanical drug under CDER?",
  ];

  return (
    <div className="flex-1 flex flex-col glass-panel rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl relative">
      {/* Top Toolbar */}
      <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/60">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-slate-300">Live Statutory Legal Agent</span>
        </div>
        <JurisdictionToggle value={jurisdiction} onChange={setJurisdiction} />
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar space-y-6">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-2xl rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-emerald-700 text-white rounded-tr-none shadow-lg shadow-emerald-950'
                : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none shadow-lg'
            }`}>
              <div className="prose prose-invert max-w-none text-xs sm:text-sm">
                {msg.text.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-2 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Citations Badges */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-2 font-medium">
                    <Scale className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Statutory Legal Citations (Click to Inspect Verbatim Act):</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {msg.citations.map((cit, cIdx) => (
                      <button
                        key={cIdx}
                        onClick={() => setSelectedCitation(cit)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-950/80 hover:border-emerald-500 text-emerald-300 text-xs font-mono transition-all group"
                      >
                        <span className="font-semibold text-[11px]">§ {cit.section}</span>
                        <span className="text-[10px] text-slate-400 group-hover:text-slate-200">
                          ({cit.act})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Confidence Score & Escalation Footer */}
              {msg.sender === 'assistant' && msg.confidenceScore !== undefined && (
                <div className="mt-3 pt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1">
                    <span>Confidence:</span>
                    <span className="text-emerald-400 font-mono font-semibold">
                      {(msg.confidenceScore * 100).toFixed(0)}%
                    </span>
                  </div>

                  <button
                    onClick={() => setIsEscalationOpen(true)}
                    className="text-amber-400 hover:text-amber-300 flex items-center gap-1 hover:underline"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Escalate to IP Attorney</span>
                  </button>
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 flex-shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </motion.div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3 text-slate-400 text-xs">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="flex items-center gap-2 p-3 bg-slate-900 rounded-xl border border-slate-800">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Analyzing against Patents Act 1970 & CSIR-TKDL corpus...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Prompts */}
      <div className="px-4 py-2 bg-slate-950/40 border-t border-slate-800/60 flex items-center gap-2 overflow-x-auto custom-scrollbar">
        <span className="text-[11px] text-slate-400 whitespace-nowrap font-medium flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-amber-400" />
          <span>Quick Prompts:</span>
        </span>
        {sampleQueries.map((sample, sIdx) => (
          <button
            key={sIdx}
            onClick={() => handleSend(sample)}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-emerald-500/40 whitespace-nowrap transition-all"
          >
            {sample}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-3 sm:p-4 bg-slate-950/80 border-t border-slate-800 flex items-center gap-2">
        <AudioRecorder onTranscription={(transcription) => handleSend(transcription)} lang={language} />

        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Ask about patentability, Section 3 bars, TKDL, or ABS compliance in ${language.toUpperCase()} / English...`}
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/60"
        />

        <button
          onClick={() => handleSend()}
          disabled={!inputQuery.trim() || isLoading}
          className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-semibold shadow-lg shadow-emerald-950 transition-all flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
