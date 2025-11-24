# Docker Setup Guide

This guide explains how to run the Resume Analyzer application using Docker.

**Note**: All Docker-related files are now organized in the `docker/` folder.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)

## Quick Start

### Production Mode

1. **Create environment files** (if not already created):
   ```bash
   # AI Backend
   echo "OPENAI_API_KEY=your_key_here" > AI_backend/.env
   
   # Backend
   echo "MONGODB_URL=mongodb://mongodb:27017/resume_analyzer" > Backend/.env
   ```

2. **Build and start all services**:
   ```bash
   docker-compose -f docker/docker-compose.yml up -d --build
   ```

3. **Access the application**:
   - Frontend: http://localhost
   - Backend API: http://localhost:3000
   - AI Backend API: http://localhost:8000
   - MongoDB: localhost:27017

4. **View logs**:
   ```bash
   docker-compose -f docker/docker-compose.yml logs -f
   ```

5. **Stop all services**:
   ```bash
   docker-compose -f docker/docker-compose.yml down
   ```

### Development Mode (with hot reload)

1. **Start in development mode**:
   ```bash
   docker-compose -f docker/docker-compose.dev.yml up -d --build
   ```

2. **Access the application**:
   - Frontend: http://localhost:5173 (Vite dev server)
   - Backend API: http://localhost:3000
   - AI Backend API: http://localhost:8000

3. **View logs**:
   ```bash
   docker-compose -f docker-compose.dev.yml logs -f
   ```

4. **Stop services**:
   ```bash
   docker-compose -f docker-compose.dev.yml down
   ```

## Services

### 1. MongoDB
- **Port**: 27017
- **Data**: Persisted in Docker volume `mongodb_data`
- **Database**: `resume_analyzer`

### 2. AI Backend (FastAPI)
- **Port**: 8000
- **Health Check**: http://localhost:8000/health
- **API Docs**: http://localhost:8000/docs

### 3. Backend (Express.js)
- **Port**: 3000
- **Health Check**: http://localhost:3000/

### 4. Frontend (React + Nginx)
- **Port**: 80 (production) or 5173 (development)
- **Built with**: Vite
- **Served by**: Nginx (production) or Vite dev server (development)

## Environment Variables

### AI Backend (.env in AI_backend/)
```env
OPENAI_API_KEY=your_openai_api_key_here  # Optional
```

### Backend (.env in Backend/)
```env
MONGODB_URL=mongodb://mongodb:27017/resume_analyzer
NODE_ENV=production  # or development
```

## Docker Commands

### Build services
```bash
# Production (from project root)
docker-compose -f docker/docker-compose.yml build

# Development
docker-compose -f docker/docker-compose.dev.yml build
```

### Start services
```bash
# Production
docker-compose -f docker/docker-compose.yml up -d

# Development
docker-compose -f docker/docker-compose.dev.yml up -d
```

### Stop services
```bash
# Production
docker-compose -f docker/docker-compose.yml down

# Development
docker-compose -f docker/docker-compose.dev.yml down
```

### View logs
```bash
# All services
docker-compose -f docker/docker-compose.yml logs -f

# Specific service
docker-compose -f docker/docker-compose.yml logs -f ai-backend
docker-compose -f docker/docker-compose.yml logs -f backend
docker-compose -f docker/docker-compose.yml logs -f frontend
docker-compose -f docker/docker-compose.yml logs -f mongodb
```

### Restart a service
```bash
docker-compose -f docker/docker-compose.yml restart ai-backend
```

### Execute commands in a container
```bash
# AI Backend
docker-compose -f docker/docker-compose.yml exec ai-backend bash

# Backend
docker-compose -f docker/docker-compose.yml exec backend sh

# Frontend
docker-compose -f docker/docker-compose.yml exec frontend sh
```

### Remove everything (including volumes)
```bash
docker-compose -f docker/docker-compose.yml down -v
```

## Troubleshooting

### Port already in use
If a port is already in use, you can modify the port mappings in `docker/docker-compose.yml`:
```yaml
ports:
  - "8001:8000"  # Change host port from 8000 to 8001
```

### MongoDB connection issues
Ensure MongoDB container is healthy:
```bash
docker-compose -f docker/docker-compose.yml ps
docker-compose -f docker/docker-compose.yml logs mongodb
```

### Build failures
1. Clear Docker cache:
   ```bash
   docker-compose -f docker/docker-compose.yml build --no-cache
   ```

2. Remove old images:
   ```bash
   docker system prune -a
   ```

### Environment variables not loading
Ensure `.env` files exist in:
- `AI_backend/.env`
- `Backend/.env`

### Frontend can't connect to backend
In development mode, update frontend environment variables or use the service names:
- Backend: `http://backend:3000` (internal) or `http://localhost:3000` (external)
- AI Backend: `http://ai-backend:8000` (internal) or `http://localhost:8000` (external)

## Production Deployment

For production deployment:

1. **Update CORS settings** in `AI_backend/main.py`:
   ```python
   allow_origins=["http://your-domain.com"]
   ```

2. **Use environment-specific configs**:
   - Create `.env.production` files
   - Use Docker secrets for sensitive data

3. **Enable HTTPS**:
   - Add nginx reverse proxy with SSL
   - Update frontend to use HTTPS

4. **Resource limits**:
   Add to `docker-compose.yml`:
   ```yaml
   services:
     ai-backend:
       deploy:
         resources:
           limits:
             cpus: '2'
             memory: 2G
   ```

## Data Persistence

MongoDB data is persisted in Docker volumes:
- Production: `mongodb_data`
- Development: `mongodb_data_dev`

To backup:
```bash
docker-compose exec mongodb mongodump --out /data/backup
```

To restore:
```bash
docker-compose exec mongodb mongorestore /data/backup
```

## Network

All services communicate through the `resume-analyzer-network` bridge network. Services can reach each other using their service names:
- `mongodb`
- `ai-backend`
- `backend`
- `frontend`

