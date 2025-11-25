## AI Backend

FastAPI service that extracts resume text (PDF/DOCX) and produces heuristic insights for the Node backend.

### Running locally

```bash
cd AI_backend
uv sync
uv run fastapi dev main.py
```

The service exposes:

- `GET /` – health check
- `POST /api/analyze` – multipart endpoint that accepts `resume` (file) and `jdText` (string) and returns summaries, keyword gaps, action items, and a confidence score.

Configure CORS origins with `ALLOWED_ORIGINS` (comma-separated). Default is `http://localhost:3000,http://localhost:5173`.
