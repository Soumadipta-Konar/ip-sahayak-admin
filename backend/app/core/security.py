import re
# pyrefly: ignore [missing-import]
from presidio_analyzer import AnalyzerEngine
# pyrefly: ignore [missing-import]
from presidio_anonymizer import AnonymizerEngine
import logging

logger = logging.getLogger(__name__)

class DPDPComplianceEngine:
    """
    Security Middleware to comply with Digital Personal Data Protection Act.
    Strips personally identifiable information (PII) before it touches any LLM.
    """
    _analyzer = None
    _anonymizer = None

    @classmethod
    def _initialize(cls):
        if cls._analyzer is None:
            try:
                cls._analyzer = AnalyzerEngine()
                cls._anonymizer = AnonymizerEngine()
            except Exception as e:
                logger.warning(f"Failed to initialize Presidio: {e}. Falling back to regex.")

    @classmethod
    def strip_pii(cls, text: str) -> str:
        cls._initialize()
        
        if cls._analyzer and cls._anonymizer:
            try:
                results = cls._analyzer.analyze(text=text, entities=["PHONE_NUMBER", "EMAIL_ADDRESS", "PERSON"], language='en')
                anonymized_result = cls._anonymizer.anonymize(text=text, analyzer_results=results)
                return anonymized_result.text
            except Exception as e:
                logger.error(f"Presidio anonymization failed: {e}. Falling back to regex.")
        
        # Fallback Regex approach
        # Regex to strip common 10-digit Indian phone numbers
        text = re.sub(r'\b\d{10}\b', '[REDACTED_PHONE]', text)
        
        # Regex to strip Aadhaar (12 digits)
        text = re.sub(r'\b\d{4}\s?\d{4}\s?\d{4}\b', '[REDACTED_AADHAAR]', text)
        
        # Regex to strip simple emails
        text = re.sub(r'\S+@\S+', '[REDACTED_EMAIL]', text)
        
        return text
