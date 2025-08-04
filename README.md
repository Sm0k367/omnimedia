# OmniMedia AI

A cutting-edge AI media generation platform that orchestrates multiple specialized AI agents to create high-quality videos, images, audio, and text content.

## 🚀 Features

- **Multi-Modal Content Generation**: Create videos, images, audio, and text using state-of-the-art AI models
- **Microservices Architecture**: Scalable and maintainable service-oriented design
- **Multiple AI Providers**: Integration with OpenAI, Stability AI, ElevenLabs, Anthropic, and more
- **Flexible Deployment**: Support for Docker, Kubernetes, and direct Python execution
- **RESTful APIs**: Easy-to-use HTTP endpoints for all services
- **Health Monitoring**: Built-in health checks and monitoring capabilities

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Orchestrator  │    │   Image Service │    │  Video Service  │
│    (Port 8000)  │    │   (Port 8001)   │    │   (Port 8002)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
┌─────────────────┐    ┌─────────────────┐
│  Audio Service  │    │   Text Service  │
│   (Port 8003)   │    │   (Port 8004)   │
└─────────────────┘    └─────────────────┘
```

## 🛠️ Quick Start

### Prerequisites

- Python 3.8+
- Docker and Docker Compose (optional)
- API keys for AI services

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/omnimedia-ai.git
cd omnimedia-ai
```

### 2. Environment Setup

```bash
cp .env.example .env
# Edit .env with your API keys
```

### 3. Choose Your Deployment Method

#### Option A: Docker Compose (Recommended)

```bash
docker-compose up --build
```

#### Option B: Local Python

```bash
pip install -r requirements.txt
python start.py
```

#### Option C: Kubernetes

```bash
kubectl apply -f k8s/
```

## 📚 API Documentation

### Orchestrator Service (Port 8000)

#### Generate Media
```bash
POST /generate-media
```

Example request:
```json
{
  "prompt": "A beautiful sunset over mountains",
  "output_format": "mixed/package",
  "options": {
    "style": ["cinematic"],
    "quality": ["hd"]
  }
}
```

#### Check Task Status
```bash
GET /task-status/{task_id}
```

### Individual Services

- **Images** (Port 8001): `/generate` - Generate images
- **Videos** (Port 8002): `/generate` - Generate videos  
- **Audio** (Port 8003): `/generate` - Generate audio
- **Text** (Port 8004): `/generate` - Generate text

All services provide `/health` endpoints for monitoring.

## 🧪 Testing

```bash
# Install test dependencies
pip install -r requirements-dev.txt

# Run tests
pytest tests/

# Test API endpoints
curl http://localhost:8000/health
```

## 🔧 Configuration

Configure services through environment variables:

```bash
# Core AI Services
OPENAI_API_KEY=your-key
REPLICATE_API_TOKEN=your-token
STABILITY_API_KEY=your-key
ELEVENLABS_API_KEY=your-key

# Service Settings
IMAGE_DEFAULT_RESOLUTION=1024x1024
VIDEO_DEFAULT_DURATION=5
AUDIO_DEFAULT_DURATION=30
TEXT_MAX_TOKENS=4000
```

## 📖 Documentation

- [API Reference](docs/api_reference.md)
- [Architecture Guide](docs/architecture.md)
- [Deployment Guide](docs/deployment.md)

## 🚀 Deployment

### Local Development
```bash
python start.py
```

### Docker Production
```bash
docker-compose -f docker-compose.prod.yml up
```

### Kubernetes
```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

## 🔍 Monitoring

Health check endpoints:
- Orchestrator: `http://localhost:8000/health`
- Images: `http://localhost:8001/health`
- Videos: `http://localhost:8002/health`
- Audio: `http://localhost:8003/health`
- Text: `http://localhost:8004/health`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- Create an issue for bug reports
- Join our Discord for community support
- Check the documentation for common solutions

## 🔮 Roadmap

- [ ] Real-time streaming capabilities
- [ ] Advanced workflow orchestration
- [ ] Custom model integration
- [ ] Enhanced monitoring and analytics
- [ ] Multi-tenant support

---

Built with ❤️ for the AI community