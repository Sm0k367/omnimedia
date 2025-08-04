import pytest
from fastapi.testclient import TestClient
from services.images.images_service import app

client = TestClient(app)

def test_generate_image():
    response = client.post("/generate", json={
        "prompt": "Test prompt",
        "task_id": "test-task-id",
        "subtask_id": "img-001",
        "style": "photorealistic",
        "resolution": "1024x1024",
        "quality": "hd"
    })
    assert response.status_code == 200
    assert response.json()["result"] == "Image generated successfully"