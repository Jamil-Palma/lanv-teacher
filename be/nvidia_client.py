import os
from langchain_nvidia_ai_endpoints import ChatNVIDIA
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate

class NvidiaLangChainClient:
    def __init__(self, model: str):
        """
        Initialize the client with the specific model.
        """
        nvapi_key = os.getenv("NVIDIA_API_KEY")
        model = model or os.getenv("NVIDIA_MODEL")
        if not nvapi_key or not nvapi_key.startswith("nvapi-"):
            raise ValueError(
                "Invalid or missing NVIDIA_API_KEY in the environment.")
        if not model:
            raise ValueError(
                "Model is not specified and no default model found in environment variables.")

        self.llm = ChatNVIDIA(model=model)
        self.prompt_template = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "You are an AI language model. Please respond to the user's queries.",
                ),
                ("user", "{input}"),
            ]
        )

    def query(self, input_text: str):
        """
        Send a query to the NVIDIA model and return the response.
        """
        chain = self.prompt_template | ChatNVIDIA(
            model=self.llm.model) | StrOutputParser()
        response = ""
        for txt in chain.stream({"input": input_text}):
            response += txt
        return response

    def handle_errors(self, function_to_wrap):
        """
        functions for error handling.
        """
        def wrapper(*args, **kwargs):
            try:
                return function_to_wrap(*args, **kwargs)
            except Exception as e:
                print(f"An error occurred: {str(e)}")
                return "An error occurred while processing your request."
        return wrapper
