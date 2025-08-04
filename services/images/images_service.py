// ... existing imports ...
from stability_sdk import client
import stability_sdk.interfaces.gooseai.generation.generation_pb2 as generation
import os

app = FastAPI()

// ... existing model ...

@app.post("/generate")
async def generate_image(request: ImageRequest):
    stability_api = client.StabilityInference(key=os.getenv('STABILITY_API_KEY'))
    responses = stability_api.generate(
        prompt=request.prompt,
        width=int(request.resolution.split('x')[0]),
        height=int(request.resolution.split('x')[1]),
        # Add style, quality params
    )
    for resp in responses:
        for artifact in resp.artifacts:
            if artifact.type == generation.ARTIFACT_IMAGE:
                with open(f"generated_{request.subtask_id}.png", "wb") as f:
                    f.write(artifact.binary)
                return {"task_id": request.task_id, "subtask_id": request.subtask_id, "result": f"Image saved as generated_{request.subtask_id}.png"}
    raise HTTPException(status_code=500, detail="Image generation failed")

// ... existing health ...
