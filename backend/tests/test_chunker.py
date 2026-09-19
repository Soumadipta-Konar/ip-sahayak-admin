import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.services.etl.chunker import LegalDocumentChunker

def test_legal_chunker_basic():
    text = """
CHAPTER I PRELIMINARY
Section 1 Short title
This is section 1.
Section 2 Definitions
This is section 2.
CHAPTER II INVENTIONS NOT PATENTABLE
Section 3 What are not inventions
This is section 3.
"""
    chunker = LegalDocumentChunker("doc1", "Act 1")
    chunks = chunker.chunk_document(text)
    
    # We should have 3 section chunks
    assert len(chunks) == 3
    
    assert chunks[0].chapter_name == "Chapter I PRELIMINARY"
    assert "Section 1" in chunks[0].section_name
    
    assert chunks[1].chapter_name == "Chapter I PRELIMINARY"
    assert "Section 2" in chunks[1].section_name
    
    assert chunks[2].chapter_name == "Chapter II INVENTIONS NOT PATENTABLE"
    assert "Section 3" in chunks[2].section_name
    assert "This is section 3." in chunks[2].content


if __name__ == "__main__":
    test_legal_chunker_basic()
    print("test_chunker: ALL TESTS PASSED!")
