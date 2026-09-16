from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from app.core.security import DPDPComplianceEngine
from app.services.agent import process_query_via_langgraph
from app.services.prior_art_service import PriorArtAnalyzerService
from app.services.dossier_service import DossierService

router = APIRouter()

# ---------------------------------------------------------------------------
# 1. Ask / Legal Copilot Router
# ---------------------------------------------------------------------------
class AskRequest(BaseModel):
    query: str
    jurisdiction: str = "IN"

class AskResponse(BaseModel):
    query_processed: str
    jurisdiction: str
    answer: str
    citations: list

@router.post("/ask", response_model=AskResponse)
async def ask_ip_assistant(request: AskRequest):
    # Security Check: Strip PII from the user query (DPDP Act Compliance)
    safe_query = DPDPComplianceEngine.strip_pii(request.query)
    
    # Route to Agent
    result = process_query_via_langgraph(safe_query, request.jurisdiction)
    
    return AskResponse(
        query_processed=safe_query,
        jurisdiction=request.jurisdiction,
        answer=result["answer"],
        citations=result["citations"]
    )

# ---------------------------------------------------------------------------
# 2. TKDL & Section 3(p) Prior-Art Risk Analyzer
# ---------------------------------------------------------------------------
class PriorArtRequest(BaseModel):
    formulation_name: str
    ingredients: List[str]
    extraction_type: str = "Aqueous"
    therapeutic_claims: str = ""
    has_synergy_data: bool = False
    is_fractionated: bool = False

@router.post("/prior-art/analyze")
async def analyze_prior_art(request: PriorArtRequest):
    """
    Evaluates ingredients against TKDL and Sections 3(p), 3(d), 3(e) of the Indian Patents Act.
    """
    result = PriorArtAnalyzerService.analyze_formulation(
        formulation_name=request.formulation_name,
        ingredients=request.ingredients,
        extraction_type=request.extraction_type,
        therapeutic_claims=request.therapeutic_claims,
        has_synergy_data=request.has_synergy_data,
        is_fractionated=request.is_fractionated
    )
    return result

# ---------------------------------------------------------------------------
# 3. Statutory Compliance Dossier Generator & Export
# ---------------------------------------------------------------------------
class DossierRequest(BaseModel):
    applicant_name: str = "Ayurvedic Innovator"
    organization: str = "Ayurvedic Healthcare MSME"
    formulation_name: str = "Herbo-Mineral Composition"
    classification_data: Optional[Dict[str, Any]] = None
    abs_data: Optional[Dict[str, Any]] = None
    prior_art_data: Optional[Dict[str, Any]] = None

@router.post("/dossier/generate")
async def generate_statutory_dossier(request: DossierRequest):
    """
    Compiles full statutory filing dossier combining triage, ABS obligations,
    and prior-art clearance into official regulatory submission ready format.
    """
    dossier = DossierService.generate_dossier(
        applicant_name=request.applicant_name,
        organization=request.organization,
        formulation_name=request.formulation_name,
        classification_data=request.classification_data,
        abs_data=request.abs_data,
        prior_art_data=request.prior_art_data
    )
    return dossier
