export type Jurisdiction = 'IN' | 'INTL' | 'BOTH';

export interface StatutoryCitation {
  id?: string;
  act: string;
  section: string;
  description: string;
  snippet?: string;
  url?: string;
  jurisdiction: 'IN' | 'INTL';
  collectedAt?: string;
  source?: 'canonical' | 'chat_session' | 'user_saved';
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
  jurisdiction: "INDIA" | "INTERNATIONAL" | "IN" | "INTL";
  session_id: string;
  language?: string;
  context?: Partial<ClassificationResult> | null;
  session_metadata?: Record<string, any> | null;
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

// ---------------------------------------------------------------------------
// TKDL Prior-Art Analysis Types
// ---------------------------------------------------------------------------
export interface TKDLMatch {
  ingredient: string;
  botanical_name: string;
  sanskrit_name: string;
  classical_citations: string[];
  traditional_indications: string[];
  tkdl_codes: string[];
  active_markers: string[];
}

export interface IPStrategy {
  pathway: string;
  description: string;
  timeline: string;
}

export interface PriorArtAnalysisResult {
  formulation_name: string;
  patentability_risk_score: number;
  overall_status: string;
  statutory_summary: string;
  section_3p_posture: {
    risk_level: string;
    statute: string;
    finding: string;
  };
  section_3e_posture: {
    risk_level: string;
    statute: string;
    finding: string;
  };
  tkdl_matches_count: number;
  matched_prior_art: TKDLMatch[];
  recommended_strategies: IPStrategy[];
  bda_compliance_notice: string;
}

// ---------------------------------------------------------------------------
// BDA ABS Calculation Types
// ---------------------------------------------------------------------------
export interface ABSCalculationState {
  entityType: string;
  annualTurnover: number;
  rawMaterialPurchaseValue: number;
  isRegisteredPractitioner: boolean;
  calculatedFee: number;
  calculationMethod: string;
  statutoryRateDescription: string;
  status: string;
  exemptionNotes: string;
}

// ---------------------------------------------------------------------------
// Compliance Dossier Types
// ---------------------------------------------------------------------------
export interface StatutoryFormItem {
  form_code: string;
  authority: string;
  statutory_act: string;
  purpose: string;
  deadline: string;
  status: string;
}

export interface DossierResult {
  dossier_ref: string;
  created_at: string;
  applicant: {
    name: string;
    organization: string;
    jurisdiction: string;
  };
  formulation: {
    name: string;
    triage_category: string;
    regulatory_authority: string;
    patent_risk_score: string;
    prior_art_status: string;
  };
  bda_abs_compliance: {
    assessment: string;
    statutory_rate: string;
    exemptions_applicable: string;
  };
  statutory_forms: StatutoryFormItem[];
  digital_verification_hash: string;
  compliance_verdict: string;
  regulatory_disclaimer: string;
}
