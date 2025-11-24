"""
Tests for analyzer module
"""
import pytest
from unittest.mock import patch, MagicMock
from app.analyzer import (
    extract_resume_sections,
    calculate_text_similarity,
    extract_keywords,
    analyze_resume_rule_based,
    parse_ai_analysis,
    extract_score,
    extract_section
)


class TestExtractResumeSections:
    """Test resume section extraction"""
    
    def test_extract_email(self):
        """Test email extraction"""
        text = "Contact: john.doe@example.com"
        sections = extract_resume_sections(text)
        assert sections["email"] == "john.doe@example.com"
    
    def test_extract_phone(self):
        """Test phone number extraction"""
        text = "Phone: 123-456-7890"
        sections = extract_resume_sections(text)
        assert sections["phone"] != ""
    
    def test_extract_skills(self):
        """Test skills section extraction"""
        text = """
        SKILLS
        Python, JavaScript, React, Node.js, MongoDB
        """
        sections = extract_resume_sections(text)
        assert len(sections["skills"]) > 0
        assert "Python" in sections["skills"][0] or any("Python" in s for s in sections["skills"])
    
    def test_extract_experience(self):
        """Test experience section extraction"""
        text = """
        EXPERIENCE
        Software Engineer at Tech Corp (2020-2024)
        - Developed web applications
        """
        sections = extract_resume_sections(text)
        assert len(sections["experience"]) > 0
    
    def test_extract_education(self):
        """Test education section extraction"""
        text = """
        EDUCATION
        Bachelor of Science in Computer Science
        University of Technology (2016-2020)
        """
        sections = extract_resume_sections(text)
        assert len(sections["education"]) > 0
    
    def test_extract_summary(self):
        """Test summary section extraction"""
        text = """
        SUMMARY
        Experienced software engineer with 5 years of experience.
        """
        sections = extract_resume_sections(text)
        assert sections["summary"] != ""


class TestCalculateTextSimilarity:
    """Test text similarity calculation"""
    
    def test_identical_texts(self):
        """Test similarity of identical texts"""
        text = "Python JavaScript React Node.js"
        similarity = calculate_text_similarity(text, text)
        assert similarity > 90  # Should be very high for identical text
    
    def test_similar_texts(self):
        """Test similarity of similar texts"""
        text1 = "Python JavaScript React Node.js MongoDB"
        text2 = "Python JavaScript React Node.js PostgreSQL"
        similarity = calculate_text_similarity(text1, text2)
        assert 50 < similarity < 100
    
    def test_different_texts(self):
        """Test similarity of different texts"""
        text1 = "Python JavaScript React"
        text2 = "Cooking Gardening Painting"
        similarity = calculate_text_similarity(text1, text2)
        assert similarity < 50
    
    def test_empty_texts(self):
        """Test similarity with empty texts"""
        similarity = calculate_text_similarity("", "")
        assert similarity == 0.0


class TestExtractKeywords:
    """Test keyword extraction"""
    
    def test_extract_keywords_basic(self):
        """Test basic keyword extraction"""
        text = "Python JavaScript React Node.js MongoDB PostgreSQL"
        keywords = extract_keywords(text, top_n=5)
        assert len(keywords) > 0
        assert any("python" in kw.lower() for kw in keywords)
    
    def test_extract_keywords_filters_stopwords(self):
        """Test that stopwords are filtered"""
        text = "I am a software engineer with experience in Python and JavaScript"
        keywords = extract_keywords(text, top_n=10)
        assert "i" not in keywords
        assert "am" not in keywords
        assert "a" not in keywords
    
    def test_extract_keywords_empty_text(self):
        """Test keyword extraction with empty text"""
        keywords = extract_keywords("", top_n=10)
        assert keywords == []
    
    def test_extract_keywords_short_text(self):
        """Test keyword extraction with very short text"""
        keywords = extract_keywords("Python", top_n=10)
        assert len(keywords) <= 1


class TestAnalyzeResumeRuleBased:
    """Test rule-based resume analysis"""
    
    @pytest.fixture
    def sample_resume(self):
        """Sample resume text"""
        return """
        John Doe
        Email: john.doe@email.com
        
        SUMMARY
        Experienced software engineer with 5 years of experience.
        
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
        """Sample job description"""
        return """
        We are looking for a Software Engineer with:
        - Python and JavaScript experience
        - React and Node.js skills
        - RESTful API development
        - MongoDB and PostgreSQL knowledge
        - 3+ years of experience
        """
    
    def test_analyze_resume_rule_based_structure(
        self, 
        sample_resume, 
        sample_job_description
    ):
        """Test rule-based analysis returns correct structure"""
        result = analyze_resume_rule_based(sample_resume, sample_job_description)
        
        assert "overall_score" in result
        assert "skills_score" in result
        assert "experience_score" in result
        assert "education_score" in result
        assert "similarity_score" in result
        assert "keyword_match_percentage" in result
        assert "matched_keywords" in result
        assert "missing_keywords" in result
        assert "strengths" in result
        assert "weaknesses" in result
        assert "recommendations" in result
        assert "detailed_analysis" in result
        assert "analysis_type" in result
        assert result["analysis_type"] == "rule_based"
    
    def test_analyze_resume_rule_based_scores(
        self, 
        sample_resume, 
        sample_job_description
    ):
        """Test rule-based analysis scores are in valid range"""
        result = analyze_resume_rule_based(sample_resume, sample_job_description)
        
        assert 0 <= result["overall_score"] <= 100
        assert 0 <= result["skills_score"] <= 100
        assert 0 <= result["experience_score"] <= 100
        assert 0 <= result["education_score"] <= 100
        assert 0 <= result["similarity_score"] <= 100
        assert 0 <= result["keyword_match_percentage"] <= 100
    
    def test_analyze_resume_rule_based_keywords(
        self, 
        sample_resume, 
        sample_job_description
    ):
        """Test keyword matching in rule-based analysis"""
        result = analyze_resume_rule_based(sample_resume, sample_job_description)
        
        assert isinstance(result["matched_keywords"], list)
        assert isinstance(result["missing_keywords"], list)
        assert len(result["matched_keywords"]) + len(result["missing_keywords"]) > 0
    
    def test_analyze_resume_rule_based_recommendations(
        self, 
        sample_resume, 
        sample_job_description
    ):
        """Test that recommendations are provided"""
        result = analyze_resume_rule_based(sample_resume, sample_job_description)
        
        assert isinstance(result["strengths"], list)
        assert isinstance(result["weaknesses"], list)
        assert isinstance(result["recommendations"], list)
        assert len(result["recommendations"]) > 0


class TestParseAIAnalysis:
    """Test AI analysis parsing"""
    
    def test_parse_ai_analysis_structure(self):
        """Test AI analysis parsing returns correct structure"""
        analysis_text = """
        Overall Match Score: 85
        Skills Match: 90
        Experience Relevance: 80
        Education Fit: 85
        
        Strengths:
        - Strong technical skills
        - Relevant experience
        
        Weaknesses:
        - Missing some technologies
        
        Recommendations:
        - Add more skills
        """
        resume_text = "Sample resume"
        job_description = "Sample job description"
        
        result = parse_ai_analysis(analysis_text, resume_text, job_description)
        
        assert "overall_score" in result
        assert "skills_score" in result
        assert "experience_score" in result
        assert "education_score" in result
        assert "strengths" in result
        assert "weaknesses" in result
        assert "recommendations" in result
        assert "analysis_type" in result
        assert result["analysis_type"] == "ai"


class TestExtractScore:
    """Test score extraction utility"""
    
    def test_extract_score_found(self):
        """Test extracting score when found"""
        text = "Overall Score: 85"
        score = extract_score(text, r'score[:\s]*(\d+)', default=70)
        assert score == 85
    
    def test_extract_score_not_found(self):
        """Test extracting score when not found (uses default)"""
        text = "No score here"
        score = extract_score(text, r'score[:\s]*(\d+)', default=70)
        assert score == 70
    
    def test_extract_score_out_of_range(self):
        """Test score is clamped to 0-100"""
        text = "Score: 150"
        score = extract_score(text, r'score[:\s]*(\d+)', default=70)
        assert score == 100
        
        text = "Score: -10"
        score = extract_score(text, r'score[:\s]*(\d+)', default=70)
        assert score == 0


class TestExtractSection:
    """Test section extraction utility"""
    
    def test_extract_section_found(self):
        """Test extracting section when found"""
        text = """
        Strengths:
        - Strong skills
        - Good experience
        """
        result = extract_section(text, r'strengths?[:\s]*\n(.*)', "fallback")
        assert len(result) > 0
    
    def test_extract_section_not_found(self):
        """Test extracting section when not found"""
        text = "No strengths here"
        result = extract_section(text, r'strengths?[:\s]*\n(.*)', "fallback")
        assert result == []

