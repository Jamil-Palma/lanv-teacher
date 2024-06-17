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
            "As an expert assistant, your goal is to guide the user towards the correct understanding "
            "and execution of tasks based on their current response. Your hint should build on what "
            "the user has already understood while steering them towards the correct solution.\n\n"
            f"Original Question: {original_question}\n"
            f"User's Answer: {user_answer}\n"
            "Analyze the user's answer: Identify gaps or misunderstandings in the user's response compared "
            "to the expected answer. Based on this analysis, provide a specific and actionable hint that addresses "
            "these gaps. The hint should encourage critical thinking and promote learning, helping the user "
            "to independently arrive at the correct answer or next steps.\n\n"
            "Hint:"
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
