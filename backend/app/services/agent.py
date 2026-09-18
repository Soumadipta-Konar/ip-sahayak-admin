from typing import TypedDict, List
from langgraph.graph import StateGraph, END


# Define the state for the LangGraph orchestrator
class AgentState(TypedDict):
    query: str
    jurisdiction: str
    decomposed_queries: List[str]
    vector_results: List[str]
    graph_results: List[str]
    final_answer: str
    citations: List[dict]


# --- Nodes ---


def decompose_query(state: AgentState) -> dict:
    """Decomposes the query into Concept, Factual, and Regulatory."""
    original_query = state["query"]
    
    # In a real implementation, this would call an LLM (e.g. ChatOpenAI).
    # For now, we simulate the LLM decomposing the query into 3 distinct perspectives.
    decomposed = [
        f"Concept: Extract meaning related to {original_query}",
        f"Factual: Exact keywords and sections for {original_query}",
        f"Regulatory: Hierarchical laws applying to {original_query}"
    ]
    return {"decomposed_queries": decomposed}


def retrieve_from_vector_db(state: AgentState) -> dict:
    """Mock node: Retrieves dense vectors from Qdrant."""
    return {"vector_results": ["Section 3(p) of Patents Act bars traditional knowledge."]}


def retrieve_from_graph_db(state: AgentState) -> dict:
    """Retrieves relationships from Neo4j."""
    # Mock Neo4j Cypher query execution
    return {"graph_results": ["Patents Act CITES Biological Diversity Act."]}

def reciprocal_rank_fusion(vector_res: List[str], graph_res: List[str], bm25_res: List[str]) -> List[str]:
    """Applies Reciprocal Rank Fusion (RRF) to deduplicate and rank results."""
    # Mock RRF implementation
    fused_results = list(set(vector_res + graph_res + bm25_res))
    return fused_results

def generate_final_answer(state: AgentState) -> dict:
    """Fuses results and generates the final answer with Guardrails."""
    jurisdiction = state["jurisdiction"]
    v_res = state.get("vector_results", [])
    g_res = state.get("graph_results", [])
    
    # RRF applied here
    final_context = reciprocal_rank_fusion(v_res, g_res, ["BM25 mock result"])
    context_str = " | ".join(final_context)
    
    answer = f"Based on jurisdiction {jurisdiction}, here is the IP triage. Context used: {context_str}."
    citations = [
        {"id": "doc_1", "statute": "Patents Act, 1970", "section": "3(p)", "url": "#"}
    ]
    return {"final_answer": answer, "citations": citations}


# --- Graph Definition ---


workflow = StateGraph(AgentState)

# Add nodes
workflow.add_node("decompose", decompose_query)
workflow.add_node("retrieve_vector", retrieve_from_vector_db)
workflow.add_node("retrieve_graph", retrieve_from_graph_db)
workflow.add_node("generate", generate_final_answer)

# Define edges
workflow.set_entry_point("decompose")
workflow.add_edge("decompose", "retrieve_vector")
workflow.add_edge("retrieve_vector", "retrieve_graph")
workflow.add_edge("retrieve_graph", "generate")
workflow.add_edge("generate", END)

# Compile the graph
app = workflow.compile()


def process_query_via_langgraph(query: str, jurisdiction: str) -> dict:
    """
    Executes the compiled LangGraph workflow.
    """
    initial_state = {
        "query": query,
        "jurisdiction": jurisdiction,
        "decomposed_queries": [],
        "vector_results": [],
        "graph_results": [],
        "final_answer": "",
        "citations": []
    }
    
    # Run the graph
    result = app.invoke(initial_state)
    
    return {
        "answer": result.get("final_answer", "Error generating answer."),
        "citations": result.get("citations", [])
    }
