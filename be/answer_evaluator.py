from nvidia_client import NvidiaLangChainClient

class AnswerEvaluator:
    def __init__(self, model: str):
        self.client = NvidiaLangChainClient(model=model)

    def evaluate_answer(self, original_question: str, user_answer: str, expected_answer: str) -> bool:
        prompt = (
            f"You are evaluating the following interaction.\n"
            f"Original Question: {original_question}\n"
            f"User's Answer: {user_answer}\n"
            f"Expected Answer: {expected_answer}\n\n"
            f"Please determine if the user's answer is correct. If the user has indicated they have no questions, expressed a positive result, or stated that they have completed the task, respond with 'True'. "
            f"Otherwise, respond with 'False'.\n"
            f"Reply with 'True' or 'False' only."
        )
        response = self.client.query(prompt)
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
