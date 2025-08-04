# OmniMedia AI Deployment Guide

## Prerequisites

- Python 3.8+
- Docker and Docker Compose (for containerized deployment)
- Kubernetes cluster (for K8s deployment)
- API keys for AI services

## Environment Setup

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Fill in your API keys in the `.env` file:
```bash
# Core Services
OPENAI_API_KEY=your-openai-key
REPLICATE_API_TOKEN=your-replicate-token

# Enhanced Providers
STABILITY_API_KEY=your-stability-key
ELEVENLABS_API_KEY=your-elevenlabs-key
ANTHROPIC_API_KEY=your-anthropic-key
GOOGLE_API_KEY=your-google-key

# Experimental (Private Beta)
RUNWAY_API_KEY=your-runway-key
SUNO_API_KEY=your-suno-key
```

## Deployment Options

### Option 1: Local Development with Python

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Start all services:
```bash
python start.py
```

Services will be available at:
- Orchestrator: http://localhost:8000
- Images: http://localhost:8001
- Videos: http://localhost:8002
- Audio: http://localhost:8003
- Text: http://localhost:8004

### Option 2: Docker Compose (Recommended for Development)

1. Build and start services:
```bash
docker-compose up --build
```

2. For production-like environment:
```bash
docker-compose -f docker-compose.prod.yml up
```

### Option 3: Kubernetes Deployment

1. Create namespace:
```bash
kubectl create namespace omnimedia
```

2. Create secrets:
```bash
kubectl create secret generic omnimedia-secrets \
  --from-literal=OPENAI_API_KEY=your-key \
  --from-literal=REPLICATE_API_TOKEN=your-token \
  --from-literal=STABILITY_API_KEY=your-key \
  --from-literal=ELEVENLABS_API_KEY=your-key \
  --from-literal=ANTHROPIC_API_KEY=your-key \
  --from-literal=GOOGLE_API_KEY=your-key \
  --from-literal=RUNWAY_API_KEY=your-key \
  --from-literal=SUNO_API_KEY=your-key \
  -n omnimedia
```

3. Deploy services:
```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

## Testing the Deployment

### Health Checks

Test each service health endpoint:

```bash
# Orchestrator
curl http://localhost:8000/health

# Images
curl http://localhost:8001/health

# Videos
curl http://localhost:8002/health

# Audio
curl http://localhost:8003/health

# Text
curl http://localhost:8004/health
```

### API Testing

Test media generation:

```bash
curl -X POST http://localhost:8000/generate-media \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A beautiful sunset over mountains",
    "output_format": "mixed/package",
    "options": {
      "style": ["cinematic"],
      "quality": ["hd"]
    }
  }'
```

### Running Tests

```bash
# Install test dependencies
pip install -r requirements-dev.txt

# Run tests
pytest tests/
```

## Monitoring and Logs

### Docker Compose Logs
```bash
docker-compose logs -f [service-name]
```

### Kubernetes Logs
```bash
kubectl logs -f deployment/omnimedia-ai -n omnimedia
```

## Scaling

### Docker Compose Scaling
```bash
docker-compose up --scale images=3 --scale videos=2
```

### Kubernetes Scaling
```bash
kubectl scale deployment omnimedia-ai --replicas=3 -n omnimedia
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 8000-8004 are available
2. **API key errors**: Verify all required API keys are set
3. **Memory issues**: Increase Docker memory limits for AI processing
4. **Network connectivity**: Check firewall settings for external API calls

### Debug Mode

Enable debug logging by setting environment variable:
```bash
export LOG_LEVEL=DEBUG
```

## Production Considerations

1. **Security**: Use secrets management for API keys
2. **Load Balancing**: Configure load balancers for high availability
3. **Monitoring**: Set up application monitoring and alerting
4. **Backup**: Implement backup strategies for persistent data
5. **SSL/TLS**: Configure HTTPS for production deployments