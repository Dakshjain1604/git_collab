# AI Backend - Resume Analyzer

A comprehensive AI-powered resume analysis tool that matches resumes against job descriptions.

## Features

- **Resume Parsing**: Extracts text from PDF and DOCX files
- **AI-Powered Analysis**: Uses OpenAI GPT for detailed resume analysis (optional)
- **Rule-Based Analysis**: Fallback analysis using TF-IDF and keyword matching
- **Comprehensive Scoring**: 
  - Overall match score
  - Skills match score
  - Experience relevance score
  - Education fit score
  - Keyword match percentage
- **Detailed Feedback**: Provides strengths, weaknesses, and actionable recommendations

## Setup

1. **Install Dependencies**:
   ```bash
   cd AI_backend
   uv sync
   # or
   pip install -r requirements.txt
   ```

2. **Environment Variables**:
   Create a `.env` file in the `AI_backend` directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here  # Optional
   ```

3. **Run the Server**:
   ```bash
   python main.py
   # or
   uvicorn main:app --reload --port 8000
   ```

The API will be available at `http://localhost:8000`

## API Endpoints

### POST `/analyze`
Analyze a resume against a job description.

**Request:**
- `resume`: File (PDF or DOCX)
- `jdText`: String (Job description text)

**Response:**
```json
{
  "success": true,
  "analysis": {
    "overall_score": 85.5,
    "skills_score": 90.0,
    "experience_score": 80.0,
    "education_score": 75.0,
    "similarity_score": 82.3,
    "keyword_match_percentage": 75.0,
    "matched_keywords": ["python", "react", "aws"],
    "missing_keywords": ["docker", "kubernetes"],
    "strengths": ["Strong technical skills", ...],
    "weaknesses": ["Limited cloud experience", ...],
    "recommendations": ["Add cloud certifications", ...],
    "detailed_analysis": "..."
  }
}
```

### POST `/uploadfile`
Legacy endpoint for file upload (backward compatibility).

### GET `/health`
Health check endpoint.

## How It Works

1. **Text Extraction**: Extracts text from uploaded resume (PDF/DOCX)
2. **Section Parsing**: Identifies key sections (skills, experience, education, etc.)
3. **Analysis**: 
   - If OpenAI API key is provided: Uses GPT for comprehensive analysis
   - Otherwise: Uses rule-based analysis with TF-IDF similarity and keyword matching
4. **Scoring**: Calculates multiple scores based on different criteria
5. **Feedback Generation**: Provides actionable insights and recommendations

## Dependencies

- FastAPI: Web framework
- PyMuPDF/PyPDF2: PDF text extraction
- python-docx: DOCX text extraction
- OpenAI: AI-powered analysis (optional)
- scikit-learn: Text similarity calculations
- NLTK: Natural language processing

## Notes

- The system works without OpenAI API key using rule-based analysis
- OpenAI integration provides more detailed and contextual feedback
- All analysis results can be saved to the backend database for history tracking

