from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
import uuid

app = FastAPI()

tasks = {}

class MediaRequest(BaseModel):
    prompt: str
    output_format: str
    options: Dict[str, Any]

class TaskStatus(BaseModel):
    task_id: str
    status: str
    progress: int
    result: Any = None

@app.post("/generate-media")
async def generate_media(request: MediaRequest):
    task_id = str(uuid.uuid4())
    tasks[task_id] = {
        "status": "in-progress",
        "progress": 0,
        "result": None
    }
    # Simulate task processing
    tasks[task_id]["status"] = "completed"
    tasks[task_id]["progress"] = 100
    tasks[task_id]["result"] = "Media generated successfully"
    return {"task_id": task_id}

@app.get("/task-status/{task_id}")
async def task_status(task_id: str):
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    return tasks[task_id]

@app.get("/health")
async def health_check():
    return {"status": "healthy"}