import os
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from app.parse import content_Parse

app = FastAPI(title="DMatch AI Backend", version="1.0.0")

allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173").split(",")

app.add_middleware(
  CORSMiddleware,
  allow_origins=[origin.strip() for origin in allowed_origins],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)


@app.get("/")
async def read_root():
  return {"message": "hello from py backend"}


@app.post("/api/analyze")
async def analyze_resume(
  resume: UploadFile = File(...),
  jdText: str = Form(...)
):
  try:
    file_bytes = await resume.read()
    result = content_Parse(file_bytes, resume.filename, jdText)
    return result
  except ValueError as exc:
    raise HTTPException(status_code=400, detail=str(exc)) from exc
  except Exception as exc:
    raise HTTPException(status_code=500, detail="Unable to analyze resume") from exc