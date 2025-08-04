// Add from openai import OpenAI
@app.post("/generate")
async def generate_text(request: TextRequest):
    client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
    response = client.chat.completions.create(model="gpt-4", messages=[{"role": "user", "content": request.prompt}], max_tokens=request.max_tokens, temperature=request.temperature)
    return {"result": response.choices[0].message.content}
