import sys
import os
import time
import argparse
import logging
from pathlib import Path
from typing import List, Dict, Any
from tqdm import tqdm

# Add backend directory to sys.path
BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.services.etl.etl_ingestion_pipeline import ETLIngestionPipeline

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("ingest_docs")


def print_summary_report(results: List[Dict[str, Any]], elapsed_time: float, dry_run: bool):
    """Prints a formatted CLI summary table."""
    total_files = len(results)
    total_chunks = sum(r.get("chunks_count", 0) for r in results)
    total_vectors = sum(r.get("vectors_inserted", 0) for r in results)
    total_nodes = sum(r.get("graph_nodes", 0) for r in results)
    total_edges = sum(r.get("graph_edges", 0) for r in results)
    successful = sum(1 for r in results if "Success" in r.get("status", ""))
    failed = total_files - successful

    mode_label = "[DRY-RUN SIMULATION]" if dry_run else "[PRODUCTION LOAD]"
    separator = "=" * 70

    print("\n" + separator)
    print(f"      IP-SAKTI SAHAYAK - DATA INGESTION ENGINE SUMMARY {mode_label}")
    print(separator)
    print(f" Total Documents Processed : {total_files}")
    print(f" Successful Ingestions     : {successful}")
    print(f" Failed Ingestions         : {failed}")
    print(f" Hierarchical Chunks       : {total_chunks}")
    if dry_run:
        print(f" Dense Vectors (Simulated) : {total_chunks}")
        print(f" Graph Triples (Simulated) : ~{total_chunks * 3}")
    else:
        print(f" Vectors Upserted (Qdrant) : {total_vectors}")
        print(f" Graph Nodes (Neo4j)       : {total_nodes}")
        print(f" Graph Edges (Neo4j)       : {total_edges}")
    print(f" Total Elapsed Time        : {elapsed_time:.2f} seconds")
    print(separator)

    print("\nDocument Breakdown:")
    print(f"{'Document File':<40} | {'Status':<15} | {'Chunks':<8}")
    print("-" * 70)
    for r in results:
        fname = r.get("file", "Unknown")[:38]
        status = r.get("status", "Unknown")[:15]
        chunks = r.get("chunks_count", 0)
        print(f"{fname:<40} | {status:<15} | {chunks:<8}")
    print(separator + "\n")


def main():
    parser = argparse.ArgumentParser(
        description="IP-SAKTI Sahayak: Production Legal Document ETL & Graph Construction Engine"
    )
    parser.add_argument(
        "--input-dir",
        type=str,
        help="Directory containing legal .txt, .md, or .pdf files to ingest.",
    )
    parser.add_argument(
        "--file",
        type=str,
        help="Path to a single legal document to ingest.",
    )
    parser.add_argument(
        "--format",
        choices=["auto", "txt", "pdf"],
        default="auto",
        help="Input format preference: 'auto' (default), 'txt', or 'pdf'.",
    )
    parser.add_argument(
        "--reset-db",
        action="store_true",
        help="Clears existing Qdrant collection and Neo4j graph before ingestion.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Runs extraction, cleaning, and chunking without inserting into databases.",
    )

    args = parser.parse_args()

    # Default fallback if neither is supplied: check ../corpus_extracted or ./corpus_extracted
    if not args.input_dir and not args.file:
        candidates = [
            Path("corpus_extracted"),
            Path("../corpus_extracted"),
            BACKEND_DIR.parent / "corpus_extracted",
        ]
        found_dir = next((c for c in candidates if c.exists() and c.is_dir()), None)
        if found_dir:
            args.input_dir = str(found_dir)
            logger.info(f"No input specified. Auto-detected corpus directory at: {found_dir}")
        else:
            parser.error("Please specify --input-dir <path> or --file <path>.")

    start_time = time.time()
    pipeline = ETLIngestionPipeline()

    # Handle --reset-db
    if args.reset_db and not args.dry_run:
        logger.warning("Resetting target databases (--reset-db requested)...")
        reset_res = pipeline.reset_databases()
        logger.info(f"Database Reset Status: {reset_res}")

    results: List[Dict[str, Any]] = []

    # Ingest single file
    if args.file:
        file_path = Path(args.file)
        if not file_path.exists():
            logger.error(f"Specified file does not exist: {file_path}")
            sys.exit(1)
        res = pipeline.ingest_file(file_path, format_type=args.format, dry_run=args.dry_run)
        results.append(res)

    # Ingest directory
    elif args.input_dir:
        input_dir = Path(args.input_dir)
        if not input_dir.exists() or not input_dir.is_dir():
            logger.error(f"Specified directory does not exist: {input_dir}")
            sys.exit(1)

        supported_exts = {".txt", ".md", ".pdf"}
        files = [f for f in input_dir.iterdir() if f.is_file() and f.suffix.lower() in supported_exts]

        if not files:
            logger.warning(f"No supported legal files (.txt, .md, .pdf) found in {input_dir}")
            sys.exit(0)

        logger.info(f"Found {len(files)} document(s) in {input_dir}. Beginning ingestion...")
        for doc_file in tqdm(sorted(files), desc="Ingesting Documents", unit="doc"):
            try:
                res = pipeline.ingest_file(doc_file, format_type=args.format, dry_run=args.dry_run)
                results.append(res)
            except Exception as e:
                logger.error(f"Failed ingesting {doc_file.name}: {e}")
                results.append({"file": doc_file.name, "status": f"Error: {e}", "chunks_count": 0})

    pipeline.close()
    elapsed = time.time() - start_time
    print_summary_report(results, elapsed, dry_run=args.dry_run)


if __name__ == "__main__":
    main()
