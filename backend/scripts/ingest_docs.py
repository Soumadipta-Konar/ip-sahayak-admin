import sys
import os
import logging
from typing import List

# Add the backend directory to the sys path so we can import from app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.services.etl.chunker import LegalDocumentChunker, LegalChunk
from app.core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Mock Legal Text for testing the ETL pipeline without actual PDFs
MOCK_PATENTS_ACT_TEXT = """
CHAPTER I PRELIMINARY
Section 1 Short title, extent and commencement
(1) This Act may be called the Patents Act, 1970.
(2) It extends to the whole of India.
Section 2 Definitions and interpretation
(1) In this Act, unless the context otherwise requires,—
(a) “Appellate Board” means the Appellate Board referred to in section 116;

CHAPTER II INVENTIONS NOT PATENTABLE
Section 3 What are not inventions
The following are not inventions within the meaning of this Act,—
(a) an invention which is frivolous or which claims anything obviously contrary to well established natural laws;
(p) an invention which in effect, is traditional knowledge or which is an aggregation or duplication of known properties of traditionally known component or components.
"""


class MockQdrantClient:
    def upload_vectors(self, collection_name: str, chunks: List[LegalChunk]):
        logger.info(f"[QDRANT MOCK] Uploading {len(chunks)} dense vectors to collection '{collection_name}'...")
        for chunk in chunks:
            logger.debug(f" -> Inserted vector for: {chunk.act_name} | {chunk.chapter_name} | {chunk.section_name}")


class MockNeo4jClient:
    def create_edges(self, chunks: List[LegalChunk]):
        logger.info(f"[NEO4J MOCK] Extracting and inserting graph edges for {len(chunks)} chunks...")
        for chunk in chunks:
            logger.debug(f" -> Created node for {chunk.section_name} and linked to ACT node '{chunk.act_name}'.")


def run_etl_pipeline():
    logger.info(f"Starting IP-SAKTI ETL Pipeline...")
    logger.info(f"Target Drive URL: {settings.RAW_DATA_DRIVE_URL}")
    logger.info("Initializing Hierarchical Splitter...")

    chunker = LegalDocumentChunker(
        doc_id="IN_PAT_1970",
        act_name="The Patents Act, 1970",
        jurisdiction="IN",
        effective_date="1970-09-19"
    )

    logger.info("Processing Mock Document: The Patents Act, 1970...")
    chunks = chunker.chunk_document(MOCK_PATENTS_ACT_TEXT)
    
    logger.info(f"Successfully generated {len(chunks)} hierarchical chunks.")
    
    # Initialize Mock DB Clients
    qdrant = MockQdrantClient()
    neo4j = MockNeo4jClient()

    # Step 4: Triple-Index Routing
    qdrant.upload_vectors("ip_sakti_vectors", chunks)
    neo4j.create_edges(chunks)
    
    logger.info("ETL Pipeline completed successfully! All data ingested.")


if __name__ == "__main__":
    run_etl_pipeline()
