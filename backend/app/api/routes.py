import os
import re
import csv
from pathlib import Path
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException, BackgroundTasks, UploadFile, File, Form
from pydantic import BaseModel, Field

from app.services.etl.chunker import LegalDocumentChunker, extract_text_from_file
from app.services.etl.etl_ingestion_pipeline import ETLIngestionPipeline
from app.services.etl.tasks import ingest_document_task, celery_app
from app.core.config import settings

router = APIRouter()


class IngestFileRequest(BaseModel):
    file_path: str = Field(..., description="Relative or absolute path to the legal document (.txt, .md, or .pdf)")
    doc_id: Optional[str] = None
    act_name: Optional[str] = None
    jurisdiction: str = "IN"
    document_type: str = "statute"
    format: str = "auto"
    dry_run: bool = False
    async_mode: bool = False


class IngestDirectoryRequest(BaseModel):
    dir_path: str = Field(..., description="Directory containing legal files (.txt, .md, .pdf)")
    format: str = "auto"
    dry_run: bool = False


class PreviewRequest(BaseModel):
    file_path: str
    format: str = "auto"


class IngestionResponse(BaseModel):
    status: str
    message: str
    data: Optional[Dict[str, Any]] = None


@router.post("/ingest/file", response_model=IngestionResponse)
async def ingest_single_file(request: IngestFileRequest):
    """
    Ingests an individual legal document into Qdrant vector database and Neo4j knowledge graph.
    Can be executed synchronously or dispatched asynchronously to Celery.
    """
    path = Path(request.file_path)
    if not path.exists():
        candidates = [
            Path(request.file_path),
            Path("corpus_extracted") / request.file_path,
            Path("../corpus_extracted") / request.file_path,
            Path("corpus_extracted") / path.name,
            Path("../corpus_extracted") / path.name,
        ]
        found = next((c for c in candidates if c.exists()), None)
        if not found:
            raise HTTPException(status_code=404, detail=f"File not found: {request.file_path}")
        path = found

    if request.async_mode:
        task = ingest_document_task.delay(
            file_path=str(path.resolve()),
            doc_id=request.doc_id,
            act_name=request.act_name,
            jurisdiction=request.jurisdiction,
            document_type=request.document_type,
            format_type=request.format,
            dry_run=request.dry_run,
        )
        return IngestionResponse(
            status="Queued",
            message="Document ingestion dispatched to background Celery worker.",
            data={"task_id": task.id, "file": path.name},
        )

    try:
        pipeline = ETLIngestionPipeline()
        metadata = {
            "doc_id": request.doc_id,
            "act_name": request.act_name,
            "jurisdiction": request.jurisdiction,
            "document_type": request.document_type,
        }
        result = pipeline.ingest_file(
            path, doc_metadata=metadata, format_type=request.format, dry_run=request.dry_run
        )
        pipeline.close()
        return IngestionResponse(
            status="Success",
            message=f"Successfully processed {path.name}",
            data=result,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ingestion failed: {str(e)}")


@router.post("/ingest/directory", response_model=IngestionResponse)
async def ingest_entire_directory(request: IngestDirectoryRequest):
    """
    Batch ingests all documents in a directory into Qdrant and Neo4j.
    """
    path = Path(request.dir_path)
    if not path.exists() or not path.is_dir():
        candidates = [
            Path(request.dir_path),
            Path("../") / request.dir_path,
            Path("corpus_extracted"),
            Path("../corpus_extracted"),
        ]
        found = next((c for c in candidates if c.exists() and c.is_dir()), None)
        if not found:
            raise HTTPException(status_code=404, detail=f"Directory not found: {request.dir_path}")
        path = found

    try:
        pipeline = ETLIngestionPipeline()
        results = pipeline.ingest_directory(path, format_type=request.format, dry_run=request.dry_run)
        pipeline.close()
        return IngestionResponse(
            status="Success",
            message=f"Batch processed {len(results)} file(s) in {path.name}",
            data={"processed_files": results},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Directory ingestion failed: {str(e)}")


@router.post("/preview/chunks")
async def preview_document_chunks(request: PreviewRequest):
    """
    Extracts, cleans, and hierarchical-chunks a document on the fly for UI inspection.
    """
    path = Path(request.file_path)
    if not path.exists():
        candidates = [
            Path("corpus_extracted") / request.file_path,
            Path("../corpus_extracted") / request.file_path,
            Path("corpus_extracted") / path.name,
            Path("../corpus_extracted") / path.name,
        ]
        found = next((c for c in candidates if c.exists()), None)
        if not found:
            raise HTTPException(status_code=404, detail=f"Document not found: {request.file_path}")
        path = found

    try:
        chunker = LegalDocumentChunker(
            doc_id=path.stem.replace(" ", "_").lower(),
            act_name=path.stem.replace("_", " ").title(),
            jurisdiction="IN",
            source_file=path.name,
        )
        chunks = chunker.chunk_file(path, format_type=request.format)

        chunk_list = []
        for i, c in enumerate(chunks):
            # Extract breadcrumb and verbatim body
            lines = c.content.split("\n", 1)
            breadcrumb = lines[0] if lines[0].startswith("[Act:") else ""
            verbatim = lines[1] if len(lines) > 1 else c.content

            chunk_list.append({
                "index": i + 1,
                "act_name": c.act_name,
                "doc_id": c.doc_id,
                "chapter_name": c.chapter_name or "General",
                "section_name": c.section_name,
                "section_title": c.section_title or c.section_name,
                "breadcrumb": breadcrumb,
                "verbatim": verbatim,
                "full_content": c.content,
                "character_count": len(c.content),
                "qdrant_payload_preview": {
                    "text": c.content[:200] + ("..." if len(c.content) > 200 else ""),
                    "doc_id": c.doc_id,
                    "act_name": c.act_name,
                    "section_name": c.section_name,
                    "jurisdiction": c.jurisdiction,
                    "language": c.original_language,
                },
            })

        return {
            "file": path.name,
            "total_chunks": len(chunk_list),
            "act_name": chunker.act_name,
            "chunks": chunk_list,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to preview document chunks: {str(e)}")


def _detect_year_from_content(text: str, filename: str) -> str:
    """Extract the most likely enactment year from file content or filename."""
    import datetime

    # Common patterns: "Act, 1970", "Act of 1970", "enacted in 1970", "Year: 1970"
    year_patterns = [
        r'(?:Act|Code|Ordinance|Bill|Rules?|Regulation|Amendment)[,\s]+(\d{4})',
        r'(?:enacted|passed|published|notified|dated)\s+(?:in\s+)?(?:\w+\s+)?(\d{4})',
        r'\b(1[89]\d{2}|20[0-2]\d)\b',
    ]

    # Try content first
    for pattern in year_patterns:
        matches = re.findall(pattern, text[:5000], re.IGNORECASE)
        if matches:
            # Return the first plausible legislative year
            for m in matches:
                yr = int(m)
                if 1800 <= yr <= datetime.datetime.now().year:
                    return str(yr)

    # Try filename
    fname_matches = re.findall(r'(1[89]\d{2}|20[0-2]\d)', filename)
    if fname_matches:
        return fname_matches[0]

    return str(datetime.datetime.now().year)


def _detect_document_type(text: str, filename: str, ext: str) -> str:
    """Auto-detect document type from file content and extension."""
    fname_lower = filename.lower()
    text_lower = text[:3000].lower()

    # Check filename hints first
    if any(kw in fname_lower for kw in ["regulation", "rules", "rule"]):
        return "regulation"
    if any(kw in fname_lower for kw in ["guideline", "guidance", "circular", "notification"]):
        return "guideline"
    if any(kw in fname_lower for kw in ["case", "judgment", "judgement", "order", "appeal"]):
        return "case_law"

    # Check content hints
    if any(kw in text_lower for kw in ["regulation", "rules made under", "in exercise of the powers"]):
        return "regulation"
    if any(kw in text_lower for kw in ["guideline", "advisory", "circular", "office memorandum"]):
        return "guideline"
    if any(kw in text_lower for kw in ["hon'ble", "honourable", "petitioner", "respondent", "judgment", "judgement", "appellant"]):
        return "case_law"

    # Default: statutes are the most common legal document
    return "statute"


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    act_name: Optional[str] = Form(None),
    jurisdiction: Optional[str] = Form("IN"),
):
    """
    Uploads a new .txt or .pdf legal statute to corpus_extracted/ and updates corpus_index.csv.
    Automatically detects the enactment year and document type from the file content.
    """
    ext = Path(file.filename).suffix.lower()
    if ext not in [".txt", ".pdf", ".md"]:
        raise HTTPException(status_code=400, detail="Only .txt, .md, and .pdf files are supported.")

    corpus_dir = Path("corpus_extracted")
    if not corpus_dir.exists():
        corpus_dir = Path("../corpus_extracted")
        if not corpus_dir.exists():
            corpus_dir = Path("corpus_extracted")
            corpus_dir.mkdir(parents=True, exist_ok=True)

    dest_path = corpus_dir / file.filename
    try:
        content = await file.read()
        dest_path.write_bytes(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save uploaded file: {str(e)}")

    # Read text content for auto-detection
    file_text = ""
    try:
        if ext in [".txt", ".md"]:
            file_text = content.decode("utf-8", errors="ignore")
        elif ext == ".pdf":
            try:
                import fitz  # PyMuPDF
                doc = fitz.open(stream=content, filetype="pdf")
                file_text = "\n".join(page.get_text() for page in doc)
                doc.close()
            except ImportError:
                # Fallback: just use filename for detection
                file_text = ""
    except Exception:
        file_text = ""

    # Auto-detect year and document type
    detected_year = _detect_year_from_content(file_text, file.filename)
    detected_type = _detect_document_type(file_text, file.filename, ext)

    # Update corpus_index.csv
    candidate_paths = [Path("corpus_index.csv"), Path("../corpus_index.csv")]
    csv_path = next((p for p in candidate_paths if p.exists()), candidate_paths[0])

    resolved_act_name = act_name or file.filename.rsplit(".", 1)[0].replace("_", " ").title()
    new_entry = {
        "file_path": f"corpus_extracted/{file.filename}",
        "document_title": file.filename.rsplit(".", 1)[0].replace("_", " ").title(),
        "act_name": resolved_act_name,
        "year": detected_year,
        "jurisdiction": jurisdiction or "IN",
        "language": "en",
        "document_type": detected_type,
        "status": "Pending",
    }

    try:
        rows = []
        fieldnames = ["file_path", "document_title", "act_name", "year", "jurisdiction", "language", "document_type", "status"]
        if csv_path.exists():
            with open(csv_path, "r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                fieldnames = reader.fieldnames or fieldnames
                for r in reader:
                    if file.filename not in r.get("file_path", ""):
                        rows.append(r)

        rows.append(new_entry)
        with open(csv_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rows)
    except Exception as e:
        pass

    return {
        "status": "Uploaded",
        "file_name": file.filename,
        "act_name": resolved_act_name,
        "year": detected_year,
        "document_type": detected_type,
        "size_bytes": len(content),
        "path": f"corpus_extracted/{file.filename}",
    }


@router.post("/reset-db")
async def reset_databases():
    """
    Clears all vectors from Qdrant and nodes from Neo4j.
    """
    pipeline = ETLIngestionPipeline()
    results = pipeline.reset_databases()
    pipeline.close()
    return {"status": "Success", "reset_results": results}


@router.get("/ingest/status/{task_id}")
async def get_task_status(task_id: str):
    """
    Checks the status of a Celery background ingestion task.
    """
    try:
        task_res = celery_app.AsyncResult(task_id)
        response_data = {
            "task_id": task_id,
            "status": task_res.status,
            "ready": task_res.ready(),
        }
        if task_res.ready():
            if task_res.successful():
                response_data["result"] = task_res.result
            else:
                response_data["error"] = str(task_res.result)
        else:
            response_data["info"] = task_res.info
        return response_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to query task status: {str(e)}")


@router.get("/corpus/index")
async def get_corpus_index():
    """
    Returns the current status of the corpus documents from corpus_index.csv.
    """
    candidate_paths = [
        Path("corpus_index.csv"),
        Path("../corpus_index.csv"),
        Path("../../corpus_index.csv"),
    ]
    csv_path = next((p for p in candidate_paths if p.exists()), None)
    if not csv_path:
        return {"documents": [], "total": 0, "message": "corpus_index.csv not found"}

    documents = []
    try:
        with open(csv_path, mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                documents.append(row)
        return {"documents": documents, "total": len(documents)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading corpus index: {str(e)}")


@router.get("/health")
async def check_health():
    """
    Verifies service connectivity to Qdrant, Neo4j, and Redis.
    """
    status = {"qdrant": "unknown", "neo4j": "unknown", "redis": "unknown"}

    # Qdrant
    try:
        from qdrant_client import QdrantClient
        qc = QdrantClient(url=settings.QDRANT_URL, timeout=1.0)
        qc.get_collections()
        status["qdrant"] = "connected"
    except Exception as qe:
        status["qdrant"] = f"offline ({qe.__class__.__name__})"

    # Neo4j
    try:
        from neo4j import GraphDatabase
        driver = GraphDatabase.driver(
            settings.NEO4J_URI,
            auth=(settings.NEO4J_USER, settings.NEO4J_PASS),
            connection_timeout=1.0,
        )
        with driver.session() as s:
            s.run("RETURN 1")
        driver.close()
        status["neo4j"] = "connected"
    except Exception as ne:
        status["neo4j"] = f"offline ({ne.__class__.__name__})"

    # Redis
    try:
        import redis
        r = redis.from_url(settings.REDIS_URL, socket_timeout=1.0)
        r.ping()
        status["redis"] = "connected"
    except Exception as re_err:
        status["redis"] = f"offline ({re_err.__class__.__name__})"

    return {
        "service": "IP-SAKTI Sahayak Admin & ETL Engine",
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "database_health": status,
    }
