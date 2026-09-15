from pydantic import BaseModel
from typing import Literal

class ClassificationInput(BaseModel):
    is_first_schedule: bool
    is_modified: bool
    intended_use: Literal["medicinal", "food"]
    is_purified: bool

class ClassificationResult(BaseModel):
    classification_title: str
    patent_risk: str
    abs_status: str

class FormulationEngine:
    """
    Deterministic rule-based engine to classify an Ayurvedic formulation
    into its correct legal category based on the Drugs & Cosmetics Act 
    and the Biological Diversity Act.
    """
    
    @staticmethod
    def classify(data: ClassificationInput) -> ClassificationResult:
        if data.is_first_schedule and not data.is_modified:
            return ClassificationResult(
                classification_title="Generic Classical Medicine",
                patent_risk="BARRED (Section 3p). Protected by TKDL.",
                abs_status="Exempt from prior SBB intimation."
            )
            
        if data.is_purified:
            return ClassificationResult(
                classification_title="Phytopharmaceutical Drug (Rule 122-E)",
                patent_risk="HIGHLY PATENTABLE. Complies with Sec 3(d).",
                abs_status="Mandatory NBA Approval required."
            )
            
        if data.intended_use == "food":
            return ClassificationResult(
                classification_title="Ayurveda-Aahar (Nutraceutical)",
                patent_risk="Recipe Not Patentable. Use Trademarks.",
                abs_status="Standard SBB reporting."
            )
            
        # Default fallback for anything else
        return ClassificationResult(
            classification_title="Patent-or-Proprietary (P&P) Medicine",
            patent_risk="High Sec 3(e) risk unless clinical synergy proven.",
            abs_status="SBB Intimation Mandatory."
        )
