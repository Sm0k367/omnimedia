import pytest
from fastapi.testclient import TestClient
from services.text.text_service import app

client = TestClient(app)

def test_generate_text():
    response = client.post("/generate", json={
        "prompt": "Test prompt",
        "task_id": "test-task-id",
        "subtask_id": "text-001",
        "max_tokens": 100,
        "temperature": 0.7
    })
    assert response.status_code == 200
    assert response.json()["result"] == "Text generated successfully"