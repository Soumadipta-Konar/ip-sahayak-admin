import re

class DPDPComplianceEngine:
    """
    Security Middleware to comply with Digital Personal Data Protection Act.
    Strips personally identifiable information (PII) before it touches any LLM.
    """
    
    @staticmethod
    def strip_pii(text: str) -> str:
        # Regex to strip common 10-digit Indian phone numbers
        text = re.sub(r'\b\d{10}\b', '[REDACTED_PHONE]', text)
        
        # Regex to strip Aadhaar (12 digits)
        text = re.sub(r'\b\d{4}\s?\d{4}\s?\d{4}\b', '[REDACTED_AADHAAR]', text)
        
        # Regex to strip simple emails
        text = re.sub(r'\S+@\S+', '[REDACTED_EMAIL]', text)
        
        # In production, use Presidio for advanced NER (Named Entity Recognition)
        return text
