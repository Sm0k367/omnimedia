#!/bin/bash

# OmniMedia AI Deployment Script

set -e

echo "🚀 Starting OmniMedia AI Deployment..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Copying from .env.example..."
    cp .env.example .env
    echo "📝 Please edit .env file with your API keys before continuing."
    echo "Press any key to continue after editing .env..."
    read -n 1 -s
fi

# Function to check if port is available
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo "❌ Port $port is already in use"
        return 1
    else
        echo "✅ Port $port is available"
        return 0
    fi
}

# Function to deploy with Docker Compose
deploy_docker() {
    echo "🐳 Deploying with Docker Compose..."
    
    # Check if Docker is running
    if ! docker info > /dev/null 2>&1; then
        echo "❌ Docker is not running. Please start Docker and try again."
        exit 1
    fi
    
    # Build and start services
    docker-compose down 2>/dev/null || true
    docker-compose up --build -d
    
    echo "✅ Docker deployment completed!"
    echo "📊 Services status:"
    docker-compose ps
}

# Function to deploy with Python
deploy_python() {
    echo "🐍 Deploying with Python..."
    
    # Check Python version
    python_version=$(python3 --version 2>&1 | awk '{print $2}' | cut -d. -f1,2)
    required_version="3.8"
    
    if [ "$(printf '%s\n' "$required_version" "$python_version" | sort -V | head -n1)" != "$required_version" ]; then
        echo "❌ Python 3.8+ is required. Current version: $python_version"
        exit 1
    fi
    
    # Check required ports
    for port in 8000 8001 8002 8003 8004; do
        if ! check_port $port; then
            echo "❌ Cannot deploy: Port $port is in use"
            exit 1
        fi
    done
    
    # Install dependencies
    echo "📦 Installing dependencies..."
    pip3 install -r requirements.txt
    
    # Start services
    echo "🚀 Starting services..."
    python3 start.py &
    
    # Wait for services to start
    sleep 5
    
    echo "✅ Python deployment completed!"
}

# Function to run health checks
health_check() {
    echo "🏥 Running health checks..."
    
    services=("8000" "8001" "8002" "8003" "8004")
    service_names=("Orchestrator" "Images" "Videos" "Audio" "Text")
    
    for i in "${!services[@]}"; do
        port=${services[$i]}
        name=${service_names[$i]}
        
        if curl -s http://localhost:$port/health > /dev/null; then
            echo "✅ $name service (port $port): Healthy"
        else
            echo "❌ $name service (port $port): Unhealthy"
        fi
    done
}

# Function to run tests
run_tests() {
    echo "🧪 Running tests..."
    
    # Install test dependencies
    pip3 install -r requirements-dev.txt
    
    # Run tests
    PYTHONPATH=/workspace pytest tests/ -v
    
    if [ $? -eq 0 ]; then
        echo "✅ All tests passed!"
    else
        echo "❌ Some tests failed!"
        exit 1
    fi
}

# Main deployment logic
case "${1:-docker}" in
    "docker")
        deploy_docker
        ;;
    "python")
        deploy_python
        ;;
    "test")
        run_tests
        ;;
    "health")
        health_check
        ;;
    *)
        echo "Usage: $0 [docker|python|test|health]"
        echo "  docker  - Deploy using Docker Compose (default)"
        echo "  python  - Deploy using Python directly"
        echo "  test    - Run test suite"
        echo "  health  - Check service health"
        exit 1
        ;;
esac

echo ""
echo "🎉 OmniMedia AI is ready!"
echo ""
echo "📍 Service URLs:"
echo "   Orchestrator: http://localhost:8000"
echo "   Images:       http://localhost:8001"
echo "   Videos:       http://localhost:8002"
echo "   Audio:        http://localhost:8003"
echo "   Text:         http://localhost:8004"
echo ""
echo "📚 API Documentation: http://localhost:8000/docs"
echo "🏥 Health Check: ./deploy.sh health"
echo "🧪 Run Tests: ./deploy.sh test"