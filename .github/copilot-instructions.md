# Resume Analyzer - AI Coding Agent Instructions

## Architecture Overview

This is a full-stack **resume analysis application** with three main services deployed via Docker:

- **AI Backend** (`AI_backend/`): FastAPI (Python) service that handles resume parsing and AI-powered analysis using OpenAI's GPT
- **Backend** (`Backend/`): Express.js (Node.js) API server managing user authentication, database operations, and orchestration between frontend and AI backend
- **Frontend** (`Fe/`): React app (Vite) with TailwindCSS for UI, communicates with Backend via REST APIs

**Data Flow**: Frontend → Backend (Express) → AI Backend (FastAPI) → OpenAI + Database (MongoDB)

## Key Technical Patterns

### 1. Async/Await and Stream Handling
- **AI Backend** uses `AsyncOpenAI` and `asyncio` for non-blocking operations (see `app/analyzer.py`)
- **Backend** uses `axios` for cross-service HTTP calls and `FormData` for multipart file uploads
- Frontend uses standard `fetch`/`axios` with async/await patterns

**When adding features**: Always prefer async operations over sync blocking calls, especially for AI/file processing.

### 2. Resume Data Structures (Python ↔ MongoDB Alignment)
The backend carefully mirrors Python Pydantic models in MongoDB schemas:
- `AnalysisSchema` (Python) → `AnalysisHistory` (MongoDB) via `Backend/model/db.js`
- Key nested structures: `ContactInfo`, `ExperienceEntry`, `EducationEntry`, `ProjectEntry`

**When modifying schema**: Update both `AI_backend/app/analyzer.py` (Pydantic) AND `Backend/model/db.js` (Mongoose) simultaneously.

### 3. JWT Token Management
- **Issued by**: Backend's `UserController.js`
- **Validated by**: `AnalysisController.js` via `getUserFromToken()` helper
- **Warning**: Default `JWT_SECRET` is exposed in code; set `JWT_SECRET` environment variable in production
- **Storage**: Frontend stores in `localStorage` via `AuthContext.jsx`

### 4. File Upload Workflow
1. Frontend → POST to `Backend/routes/analysisRoutes.js` with multipart resume
2. Backend stores temporarily in `temp_uploads/`, forwards to AI backend via `FormData`
3. AI Backend extracts text using `app/parse.py` (supports `.pdf`, `.docx`)
4. Analysis result returned to Backend, saved to MongoDB with user context

### 5. Structured AI Output (JSON Extraction)
- **AI Backend** uses Pydantic models with explicit JSON schema constraints
- **Critical**: Prompt enforces `"Your ENTIRE response MUST be a single JSON object. DO NOT include markdown wrappers"`
- Backend validates response before storing in MongoDB

## Testing Patterns

### AI Backend (Python)
```bash
cd AI_backend
pytest --cov=app  # Run all tests with coverage
pytest tests/test_analyzer.py -v  # Test specific module
```
Tests in `tests/conftest.py` provide fixtures for resume/job description samples.

### Backend (Express)
```bash
cd Backend
npm test  # Jest with coverage report
npm test -- --watch  # Watch mode
```
Controllers tested via `tests/*.test.js` using Jest setup in `tests/setup.js`.

### Frontend
```bash
cd Fe
npm run build  # Validate compilation
# Note: Minimal test coverage; manual testing via `npm run dev`
```

## Development Workflows

### Local Development (Without Docker)
1. **AI Backend**: `cd AI_backend && uv run python main.py` (requires Python 3.13+)
2. **Backend**: `cd Backend && npm run dev` (uses nodemon)
3. **Frontend**: `cd Fe && npm run dev` (Vite dev server on port 5173)
4. **Database**: Requires external MongoDB instance or Docker container

### Docker Development
```bash
docker-compose -f docker/docker-compose.dev.yml up -d --build
```
Mounts source directories for hot-reload; includes health checks between services.

## Environment Configuration

### Required Variables
- `OPENAI_API_KEY`: Set in `AI_backend/.env` (loaded via `dotenv`)
- `MONGODB_URL`: Backend uses `mongodb://mongodb:27017/resume_analyzer` in Docker
- `JWT_SECRET`: Backend should set this (currently defaults to insecure placeholder)

All services follow `.env` + `dotenv` pattern; never commit `.env` files.

## Integration Points

### AI Backend ↔ Backend Communication
- **Endpoint**: `http://localhost:8000/analyze` (FastAPI)
- **Request**: Multipart form with resume file + job description text
- **Response**: JSON matching `AnalysisSchema` structure
- **Error Handling**: Backend extracts user context via JWT; AI backend returns detailed validation errors

### Backend ↔ Frontend Communication
- **API Base**: `http://localhost:3000` (Express)
- **Auth**: Bearer token in `Authorization` header (JWT)
- **Routes**: `/user`, `/analysis`, `/jobs` (see `routes/`)
- **CORS**: Configured in `Backend/index.js` (wildcard `*` for development)

### Frontend State Management
- **Auth State**: `AuthContext.jsx` with localStorage persistence
- **Profile**: `ProfileContext.jsx` (placeholder)
- **No Redux/Zustand**: Uses React Context only

## Common Pitfalls to Avoid

1. **Don't mix sync/async**: AI Backend file parsing uses thread pool (`run_in_executor`) for sync PyPDF2; don't convert to direct async
2. **Don't skip schema validation**: Pydantic validation in AI Backend prevents malformed MongoDB documents
3. **Don't hardcode URLs**: All service endpoints use environment variables or Docker DNS
4. **Don't store tokens in cookies without HTTP-only flag**: Currently uses localStorage (acceptable for SPA, but less secure)
5. **Don't modify MongoDB schemas without updating Pydantic models**: Breaking alignment causes validation failures

## File Organization

```
AI_backend/
  app/
    analyzer.py      # OpenAI async calls, structured output
    parse.py         # PDF/DOCX extraction, section parsing
    __init__.py
  tests/              # pytest fixtures and test modules
  pyproject.toml     # Python dependencies (includes test extras)

Backend/
  controller/         # Business logic + AI backend coordination
  routes/             # Express router definitions
  model/db.js        # Mongoose schemas aligned with Python
  index.js           # Express app setup + CORS

Fe/
  src/
    Pages/            # Route components (Auth, Dashboard, Profile)
    Components/       # Reusable UI (NavBar, animated components)
    Context/          # React Context for state
    utils/apiClient.js # Axios instance with auth header injection
```

## Quick Reference: Key Files

- **Resume Analysis Logic**: `AI_backend/app/analyzer.py` (Pydantic schema definition)
- **File Parsing**: `AI_backend/app/parse.py` (PDF text extraction strategies)
- **API Orchestration**: `Backend/controller/AnalysisController.js` (uploadAndAnalyze function)
- **DB Schema**: `Backend/model/db.js` (AnalysisHistory structure)
- **Auth Flow**: `Backend/controller/UserController.js` + `Fe/src/Context/AuthContext.jsx`
- **Docker Setup**: `docker/docker-compose.yml` (service definitions + health checks)

---

**Last Updated**: November 2025  
**For updates**: Review architecture changes in feature branches and align Pydantic ↔ Mongoose schemas.
