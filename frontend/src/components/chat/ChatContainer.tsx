'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  Scale, 
  ShieldAlert, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight,
  Volume2,
  VolumeX,
  Radio
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { ChatMessage, StatutoryCitation } from '@/lib/types';
import { askLegalQuestion } from '@/lib/apiClient';
import { JurisdictionToggle } from './JurisdictionToggle';
import { AudioRecorder } from '../voice/AudioRecorder';

export const ChatContainer: React.FC = () => {
  const { 
    jurisdiction, 
    setJurisdiction, 
    language, 
    setSelectedCitation, 
    setIsEscalationOpen,
    classificationState 
  } = useAppStore();
  
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `### Namaste & Welcome to IP-SAKTI Sahayak (SIH 045)\n\nI am your official AI statutory legal copilot grounded in **The Indian Patents Act (1970)**, **The Biological Diversity (Amendment) Act (2023)**, **CSIR Traditional Knowledge Digital Library (TKDL)**, and international botanical drug regulatory frameworks.\n\nHow may I evaluate your Ayurvedic innovation today?`,
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
          url: 'https://www.ipindia.gov.in',
        },
        {
          id: 'welcome-cit-2',
          act: 'Biological Diversity Act, 2002 (as amended 2023)',
          section: 'Section 6',
          description: 'Prior NBA Approval for IPR on Indian Biological Resources',
          jurisdiction: 'IN',
          url: 'http://nbaindia.org/',
        }
      ]
    },
  ]);

  // Clean up speech synthesis on component unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggleSpeech = (msgId: string, text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    // Toggle off if already speaking this message
    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    // Cancel any previous speech
    window.speechSynthesis.cancel();

    // Clean markdown characters and citations for smooth, natural audio readout
    const cleanText = text
      .replace(/#{1,6}\s+/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`{1,3}[\s\S]*?`{1,3}/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .replace(/§\s*/g, 'Section ')
      .replace(/[•\*\-]\s+/g, ', ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Map language code to browser Indic locale
    const localeMap: Record<string, string> = {
      hi: 'hi-IN',
      ml: 'ml-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      bn: 'bn-IN',
      en: 'en-IN',
    };

    utterance.lang = localeMap[language] || 'en-IN';
    utterance.rate = 0.95; // Official, clear pace

    // Look for matching voice
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find((v) => 
      v.lang.toLowerCase().startsWith(utterance.lang.toLowerCase()) || 
      v.lang.toLowerCase().replace('_', '-').startsWith(utterance.lang.toLowerCase())
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => {
      setSpeakingMessageId(null);
    };

    utterance.onerror = () => {
      setSpeakingMessageId(null);
    };

    window.speechSynthesis.speak(utterance);
    setSpeakingMessageId(msgId);
  };

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
      // Prepend active classification context if available to ground AI
      const contextualizedQuery = classificationState?.category
        ? `[Statutory Context: Product classified as "${classificationState.category}", Statute: "${classificationState.statute}"] ${query}`
        : query;

      const response = await askLegalQuestion(contextualizedQuery, jurisdiction);
      setMessages((prev) => [...prev, response]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQueries = classificationState?.category?.includes('Classical')
    ? [
        "Can I patent an altered delivery method for this classical formula?",
        "Does Section 3(p) permit extracting active fractions?",
        "What are my BDA 2023 ABS exemptions as an Indian Vaidya?",
        "How to cite CSIR-TKDL textual prior art?",
      ]
    : classificationState?.category?.includes('Phytopharmaceutical')
    ? [
        "What are CDSCO Rule 122-E Schedule Y-A clinical trial requirements?",
        "How do I secure NBA Section 6 prior approval before patent filing?",
        "How to overcome Section 3(d) enhanced efficacy requirements?",
        "US FDA Botanical Drug Guidance IND/NDA path details?",
      ]
    : [
        "Can I patent a ginger and honey cough syrup?",
        "What are my ABS requirements under BDA 2023 for Ashwagandha?",
        "Can I patent an Ayurveda-Aahar health biscuit under FSSAI 2022?",
        "How does US FDA regulate an Ayurvedic botanical drug under CDER?",
      ];

  return (
    <div className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm relative">
      {/* 1. Active Formulation Dossier / Triage Recommendation Banner */}
      {classificationState ? (
        <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-emerald-950">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
            <span className="font-bold">Active Case Dossier:</span>
            <span className="font-semibold bg-white border border-emerald-300 px-2 py-0.5 rounded text-emerald-900 shadow-xs">
              {classificationState.category}
            </span>
            <span className="text-emerald-800 hidden lg:inline text-[11px] font-medium">
              &bull; {classificationState.patentability?.slice(0, 60)}...
            </span>
          </div>
          <Link
            href="/wizard"
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline flex items-center gap-1"
          >
            <span>Change / Re-triage</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      ) : (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-800">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse flex-shrink-0" />
            <span className="font-bold text-[#002147]">Step 1 Recommended:</span>
            <span className="text-slate-600">
              Formulation is not yet triaged. Classify your formulation first to ensure the AI applies the accurate Section 3(p)/(e)/(d) and ABS rules.
            </span>
          </div>
          <Link
            href="/wizard"
            className="px-3 py-1 rounded bg-[#002147] hover:bg-[#001733] text-white font-bold text-[11px] shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <span>Launch Triage (Step 1)</span>
            <ArrowRight className="w-3 h-3 text-emerald-400" />
          </Link>
        </div>
      )}

      {/* 2. Top Toolbar */}
      <div className="p-3.5 sm:p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/80">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
          <span className="text-xs font-bold text-[#002147]">
            Live Statutory Intelligence Agent (CSIR-TKDL & BDA 2023)
          </span>
        </div>
        <JurisdictionToggle value={jurisdiction} onChange={setJurisdiction} />
      </div>

      {/* 3. Messages Stream */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar space-y-6 bg-white">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#002147] flex-shrink-0 mt-1 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-2xl rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-[#002147] text-white rounded-tr-none shadow-sm'
                : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none shadow-xs'
            }`}>
              <div className="max-w-none text-xs sm:text-sm">
                {msg.text.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-2 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Citations Badges */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-200">
                  <div className="flex items-center gap-1 text-[11px] text-slate-600 mb-2 font-bold">
                    <Scale className="w-3.5 h-3.5 text-[#002147]" />
                    <span>Statutory Legal Citations (Inspect Verbatim Clause):</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {msg.citations.map((cit, cIdx) => (
                      <button
                        key={cIdx}
                        onClick={() => setSelectedCitation(cit)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-slate-300 hover:border-blue-600 hover:text-blue-900 text-slate-800 text-xs font-mono transition-all shadow-2xs group"
                      >
                        <span className="font-bold text-[11px] text-[#002147]">§ {cit.section}</span>
                        <span className="text-[10px] text-slate-500 group-hover:text-blue-700">
                          ({cit.act})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Audio Listen & Facilitator Footer */}
              {msg.sender === 'assistant' && (
                <div className="mt-3.5 pt-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 border-t border-slate-200/80">
                  <div className="flex items-center gap-3">
                    {/* Audio Listen / Stop Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleSpeech(msg.id, msg.text)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all shadow-2xs ${
                        speakingMessageId === msg.id
                          ? 'bg-amber-100 border border-amber-400 text-amber-900'
                          : 'bg-white border border-slate-300 text-[#002147] hover:bg-blue-50 hover:border-blue-400'
                      }`}
                      title={speakingMessageId === msg.id ? 'Stop listening' : 'Listen to legal assessment in audio'}
                      aria-label={speakingMessageId === msg.id ? 'Stop audio playback' : 'Listen to response in audio'}
                    >
                      {speakingMessageId === msg.id ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-amber-800 animate-pulse" />
                          <span>Stop Audio / रोकें</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-[#002147]" />
                          <span>Listen / आवाज़ सुनें</span>
                        </>
                      )}
                    </button>

                    {msg.confidenceScore !== undefined && (
                      <div className="hidden sm:flex items-center gap-1 text-[11px]">
                        <span>Grounding:</span>
                        <span className="text-emerald-700 font-mono font-bold">
                          {(msg.confidenceScore * 100).toFixed(0)}%
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setIsEscalationOpen(true)}
                    className="text-amber-800 hover:text-amber-900 flex items-center gap-1 font-semibold hover:underline"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                    <span>Facilitator Escalation</span>
                  </button>
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 flex-shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </motion.div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3 text-slate-600 text-xs">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#002147]">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span>Synthesizing answer from Patents Act 1970, BDA 2023 & CSIR-TKDL...</span>
            </div>
          </div>
        )}
      </div>

      {/* 4. Suggested Prompts */}
      <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center gap-2 overflow-x-auto custom-scrollbar">
        <span className="text-[11px] text-slate-500 whitespace-nowrap font-bold flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-amber-600" />
          <span>Quick Inquiries:</span>
        </span>
        {sampleQueries.map((sample, sIdx) => (
          <button
            key={sIdx}
            onClick={() => handleSend(sample)}
            className="text-[11px] px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-[#002147] hover:border-blue-400 hover:bg-blue-50/40 whitespace-nowrap transition-all shadow-2xs font-medium"
          >
            {sample}
          </button>
        ))}
      </div>

      {/* 5. Input Bar with Bhashini AudioRecorder */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2">
        <AudioRecorder onTranscription={(transcription) => handleSend(transcription)} lang={language} />

        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Ask about patentability, Section 3 bars, TKDL, or ABS compliance in ${language.toUpperCase()} or English...`}
          className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#002147] focus:bg-white transition-colors"
        />

        <button
          type="button"
          onClick={() => handleSend()}
          disabled={!inputQuery.trim() || isLoading}
          className="p-2.5 rounded-xl bg-[#002147] hover:bg-[#001733] disabled:opacity-40 text-white font-semibold shadow-sm transition-all flex-shrink-0"
          aria-label="Send Query"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
