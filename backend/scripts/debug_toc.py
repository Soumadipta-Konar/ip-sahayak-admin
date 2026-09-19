import sys
sys.path.insert(0, ".")
from app.services.etl.chunker import LegalDocumentChunker, clean_legal_text, strip_arrangement_of_sections

raw_bare_act = """THE PATENTS ACT, 1970
ACT NO. 39 OF 1970
[19th September, 1970]

ARRANGEMENT OF SECTIONS
CHAPTER I
PRELIMINARY
1. Short title, extent and commencement.
2. Definitions and interpretation.
CHAPTER II
INVENTIONS NOT PATENTABLE
3. What are not inventions.

An Act to amend and consolidate the law relating to patents.
BE it enacted by Parliament in the Twenty-first Year of the Republic of India as follows:—

CHAPTER I PRELIMINARY
1. Short title, extent and commencement.—(1) This Act may be called the Patents Act, 1970.
(2) It extends to the whole of India.

2. Definitions and interpretation.—(1) In this Act, unless the context otherwise requires,—
(a) “Appellate Board” means the Appellate Board;

CHAPTER II INVENTIONS NOT PATENTABLE
3. What are not inventions.—The following are not inventions within the meaning of this Act,—
(p) an invention which in effect, is traditional knowledge.
"""

cleaned = clean_legal_text(raw_bare_act)
print("CLEANED TEXT:")
print(cleaned)

chunker = LegalDocumentChunker()
chunks = chunker.chunk_multi_act_document(raw_bare_act)
print(f"Total chunks: {len(chunks)}")
for i, c in enumerate(chunks):
    print(f"Chunk {i+1}: Chapter={c.chapter_name} | Section={c.section_name} | Act={c.act_name}")
