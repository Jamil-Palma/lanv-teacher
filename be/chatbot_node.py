from typing import Dict
from answer_evaluator import AnswerEvaluator

evaluator = AnswerEvaluator(model="mistralai/mixtral-8x7b-instruct-v0.1") 

def chatbot(state: Dict) -> Dict:
    print("----- ingress in chatbot")
    current_step_index = state["current_step_index"]
    user_message = state["messages"][-1]
    user_message_content = user_message["content"] if isinstance(user_message, dict) else user_message.content
    original_question = state["steps"][current_step_index]

    print(f"User message: {user_message_content}") 

    if state["all_steps_completed"]:
        state["messages"].append({"role": "assistant", "content": "You have completed all steps."})
        return state

    is_correct = evaluator.evaluate_answer(original_question, user_message_content, state["steps"][current_step_index])
    print(f"Is correct? {is_correct}")

    if is_correct:
        state["messages"].append({"role": "system", "content": "Correct! Well done."})
        current_step_index += 1
        if current_step_index < len(state["steps"]):
            state["current_step_index"] = current_step_index
            response = state["steps"][current_step_index]
            state["messages"].append({"role": "assistant", "content": response})
        else:
            state["all_steps_completed"] = True
            state["messages"].append({"role": "assistant", "content": "You have completed all steps."})
    else:
        hint = evaluator.get_hint(original_question, user_message_content)
        print(f"Hint: {hint}")
        state["messages"].append({"role": "system", "content": hint})

        study_suggestions = evaluator.get_study_suggestions(original_question, user_message_content)
        state["support_tasks"] += study_suggestions

    state["current_step_index"] = current_step_index
    return state
