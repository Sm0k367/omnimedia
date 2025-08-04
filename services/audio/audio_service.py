// Add from elevenlabs import generate, save
@app.post("/generate")
async def generate_audio(request: AudioRequest):
    audio = generate(text=request.prompt, voice=request.voice_id, api_key=os.getenv('ELEVENLABS_API_KEY'))
    save(audio, f"generated_{request.subtask_id}.mp3")
    return {"result": f"Audio saved as generated_{request.subtask_id}.mp3"}
