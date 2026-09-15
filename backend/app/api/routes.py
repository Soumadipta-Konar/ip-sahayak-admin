from fastapi import APIRouter
from pydantic import BaseModel
from app.core.security import DPDPComplianceEngine
from app.services.agent import process_query_via_langgraph
from app.services.classification_engine import FormulationEngine, ClassificationInput, ClassificationResult

router = APIRouter()


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
    # Security Check: Strip PII from the user query
    safe_query = DPDPComplianceEngine.strip_pii(request.query)
    
    # Route to Agent
    result = process_query_via_langgraph(safe_query, request.jurisdiction)
    
    return AskResponse(
        query_processed=safe_query,
        jurisdiction=request.jurisdiction,
        answer=result["answer"],
        citations=result["citations"]
    )

@router.post("/classify", response_model=ClassificationResult)
async def classify_formulation(request: ClassificationInput):
    return FormulationEngine.classify(request)
