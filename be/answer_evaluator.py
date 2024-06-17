from nvidia_client import NvidiaLangChainClient

class AnswerEvaluator:
    def __init__(self, model: str):
        self.client = NvidiaLangChainClient(model=model)

    def evaluate_answer(self, original_question: str, user_answer: str, expected_answer: str) -> bool:

        prompt = (
            "You are an evaluator tasked with determining if a user's response correctly completes a task. "
            "Evaluate the interaction based on the following details:\n"
            f"Original Question: {original_question}\n"
            f"User's Answer: {user_answer}\n"
            f"Expected Answer: {expected_answer}\n\n"
            "Criteria for evaluation:\n"
            "1. If the user's answer matches the expected answer, respond with 'True'.\n"
            "2. If the user indicates they have completed the task, uses the term 'echo' 'done' 'work', or states a positive result, respond with 'True'.\n"
            "3. In all other cases, respond with 'False'.\n"
            "Please reply with 'True' or 'False' only."
        )

        response = self.client.query(prompt)
        print(" ---- response evaluate answer", response)
        return "true" in response.lower()

    def get_hint(self, original_question: str, user_answer: str) -> str:
        prompt = (
            f"The user is working on the following task:\n"
            f"Original Question: {original_question}\n"
            f"User's Answer: {user_answer}\n"
            f"Please provide a hint to help the user complete this step. The hint should be clear and specific to guide the user towards the correct answer."
        )
        response = self.client.query(prompt)
        return response
    
    def get_study_suggestions(self, original_question: str, user_answer: str) -> str:
        prompt = (
            f"The user is working on the following task and has shown difficulty:\n"
            f"Original Question: {original_question}\n"
            f"User's Answer: {user_answer}\n"
            f"Please suggest some topics that the user can study to improve their understanding of this task."
        )
        response = self.client.query(prompt)
        return response
