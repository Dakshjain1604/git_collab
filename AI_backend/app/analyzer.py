import json
import os
from typing import Dict, List, Any
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Assuming you use the official OpenAI library:
from openai import OpenAI, AsyncOpenAI # We will use AsyncOpenAI for better integration

load_dotenv()

api_key=os.getenv("OPENAI_API_KEY")
# --- Pydantic Models for Structured Output ---

class ExperienceEntry(BaseModel):
    title: str = Field(description="The professional title held.")
    company: str = Field(description="The company name.")
    dates: str = Field(description="Start and end dates (e.g., 'Jan 2020 - Dec 2023').")
    description_summary: str = Field(description="A 1-2 sentence summary of key responsibilities/achievements.")

class EducationEntry(BaseModel):
    degree: str = Field(description="Degree or certification name (e.g., 'M.S. Computer Science').")
    institution: str = Field(description="Name of the university or institution.")
    year_or_dates: str = Field(description="Graduation year or dates attended.")

class ProjectEntry(BaseModel):
    project_name: str = Field(description="Name of the personal or academic project.")
    description: str = Field(description="1-2 sentences describing the project and its results.")
    technologies: List[str] = Field(description="Key technologies used.")

class ContactInfo(BaseModel):
    name: str = Field(description="Full name of the candidate.")
    phone: str = Field(description="Primary phone number, including country code if available.")
    email: str = Field(description="Primary professional email address.")
    linkedin: str = Field(default="", description="LinkedIn profile URL or handle.")
    portfolio: str = Field(default="", description="Personal portfolio or GitHub URL.")

class AnalysisSchema(BaseModel):
    """The structured output schema for the LLM."""
    
    # Structured Resume Data
    contact_info: ContactInfo
    summary: str = Field(description="A 2-3 sentence summary/objective from the resume.")
    experience: List[ExperienceEntry]
    education: List[EducationEntry]
    projects: List[ProjectEntry] = Field(description="Personal or academic projects section, if present.")
    skills: List[str] = Field(description="List of core technical and soft skills.")

    # Match Analysis
    scores: Dict[str, float] = Field(description="A dictionary of match scores (overall_score, skills_score, experience_score, keyword_score, education_score).")
    summary_critique: str = Field(description="An executive 3-4 sentence summary of the match between the resume and JD.")
    strengths: List[str] = Field(description="List of 3-5 key strengths of the resume relative to the JD.")
    weaknesses: List[str] = Field(description="List of 3-5 key gaps or areas for improvement relative to the JD.")
    recommendations: List[str] = Field(description="List of 3-5 actionable recommendations to improve the resume.")
    keywords: Dict[str, List[str]] = Field(description="Dictionary containing 'matched_keywords' and 'missing_keywords'.")


# Initialize the OpenAI client (using async for better performance)
# Ensure OPENAI_API_KEY is set in your environment
client = AsyncOpenAI() 

# --- Core Analysis Function (Now ASYNC) ---

async def analyze_resume_with_ai(resume_text: str, job_description: str) -> Dict[str, Any]:
    if not client:
        # ... (return error structure) ...
        pass

    system_prompt = f"""
You are an expert ATS evaluator. Produce a full structured JSON object exactly matching the AnalysisSchema.

IMPORTANT:
- Never output zeros unless the resume truly has no match.
- You MUST compute numeric match scores using the following formulas:

SCORING RULES:
1. skills_score = (matched skills / required skills) * 100
2. experience_score = % of JD responsibilities reflected in past roles
3. education_score:
        100 = exact degree match
        70 = partially related degree
        0 = unrelated
4. keyword_score = (matched_keywords / (matched_keywords + missing_keywords)) * 100
5. overall_score = average(skills_score, experience_score, education_score, keyword_score)

ALL SCORES MUST BE BETWEEN 0–100.

EXAMPLE VALID OUTPUT STRUCTURE:
{{
 "scores": {{
    "overall_score": 82,
    "skills_score": 80,
    "experience_score": 75,
    "education_score": 90,
    "keyword_score": 83
 }}
}}

Now produce the complete JSON for the current resume and job description.

Job Description:
---
{job_description[:4000]}
---

Resume Text:
---
{resume_text[:4000]}
---
"""


    try:
        completion = await client.chat.completions.create(
            model="gpt-4o-mini",
            # FIX: Use the 'response_format' argument instead of 'response_model'
            response_format={"type": "json_object"}, 
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": "Perform the full analysis and return the complete JSON object."}
            ],
            temperature=0.0
        )
        
        # FIX: Manually parse the JSON string response
        json_string = completion.choices[0].message.content
        analysis_data = json.loads(json_string)

        # Optional: Validate against Pydantic model here if needed, but we'll return the dict
        return analysis_data

    except json.JSONDecodeError as e:
        print(f"JSON Parsing Error from LLM: {e}. Raw response: {json_string[:200]}")
        raise Exception("AI failed to return valid JSON output.")
    except Exception as e:
        # ... (Handle other exceptions) ...
        print(f"OpenAI API Error: {e}")
        # ... (return failure structure) ...
        return {
            "success": False,
            "message": f"AI analysis failed due to: {str(e)}",
            "scores": {"overall_score": 0},
            "analysis": {},
            "keywords": {},
            "structured_resume": {}
        }