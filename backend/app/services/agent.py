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
    """Mock node: Decomposes the query into Concept, Factual, and Regulatory."""
    original_query = state["query"]
    # Mock decomposition
    decomposed = [
        f"Concept: {original_query}",
        f"Regulatory: What laws apply to {original_query}?"
    ]
    return {"decomposed_queries": decomposed}


def retrieve_from_vector_db(state: AgentState) -> dict:
    """Mock node: Retrieves dense vectors from Qdrant."""
    return {"vector_results": ["Section 3(p) of Patents Act bars traditional knowledge."]}


def retrieve_from_graph_db(state: AgentState) -> dict:
    """Mock node: Retrieves relationships from Neo4j."""
    return {"graph_results": ["Patents Act CITES Biological Diversity Act."]}


def generate_final_answer(state: AgentState) -> dict:
    """Mock node: Fuses results and generates the final answer."""
    jurisdiction = state["jurisdiction"]
    v_res = " | ".join(state.get("vector_results", []))
    g_res = " | ".join(state.get("graph_results", []))
    
    answer = f"Based on jurisdiction {jurisdiction}, here is the IP triage. Vector data: {v_res}. Graph data: {g_res}."
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
