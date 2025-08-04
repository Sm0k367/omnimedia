from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any

app = FastAPI()

class AudioRequest(BaseModel):
    prompt: str
    task_id: str
    subtask_id: str
    audio_type: str
    voice_id: str

@app.post("/generate")
async def generate_audio(request: AudioRequest):
    # Simulate audio generation
    return {
        "task_id": request.task_id,
        "subtask_id": request.subtask_id,
        "result": "Audio generated successfully"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}