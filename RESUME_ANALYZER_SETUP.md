# Resume Analyzer - Complete Setup Guide

## Overview

A full-stack AI-powered resume analyzer that matches resumes against job descriptions, providing comprehensive scoring, feedback, and recommendations.

## Architecture

### 1. **AI Backend** (FastAPI - Python)
- **Location**: `AI_backend/`
- **Port**: 8000
- **Features**:
  - Resume text extraction (PDF/DOCX)
  - AI-powered analysis using OpenAI GPT (optional)
  - Rule-based analysis using TF-IDF and keyword matching
  - Comprehensive scoring system
  - Detailed feedback generation

### 2. **Backend** (Express.js - Node.js)
- **Location**: `Backend/`
- **Port**: 3000
- **Features**:
  - User authentication
  - Analysis history storage
  - MongoDB integration

### 3. **Frontend** (React + Vite)
- **Location**: `Fe/`
- **Port**: 5173 (default Vite port)
- **Features**:
  - Interactive dashboard
  - Resume upload
  - Job description input
  - Real-time analysis display
  - Score visualization
  - History tracking

## Setup Instructions

### Prerequisites
- Python 3.13+
- Node.js 18+
- MongoDB (local or cloud)
- OpenAI API Key (optional, for enhanced AI analysis)

### Step 1: AI Backend Setup

```bash
cd AI_backend

# Install dependencies using uv (recommended)
uv sync

# OR using pip
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY (optional)

# Run the server
python main.py
# OR
uvicorn main:app --reload --port 8000
```

The AI backend will be available at `http://localhost:8000`

### Step 2: Backend Setup

```bash
cd Backend

# Install dependencies
npm install

# Create .env file (if not exists)
# Add your MongoDB connection string:
# MONGODB_URL=mongodb://localhost:27017/your_database

# Run the server
npm run dev
# OR
node index.js
```

The backend will be available at `http://localhost:3000`

### Step 3: Frontend Setup

```bash
cd Fe

# Install dependencies
npm install

# Run the development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

### AI Backend (Port 8000)

#### POST `/analyze`
Analyze a resume against a job description.

**Request:**
- `resume`: File (PDF or DOCX)
- `jdText`: String (Job description)

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
    "matched_keywords": ["python", "react"],
    "missing_keywords": ["docker"],
    "strengths": ["Strong technical skills"],
    "weaknesses": ["Limited cloud experience"],
    "recommendations": ["Add cloud certifications"],
    "detailed_analysis": "..."
  }
}
```

### Backend (Port 3000)

#### POST `/user/signup`
Create a new user account.

#### POST `/user/signin`
Login and get authentication token.

#### POST `/analysis/save`
Save analysis to history (requires authentication).

#### GET `/analysis/history`
Get user's analysis history (requires authentication).

#### GET `/analysis/:id`
Get specific analysis by ID (requires authentication).

## Usage Flow

1. **User Registration/Login**:
   - Navigate to `/user/signup` or `/user/signin`
   - Create account or login
   - Token is stored in localStorage

2. **Resume Analysis**:
   - Go to Dashboard (`/user/DashBoard`)
   - Enter job description in the text area
   - Upload resume (PDF or DOCX)
   - Click "Analyze"
   - View results:
     - Overall match score
     - Detailed analysis with strengths/weaknesses
     - Recommendations
     - Score breakdown (Skills, Experience, Education)

3. **View History**:
   - Previous analyses appear in the left panel
   - Click on any history item to view details
   - Scores are displayed for quick reference

## Features

### Analysis Capabilities

1. **Overall Match Score**: Weighted average of all factors
2. **Skills Score**: Relevance of skills to job requirements
3. **Experience Score**: How well experience matches the role
4. **Education Score**: Education fit assessment
5. **Keyword Matching**: Percentage of job description keywords found
6. **Similarity Score**: Text similarity using TF-IDF

### Feedback Provided

- **Strengths**: What makes the resume strong
- **Weaknesses**: Areas that need improvement
- **Recommendations**: Actionable steps to improve the resume
- **Matched Keywords**: Keywords from JD found in resume
- **Missing Keywords**: Important keywords not found

### AI vs Rule-Based Analysis

- **With OpenAI API Key**: Uses GPT-3.5 for contextual, detailed analysis
- **Without OpenAI API Key**: Uses rule-based analysis with TF-IDF similarity and keyword matching

Both methods provide comprehensive scoring and feedback.

## Environment Variables

### AI Backend (.env)
```env
OPENAI_API_KEY=your_key_here  # Optional
```

### Backend (.env)
```env
MONGODB_URL=mongodb://localhost:27017/your_database
```

## Troubleshooting

### AI Backend Issues

1. **Import errors**: Make sure all dependencies are installed
   ```bash
   uv sync
   ```

2. **OpenAI errors**: Check your API key in `.env` file
   - System will fallback to rule-based analysis if OpenAI is unavailable

3. **File upload errors**: Ensure file is PDF or DOCX and under 5MB

### Backend Issues

1. **MongoDB connection**: Verify MongoDB is running and connection string is correct

2. **Authentication errors**: Check JWT_SECRET in UserController.js matches

### Frontend Issues

1. **API connection errors**: Verify both backend servers are running
   - AI Backend: `http://localhost:8000`
   - Backend: `http://localhost:3000`

2. **CORS errors**: Backend CORS is configured to allow all origins in development

## File Structure

```
git_collab/
├── AI_backend/
│   ├── app/
│   │   ├── analyzer.py      # AI analysis logic
│   │   └── parse.py         # Resume parsing
│   ├── main.py              # FastAPI application
│   ├── pyproject.toml       # Python dependencies
│   └── Uploaded_files/      # Temporary file storage
├── Backend/
│   ├── controller/
│   │   ├── UserController.js
│   │   └── AnalysisController.js
│   ├── model/
│   │   └── db.js            # MongoDB schemas
│   ├── routes/
│   │   ├── userRoutes.js
│   │   └── analysisRoutes.js
│   └── index.js
└── Fe/
    └── src/
        ├── Pages/
        │   ├── Auth/
        │   ├── Dashboard/
        │   └── Profile/
        └── Components/
```

## Next Steps

1. Add more analysis metrics
2. Export analysis as PDF
3. Compare multiple resumes
4. Job description suggestions
5. Resume improvement tracking over time

## Support

For issues or questions, check:
- AI Backend logs in terminal
- Backend console logs
- Browser console for frontend errors
- Network tab for API call details

