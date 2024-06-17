import os
import re
import json
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from nvidia_client import NvidiaLangChainClient
from answer_evaluator import AnswerEvaluator
from task_manager import TaskManager
from conversation_manager import ConversationManager
import requests
from bs4 import BeautifulSoup

os.environ["LANGCHAIN_TRACING_V2"] = "false"
os.environ["LANGCHAIN_PROJECT"] = ""

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserQuery(BaseModel):
    input_text: str
    conversation_id: str = None
    filename: str = None

tasks_dir = os.path.join(os.path.dirname(__file__), 'tasks')
task_manager = TaskManager(tasks_dir)


model_name = os.getenv("NVIDIA_MODEL", "mistralai/mixtral-8x7b-instruct-v0.1")
nvidia_client = NvidiaLangChainClient(model=model_name)
evaluator = AnswerEvaluator(model=model_name)
conversation_manager = ConversationManager(evaluator)

print(f"Graph nodes: {conversation_manager.graph_manager.get_nodes()}")

@app.post("/query")
async def process_query(query: UserQuery):
    print(f"Received query: {query}")
    try:
        response = conversation_manager.process_query(query.conversation_id, query.input_text)
        if response is None:
            raise HTTPException(status_code=500, detail="Internal server error")
        print(f"Response to be sent: {response}")
        return response
    except ValueError:
        raise HTTPException(status_code=400, detail="Task not initialized")
    except Exception as e:
        print(f"Error: {e}")
        return {
            "response": "An error occurred while processing your request.",
            "success": False,
            "conversation_id": query.conversation_id,
            "current_step_index": None,
            "all_steps_completed": False,
            "support_tasks": ""  
        }

@app.get("/tasks")
async def get_tasks():
    tasks = task_manager.get_tasks()
    print(f"Available tasks: {tasks}")
    return {"tasks": tasks}


@app.get("/task_by_filename/{filename}")
async def get_task_by_filename(filename: str):
    try:
        task_details = task_manager.get_task_by_filename(filename)
        print(f"Task details for filename {filename}: {task_details}")
        return {
            "task": task_details["task"],
            "steps": task_details["steps"],
            "summary_task": task_details["summary_task"]
        }
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Task not found")

@app.post("/initialize_task")
async def initialize_task(query: UserQuery):
    try:
        selected_task = task_manager.get_task_by_filename(query.filename)
        conversation_id = conversation_manager.initialize_conversation(selected_task)
        state = conversation_manager.conversations[conversation_id]
        print(f"Initialized task {selected_task['task']} with conversation ID {conversation_id}")
        return {
            "response": selected_task["steps"][0],
            "success": False,
            "conversation_id": conversation_id,
            "current_step_index": 0,
            "all_steps_completed": False
        }
    except FileNotFoundError:
        raise HTTPException(status_code=400, detail="Invalid task filename")

@app.post("/scraping")
async def process_web(query: UserQuery):
    try:
        page = requests.get(query.input_text)
        soup = BeautifulSoup(page.content, 'html.parser')
        title = soup.title.text
        title = title.replace("-", "").replace(" ", "_")

        article_text = " ".join([p.text for p in soup.find_all('p')])
        prompt = """You are an expert IT instructor. Now I will give you a complete article,
            Read and analyze the article, Then I want you to create a step-by-step guide on \
            how to complete the task described in the article. 

            ## Article Content:
            """ + article_text

        filename = title[:15]
        response = nvidia_client.query(prompt)
        steps = re.findall(r"(Step \d+:.*?)(?=Step \d+:|$)", response, re.DOTALL)
        steps_list = [step.strip() for step in steps]
        save_to_json(os.path.join('tasks', filename), {"steps": steps_list, "task": filename, "summary_task": ""})
        return {"instructions": steps_list[0], "filename": f"{filename}.json"}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while processing the request")
    
@app.post("/summary")
async def process_summary(query: UserQuery):
    try: 
        page = requests.get(query.input_text)
        soup = BeautifulSoup(page.content, 'html.parser')
        title = soup.title.text
        title = title.replace("-", "").replace(" ", "_")

        article_text = " ".join([p.text for p in soup.find_all('p')])
        prompt = """You are an AI language model. Please summarize the following text \
        in no more than one paragraph.

        ## Article Content:
        """ + article_text

        filename = title[:15]
        response = nvidia_client.query(prompt)
        save_to_json(os.path.join('tasks', filename), {"task": filename, "summary_task": response})
        return {"summary": response, "filename": f"{filename}.json"}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while processing the summary")

def save_to_json(filepath: str, data: dict):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    if not os.path.exists(filepath):
        with open(f"{filepath}.json", "w") as file:
            json.dump(data, file, indent=4)
    else:
        with open(f"{filepath}.json", "r") as file:
            existing_data = json.load(file)
            should_update = False
            for key, value in data.items():
                if key not in existing_data:
                    existing_data[key] = value
                    should_update = True
            if should_update:
                with open(f"{filepath}.json", "w") as file:
                    json.dump(existing_data, file, indent=4)
            else:
                print(
                    "File exists and contains the keys to be added. No changes were made.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
