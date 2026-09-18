import csv
import logging
from pathlib import Path
import pdfplumber
from app.services.etl.chunker import LegalDocumentChunker

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
CSV_PATH = BASE_DIR.parent / "corpus_index.csv"
PROJECT_ROOT = BASE_DIR.parent

def extract_text_from_pdf(pdf_path: Path) -> str:
    """Extract text from a PDF file using pdfplumber."""
    text = ""
    try:
        with pdfplumber.open(pdf_path) as doc:
            for page in doc.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        logger.error(f"Error reading {pdf_path}: {e}")
    return text

def mock_insert_to_qdrant(chunks):
    """Mock insertion of vectors to Qdrant."""
    logger.info(f"-> Inserted {len(chunks)} chunks into Qdrant Vector DB.")

def mock_insert_to_bm25(chunks):
    """Mock insertion of text to BM25."""
    logger.info(f"-> Inserted {len(chunks)} chunks into BM25 Search.")

def mock_insert_to_neo4j(chunks):
    """Mock insertion of graph edges to Neo4j."""
    logger.info(f"-> Inserted {len(chunks)} nodes into Neo4j Graph DB.")

def run_pipeline():
    logger.info("Starting ETL Ingestion Pipeline...")
    
    if not CSV_PATH.exists():
        logger.error(f"CSV not found at {CSV_PATH.resolve()}")
        return

    with open(CSV_PATH, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            file_path = row["file_path"]
            status = row["status"]
            
            if status == "Ingested":
                continue
                
            pdf_path = PROJECT_ROOT / file_path
            
            if not pdf_path.exists():
                logger.warning(f"File not found: {pdf_path}. Skipping.")
                continue
                
            logger.info(f"Processing: {row['document_title']} ({row['document_type']})")
            
            # 1. Extraction
            text = extract_text_from_pdf(pdf_path)
            
            # 2. Chunking
            chunker = LegalDocumentChunker(
                doc_id=row["document_title"].replace(" ", "_").lower(),
                act_name=row["act_name"],
                jurisdiction=row["jurisdiction"],
                language=row["language"]
            )
            chunks = chunker.chunk_document(text)
            
            # 3. Insertion
            mock_insert_to_qdrant(chunks)
            mock_insert_to_bm25(chunks)
            mock_insert_to_neo4j(chunks)
            
            logger.info(f"Successfully processed {file_path}. Marking as Ingested.\n")

if __name__ == "__main__":
    # Ensure this is run from the backend directory
    # Adjust paths if needed
    run_pipeline()
