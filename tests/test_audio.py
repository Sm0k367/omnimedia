import pytest
from fastapi.testclient import TestClient
from services.audio.audio_service import app

client = TestClient(app)

def test_generate_audio():
    response = client.post("/generate", json={
        "prompt": "Test prompt",
        "task_id": "test-task-id",
        "subtask_id": "audio-001",
        "audio_type": "voice",
        "voice_id": "test-voice-id"
    })
    assert response.status_code == 200
    assert response.json()["result"] == "Audio generated successfully"