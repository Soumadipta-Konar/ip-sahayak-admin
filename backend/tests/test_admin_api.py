import sys
from pathlib import Path
from fastapi.testclient import TestClient

BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.main import app

client = TestClient(app)


def test_health_endpoints():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "IP-SAKTI Ingestion Engine"

    api_health = client.get("/api/health")
    assert api_health.status_code == 200
    hdata = api_health.json()
    assert "database_health" in hdata


def test_corpus_index_endpoint():
    response = client.get("/api/corpus/index")
    assert response.status_code == 200
    data = response.json()
    assert "documents" in data
    assert data["total"] >= 0


def test_ingest_file_dry_run_endpoint():
    req_body = {
        "file_path": "corpus_extracted/patents_act_1970.txt",
        "act_name": "The Patents Act, 1970",
        "doc_id": "in_pat_1970",
        "dry_run": True,
    }
    response = client.post("/api/ingest/file", json=req_body)
    assert response.status_code == 200
    res_data = response.json()
    assert res_data["status"] == "Success"
    assert res_data["data"]["chunks_count"] >= 2


def test_stats_endpoint():
    response = client.get("/api/stats")
    assert response.status_code == 200
    data = response.json()
    assert "total_documents" in data
    assert "total_chunks" in data
    assert "status_breakdown" in data
    # By default, total_chunks must be an integer >= 0 (0 if Qdrant offline)
    assert isinstance(data["total_chunks"], int)


def test_ingest_stream_endpoint():
    req_body = {
        "dir_path": "corpus_extracted",
        "format": "auto",
        "dry_run": True,
    }
    response = client.post("/api/ingest/stream", json=req_body)
    assert response.status_code == 200
    lines = [line.strip() for line in response.text.strip().split("\n") if line.strip()]
    assert len(lines) > 0
    # First line should be start event
    import json
    first_event = json.loads(lines[0])
    assert first_event["type"] == "start"
    # Last line should be complete event
    last_event = json.loads(lines[-1])
    assert last_event["type"] == "complete"
    assert last_event["dry_run"] is True


if __name__ == "__main__":
    print("Testing Admin API Endpoints...")
    test_health_endpoints()
    print("  [PASS] test_health_endpoints")
    test_corpus_index_endpoint()
    print("  [PASS] test_corpus_index_endpoint")
    test_stats_endpoint()
    print("  [PASS] test_stats_endpoint")
    test_ingest_file_dry_run_endpoint()
    print("  [PASS] test_ingest_file_dry_run_endpoint")
    test_ingest_stream_endpoint()
    print("  [PASS] test_ingest_stream_endpoint")
    print("\nALL ADMIN API TESTS PASSED SUCCESSFULLY!")

