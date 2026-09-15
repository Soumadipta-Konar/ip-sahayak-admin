export type Jurisdiction = 'IN' | 'INTL' | 'BOTH';

export interface StatutoryCitation {
  id?: string;
  act: string;
  section: string;
  description: string;
  snippet?: string;
  url?: string;
  jurisdiction: 'IN' | 'INTL';
}

export interface ClassificationResult {
  category: string;
  title: string;
  statute: string;
  authority: string;
  patentability: string;
  section_3_risk: 'HIGH_BAR_SEC_3P' | 'CONDITIONAL_SEC_3E' | 'PATENTABLE_SEC_3D' | 'NOT_APPLICABLE';
  patentRiskDescription: string;
  tkdl_status: string;
  abs_posture: string;
  clinical_requirements: string;
  claims_rule: string;
  citations: StatutoryCitation[];
  export_clearance: Record<string, string>;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  jurisdiction: Jurisdiction;
  citations?: StatutoryCitation[];
  confidenceScore?: number;
  suggestClassification?: boolean;
  requiresEscalation?: boolean;
}

export interface AskRequest {
  query: string;
  jurisdiction: "INDIA" | "INTERNATIONAL";
  session_id: string;
}

export interface AskResponse {
  answer: string;
  confidence_score: number;
  requires_escalation: boolean;
  citations: Array<{
    id: string;
    statute_name: string;
    section: string;
    snippet: string;
    url: string;
  }>;
}
