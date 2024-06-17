# conversation_manager.py
import uuid
from typing import Dict
from answer_evaluator import AnswerEvaluator
from graph_manager import GraphManager

class ConversationManager:
    def __init__(self, evaluator: AnswerEvaluator):
        self.graph_manager = GraphManager()
        self.graph = self.graph_manager.get_graph()
        self.evaluator = evaluator
        self.conversations = {}

    def initialize_conversation(self, task: Dict) -> str:
        conversation_id = str(uuid.uuid4())
        self.conversations[conversation_id] = {
            "messages": [],
            "task": task["task"],
            "steps": task["steps"],
            "current_step_index": 0,
            "all_steps_completed": False,
            "summary_task": task["summary_task"],
            "support_tasks": "" 
        }
        self.conversations[conversation_id]["messages"].append({"role": "assistant", "content": task["steps"][0]})
        print(f"Initialized conversation {conversation_id} with task {task['task']}")
        return conversation_id

    def process_query(self, conversation_id: str, input_text: str) -> Dict:
        if conversation_id not in self.conversations:
            raise ValueError("Task not initialized")

        state = self.conversations[conversation_id]
        state["messages"].append({"role": "user", "content": input_text})
        print(f"Processing query for conversation {conversation_id} with state {state}")

        try:
            for event in self.graph.stream(state):
                print(f"Event: {event}")
                for value in event.values():
                    response = value["messages"][-1]["content"]
                    all_steps_completed = value.get("all_steps_completed", False)
                    self.conversations[conversation_id] = value
                    print(f"Updated state for conversation {conversation_id}: {value}")
                    return {
                        "response": response,
                        "success": all_steps_completed,
                        "conversation_id": conversation_id,
                        "current_step_index": value["current_step_index"],
                        "all_steps_completed": all_steps_completed,
                        "support_tasks": value["support_tasks"]
                    }
        except Exception as e:
            print(f"Error: {e}")
            return {
                "response": "An error occurred while processing your request.",
                "success": False,
                "conversation_id": conversation_id,
                "current_step_index": state["current_step_index"],
                "all_steps_completed": state["all_steps_completed"],
                "support_tasks": state["support_tasks"]
            }