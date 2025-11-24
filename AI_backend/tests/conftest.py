"""
Pytest configuration and fixtures
"""
import pytest
import os
import tempfile
import shutil


@pytest.fixture
def temp_upload_dir():
    """Create a temporary upload directory for tests"""
    temp_dir = tempfile.mkdtemp()
    yield temp_dir
    shutil.rmtree(temp_dir)


@pytest.fixture
def sample_resume_text():
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
def sample_job_description():
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

