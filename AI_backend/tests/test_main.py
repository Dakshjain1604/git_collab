"""
Tests for FastAPI main endpoints
"""
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock, mock_open
import os
import sys
import tempfile
import shutil

# Add parent directory to path to import main
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import the app after setting up test environment
from main import app

client = TestClient(app)


class TestHealthCheck:
    """Test health check endpoint"""
    
    def test_health_check(self):
        """Test health endpoint returns healthy status"""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "timestamp" in data


class TestRootEndpoint:
    """Test root endpoint"""
    
    def test_root_endpoint(self):
        """Test root endpoint returns API information"""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Resume Analyzer API"
        assert data["version"] == "1.0.0"
        assert "endpoints" in data


class TestAnalyzeEndpoint:
    """Test analyze endpoint"""
    
    @pytest.fixture
    def sample_pdf_content(self):
        """Create a mock PDF file content"""
        return b"%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n>>\nendobj\nxref\n0 1\ntrailer\n<<\n/Root 1 0 R\n>>\n%%EOF"
    
    @pytest.fixture
    def sample_resume_text(self):
        """Sample resume text for testing"""
        return """
        John Doe
        Email: john.doe@email.com
        Phone: 123-456-7890
        
        SUMMARY
        Experienced software engineer with 5 years of experience in Python and JavaScript.
        
        SKILLS
        Python, JavaScript, React, Node.js, MongoDB, PostgreSQL
        
        EXPERIENCE
        Software Engineer at Tech Corp (2020-2024)
        - Developed web applications using React and Node.js
        - Implemented RESTful APIs
        
        EDUCATION
        Bachelor of Science in Computer Science
        University of Technology (2016-2020)
        """
    
    @pytest.fixture
    def sample_job_description(self):
        """Sample job description for testing"""
        return """
        We are looking for a Software Engineer with experience in:
        - Python and JavaScript
        - React and Node.js
        - RESTful API development
        - Database management (MongoDB, PostgreSQL)
        
        Requirements:
        - 3+ years of experience
        - Strong problem-solving skills
        - Bachelor's degree in Computer Science
        """
    
    @patch('main.extract_text_from_file')
    @patch('main.analyze_resume_with_ai')
    def test_analyze_resume_success(
        self, 
        mock_analyze, 
        mock_extract,
        sample_pdf_content,
        sample_resume_text,
        sample_job_description
    ):
        """Test successful resume analysis"""
        # Mock the text extraction
        mock_extract.return_value = sample_resume_text
        
        # Mock the analysis result
        mock_analyze.return_value = {
            "overall_score": 85.5,
            "skills_score": 90.0,
            "experience_score": 80.0,
            "education_score": 85.0,
            "similarity_score": 82.5,
            "keyword_match_percentage": 75.0,
            "matched_keywords": ["Python", "JavaScript", "React"],
            "missing_keywords": ["Docker"],
            "strengths": ["Strong technical skills"],
            "weaknesses": ["Missing Docker experience"],
            "recommendations": ["Add Docker to skills"],
            "detailed_analysis": "Test analysis"
        }
        
        # Create a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
            tmp_file.write(sample_pdf_content)
            tmp_file_path = tmp_file.name
        
        try:
            # Make the request
            with open(tmp_file_path, 'rb') as f:
                response = client.post(
                    "/analyze",
                    files={"resume": ("test_resume.pdf", f, "application/pdf")},
                    data={"jdText": sample_job_description}
                )
            
            assert response.status_code == 200
            data = response.json()
            assert data["success"] is True
            assert "analysis" in data
            assert data["analysis"]["overall_score"] == 85.5
            assert "resume_filename" in data["analysis"]
            assert "analysis_date" in data["analysis"]
            assert "file_id" in data["analysis"]
        finally:
            # Cleanup
            if os.path.exists(tmp_file_path):
                os.remove(tmp_file_path)
    
    def test_analyze_missing_job_description(self, sample_pdf_content):
        """Test analyze endpoint with missing job description"""
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
            tmp_file.write(sample_pdf_content)
            tmp_file_path = tmp_file.name
        
        try:
            with open(tmp_file_path, 'rb') as f:
                response = client.post(
                    "/analyze",
                    files={"resume": ("test_resume.pdf", f, "application/pdf")},
                    data={"jdText": ""}
                )
            
            assert response.status_code == 400
            assert "Job description text is required" in response.json()["detail"]
        finally:
            if os.path.exists(tmp_file_path):
                os.remove(tmp_file_path)
    
    def test_analyze_unsupported_file_type(self):
        """Test analyze endpoint with unsupported file type"""
        with tempfile.NamedTemporaryFile(delete=False, suffix='.txt') as tmp_file:
            tmp_file.write(b"Some text content")
            tmp_file_path = tmp_file.name
        
        try:
            with open(tmp_file_path, 'rb') as f:
                response = client.post(
                    "/analyze",
                    files={"resume": ("test.txt", f, "text/plain")},
                    data={"jdText": "Job description"}
                )
            
            assert response.status_code == 400
            assert "Unsupported file type" in response.json()["detail"]
        finally:
            if os.path.exists(tmp_file_path):
                os.remove(tmp_file_path)
    
    @patch('main.extract_text_from_file')
    def test_analyze_insufficient_text(
        self, 
        mock_extract,
        sample_pdf_content,
        sample_job_description
    ):
        """Test analyze endpoint with insufficient text extracted"""
        mock_extract.return_value = "Short text"  # Less than 50 characters
        
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
            tmp_file.write(sample_pdf_content)
            tmp_file_path = tmp_file.name
        
        try:
            with open(tmp_file_path, 'rb') as f:
                response = client.post(
                    "/analyze",
                    files={"resume": ("test_resume.pdf", f, "application/pdf")},
                    data={"jdText": sample_job_description}
                )
            
            assert response.status_code == 400
            assert "Could not extract sufficient text" in response.json()["detail"]
        finally:
            if os.path.exists(tmp_file_path):
                os.remove(tmp_file_path)


class TestUploadFileEndpoint:
    """Test upload file endpoint"""
    
    @patch('main.extract_text_from_file')
    def test_upload_file_success(self, mock_extract):
        """Test successful file upload"""
        mock_extract.return_value = "Sample resume text content for testing purposes"
        
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
            tmp_file.write(b"PDF content")
            tmp_file_path = tmp_file.name
        
        try:
            with open(tmp_file_path, 'rb') as f:
                response = client.post(
                    "/uploadfile",
                    files={"file": ("test.pdf", f, "application/pdf")}
                )
            
            assert response.status_code == 200
            data = response.json()
            assert data["file_uploaded"] is True
            assert data["filename"] == "test.pdf"
            assert data["text_extracted"] is True
            assert data["text_length"] > 0
        finally:
            if os.path.exists(tmp_file_path):
                os.remove(tmp_file_path)

