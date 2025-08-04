import subprocess

services = [
    {"name": "orchestrator", "module": "services.orchestrator.orchestrator", "port": 8000},
    {"name": "images", "module": "services.images.images_service", "port": 8001},
    {"name": "videos", "module": "services.videos.videos_service", "port": 8002},
    {"name": "audio", "module": "services.audio.audio_service", "port": 8003},
    {"name": "text", "module": "services.text.text_service", "port": 8004},
]

processes = []

try:
    for service in services:
        cmd = ["uvicorn", f"{service['module']}:app", "--host", "0.0.0.0", "--port", str(service["port"])]
        processes.append(subprocess.Popen(cmd))
    
    for process in processes:
        process.wait()
except KeyboardInterrupt:
    for process in processes:
        process.terminate()