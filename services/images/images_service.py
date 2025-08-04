from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any

app = FastAPI()

class ImageRequest(BaseModel):
    prompt: str
    task_id: str
    subtask_id: str
    style: str
    resolution: str
    quality: str

@app.post("/generate")
async def generate_image(request: ImageRequest):
    # Simulate image generation
    return {
        "task_id": request.task_id,
        "subtask_id": request.subtask_id,
        "result": "Image generated successfully"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}