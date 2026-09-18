import os
import csv
from pathlib import Path

# Path to the extracted corpus
CORPUS_DIR = Path("../../corpus_extracted")
# Output CSV path
CSV_PATH = Path("../../corpus_index.csv")

def guess_document_type(filename: str) -> str:
    """Simple heuristic to guess document type based on filename."""
    filename_lower = filename.lower()
    if "act" in filename_lower:
        return "statute"
    elif "rule" in filename_lower or "guideline" in filename_lower:
        return "regulation"
    elif "case" in filename_lower or "judgment" in filename_lower:
        return "case_law"
    elif "manual" in filename_lower:
        return "manual"
    return "general_info"

def generate_csv():
    # Headers including the new document_type column
    headers = [
        "file_path", 
        "document_title", 
        "act_name", 
        "year", 
        "jurisdiction", 
        "language", 
        "document_type",  # NEW COLUMN FOR RAG FILTERING
        "status"
    ]

    if not CORPUS_DIR.exists():
        print(f"Error: Directory {CORPUS_DIR.resolve()} does not exist.")
        return

    pdf_files = list(CORPUS_DIR.rglob("*.pdf"))
    
    with open(CSV_PATH, mode='w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(headers)

        for pdf in pdf_files:
            file_path = f"corpus_extracted/{pdf.name}"
            document_title = pdf.stem.replace("_", " ").title()
            act_name = document_title # Placeholder, can be manually edited
            year = "2024" # Placeholder
            jurisdiction = "IN"
            language = "en"
            document_type = guess_document_type(pdf.name)
            status = "Pending"

            writer.writerow([
                file_path, 
                document_title, 
                act_name, 
                year, 
                jurisdiction, 
                language, 
                document_type, 
                status
            ])
            
    print(f"Successfully generated {CSV_PATH.resolve()} with {len(pdf_files)} entries.")

if __name__ == "__main__":
    generate_csv()
