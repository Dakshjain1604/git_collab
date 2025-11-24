# Quick Start with Docker

## 🚀 Run Everything with One Command

### Production Mode
```bash
# 1. Create environment files (if needed)
echo "OPENAI_API_KEY=your_key_here" > AI_backend/.env
echo "MONGODB_URL=mongodb://mongodb:27017/resume_analyzer" > Backend/.env

# 2. Start all services (from project root)
docker-compose -f docker/docker-compose.yml up -d --build

# OR from docker folder
cd docker
docker-compose -f docker-compose.yml up -d --build

# 3. Access the application
# Frontend: http://localhost
# Backend: http://localhost:3000
# AI Backend: http://localhost:8000
```

### Development Mode (with hot reload)
```bash
# From project root
docker-compose -f docker/docker-compose.dev.yml up -d --build

# OR from docker folder
cd docker
docker-compose -f docker-compose.dev.yml up -d --build

# Frontend: http://localhost:5173
```

## 📋 Services

| Service | Port | URL |
|---------|------|-----|
| Frontend | 80 (prod) / 5173 (dev) | http://localhost |
| Backend API | 3000 | http://localhost:3000 |
| AI Backend API | 8000 | http://localhost:8000 |
| MongoDB | 27017 | localhost:27017 |

## 🛠️ Common Commands

```bash
# View logs (from project root)
docker-compose -f docker/docker-compose.yml logs -f

# Stop all services
docker-compose -f docker/docker-compose.yml down

# Restart a service
docker-compose -f docker/docker-compose.yml restart ai-backend

# Remove everything (including data)
docker-compose -f docker/docker-compose.yml down -v
```

For detailed documentation, see [DOCKER_SETUP.md](./DOCKER_SETUP.md)

