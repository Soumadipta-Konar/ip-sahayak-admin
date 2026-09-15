import { create } from 'zustand';
import { Jurisdiction, StatutoryCitation, ClassificationResult } from './types';

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
  sessionId: string;
  resetSessionId: () => void;
}

export const useAppStore = create<AppState>((set) => ({
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
  sessionId: 'session_' + Math.random().toString(36).substring(7),
  resetSessionId: () => set({ sessionId: 'session_' + Math.random().toString(36).substring(7) }),
}));
