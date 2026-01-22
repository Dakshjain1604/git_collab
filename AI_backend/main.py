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
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# --- File Parsing Dependencies (Synchronous operations, will be run in thread pool) ---
# NOTE: PyPDF2 is outdated and may not be reliable. I'll use a safer approach for text extraction.
# We will use the `pdfminer.six` approach for better text extraction in a real app, 
# but for simplicity, we'll keep the current synchronous placeholders.
import PyPDF2 
import docx 

# --- Direct Agent Imports ---
try:
    from app.agents.resume_parser_agent import ResumeParserAgent
    from app.agents.resume_analyzer_agent import ResumeAnalyzerAgent
except ImportError as e:
    raise RuntimeError(f"Could not import agents: {e}. Make sure all agent modules are properly installed.")

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
ALLOWED_EXTENSIONS = {'.pdf', '.docx', '.txt'}

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
    elif extension == '.txt':
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()
        except Exception as e:
            logger.error(f"Error reading text file: {e}")
            return ""

    return ""

# --- Health Check Endpoint ---

@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring and Docker health checks."""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "Resume Analyzer AI Backend"
    }

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
            
        # 4. AI Analysis (ASYNCHRONOUS Call - Direct Agent Usage)
        # Initialize workflow with API key from environment
        openai_api_key = os.getenv("OPENAI_API_KEY")
        if not openai_api_key:
            raise HTTPException(
                status_code=500,
                detail="OpenAI API key not configured. Please set OPENAI_API_KEY environment variable."
            )

        # Simplified analysis using direct LangChain calls
        from langchain_core.prompts import ChatPromptTemplate
        from langchain_openai import ChatOpenAI
        from langchain_core.output_parsers import JsonOutputParser
        from pydantic import BaseModel, Field
        from typing import List, Optional

        class StructuredResume(BaseModel):
            contact_info: dict = Field(default_factory=dict)
            summary: Optional[str] = None
            experience: List[dict] = Field(default_factory=list)
            education: List[dict] = Field(default_factory=list)
            skills: List[str] = Field(default_factory=list)

        class AnalysisResult(BaseModel):
            overall_score: int = 75
            skills_score: int = 70
            experience_score: int = 80
            education_score: int = 75
            matched_keywords: List[str] = Field(default_factory=list)
            missing_keywords: List[str] = Field(default_factory=list)
            strengths: List[str] = Field(default_factory=list)
            weaknesses: List[str] = Field(default_factory=list)
            recommendations: List[str] = Field(default_factory=list)
            summary_critique: str = "Good candidate with solid technical background."

        # Initialize LLM
        llm = ChatOpenAI(model="gpt-4-turbo-preview", temperature=0.1, openai_api_key=openai_api_key)

        # Parse resume
        parse_prompt = ChatPromptTemplate.from_template("""
        Extract structured information from this resume text. Return a JSON object with:
        - contact_info: object with name, email, phone if available
        - summary: professional summary
        - experience: array of job objects with title, company, dates, description
        - education: array of education objects with degree, institution, dates
        - skills: array of technical skills

        Resume text:
        {resume_text}

        Return only valid JSON.
        """)

        parse_chain = parse_prompt | llm | JsonOutputParser()
        resume_data = await parse_chain.ainvoke({"resume_text": resume_text})

        # Analyze against job description
        analysis_prompt = ChatPromptTemplate.from_template("""
        Analyze this resume against the job description. Return a JSON object with:
        - overall_score: number 0-100
        - skills_score: number 0-100
        - experience_score: number 0-100
        - education_score: number 0-100
        - matched_keywords: array of keywords that match the JD
        - missing_keywords: array of important keywords missing from resume
        - strengths: array of candidate strengths
        - weaknesses: array of areas for improvement
        - recommendations: array of actionable advice
        - summary_critique: brief overall assessment

        Resume data: {resume_data}
        Job description: {job_description}

        Return only valid JSON.
        """)

        analysis_chain = analysis_prompt | llm | JsonOutputParser()
        analysis_data = await analysis_chain.ainvoke({
            "resume_data": resume_data,
            "job_description": jdText
        })

        analysis_result = {
            "success": True,
            "structured_resume": resume_data,
            "analysis": analysis_data,
            "processing_metadata": {
                "method": "direct_langchain",
                "processing_time": "completed"
            }
        }
        
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
    uvicorn.run(app, host="127.0.0.1", port=8000)
