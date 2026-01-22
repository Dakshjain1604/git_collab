"""
Resume Parser Agent - Intelligent Resume Analysis and Structuring
Uses advanced AI to parse, extract, and structure resume information.
"""

from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import json
import logging

logger = logging.getLogger(__name__)

class ContactInfo(BaseModel):
    """Contact information extracted from resume"""
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    linkedin: Optional[str] = None
    portfolio: Optional[str] = None
    location: Optional[str] = None

class ExperienceEntry(BaseModel):
    """Work experience entry"""
    title: str
    company: str
    dates: str
    description_summary: str
    achievements: List[str] = Field(default_factory=list)
    technologies: List[str] = Field(default_factory=list)

class EducationEntry(BaseModel):
    """Education entry"""
    degree: str
    institution: str
    year_or_dates: str
    gpa: Optional[str] = None
    honors: List[str] = Field(default_factory=list)

class ProjectEntry(BaseModel):
    """Project entry"""
    project_name: str
    description: str
    technologies: List[str]
    duration: Optional[str] = None
    url: Optional[str] = None

class StructuredResume(BaseModel):
    """Complete structured resume data"""
    contact_info: ContactInfo
    summary: Optional[str] = None
    experience: List[ExperienceEntry] = Field(default_factory=list)
    education: List[EducationEntry] = Field(default_factory=list)
    projects: List[ProjectEntry] = Field(default_factory=list)
    skills: List[str] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)
    languages: List[str] = Field(default_factory=list)

class ResumeParserAgent:
    """AI Agent for parsing and structuring resume data"""

    def __init__(self, openai_api_key: str):
        self.llm = ChatOpenAI(
            model="gpt-4-turbo-preview",
            temperature=0.1,
            openai_api_key=openai_api_key
        )

        # Define the parsing prompt
        self.parsing_prompt = ChatPromptTemplate.from_template("""
You are an expert Resume Parser AI. Your task is to carefully analyze the provided resume text and extract structured information.

Resume Text:
{resume_text}

Instructions:
1. Extract contact information (name, phone, email, LinkedIn, portfolio, location)
2. Identify and structure work experience with:
   - Job titles and companies
   - Employment dates
   - Key responsibilities and achievements
   - Technologies/tools used
3. Extract education information (degrees, institutions, dates, GPA, honors)
4. Identify projects with descriptions and technologies
5. List technical skills, certifications, and languages
6. Create a professional summary if not present

Be precise and extract only information that is clearly present in the resume.
For dates, use the format as written in the resume.
For skills, extract both explicitly listed skills and infer from experience descriptions.

Output the structured data in the exact JSON format specified.
""")

        self.output_parser = JsonOutputParser(pydantic_object=StructuredResume)

    async def parse_resume(self, resume_text: str) -> StructuredResume:
        """
        Parse resume text and return structured data

        Args:
            resume_text: Raw resume text content

        Returns:
            StructuredResume: Parsed and structured resume data
        """
        try:
            logger.info("Starting resume parsing with AI agent")

            # Create the chain
            chain = self.parsing_prompt | self.llm | self.output_parser

            # Run the parsing
            result = await chain.ainvoke({
                "resume_text": resume_text,
                "format_instructions": self.output_parser.get_format_instructions()
            })

            logger.info("Resume parsing completed successfully")
            return StructuredResume(**result)

        except Exception as e:
            logger.error(f"Error in resume parsing: {e}")
            # Return a basic structure if parsing fails
            return StructuredResume(
                contact_info=ContactInfo(),
                summary="Resume parsing encountered an error. Please review manually.",
                experience=[],
                education=[],
                projects=[],
                skills=[],
                certifications=[],
                languages=[]
            )

    def extract_key_skills(self, structured_resume: StructuredResume) -> List[str]:
        """
        Extract and prioritize key skills from structured resume

        Args:
            structured_resume: Parsed resume data

        Returns:
            List of prioritized skills
        """
        skills = set(structured_resume.skills)

        # Extract skills from experience descriptions
        for exp in structured_resume.experience:
            # Look for common tech keywords in descriptions
            tech_keywords = [
                'python', 'java', 'javascript', 'react', 'node', 'aws', 'docker',
                'kubernetes', 'sql', 'mongodb', 'postgresql', 'git', 'linux',
                'typescript', 'vue', 'angular', 'html', 'css', 'sass', 'webpack',
                'jenkins', 'ci/cd', 'agile', 'scrum', 'machine learning', 'ai'
            ]

            desc_lower = exp.description_summary.lower()
            for tech in tech_keywords:
                if tech in desc_lower and tech not in skills:
                    skills.add(tech.title())

        # Extract from technologies lists
        for exp in structured_resume.experience:
            skills.update(exp.technologies)

        for project in structured_resume.projects:
            skills.update(project.technologies)

        return sorted(list(skills))

    def generate_resume_summary(self, structured_resume: StructuredResume) -> str:
        """
        Generate a professional summary if not present

        Args:
            structured_resume: Parsed resume data

        Returns:
            Professional summary string
        """
        if structured_resume.summary:
            return structured_resume.summary

        # Generate summary from experience and skills
        name = structured_resume.contact_info.name or "Professional"

        # Get most recent experience
        recent_exp = None
        if structured_resume.experience:
            # Sort by end date (assuming recent jobs have later end dates or "Present")
            sorted_exp = sorted(
                structured_resume.experience,
                key=lambda x: x.dates,
                reverse=True
            )
            recent_exp = sorted_exp[0]

        # Get top skills
        top_skills = self.extract_key_skills(structured_resume)[:5]

        if recent_exp and top_skills:
            summary = f"{name} is a {recent_exp.title} with experience at {recent_exp.company}. "
            summary += f"Skilled in {', '.join(top_skills)}. "
            summary += f"Passionate about delivering high-quality solutions and driving business value."
        else:
            summary = f"{name} is a dedicated professional with expertise in {', '.join(top_skills) if top_skills else 'various technologies'}. "
            summary += "Committed to excellence and continuous learning."

        return summary
