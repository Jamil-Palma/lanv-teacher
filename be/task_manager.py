import os
import json
from typing import List, Dict

class TaskManager:
    def __init__(self, tasks_dir: str):
        self.tasks_dir = tasks_dir
        self.tasks = self.load_tasks()

    def load_tasks(self) -> List[Dict]:
        tasks = []
        for file_name in os.listdir(self.tasks_dir):
            if file_name.endswith('.json'):
                with open(os.path.join(self.tasks_dir, file_name), 'r') as file:
                    task = json.load(file)
                    task['file_name'] = file_name
                    tasks.append(task)
        return tasks

    def get_tasks(self) -> List[str]:
        self.tasks = self.load_tasks()
        return [task["task"] for task in self.tasks]

    def get_task_details(self, task_index: int) -> Dict:
        self.tasks = self.load_tasks()
        if 0 <= task_index < len(self.tasks):
            return self.tasks[task_index]
        else:
            raise IndexError("Invalid task index")

    def get_task_by_filename(self, file_name: str) -> Dict:
        self.tasks = self.load_tasks()
        for task in self.tasks:
            if task['file_name'] == file_name:
                return task
        raise FileNotFoundError("Task not found")
