import pytest
from fastapi.testclient import TestClient
from services.videos.videos_service import app

client = TestClient(app)

def test_generate_video():
    response = client.post("/generate", json={
        "prompt": "Test prompt",
        "task_id": "test-task-id",
        "subtask_id": "vid-001",
        "duration": 5,
        "fps": 24,
        "quality": "hd"
    })
    assert response.status_code == 200
    assert response.json()["result"] == "Video generated successfully"