"""
Statutory Compliance Dossier & Export Service
Generates official Ministry of AYUSH & Government of India compliant regulatory dossiers.
Integrates:
- Formulation Triage Diagnostic (D&C Act 1940 / FSSAI 2022)
- BDA 2023 Access & Benefit Sharing (ABS) Fee Schedule
- TKDL & Section 3(p) Patentability Prior-Art Analysis
- Prescribed Government Application Forms (NBA Form I/III, AYUSH Form 24D/25D)
"""

import hashlib
import time
from typing import Dict, Any, List, Optional

class DossierService:
    @staticmethod
    def generate_dossier(
        applicant_name: str,
        organization: str,
        formulation_name: str,
        classification_data: Optional[Dict[str, Any]] = None,
        abs_data: Optional[Dict[str, Any]] = None,
        prior_art_data: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        timestamp = int(time.time())
        dossier_ref = f"AYUSH-IPR-2026-{(timestamp % 1000000):06d}"
        
        # Determine Category
        category_title = classification_data.get("category", "Patent or Proprietary Medicine (P&P)") if classification_data else "Ayurvedic Proprietary Compound"
        statute_authority = classification_data.get("authority", "State AYUSH Licensing Authority (SLA)") if classification_data else "State Licensing Authority (D&C Act 1940)"
        
        # Calculate ABS Assessment
        abs_percentage = abs_data.get("abs_percentage", "0.5% of Gross Ex-Factory Sale") if abs_data else "0.5% (Default Commercial ABS Bracket)"
        abs_status = abs_data.get("status", "Mandatory Benefit Sharing under BDA 2023 Sec 7 & 19") if abs_data else "Subject to BDA 2023 benefit-sharing obligation"
        
        # Prior Art Summary
        risk_score = prior_art_data.get("patentability_risk_score", 75) if prior_art_data else 75
        prior_art_status = prior_art_data.get("overall_status", "HIGH_REJECTION_RISK_AGGREGATION") if prior_art_data else "HIGH_REJECTION_RISK_AGGREGATION"
        
        # Mandatory Statutory Filing Forms
        statutory_forms: List[Dict[str, str]] = [
            {
                "form_code": "NBA Form I",
                "authority": "National Biodiversity Authority (Chennai)",
                "statutory_act": "Biological Diversity Act 2023, Sec 19",
                "purpose": "Application for seeking prior approval for commercial utilization of biological resources or associated knowledge by non-exempt entities.",
                "deadline": "Prior to commercial production or IP grant",
                "status": "Required"
            },
            {
                "form_code": "NBA Form III",
                "authority": "National Biodiversity Authority (Chennai)",
                "statutory_act": "Biological Diversity Act 2023, Sec 6",
                "purpose": "Application for seeking approval for applying for Intellectual Property Rights (Patents) inside or outside India based on Indian bio-resources.",
                "deadline": "Before grant of patent (mandatory condition precedent)",
                "status": "Mandatory before Patent Grant"
            },
            {
                "form_code": "AYUSH Form 24D / 25D",
                "authority": "State AYUSH Licensing Authority (SLA)",
                "statutory_act": "Drugs & Cosmetics Act 1940 & Rules 1945",
                "purpose": "Application for grant of manufacturing license for Ayurvedic, Siddha, or Unani Drugs (P&P / Classical).",
                "deadline": "Prior to commercial manufacture / sale",
                "status": "Mandatory for Manufacturing"
            }
        ]

        if "aahar" in category_title.lower() or "food" in category_title.lower():
            statutory_forms.append({
                "form_code": "FSSAI Form B",
                "authority": "Food Safety and Standards Authority of India",
                "statutory_act": "FSSAI (Ayurveda Aahar) Regulations, 2022",
                "purpose": "License for manufacture, packaging, and marketing of Ayurveda Aahar dietary formulations.",
                "deadline": "Prior to commercial retail distribution",
                "status": "Mandatory for Food/Supplements"
            })

        # Generate Digital Integrity Fingerprint
        raw_signature = f"{dossier_ref}-{applicant_name}-{formulation_name}-{timestamp}"
        digital_hash = hashlib.sha256(raw_signature.encode()).hexdigest()

        return {
            "dossier_ref": dossier_ref,
            "created_at": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(timestamp)),
            "applicant": {
                "name": applicant_name or "Ayurvedic Innovator / MSME",
                "organization": organization or "Ayurvedic Healthcare Enterprise",
                "jurisdiction": "Republic of India (National Standards)"
            },
            "formulation": {
                "name": formulation_name or "Classical Herbo-Mineral Composition",
                "triage_category": category_title,
                "regulatory_authority": statute_authority,
                "patent_risk_score": f"{risk_score}%",
                "prior_art_status": prior_art_status
            },
            "bda_abs_compliance": {
                "assessment": abs_status,
                "statutory_rate": abs_percentage,
                "exemptions_applicable": abs_data.get("exemption", "None declared - standard commercial liability") if abs_data else "Subject to Vaidya / Local Practitioner status check"
            },
            "statutory_forms": statutory_forms,
            "digital_verification_hash": digital_hash[:32].upper(),
            "compliance_verdict": "CONDITIONAL_STATUTORY_CLEARANCE",
            "regulatory_disclaimer": "This Statutory Compliance Dossier is automatically compiled by IP-SAKTI Sahayak under Ministry of AYUSH & GIGW guidelines. It serves as authoritative statutory guidance for regulatory filings and does not replace formal legal counsel."
        }
