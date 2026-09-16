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
  Globe2,
  Printer
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { ChatMessage, StatutoryCitation } from '@/lib/types';
import { askLegalQuestion } from '@/lib/apiClient';
import { JurisdictionToggle } from './JurisdictionToggle';
import { AudioRecorder } from '../voice/AudioRecorder';
import { MarkdownContent } from './MarkdownContent';

const WELCOME_MESSAGES: Record<string, string> = {
  en: `### Namaste & Welcome to IP-SAKTI Sahayak (SIH 045)\n\nI am your official AI statutory legal copilot grounded in **The Indian Patents Act (1970)**, **The Biological Diversity (Amendment) Act (2023)**, **CSIR Traditional Knowledge Digital Library (TKDL)**, and international botanical drug regulatory frameworks.\n\nHow may I evaluate your Ayurvedic innovation today?`,
  bn: `### নমস্কার এবং আইপি-শক্তি সহায়ক (SIH 045)-এ আপনাকে স্বাগতম\n\nআমি **ভারতীয় পেটেন্ট আইন (১৯৭০)**, **জৈব বৈচিত্র্য (সংশোধন) আইন (২০২৩)**, এবং **সিএসআইআর ঐতিহ্যবাহী জ্ঞান ডিজিটাল লাইব্রেরি (TKDL)**-এর ওপর ভিত্তি করে তৈরি আপনার সরকারি এআই আইনি সহকারী।\n\nআজ আমি কীভাবে আপনার আয়ুর্বেদিক উদ্ভাবন বা ফর্মুলেশনের মূল্যায়ন করতে পারি?`,
  hi: `### नमस्ते और आईपी-शक्ति सहायक (SIH 045) में आपका स्वागत है\n\nमैं **भारतीय पेटेंट अधिनियम (1970)**, **जैविक विविधता (संशोधन) अधिनियम (2023)**, और **सीएसआईआर पारंपरिक ज्ञान डिजिटल लाइब्रेरी (TKDL)** पर आधारित आपका आधिकारिक एआई कानूनी सहायक हूँ।\n\nआज मैं आपके आयुर्वेदिक नवाचार या उत्पाद का मूल्यांकन कैसे कर सकता हूँ?`,
  ml: `### നമസ്കാരം, ഐപി-ശക്തി സഹായക്കിലേക്ക് (SIH 045) സ്വാഗതം\n\n**ഇന്ത്യൻ പേറ്റന്റ് നിയമം (1970)**, **ജൈവ വൈവിധ്യ (ഭേദഗതി) നിയമം (2023)**, **CSIR പരമ്പരാഗത വിജ്ഞാന ഡിജിറ്റൽ ലൈബ്രറി (TKDL)** എന്നിവ അടിസ്ഥാനമാക്കിയുള്ള നിങ്ങളുടെ ഔദ്യോഗിക AI നിയമ സഹായിയാണ് ഞാൻ.\n\nഇന്ന് നിങ്ങളുടെ ആയുർവേദ ഉൽപ്പന്നം എങ്ങനെ വിലയിരുത്താം?`,
  ta: `### வணக்கம், ஐபி-சக்தி சஹாயக்கிற்கு (SIH 045) நல்வரவு\n\nநான் **இந்திய காப்புரிமைச் சட்டம் (1970)**, **உயிரியல் பன்முகத்தன்மை சட்டம் (2023)**, மற்றும் **CSIR பாரம்பரிய அறிவு டிஜிட்டல் நூலகம் (TKDL)** அடிப்படையிலான உங்கள் சட்ட உதவியாளர்.\n\nஇன்று உங்கள் ஆயுர்வேத கண்டுபிடிப்பை எவ்வாறு மதிப்பீடு செய்யலாம்?`,
  te: `### నమస్కారం, ఐపీ-శక్తి సహాయక్‌కు (SIH 045) స్వాగతం\n\nనేను **భారత పేటెంట్ చట్టం (1970)**, **జీవ వైవిధ్య చట్టం (2023)**, మరియు **CSIR సాంప్రదాయ జ్ఞాన డిజిటల్ లైబ్రరీ (TKDL)** ఆధారిత మీ అధికారిక AI చట్టపరమైన సహచరుడిని.\n\nఈరోజు మీ ఆయుర్వేద ఉత్పత్తుల పేటెంట్ అర్హతను ఎలా అంచనా వేయగలను?`,
};

function translateToIndicSpeech(text: string, targetLang: string): string {
  if (targetLang === 'bn') {
    if (/[\u0980-\u09FF]/.test(text)) return text;

    let bn = text;
    bn = bn.replace(/Namaste & Welcome to IP-SAKTI Sahayak \(SIH 045\)/gi, 'নমস্কার, আইপি-শক্তি সহায়ক এসআইএইচ ০৪৫ এ আপনাকে স্বাগতম।');
    bn = bn.replace(/I am your official AI statutory legal copilot grounded in/gi, 'আমি আপনার সরকারি এআই আইনি সহকারী, যা ভিত্তি করে তৈরি');
    bn = bn.replace(/The Indian Patents Act \(1970\)/gi, 'ভারতীয় পেটেন্ট আইন ১৯৭০');
    bn = bn.replace(/The Biological Diversity \(Amendment\) Act \(2023\)/gi, 'জৈব বৈচিত্র্য আইন ২০২৩');
    bn = bn.replace(/CSIR Traditional Knowledge Digital Library \(TKDL\)/gi, 'সিএসআইআর ঐতিহ্যবাহী জ্ঞান ডিজিটাল লাইব্রেরি');
    bn = bn.replace(/and international botanical drug regulatory frameworks\./gi, 'এবং আন্তর্জাতিক ভেষজ ঔষধ নিয়ন্ত্রক কাঠামো।');
    bn = bn.replace(/How may I evaluate your Ayurvedic innovation today\?/gi, 'আজ আমি কীভাবে আপনার আয়ুর্বেদিক উদ্ভাবনের মূল্যায়ন করতে পারি?');
    bn = bn.replace(/Legal Assessment: Patentability of Ayurvedic Formulation/gi, 'আইনি মূল্যায়ন: আয়ুর্বেদিক ফর্মুলেশনের পেটেন্ট যোগ্যতা');
    bn = bn.replace(/Under Section 3\(p\) of the Indian Patents Act, 1970/gi, 'ভারতীয় পেটেন্ট আইন ১৯৭০ এর ধারা ৩(p) অনুযায়ী');
    bn = bn.replace(/statutorily barred from patent eligibility/gi, 'আইনগতভাবে পেটেন্ট পাওয়ার সম্পূর্ণ অযোগ্য');
    bn = bn.replace(/Traditional Knowledge Bar \(Sec 3\(p\)\)/gi, 'ঐতিহ্যবাহী জ্ঞান সংক্রান্ত বাধা');
    bn = bn.replace(/Mere Admixture Bar \(Sec 3\(e\)\)/gi, 'সাধারণ মিশ্রণ সংক্রান্ত বাধা');
    bn = bn.replace(/Recommendation:/gi, 'পরামর্শ:');
    bn = bn.replace(/Statutory Guidance for Ayurvedic Innovation/gi, 'আয়ুর্বেদিক উদ্ভাবনের বৈধানিক নির্দেশনা');
    return bn;
  }

  if (targetLang === 'hi') {
    if (/[\u0900-\u097F]/.test(text)) return text;

    let hi = text;
    hi = hi.replace(/Namaste & Welcome to IP-SAKTI Sahayak/gi, 'नमस्ते, आईपी-शक्ति सहायक में आपका स्वागत है।');
    hi = hi.replace(/I am your official AI statutory legal copilot/gi, 'मैं आपका आधिकारिक एआई कानूनी सहायक हूँ।');
    hi = hi.replace(/The Indian Patents Act \(1970\)/gi, 'भारतीय पेटेंट अधिनियम 1970');
    hi = hi.replace(/The Biological Diversity \(Amendment\) Act \(2023\)/gi, 'जैविक विविधता संशोधन अधिनियम 2023');
    hi = hi.replace(/Legal Assessment: Patentability of Ayurvedic Formulation/gi, 'कानूनी मूल्यांकन: आयुर्वेदिक फॉर्मूलेशन की पेटेंट योग्यता');
    return hi;
  }

  return text;
}

export const ChatContainer: React.FC = () => {
  const { 
    jurisdiction, 
    setJurisdiction, 
    language, 
    setSelectedCitation, 
    setIsEscalationOpen,
    classificationState,
    sessionId 
  } = useAppStore();
  
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const isIntl = jurisdiction === 'INTL';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: WELCOME_MESSAGES[language] || WELCOME_MESSAGES['en'],
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

  // Update welcome message dynamically whenever user changes language
  useEffect(() => {
    setMessages((prev) => 
      prev.map((msg) => 
        msg.id === 'welcome' 
          ? { ...msg, text: WELCOME_MESSAGES[language] || WELCOME_MESSAGES['en'] }
          : msg
      )
    );
  }, [language]);

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

    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();

    let cleanText = text
      .replace(/#{1,6}\s+/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`{1,3}[\s\S]*?`{1,3}/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .replace(/§\s*/g, 'Section ')
      .replace(/[•\*\-]\s+/g, ', ')
      .trim();

    cleanText = translateToIndicSpeech(cleanText, language);

    const utterance = new SpeechSynthesisUtterance(cleanText);

    const localeMap: Record<string, string> = {
      hi: 'hi-IN',
      ml: 'ml-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      bn: 'bn-IN',
      en: 'en-IN',
    };

    utterance.lang = localeMap[language] || 'en-IN';
    utterance.rate = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const targetLangCode = localeMap[language] || 'en-IN';
    const targetLangShort = language;

    const matchedVoice = voices.find((v) => {
      const vLang = v.lang.toLowerCase().replace('_', '-');
      const vName = v.name.toLowerCase();
      if (targetLangShort === 'bn') {
        return vLang.startsWith('bn') || vName.includes('bengali') || vName.includes('bangla');
      }
      if (targetLangShort === 'hi') {
        return vLang.startsWith('hi') || vName.includes('hindi');
      }
      return vLang.startsWith(targetLangCode.toLowerCase());
    });

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
      const contextualizedQuery = classificationState?.category
        ? `[Statutory Context: Product classified as "${classificationState.category}", Statute: "${classificationState.statute}"] ${query}`
        : query;

      const response = await askLegalQuestion(contextualizedQuery, jurisdiction, language, sessionId, classificationState);
      setMessages((prev) => [...prev, response]);
    } catch (err: any) {
      console.error('Backend connection error:', err);
      const errorMessage: ChatMessage = {
        id: 'err_' + Date.now(),
        sender: 'assistant',
        text: `⚠️ **Government Copilot Connection Notice**\n\nUnable to reach the legal AI backend at \`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}\`.\n\n**Possible Cause:** The FastAPI backend server is not running or port 8000 is unavailable.\n\n*Error details:* ${err?.message || 'Network request failed'}\n\n*To start the backend:* Run \`uvicorn app.main:app --reload --port 8000\` inside the \`backend/\` directory.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        jurisdiction,
        confidenceScore: 0,
        requiresEscalation: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQueries = language === 'bn'
    ? [
        "আদা এবং মধুর কাশির সিরাপ কি পেটেন্ট করা সম্ভব?",
        "অশ্বগন্ধার জন্য BDA 2023 অনুসারে ABS প্রদেয় কত?",
        "FSSAI 2022 এর অধীনে আয়ুর্বেদ-আহার কি পেটেন্টযোগ্য?",
        "চরক সংহিতার রেসিপিতে ধারা ৩(p) কীভাবে প্রযোজ্য?",
      ]
    : language === 'hi'
    ? [
        "क्या मैं अदरक और शहद की खांसी की दवा पेटेंट करवा सकता हूँ?",
        "अश्वगंधा के लिए BDA 2023 के तहत ABS नियम क्या हैं?",
        "क्या FSSAI 2022 के तहत आयुर्वेद-आहार को पेटेंट किया जा सकता है?",
        "शास्त्रीय नुस्खे पर धारा 3(p) कैसे लागू होती है?",
      ]
    : isIntl
    ? [
        "How does US FDA Botanical Drug Guidance regulate Ayurvedic IND/NDA?",
        "What are WIPO GRATK Treaty 2024 mandatory patent disclosure rules?",
        "How does EMA THMPD 30-year traditional use rule apply to Ayurvedic exports?",
        "Can an Indian classical formula qualify for PCT international patent filing?",
      ]
    : classificationState?.category?.includes('Classical')
    ? [
        "Can I patent an altered delivery method for this classical formula?",
        "Does Section 3(p) permit extracting active fractions?",
        "What are my BDA 2023 ABS exemptions as an Indian Vaidya?",
        "How to cite CSIR-TKDL textual prior art?",
      ]
    : [
        "Can I patent a ginger and honey cough syrup?",
        "What are my ABS requirements under BDA 2023 for Ashwagandha?",
        "Can I patent an Ayurveda-Aahar health biscuit under FSSAI 2022?",
        "How does US FDA regulate an Ayurvedic botanical drug under CDER?",
      ];

  const placeholderText = language === 'bn'
    ? "পেটেন্টযোগ্যতা, ধারা ৩, TKDL, বা ABS সম্মতি সম্পর্কে বাংলায় অথবা ইংরেজিতে প্রশ্ন করুন..."
    : language === 'hi'
    ? "पेटेंट योग्यता, धारा 3, TKDL या ABS नियमों के बारे में हिन्दी या अंग्रेजी में पूछें..."
    : isIntl
    ? "Ask about WIPO GRATK, PCT, US FDA Botanical Drug guidance, or EMA THMPD in English..."
    : `Ask about patentability, Section 3 bars, TKDL, or ABS compliance in ${language.toUpperCase()} or English...`;

  return (
    <div className={`flex-1 flex flex-col bg-white rounded-2xl border overflow-hidden shadow-sm relative transition-colors ${
      isIntl ? 'border-indigo-300 shadow-indigo-100/40' : 'border-slate-200'
    }`}>
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

      {/* 2. Top Toolbar with Jurisdiction Themeing */}
      <div className={`p-3.5 sm:p-4 border-b flex flex-wrap items-center justify-between gap-3 transition-colors ${
        isIntl ? 'bg-indigo-50/70 border-indigo-200' : 'bg-slate-50/80 border-slate-200'
      }`}>
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${
            isIntl ? 'bg-indigo-600' : 'bg-emerald-600'
          }`} />
          <span className={`text-xs font-bold ${
            isIntl ? 'text-indigo-950' : 'text-[#002147]'
          }`}>
            {isIntl 
              ? 'International IPR & Botanical Drug Frameworks (WIPO GRATK & US FDA CDER)' 
              : 'Live Statutory Intelligence Agent (CSIR-TKDL & BDA 2023)'}
          </span>
        </div>
        <div className="flex items-center gap-2 print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-blue-50 text-[#002147] text-xs font-bold border border-slate-300 hover:border-blue-400 shadow-2xs flex items-center gap-1.5 transition-colors"
            title="Download or Print Consultation Transcript as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-blue-700" />
            <span>Download PDF</span>
          </button>
          <JurisdictionToggle value={jurisdiction} onChange={setJurisdiction} />
        </div>
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
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 shadow-xs border ${
                isIntl ? 'bg-indigo-50 border-indigo-200 text-indigo-900' : 'bg-blue-50 border-blue-200 text-[#002147]'
              }`}>
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-2xl rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed ${
              msg.sender === 'user'
                ? isIntl 
                  ? 'bg-indigo-900 text-white rounded-tr-none shadow-sm' 
                  : 'bg-[#002147] text-white rounded-tr-none shadow-sm'
                : isIntl
                  ? 'bg-indigo-50/30 border border-indigo-100 text-slate-800 rounded-tl-none shadow-xs'
                  : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none shadow-xs'
            }`}>
              {/* Parse Markdown & Inline Citations */}
              {msg.sender === 'assistant' ? (
                <MarkdownContent content={msg.text} />
              ) : (
                <p className="whitespace-pre-wrap">{msg.text}</p>
              )}

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

              {/* Prominent Escalation Banner for Low Confidence / Ambiguity */}
              {msg.sender === 'assistant' && (msg.requiresEscalation || (msg.confidenceScore !== undefined && msg.confidenceScore < 0.7)) && (
                <div className="mt-3 p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-900 flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-0.5 max-w-md">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-amber-900">
                      <ShieldAlert className="w-4 h-4 text-amber-700" />
                      <span>Statutory Ambiguity Detected (Low Confidence)</span>
                    </div>
                    <p className="text-[11px] text-amber-800 leading-snug">
                      This question touches complex overlapping regimes. We recommend human review by an empanelled AYUSH IP Facilitator.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEscalationOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold whitespace-nowrap shadow-xs transition-colors"
                  >
                    Escalate to IP Attorney
                  </button>
                </div>
              )}

              {/* Audio Listen & Facilitator Footer */}
              {msg.sender === 'assistant' && (
                <div className="mt-3.5 pt-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 border-t border-slate-200/80 print:hidden">
                  <div className="flex items-center gap-3">
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
                          <span>{language === 'bn' ? 'অডিও থামান' : language === 'hi' ? 'ऑडियो रोकें' : 'Stop Audio'}</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-[#002147]" />
                          <span>{language === 'bn' ? 'বাংলায় শুনুন' : language === 'hi' ? 'आवाज़ सुनें' : 'Listen Audio'}</span>
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
              <span>
                {language === 'bn'
                  ? 'পেটেন্ট আইন ১৯৭০ এবং টিকেডিএল অনুসারে উত্তর প্রস্তুত করা হচ্ছে...'
                  : 'Synthesizing answer from Patents Act 1970, BDA 2023 & CSIR-TKDL...'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Active Triage Context Banner (Handoff from Wizard) */}
      {classificationState && (
        <div className="px-4 py-2 bg-emerald-50/90 border-t border-emerald-200 text-xs flex flex-wrap items-center justify-between gap-2 text-emerald-950 print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="font-bold">Active Formulation Context Attached:</span>
            <span className="font-semibold text-emerald-900 bg-white px-2 py-0.5 rounded border border-emerald-300">
              {classificationState.category}
            </span>
            <span className="hidden sm:inline text-emerald-700 text-[11px]">({classificationState.statute})</span>
          </div>
          <Link href="/wizard" className="text-[11px] font-bold text-emerald-800 hover:underline">
            Modify Triage
          </Link>
        </div>
      )}

      {/* 4. Suggested Prompts */}
      <div className={`px-4 py-2.5 border-t flex items-center gap-2 overflow-x-auto custom-scrollbar print:hidden ${
        isIntl ? 'bg-indigo-50/40 border-indigo-100' : 'bg-slate-50 border-slate-200'
      }`}>
        <span className="text-[11px] text-slate-500 whitespace-nowrap font-bold flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-amber-600" />
          <span>{language === 'bn' ? 'সাধারণ প্রশ্নসমূহ:' : language === 'hi' ? 'सामान्य प्रश्न:' : 'Quick Inquiries:'}</span>
        </span>
        {sampleQueries.map((sample, sIdx) => (
          <button
            key={sIdx}
            onClick={() => handleSend(sample)}
            className={`text-[11px] px-3 py-1 rounded-lg bg-white border text-slate-700 whitespace-nowrap transition-all shadow-2xs font-medium ${
              isIntl 
                ? 'border-indigo-200 hover:text-indigo-900 hover:border-indigo-400 hover:bg-indigo-50/40' 
                : 'border-slate-200 hover:text-[#002147] hover:border-blue-400 hover:bg-blue-50/40'
            }`}
          >
            {sample}
          </button>
        ))}
      </div>

      {/* 5. Input Bar with Bhashini AudioRecorder */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2 print:hidden">
        <AudioRecorder onTranscription={(transcription) => handleSend(transcription)} lang={language} />

        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={placeholderText}
          className={`flex-1 bg-slate-50 border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-colors ${
            isIntl ? 'border-indigo-200 focus:border-indigo-600' : 'border-slate-300 focus:border-[#002147]'
          }`}
        />

        <button
          type="button"
          onClick={() => handleSend()}
          disabled={!inputQuery.trim() || isLoading}
          className={`p-2.5 rounded-xl text-white font-semibold shadow-sm transition-all flex-shrink-0 disabled:opacity-40 ${
            isIntl ? 'bg-indigo-900 hover:bg-indigo-800' : 'bg-[#002147] hover:bg-[#001733]'
          }`}
          aria-label="Send Query"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
