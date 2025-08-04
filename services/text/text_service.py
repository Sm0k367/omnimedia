from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any

app = FastAPI()

class TextRequest(BaseModel):
    prompt: str
    task_id: str
    subtask_id: str
    max_tokens: int
    temperature: float

@app.post("/generate")
async def generate_text(request: TextRequest):
    # Simulate text generation
    return {
        "task_id": request.task_id,
        "subtask_id": request.subtask_id,
        "result": "Text generated successfully"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}