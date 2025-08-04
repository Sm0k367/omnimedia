from fastapi import FastAPI
app = FastAPI()
from services.orchestrator.orchestrator import app as orch_app
app.mount("/orchestrator", orch_app)
# Similarly mount others: /images, /videos, etc.
