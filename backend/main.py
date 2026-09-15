from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(
    title="IP-SAKTI Sahayak Backend",
    description="Multi-Agent LangGraph API for Ayurveda IPR",
    version="1.0.0"
)

class QueryRequest(BaseModel):
    query: str
    jurisdiction: str = "IN"

@app.get("/")
def read_root():
    return {"status": "healthy", "service": "IP-SAKTI API Gateway"}

@app.post("/api/ask")
async def ask_agent(request: QueryRequest):
    # TODO: Connect to LangGraph Router
    # 1. PII Stripping (DPDP)
    # 2. Query Decomposition
    # 3. Hybrid RRF Retrieval
    # 4. Synthesize Answer
    return {
        "query": request.query,
        "jurisdiction": request.jurisdiction,
        "answer": "This is a placeholder response from the IP-SAKTI backend.",
        "citations": []
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
