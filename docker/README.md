# Docker Configuration

This folder contains all Docker-related files for the Resume Analyzer application.

## Files

- `docker-compose.yml` - Production Docker Compose configuration
- `docker-compose.dev.yml` - Development Docker Compose configuration with hot reload
- `Dockerfile.ai-backend` - Production Dockerfile for AI Backend
- `Dockerfile.ai-backend.dev` - Development Dockerfile for AI Backend
- `Dockerfile.backend` - Production Dockerfile for Backend
- `Dockerfile.backend.dev` - Development Dockerfile for Backend
- `Dockerfile.frontend` - Production Dockerfile for Frontend
- `Dockerfile.frontend.dev` - Development Dockerfile for Frontend
- `nginx.conf` - Nginx configuration for frontend production build

## Usage

### Production Mode

From the project root directory:
```bash
cd docker
docker-compose -f docker-compose.yml up -d --build
```

Or from project root:
```bash
docker-compose -f docker/docker-compose.yml up -d --build
```

### Development Mode

From the project root directory:
```bash
cd docker
docker-compose -f docker-compose.dev.yml up -d --build
```

Or from project root:
```bash
docker-compose -f docker/docker-compose.dev.yml up -d --build
```

## Services

- **Frontend**: http://localhost (prod) or http://localhost:5173 (dev)
- **Backend API**: http://localhost:3000
- **AI Backend API**: http://localhost:8000
- **MongoDB**: localhost:27017

## Notes

- All build contexts point to the parent directory (`..`)
- Environment files should be in their respective service directories:
  - `AI_backend/.env`
  - `Backend/.env`
- Volume mounts reference parent directories using `../`

