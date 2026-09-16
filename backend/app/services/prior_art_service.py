"""
TKDL & Prior-Art Statutory Analysis Engine
Evaluates Ayurvedic ingredients, formulations, and extraction methods against:
- Indian Patents Act 1970: Section 3(p), Section 3(d), Section 3(e)
- CSIR Traditional Knowledge Digital Library (TKDL) Prior-Art Database
- First Schedule Classical Ayurvedic Texts (Charaka Samhita, Sushruta Samhita, Astanga Hridaya, Bhavaprakasha)
"""

from typing import List, Dict, Any
import re

# Comprehensive TKDL Classical Knowledge Graph & Prior Art Mapping
TKDL_KNOWLEDGE_BASE: Dict[str, Dict[str, Any]] = {
    "turmeric": {
        "botanical_name": "Curcuma longa L.",
        "sanskrit_name": "Haridra (हरिद्रा)",
        "classical_texts": ["Charaka Samhita, Sutrasthana 4/16", "Sushruta Samhita, Sutrasthana 38/27", "Ashtanga Hridaya, Uttaratantra 36/12"],
        "traditional_uses": ["Vranaropana (Wound healing)", "Kusthaghna (Dermatological care)", "Pramehaghna (Anti-diabetic adjuvant)"],
        "tkdl_accession_codes": ["TKDL-IN-CSIR-HL-0482", "TKDL-IN-API-VOL1-P45"],
        "active_markers": ["Curcumin", "Demethoxycurcumin", "Bisdemethoxycurcumin", "Turmerones"]
    },
    "ginger": {
        "botanical_name": "Zingiber officinale Roscoe",
        "sanskrit_name": "Sunthi / Ardraka (शुण्ठी / आर्द्रक)",
        "classical_texts": ["Charaka Samhita, Chikitsasthana 15/98", "Bhavaprakasha Nighantu, Haritakyadi Varga"],
        "traditional_uses": ["Dipana-Pachana (Digestive carminative)", "Sothahara (Anti-inflammatory)", "Kaphahara"],
        "tkdl_accession_codes": ["TKDL-IN-CSIR-ZO-0119", "TKDL-IN-API-VOL1-P103"],
        "active_markers": ["Gingerols", "Shogaols", "Zingiberene"]
    },
    "ashwagandha": {
        "botanical_name": "Withania somnifera (L.) Dunal",
        "sanskrit_name": "Ashwagandha (अश्वगन्धा)",
        "classical_texts": ["Charaka Samhita, Chikitsasthana 1/1", "Astanga Hridaya, Uttaratantra 39/157"],
        "traditional_uses": ["Rasayana (Adaptogenic rejuvenator)", "Balya (Strength promoter)", "Nidrajanana (Neuro-sedative)"],
        "tkdl_accession_codes": ["TKDL-IN-CSIR-WS-0931", "TKDL-IN-API-VOL1-P15"],
        "active_markers": ["Withaferin A", "Withanolide A", "Withanoside IV"]
    },
    "tulsi": {
        "botanical_name": "Ocimum sanctum L. / Ocimum tenuiflorum",
        "sanskrit_name": "Tulasi (तुलसी)",
        "classical_texts": ["Charaka Samhita, Sutrasthana 27/169", "Bhavaprakasha Nighantu, Pushpa Varga"],
        "traditional_uses": ["Kasahara (Antitussive / Respiratory)", "Vishaghna (Detoxification)", "Krimighna (Antimicrobial)"],
        "tkdl_accession_codes": ["TKDL-IN-CSIR-OS-0245", "TKDL-IN-API-VOL2-P110"],
        "active_markers": ["Eugenol", "Ursolic acid", "Rosmarinic acid"]
    },
    "black pepper": {
        "botanical_name": "Piper nigrum L.",
        "sanskrit_name": "Maricha (मरिच)",
        "classical_texts": ["Charaka Samhita, Sutrasthana 27/297", "Sushruta Samhita, Sutrasthana 46/221"],
        "traditional_uses": ["Yogavahi (Bioavailability enhancer)", "Srotoshodhana (Channel clearance)", "Kaphaghna"],
        "tkdl_accession_codes": ["TKDL-IN-CSIR-PN-0054", "TKDL-IN-API-VOL3-P67"],
        "active_markers": ["Piperine", "Chavicine", "Piperidine"]
    },
    "neem": {
        "botanical_name": "Azadirachta indica A. Juss.",
        "sanskrit_name": "Nimba (निम्ब)",
        "classical_texts": ["Charaka Samhita, Sutrasthana 4/14", "Sushruta Samhita, Sutrasthana 38/5"],
        "traditional_uses": ["Kusthaghna (Skin diseases)", "Kandughna (Anti-pruritic)", "Krimighna (Antiparasitic / Antifungal)"],
        "tkdl_accession_codes": ["TKDL-IN-CSIR-AI-0001 (Historic EPO Revocation Patent EP436257)"],
        "active_markers": ["Azadirachtin", "Nimbin", "Nimbidol"]
    },
    "triphala": {
        "botanical_name": "Phyllanthus emblica + Terminalia chebula + Terminalia bellirica",
        "sanskrit_name": "Triphala (त्रिफला)",
        "classical_texts": ["Charaka Samhita, Chikitsasthana 1/3", "Sushruta Samhita, Chikitsasthana 27/11"],
        "traditional_uses": ["Chakshushya (Ocular health)", "Rasayana", "Anulomana (Mild laxative)"],
        "tkdl_accession_codes": ["TKDL-IN-CSIR-TRIPH-0012", "TKDL-IN-API-VOL1-P12"],
        "active_markers": ["Gallic acid", "Ellagic acid", "Chebulagic acid"]
    },
    "amla": {
        "botanical_name": "Phyllanthus emblica L. (Emblica officinalis)",
        "sanskrit_name": "Amalaki (आमलकी)",
        "classical_texts": ["Charaka Samhita, Chikitsasthana 1/1/4", "Astanga Hridaya, Uttaratantra 39/38"],
        "traditional_uses": ["Vayasthapana (Anti-aging antioxidant)", "Rasayana", "Chakshushya"],
        "tkdl_accession_codes": ["TKDL-IN-CSIR-PE-0188", "TKDL-IN-API-VOL1-P05"],
        "active_markers": ["Ascorbic acid", "Emblicanin A & B", "Pedunculagin"]
    },
    "guduchi": {
        "botanical_name": "Tinospora cordifolia (Willd.) Miers",
        "sanskrit_name": "Guduchi / Giloy (गुडूची)",
        "classical_texts": ["Charaka Samhita, Sutrasthana 25/40", "Bhavaprakasha Nighantu, Guduchyadi Varga"],
        "traditional_uses": ["Rasayana", "Jwaraghna (Antipyretic/Immunomodulator)", "Deepana"],
        "tkdl_accession_codes": ["TKDL-IN-CSIR-TC-0412", "TKDL-IN-API-VOL1-P33"],
        "active_markers": ["Tinosporide", "Cordifolioside A", "Berberine"]
    }
}

class PriorArtAnalyzerService:
    @staticmethod
    def analyze_formulation(
        formulation_name: str,
        ingredients: List[str],
        extraction_type: str,
        therapeutic_claims: str,
        has_synergy_data: bool = False,
        is_fractionated: bool = False
    ) -> Dict[str, Any]:
        """
        Runs comprehensive patentability screening against Patents Act 1970 Sec 3(p), 3(d), 3(e).
        """
        matched_prior_art = []
        found_botanicals = []
        
        # 1. Match ingredients against classical TKDL corpus
        for ing in ingredients:
            ing_clean = ing.strip().lower()
            matched = False
            for key, data in TKDL_KNOWLEDGE_BASE.items():
                if (key in ing_clean or 
                    data["botanical_name"].lower() in ing_clean or 
                    ing_clean in key or 
                    ing_clean in data["sanskrit_name"].lower()):
                    matched_prior_art.append({
                        "ingredient": ing,
                        "botanical_name": data["botanical_name"],
                        "sanskrit_name": data["sanskrit_name"],
                        "classical_citations": data["classical_texts"],
                        "traditional_indications": data["traditional_uses"],
                        "tkdl_codes": data["tkdl_accession_codes"],
                        "active_markers": data["active_markers"]
                    })
                    found_botanicals.append(data["botanical_name"])
                    matched = True
                    break
            if not matched:
                # Still record novel or uncataloged botanical
                found_botanicals.append(ing)

        # 2. Risk Calculation Algorithm
        num_classical_hits = len(matched_prior_art)
        is_pure_classical = (num_classical_hits > 0 and extraction_type.lower() in ["aqueous", "crude powder", "decoction", "churnam", "taila", "asava"])

        # Default scoring
        risk_score = 0
        section_3p_risk = "LOW"
        section_3d_risk = "LOW"
        section_3e_risk = "LOW"

        if is_pure_classical:
            risk_score = 95
            section_3p_risk = "CRITICAL_BAR"
            section_3e_risk = "HIGH"
            patent_status = "BARRED_SECTION_3P"
            summary = "Direct traditional knowledge overlap. The Indian Patent Office (IPO) and foreign PTOs armed with TKDL will issue 100% rejection under Section 3(p)."
        elif is_fractionated and extraction_type.lower() in ["phytopharmaceutical", "standardized extract", "supercritical co2"]:
            # Route 122-E Phytopharmaceutical with bioactive markers
            risk_score = 25
            section_3p_risk = "LOW_OVERCOME"
            section_3d_risk = "MANAGEABLE_VIA_DATA"
            patent_status = "POTENTIALLY_PATENTABLE_PHYTOMEDICINE"
            summary = "High patentability potential. By standardizing ≥4 bioactive fractions and proving enhanced pharmacokinetic delivery, Section 3(p) can be overcome under Rule 122-E."
        elif has_synergy_data:
            risk_score = 45
            section_3p_risk = "MODERATE"
            section_3e_risk = "OVERCOME_WITH_SYNERGY"
            patent_status = "PATENTABLE_SYNERGISTIC_COMBINATION"
            summary = "Section 3(e) objection can be overcome with rigorous combination index (CI < 1.0) and in-vitro/in-vivo synergistic efficacy proof exceeding individual component sums."
        else:
            # Multi-herb mix without synergy
            risk_score = 80
            section_3p_risk = "HIGH"
            section_3e_risk = "HIGH_SECTION_3E"
            patent_status = "HIGH_REJECTION_RISK_AGGREGATION"
            summary = "High risk of rejection under Section 3(p) (traditional knowledge) and Section 3(e) (mere aggregation of known properties without clinical synergy evidence)."

        # 3. Formulate Recommended IP Strategy
        strategies = []
        if risk_score >= 80:
            strategies.append({
                "pathway": "AYUSH Proprietary Medicine (P&P License)",
                "description": "Abandon patent filing to avoid costly TKDL opposition. File for Form 24D/25D under the Drugs & Cosmetics Act 1940 with State Licensing Authority.",
                "timeline": "3-6 months"
            })
            strategies.append({
                "pathway": "Brand & Trademark Moat",
                "description": "Secure Word & Device Trademark under Class 5 (Pharmaceuticals) and Class 30 (Ayurveda-Aahar) to protect commercial equity.",
                "timeline": "6-12 months"
            })
            strategies.append({
                "pathway": "Trade Secret Protection",
                "description": "Protect the exact proprietary blending ratio, temperature control, and processing duration as confidential trade secrets.",
                "timeline": "Immediate"
            })
        elif risk_score >= 40:
            strategies.append({
                "pathway": "Synergistic Composition Patent (Section 3(e) Compliance)",
                "description": "Draft patent claims strictly around proven supra-additive synergy. Submit Chou-Talalay Combination Index data demonstrating therapeutic amplification.",
                "timeline": "12-24 months"
            })
            strategies.append({
                "pathway": "Novel Drug Delivery System (NDDS) Formulation",
                "description": "Patent nano-emulsion, phytosome, or targeted liposomal encapsulation of the extracts rather than the raw herbs.",
                "timeline": "18-36 months"
            })
        else:
            strategies.append({
                "pathway": "Phytopharmaceutical Patent (CDSCO Rule 122-E)",
                "description": "File composition of matter and process claims for standardized botanical fraction with ≥4 quantified chromatographic markers. Eligible for PCT international filing.",
                "timeline": "18-30 months"
            })

        return {
            "formulation_name": formulation_name or "Ayurvedic Botanical Compound",
            "patentability_risk_score": risk_score,
            "overall_status": patent_status,
            "statutory_summary": summary,
            "section_3p_posture": {
                "risk_level": section_3p_risk,
                "statute": "Patents Act 1970, Sec 3(p)",
                "finding": "Invention is traditional knowledge" if section_3p_risk in ["CRITICAL_BAR", "HIGH"] else "Novel extraction or purification overcomes pure classical bar"
            },
            "section_3e_posture": {
                "risk_level": section_3e_risk,
                "statute": "Patents Act 1970, Sec 3(e)",
                "finding": "Mere aggregation of known properties barred" if not has_synergy_data else "Synergistic bio-amplification documented"
            },
            "tkdl_matches_count": len(matched_prior_art),
            "matched_prior_art": matched_prior_art,
            "recommended_strategies": strategies,
            "bda_compliance_notice": "Because Indian biological resources are utilized, approval from National Biodiversity Authority (NBA) under Section 6 of BDA 2023 is MANDATORY prior to grant of any patent."
        }
