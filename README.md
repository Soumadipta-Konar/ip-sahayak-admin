# IP-SAKTI Sahayak — Admin & Data Ingestion Platform

Admin console and ETL engine for **IP-SAKTI Sahayak**: hierarchical parsing of Indian statutes, dense embeddings into Qdrant, and knowledge-graph triples in Neo4j.

The previous Next.js chat frontend is not part of this tree. The admin UI is a static light-theme console served by FastAPI at `/`.

## What it does

- Registers legal files (`.txt`, `.md`, `.pdf`) in `corpus_index.csv`
- Cleans gazette/PDF text (headers, table of contents, hyphenation)
- Chunks by chapter/section and injects breadcrumbs
- Embeds chunks with `BAAI/bge-small-en-v1.5` (384-d cosine, L2-normalized). The retrieve service must use the same model, dimension, and `normalize_embeddings=True`. Prefix search queries with `Represent this sentence for searching relevant passages: `; do not prefix stored passages.
- Upserts vectors to Qdrant collection `legal_chunks`
- Builds Neo4j triples such as `(:Statute)-[:CONTAINS_SECTION]->(:Section)`
- Optional async ingestion via Celery + Redis

## Architecture

```
┌─────────────────────┐     ┌──────────────────────────────────────┐
│  Admin Console      │     │  FastAPI (uvicorn :8000)             │
│  backend/app/static │────▶│  /  static UI                        │
└─────────────────────┘     │  /api  ingest, upload, preview       │
                            └───────────────┬──────────────────────┘
                                            │
                 ┌──────────────────────────┼──────────────────────────┐
                 ▼                          ▼                          ▼
            Qdrant :6333              Neo4j :7687                 Redis :6379
            (vectors)                 (graph, browser :7474)      (Celery broker)
                 ▲
                 └── Postgres :5432 is started by Compose for later tracking;
                     the current ingestion path does not require it.
```

## Prerequisites

- Python 3.10+ (CI uses 3.11)
- Docker Desktop (Qdrant, Neo4j, Redis, Postgres)
- Optional: Celery worker for `async_mode` ingest jobs

The admin UI starts without Docker. Chunk preview and corpus listing work locally. Writes to Qdrant/Neo4j and Celery need the Compose stack.

## Quick start

### 1. Environment

```bash
cp .env.example .env
```

Fill in secrets if you use LLM enrichment. Database defaults match `docker-compose.yml`.

### 2. Python dependencies

```bash
cd backend
python -m pip install -r requirements.txt
```

For tests and lint:

```bash
python -m pip install -r requirements-test.txt
```

### 3. Databases

Start Docker Desktop, then from the repo root:

```bash
docker compose up -d
```

| Service  | Ports                         | Notes                                      |
|----------|-------------------------------|--------------------------------------------|
| Qdrant   | `6333` (HTTP), `6334` (gRPC)  | Collection `legal_chunks`                  |
| Neo4j    | `7474` (browser), `7687` (Bolt) | Auth `neo4j` / `ipsakti_secret_password` |
| Redis    | `6379`                        | Celery broker and result backend           |
| Postgres | `5432`                        | User `ipsakti_user`, db `ipsakti_db`       |

### 4. Sample corpus (optional)

If `corpus_extracted/` is empty:

```bash
cd backend
python scripts/setup_sample_corpus.py
```

Sample index entries (Patents Act 1970, Biological Diversity Act 2002, Patents Amendment Rules 2024) live in `corpus_index.csv`.

### 5. Admin server

From `backend/`:

```bash
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

- Console: http://127.0.0.1:8000
- Process health: http://127.0.0.1:8000/health
- Dependency health: http://127.0.0.1:8000/api/health
- OpenAPI: http://127.0.0.1:8000/docs

### 6. Celery (optional, async ingest)

With Redis running:

```bash
cd backend
celery -A app.services.etl.tasks.celery_app worker --loglevel=info
```

Then call `POST /api/ingest/file` with `"async_mode": true`.

## CLI ingestion

From `backend/`:

```bash
# Entire corpus (auto-detects ../corpus_extracted if present)
python scripts/ingest_docs.py

# Single file
python scripts/ingest_docs.py --file ../corpus_extracted/patents_act_1970.txt

# Directory, format hint, dry-run (no DB writes)
python scripts/ingest_docs.py --input-dir ../corpus_extracted --format auto --dry-run

# Wipe Qdrant collection and Neo4j graph, then ingest
python scripts/ingest_docs.py --reset-db
```

`--format` is `auto` (default), `txt`, or `pdf`.

## Admin console

The static UI (`backend/app/static/`) can:

- Show corpus rows from `corpus_index.csv`
- Poll Qdrant / Neo4j / Redis health
- Upload `.txt` / `.md` / `.pdf` (year and document type are inferred)
- Dry-run or ingest the full directory
- Inspect chunks, Qdrant payload preview, and Neo4j triple sketch per file

## HTTP API

Routes are mounted at both `/api` and `/api/v1`.

| Method | Path                         | Purpose                                              |
|--------|------------------------------|------------------------------------------------------|
| GET    | `/health`                    | App liveness                                         |
| GET    | `/api/health`                | Qdrant, Neo4j, Redis connectivity                    |
| GET    | `/api/corpus/index`          | Documents from `corpus_index.csv`                    |
| POST   | `/api/upload`                | Multipart file upload; updates the corpus index      |
| POST   | `/api/preview/chunks`        | Hierarchical chunks without writing to databases     |
| POST   | `/api/ingest/file`           | Ingest one file (`async_mode`, `dry_run` supported)  |
| POST   | `/api/ingest/directory`      | Batch ingest a directory                             |
| GET    | `/api/ingest/status/{id}`    | Celery task status                                   |
| POST   | `/api/reset-db`              | Clear Qdrant vectors and Neo4j nodes                 |

Example ingest body:

```json
{
  "file_path": "patents_act_1970.txt",
  "jurisdiction": "IN",
  "document_type": "statute",
  "format": "auto",
  "dry_run": false,
  "async_mode": false
}
```

Paths are resolved against the request path, `corpus_extracted/`, and `../corpus_extracted/`.

## Configuration

Settings load from `.env` in the repo root or `backend/` (`app/core/config.py`).

| Variable        | Default                         | Role                          |
|-----------------|---------------------------------|-------------------------------|
| `QDRANT_URL`    | `http://localhost:6333`         | Vector store                  |
| `NEO4J_URI`     | `bolt://localhost:7687`         | Graph store                   |
| `NEO4J_USER`    | `neo4j`                         | Neo4j user                    |
| `NEO4J_PASS`    | `ipsakti_secret_password`       | Neo4j password                |
| `REDIS_URL`     | `redis://localhost:6379/0`      | Celery broker                 |
| `OPENAI_API_KEY`| empty                           | Optional enrichment           |
| `ENVIRONMENT`   | `development`                   | Shown on health endpoints     |

Do not commit `.env`. Use `.env.example` as the template.

## Tests

```bash
cd backend
pytest tests/ -v
```

Coverage includes chunking, the ETL pipeline, and admin API routes. GitHub Actions runs flake8, Bandit, and pytest on `backend/` (see `.github/workflows/backend-ci.yml`).

## Repository layout

```
.
├── docker-compose.yml          # Qdrant, Neo4j, Redis, Postgres
├── .env.example
├── corpus_extracted/           # Source statutes and gazettes
├── corpus_index.csv            # Registry used by the console
└── backend/
    ├── app/
    │   ├── main.py             # FastAPI app + static mount
    │   ├── api/routes.py       # Admin / ingest API
    │   ├── core/               # Settings, Celery
    │   ├── services/etl/       # Chunker, pipeline, Celery tasks
    │   └── static/             # Admin console (HTML/CSS/JS)
    ├── scripts/
    │   ├── ingest_docs.py
    │   └── setup_sample_corpus.py
    ├── tests/
    └── requirements.txt
```

## Troubleshooting

- **UI loads, databases show offline.** Start Docker Desktop and `docker compose up -d`. Confirm http://localhost:6333 and http://localhost:7474.
- **First ingest is slow.** The embedding model downloads on first use.
- **File not found on ingest.** Place files under `corpus_extracted/` (repo root or `backend/`) or pass an absolute path.
- **Async ingest stays queued.** Redis and a Celery worker must be running.
