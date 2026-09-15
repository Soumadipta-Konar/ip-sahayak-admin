from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_ask_endpoint_strips_pii():
    payload = {
        "query": "My phone is 9876543210. Is neem patentable?",
        "jurisdiction": "IN"
    }
    response = client.post("/api/v1/ask", json=payload)
    assert response.status_code == 200
    data = response.json()
    
    # Security Test: Ensure phone number was stripped
    assert "[REDACTED_PHONE]" in data["query_processed"]
    assert "9876543210" not in data["query_processed"]
