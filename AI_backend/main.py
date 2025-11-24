"""
FastAPI Resume Analyzer API
Main application module - Refactored for ASYNC performance and proper cleanup.
"""
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated, Any, Dict
import os
import uuid
import logging
import io
import asyncio # Import asyncio
from datetime import datetime
from pathlib import Path

# --- File Parsing Dependencies (Synchronous operations, will be run in thread pool) ---
# NOTE: PyPDF2 is outdated and may not be reliable. I'll use a safer approach for text extraction.
# We will use the `pdfminer.six` approach for better text extraction in a real app, 
# but for simplicity, we'll keep the current synchronous placeholders.
import PyPDF2 
import docx 

# --- Import the ASYNC AI Logic ---
try:
    from app.analyzer import analyze_resume_with_ai 
except ImportError as e:
    raise RuntimeError("Could not import analyze_resume_with_ai. Make sure analyzer.py is updated and in the path.") from e

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Resume Analyzer API",
    version="1.0.0",
    description="AI-powered resume analysis"
)

# CORS middleware
# IMPORTANT: Use environment variables for production allow_origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
UPLOAD_DIR = "Uploaded_files"
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_EXTENSIONS = {'.pdf', '.docx'}

# Ensure the upload directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

# --- Synchronous File Text Extraction Functions (Will be run in a separate thread) ---

def extract_text_from_pdf(file_path: str) -> str:
    """Extracts text from a PDF file."""
    try:
        with open(file_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            text = ""
            for page in reader.pages:
                text += page.extract_text() or ""
            return text
    except Exception as e:
        logger.error(f"Error extracting text from PDF: {e}")
        return ""

def extract_text_from_docx(file_path: str) -> str:
    """Extracts text from a DOCX file."""
    try:
        document = docx.Document(file_path)
        text = "\n".join([p.text for p in document.paragraphs])
        return text
    except Exception as e:
        logger.error(f"Error extracting text from DOCX: {e}")
        return ""

def extract_text_from_file(file_path: str) -> str:
    """Extracts text based on file extension."""
    extension = Path(file_path).suffix.lower()
    
    if extension == '.pdf':
        return extract_text_from_pdf(file_path)
    elif extension == '.docx':
        return extract_text_from_docx(file_path)
    
    return ""

# --- API Endpoint ---

@app.post("/analyze-resume")
async def analyze_resume(
    resume: Annotated[UploadFile, File(description="The resume file (.pdf or .docx)")],
    jdText: Annotated[str, Form(description="The job description text")] = "General career analysis"
) -> Dict[str, Any]:
    """
    Accepts a resume file and job description, performs AI analysis, and returns a structured result.
    """
    # 1. Input Validation
    extension = Path(resume.filename).suffix.lower()
    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported file type. Only {', '.join(ALLOWED_EXTENSIONS)} are supported."
        )

    # 2. Save the file temporarily
    file_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}{extension}")

    try:
        # Save file contents
        contents = await resume.read()
        if len(contents) > MAX_FILE_SIZE:
             raise HTTPException(status_code=400, detail="File size exceeds the 10MB limit.")
        
        with open(file_path, "wb") as f:
            f.write(contents)

        logger.info(f"File saved temporarily to {file_path}")

        # 3. Extract Text (Run synchronously in the thread pool)
        # We must use asyncio.to_thread for synchronous I/O operations in an async endpoint
        resume_text = await asyncio.to_thread(extract_text_from_file, file_path)
        
        if not resume_text or len(resume_text.strip()) < 50:
            raise HTTPException(status_code=400, detail="Could not extract readable text from resume. Please ensure it is not an image-only PDF.")
            
        # 4. AI Analysis (ASYNCHRONOUS Call - non-blocking I/O)
        analysis_result = await analyze_resume_with_ai(resume_text, jdText)
        
        # 5. Return Response
        # The AI result already contains 'success', 'message', 'scores', etc.
        response_data = {
            "success": True,
            "message": "Analysis successful",
            "file_id": file_id,
            "resume_filename": resume.filename,
            "analysis_date": datetime.now().isoformat(),
            **analysis_result # Contains scores, structured_resume, analysis, etc.
        }
        
        # FastAPI will handle the JSON serialization
        return response_data

    except HTTPException:
        # Re-raise standard HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Analysis or File Handling error: {e}", exc_info=True)
        
        # Attempt cleanup on error
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
        except:
            pass
            
        # Return a generic 500 or the detailed error from the AI model
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
    finally:
        # 6. Clean up (Optional but recommended for temporary files)
        # This cleanup is now handled in the except/finally blocks above, 
        # but let's ensure it runs after a success as well.
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                logger.info(f"Cleaned up temporary file: {file_path}")
        except Exception as e:
             logger.warning(f"Failed to clean up file {file_path}: {e}")


if __name__ == "__main__":
    import uvicorn
    # Make sure to run the python server on port 8000 (default for FastAPI)
    uvicorn.run(app, host="0.0.0.0", port=8000)