FROM python:3.9-slim

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Expose ports for all services
EXPOSE 8000 8001 8002 8003 8004

# Default command (can be overridden in docker-compose)
CMD ["python", "start.py"]