import os
import logging
from typing import Dict, Any, Optional
from celery import Celery

from app.core.config import settings
from app.services.etl.etl_ingestion_pipeline import ETLIngestionPipeline

logger = logging.getLogger(__name__)

# Initialize Celery app with Redis broker
celery_app = Celery(
    "ip_sakti_etl",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Asia/Kolkata",
    enable_utc=True,
    task_track_started=True,
)


@celery_app.task(bind=True, name="tasks.ingest_document_task")
def ingest_document_task(
    self,
    file_path: str,
    doc_id: Optional[str] = None,
    act_name: Optional[str] = None,
    jurisdiction: str = "IN",
    document_type: str = "statute",
    format_type: str = "auto",
    dry_run: bool = False,
) -> Dict[str, Any]:
    """
    Asynchronous Celery task for ingesting a legal document into Qdrant and Neo4j.
    """
    logger.info(f"[Celery Task {self.request.id}] Starting ingestion for {file_path}...")
    self.update_state(state="PROGRESS", meta={"status": "Parsing and chunking document..."})

    try:
        pipeline = ETLIngestionPipeline()
        metadata = {
            "doc_id": doc_id,
            "act_name": act_name,
            "jurisdiction": jurisdiction,
            "document_type": document_type,
        }

        result = pipeline.ingest_file(
            file_path=file_path,
            doc_metadata=metadata,
            format_type=format_type,
            dry_run=dry_run,
        )

        pipeline.close()
        logger.info(f"[Celery Task {self.request.id}] Ingestion complete: {result}")
        return result
    except Exception as exc:
        logger.error(f"[Celery Task {self.request.id}] Ingestion failed: {exc}")
        self.update_state(state="FAILURE", meta={"error": str(exc)})
        raise exc
