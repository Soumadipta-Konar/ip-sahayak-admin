import { create } from 'zustand';
import { 
  Jurisdiction, 
  StatutoryCitation, 
  ClassificationResult,
  PriorArtAnalysisResult,
  ABSCalculationState,
  DossierResult,
  ChatMessage
} from './types';

const CHAT_STORAGE_KEY = 'ip_sakti_chat_history_v1';
const CITATIONS_STORAGE_KEY = 'ip_sakti_saved_citations_v1';

const normalizeCitationKey = (act: string, section: string) => 
  `${act.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}::${section.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`;

function safeSaveLocalStorage(key: string, data: any) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to write ${key} to localStorage:`, e);
  }
}

interface AppState {
  jurisdiction: Jurisdiction;
  setJurisdiction: (j: Jurisdiction) => void;
  language: string;
  setLanguage: (lang: string) => void;
  selectedCitation: StatutoryCitation | null;
  setSelectedCitation: (citation: StatutoryCitation | null) => void;
  isCitationDrawerOpen: boolean;
  setIsCitationDrawerOpen: (open: boolean) => void;
  isEscalationOpen: boolean;
  setIsEscalationOpen: (open: boolean) => void;
  classificationState: Partial<ClassificationResult> | null;
  setClassificationState: (state: Partial<ClassificationResult> | null) => void;
  priorArtAnalysis: PriorArtAnalysisResult | null;
  setPriorArtAnalysis: (analysis: PriorArtAnalysisResult | null) => void;
  absCalculation: ABSCalculationState | null;
  setAbsCalculation: (calc: ABSCalculationState | null) => void;
  dossierData: DossierResult | null;
  setDossierData: (data: DossierResult | null) => void;
  sessionId: string;
  resetSessionId: () => void;

  // Option A: Persistent Chat Messages
  chatMessages: ChatMessage[];
  setChatMessages: (action: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void;
  clearChatMessages: () => void;

  // Option B: Active Saved & Collected Citations
  savedCitations: StatutoryCitation[];
  addSavedCitations: (citations: StatutoryCitation[], source?: 'chat_session' | 'user_saved' | 'canonical') => void;
  removeSavedCitation: (citationIdOrKey: string) => void;
  clearSavedCitations: () => void;
  isCitationSaved: (act: string, section: string) => boolean;

  // Hydration state
  isHydrated: boolean;
  hydrateFromStorage: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  jurisdiction: 'IN',
  setJurisdiction: (jurisdiction) => set({ jurisdiction }),
  language: 'hi',
  setLanguage: (language) => set({ language }),
  selectedCitation: null,
  setSelectedCitation: (selectedCitation) => set({ selectedCitation, isCitationDrawerOpen: !!selectedCitation }),
  isCitationDrawerOpen: false,
  setIsCitationDrawerOpen: (isCitationDrawerOpen) => set({ isCitationDrawerOpen }),
  isEscalationOpen: false,
  setIsEscalationOpen: (isEscalationOpen) => set({ isEscalationOpen }),
  classificationState: null,
  setClassificationState: (classificationState) => set({ classificationState }),
  priorArtAnalysis: null,
  setPriorArtAnalysis: (priorArtAnalysis) => set({ priorArtAnalysis }),
  absCalculation: null,
  setAbsCalculation: (absCalculation) => set({ absCalculation }),
  dossierData: null,
  setDossierData: (dossierData) => set({ dossierData }),
  sessionId: 'session_' + Math.random().toString(36).substring(7),
  resetSessionId: () => set({ sessionId: 'session_' + Math.random().toString(36).substring(7) }),

  // Option A: Chat Messages implementation
  chatMessages: [],
  setChatMessages: (action) => {
    set((state) => {
      const next = typeof action === 'function' ? action(state.chatMessages) : action;
      safeSaveLocalStorage(CHAT_STORAGE_KEY, next);
      return { chatMessages: next };
    });
  },
  clearChatMessages: () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(CHAT_STORAGE_KEY);
      } catch {}
    }
    set({ 
      chatMessages: [], 
      sessionId: 'session_' + Math.random().toString(36).substring(7) 
    });
  },

  // Option B: Saved Citations implementation
  savedCitations: [],
  addSavedCitations: (newCitations, source = 'chat_session') => {
    set((state) => {
      if (!newCitations || newCitations.length === 0) return state;

      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const currentList = [...state.savedCitations];
      let hasChanges = false;

      newCitations.forEach((cit) => {
        if (!cit.act || !cit.section) return;
        const normKey = normalizeCitationKey(cit.act, cit.section);
        const exists = currentList.some((existing) => {
          if (cit.id && existing.id && cit.id === existing.id) return true;
          return normalizeCitationKey(existing.act, existing.section) === normKey;
        });

        if (!exists) {
          currentList.push({
            ...cit,
            id: cit.id || `cit_${Date.now()}_${Math.random().toString(36).substring(7)}`,
            collectedAt: cit.collectedAt || nowTime,
            source: cit.source || source,
          });
          hasChanges = true;
        }
      });

      if (hasChanges) {
        safeSaveLocalStorage(CITATIONS_STORAGE_KEY, currentList);
        return { savedCitations: currentList };
      }
      return state;
    });
  },
  removeSavedCitation: (citationIdOrKey: string) => {
    set((state) => {
      const updated = state.savedCitations.filter((c) => {
        if (c.id === citationIdOrKey) return false;
        const norm = normalizeCitationKey(c.act, c.section);
        return norm !== citationIdOrKey;
      });
      safeSaveLocalStorage(CITATIONS_STORAGE_KEY, updated);
      return { savedCitations: updated };
    });
  },
  clearSavedCitations: () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(CITATIONS_STORAGE_KEY);
      } catch {}
    }
    set({ savedCitations: [] });
  },
  isCitationSaved: (act: string, section: string) => {
    const state = get();
    const key = normalizeCitationKey(act, section);
    return state.savedCitations.some((c) => normalizeCitationKey(c.act, c.section) === key);
  },

  // Hydration from LocalStorage
  isHydrated: false,
  hydrateFromStorage: () => {
    if (typeof window === 'undefined') return;
    try {
      const storedChat = localStorage.getItem(CHAT_STORAGE_KEY);
      const storedCitations = localStorage.getItem(CITATIONS_STORAGE_KEY);
      
      let parsedChat: ChatMessage[] = [];
      let parsedCitations: StatutoryCitation[] = [];

      if (storedChat) {
        try {
          parsedChat = JSON.parse(storedChat);
        } catch (e) {
          console.error('Failed to parse stored chat:', e);
        }
      }

      if (storedCitations) {
        try {
          parsedCitations = JSON.parse(storedCitations);
        } catch (e) {
          console.error('Failed to parse stored citations:', e);
        }
      }

      set({
        chatMessages: parsedChat,
        savedCitations: parsedCitations,
        isHydrated: true,
      });
    } catch (e) {
      set({ isHydrated: true });
    }
  },
}));
