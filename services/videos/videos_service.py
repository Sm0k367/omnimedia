// Add import replicate
@app.post("/generate")
async def generate_video(request: VideoRequest):
    output = replicate.run("stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb472816fd4af51f31453268b24c8331ebde546", input={"prompt": request.prompt, "duration": request.duration})
    return {"result": output}  // Save or return video URL
