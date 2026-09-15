import re
from typing import List, Dict, Optional
from pydantic import BaseModel

class LegalChunk(BaseModel):
    doc_id: str
    jurisdiction: str
    act_name: str
    chapter_name: Optional[str] = None
    section_name: str
    content: str
    effective_date: Optional[str] = None
    original_language: str = "eng"

class LegalDocumentChunker:
    """
    Hierarchical Regex-based Splitter for Indian Statutes.
    Splits text by Chapters and Sections, injecting metadata into each chunk.
    """
    
    def __init__(self, doc_id: str, act_name: str, jurisdiction: str = "IN", effective_date: Optional[str] = None, language: str = "eng"):
        self.doc_id = doc_id
        self.act_name = act_name
        self.jurisdiction = jurisdiction
        self.effective_date = effective_date
        self.language = language

        # Regex patterns to detect chapters and sections (simplified for mock purposes)
        self.chapter_pattern = re.compile(r"^(?:CHAPTER|Chapter)\s+([IVXLCDM\d]+.*?)$", re.MULTILINE)
        self.section_pattern = re.compile(r"^(?:SECTION|Section)\s+(\d+[a-zA-Z]*(?:\(\w+\))*.*?)$", re.MULTILINE)

    def chunk_document(self, text: str) -> List[LegalChunk]:
        chunks = []
        
        # Split by chapters first
        chapter_splits = self.chapter_pattern.split(text)
        
        # If no chapters found, treat the whole document as one block to be split by sections
        if len(chapter_splits) == 1:
            self._parse_sections(text, None, chunks)
            return chunks

        # chapter_splits will be: [preamble, chapter_1_title, chapter_1_content, chapter_2_title, ...]
        preamble = chapter_splits[0].strip()
        if preamble:
            self._parse_sections(preamble, "Preamble", chunks)
            
        for i in range(1, len(chapter_splits), 2):
            chapter_title = f"Chapter {chapter_splits[i].strip()}"
            chapter_content = chapter_splits[i+1]
            self._parse_sections(chapter_content, chapter_title, chunks)
            
        return chunks

    def _parse_sections(self, text: str, current_chapter: Optional[str], chunks: List[LegalChunk]):
        section_splits = self.section_pattern.split(text)
        
        # If no sections, just return the whole text as a single chunk
        if len(section_splits) == 1:
            content = section_splits[0].strip()
            if content:
                chunks.append(self._create_chunk(current_chapter, "General/Preamble", content))
            return

        preamble = section_splits[0].strip()
        if preamble:
            chunks.append(self._create_chunk(current_chapter, "General", preamble))
            
        for i in range(1, len(section_splits), 2):
            section_title = f"Section {section_splits[i].strip()}"
            # Extract only the title part (e.g. "Section 3: xyz" -> "Section 3")
            # For simplicity, we just use the whole line as the section name
            section_name = section_title.split("\n")[0].strip()
            
            section_content = section_title + section_splits[i+1] # Include title in content for context
            chunks.append(self._create_chunk(current_chapter, section_name, section_content.strip()))

    def _create_chunk(self, chapter: Optional[str], section: str, content: str) -> LegalChunk:
        return LegalChunk(
            doc_id=self.doc_id,
            jurisdiction=self.jurisdiction,
            act_name=self.act_name,
            chapter_name=chapter,
            section_name=section,
            content=content,
            effective_date=self.effective_date,
            original_language=self.language
        )
