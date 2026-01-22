"""
Resume Analyzer Agent - Intelligent Resume-Job Matching and Analysis
Provides detailed analysis, scoring, and recommendations for resume-job fit.
"""

from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)

class AnalysisResult(BaseModel):
    """Complete analysis result"""
    overall_score: float = Field(..., ge=0, le=100)
    skills_score: float = Field(..., ge=0, le=100)
    experience_score: float = Field(..., ge=0, le=100)
    education_score: float = Field(..., ge=0, le=100)
    similarity_score: float = Field(..., ge=0, le=100)
    keyword_match_percentage: float = Field(..., ge=0, le=100)

    matched_keywords: List[str] = Field(default_factory=list)
    missing_keywords: List[str] = Field(default_factory=list)
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)

    summary_critique: str
    detailed_analysis: str

    structured_resume: Dict[str, Any] = Field(default_factory=dict)

class ResumeAnalyzerAgent:
    """AI Agent for analyzing resume-job description compatibility"""

    def __init__(self, openai_api_key: str):
        self.llm = ChatOpenAI(
            model="gpt-4-turbo-preview",
            temperature=0.2,
            openai_api_key=openai_api_key
        )

        # Analysis prompt for comprehensive evaluation
        self.analysis_prompt = ChatPromptTemplate.from_template("""
You are an expert Resume Analyst AI. Your task is to provide a comprehensive analysis of how well a candidate's resume matches a specific job description.

Resume Data (JSON):
{resume_data}

Job Description:
{job_description}

Analysis Requirements:
1. **Overall Score (0-100)**: General compatibility rating
2. **Skills Score (0-100)**: Technical skills match
3. **Experience Score (0-100)**: Relevant experience assessment
4. **Education Score (0-100)**: Educational background fit
5. **Similarity Score (0-100)**: Text similarity between resume and JD
6. **Keyword Match %**: Percentage of job requirements found in resume

7. **Matched Keywords**: Skills/experience terms that match job requirements
8. **Missing Keywords**: Important skills/experience not found in resume
9. **Strengths**: What makes this candidate stand out
10. **Weaknesses**: Areas where the candidate falls short
11. **Recommendations**: Specific, actionable improvements

12. **Summary Critique**: 2-3 sentence overall assessment
13. **Detailed Analysis**: Comprehensive feedback (200-300 words)

Scoring Guidelines:
- **90-100**: Exceptional match, highly recommended
- **80-89**: Strong match with minor gaps
- **70-79**: Good match, some improvements needed
- **60-69**: Moderate match, significant improvements needed
- **Below 60**: Poor match, major revisions required

Consider:
- Technical skills alignment
- Years of experience in relevant roles
- Industry/domain experience
- Educational requirements
- Soft skills and cultural fit indicators
- Growth potential and adaptability

Be constructive, specific, and actionable in your feedback.
""")

        self.output_parser = JsonOutputParser(pydantic_object=AnalysisResult)

    async def analyze_resume_job_fit(
        self,
        resume_data: Dict[str, Any],
        job_description: str
    ) -> AnalysisResult:
        """
        Analyze resume against job description

        Args:
            resume_data: Structured resume data
            job_description: Job description text

        Returns:
            AnalysisResult: Comprehensive analysis
        """
        try:
            logger.info("Starting comprehensive resume-job analysis")

            # Convert resume data to readable format
            resume_text = self._format_resume_for_analysis(resume_data)

            # Create analysis chain
            chain = self.analysis_prompt | self.llm | self.output_parser

            # Run analysis
            result = await chain.ainvoke({
                "resume_data": resume_text,
                "job_description": job_description,
                "format_instructions": self.output_parser.get_format_instructions()
            })

            analysis = AnalysisResult(**result)
            analysis.structured_resume = resume_data

            logger.info(f"Analysis completed with overall score: {analysis.overall_score}")
            return analysis

        except Exception as e:
            logger.error(f"Error in resume analysis: {e}")
            # Return basic analysis if AI fails
            return AnalysisResult(
                overall_score=50.0,
                skills_score=50.0,
                experience_score=50.0,
                education_score=50.0,
                similarity_score=50.0,
                keyword_match_percentage=50.0,
                matched_keywords=[],
                missing_keywords=[],
                strengths=["Analysis temporarily unavailable"],
                weaknesses=["Unable to complete detailed analysis"],
                recommendations=["Please try again or contact support"],
                summary_critique="Analysis could not be completed due to technical issues.",
                detailed_analysis="We encountered an error while analyzing your resume. Please ensure your resume is properly formatted and try again.",
                structured_resume=resume_data
            )

    def _format_resume_for_analysis(self, resume_data: Dict[str, Any]) -> str:
        """Format structured resume data for AI analysis"""
        formatted = []

        # Contact info
        contact = resume_data.get('contact_info', {})
        if contact.get('name'):
            formatted.append(f"Name: {contact['name']}")

        # Summary
        if resume_data.get('summary'):
            formatted.append(f"Summary: {resume_data['summary']}")

        # Experience
        if resume_data.get('experience'):
            formatted.append("Experience:")
            for exp in resume_data['experience']:
                formatted.append(f"  - {exp['title']} at {exp['company']} ({exp['dates']})")
                formatted.append(f"    {exp['description_summary']}")
                if exp.get('technologies'):
                    formatted.append(f"    Technologies: {', '.join(exp['technologies'])}")

        # Education
        if resume_data.get('education'):
            formatted.append("Education:")
            for edu in resume_data['education']:
                formatted.append(f"  - {edu['degree']} from {edu['institution']} ({edu['year_or_dates']})")

        # Skills
        if resume_data.get('skills'):
            formatted.append(f"Skills: {', '.join(resume_data['skills'])}")

        # Projects
        if resume_data.get('projects'):
            formatted.append("Projects:")
            for proj in resume_data['projects']:
                formatted.append(f"  - {proj['project_name']}: {proj['description']}")
                if proj.get('technologies'):
                    formatted.append(f"    Technologies: {', '.join(proj['technologies'])}")

        return "\n".join(formatted)

    def calculate_similarity_score(self, resume_text: str, job_text: str) -> float:
        """
        Calculate text similarity between resume and job description
        Basic implementation - can be enhanced with better NLP
        """
        # Simple word overlap calculation
        resume_words = set(resume_text.lower().split())
        job_words = set(job_text.lower().split())

        intersection = resume_words.intersection(job_words)
        union = resume_words.union(job_words)

        if not union:
            return 0.0

        similarity = len(intersection) / len(union)
        return round(similarity * 100, 2)

    async def generate_quick_feedback(
        self,
        analysis_result: AnalysisResult,
        focus_areas: List[str] = None
    ) -> Dict[str, Any]:
        """
        Generate quick, focused feedback on specific areas

        Args:
            analysis_result: Previous analysis result
            focus_areas: Specific areas to focus on (e.g., ['skills', 'experience'])

        Returns:
            Dict with quick feedback
        """
        if not focus_areas:
            focus_areas = ['skills', 'experience', 'education']

        quick_prompt = ChatPromptTemplate.from_template("""
Based on this resume analysis, provide quick, actionable feedback on: {focus_areas}

Analysis Summary:
- Overall Score: {overall_score}/100
- Key Strengths: {strengths}
- Main Weaknesses: {weaknesses}

Provide 2-3 specific, actionable tips for each focus area.
Keep responses concise but helpful.
""")

        try:
            chain = quick_prompt | self.llm

            result = await chain.ainvoke({
                "focus_areas": ", ".join(focus_areas),
                "overall_score": analysis_result.overall_score,
                "strengths": "; ".join(analysis_result.strengths[:3]),
                "weaknesses": "; ".join(analysis_result.weaknesses[:3])
            })

            return {
                "focus_areas": focus_areas,
                "quick_tips": result.content,
                "priority_score": analysis_result.overall_score
            }

        except Exception as e:
            logger.error(f"Error generating quick feedback: {e}")
            return {
                "focus_areas": focus_areas,
                "quick_tips": "Unable to generate quick feedback at this time.",
                "priority_score": analysis_result.overall_score
            }
