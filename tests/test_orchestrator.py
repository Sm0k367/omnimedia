import pytest
from fastapi.testclient import TestClient
from services.orchestrator.orchestrator import app

client = TestClient(app)

def test_generate_media():
    response = client.post("/generate-media", json={
        "prompt": "Test prompt",
        "output_format": "mixed/package",
        "options": {
            "style": ["cinematic"],
            "quality": ["ultra-hd"],
            "policy": ["unrestricted"]
        }
    })
    assert response.status_code == 200
    assert "task_id" in response.json()

def test_task_status():
    response = client.get("/task-status/test-task-id")
    assert response.status_code == 404