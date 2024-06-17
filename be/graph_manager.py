from langgraph.graph import StateGraph
from langgraph.graph.message import add_messages
from typing import Annotated, List, Dict, TypedDict
from chatbot_node import chatbot

class Task(TypedDict):
    messages: Annotated[List[Dict[str, str]], add_messages]
    task: str
    steps: List[str]
    current_step_index: int
    all_steps_completed: bool
    summary_task: str

class GraphManager:
    def __init__(self):
        self.graph_builder = StateGraph(Task)
        self._initialize_graph()
        self.graph = self.graph_builder.compile()
    
    def _initialize_graph(self):
        self.graph_builder.add_node("chatbot", chatbot)
        self.graph_builder.set_entry_point("chatbot")
        self.graph_builder.set_finish_point("chatbot")

    def get_graph(self):
        return self.graph

    def get_nodes(self):
        return self.graph.nodes

# Ejemplo de uso
if __name__ == "__main__":
    graph_manager = GraphManager()
    print(f"Graph nodes: {graph_manager.get_nodes()}")  # Verificar nodos en el grafo
