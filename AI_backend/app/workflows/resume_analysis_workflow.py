"""
Resume Analysis Workflow - Orchestrates multiple AI agents for comprehensive resume analysis
Uses CrewAI to coordinate parser, analyzer, and research agents.
"""

from crewai import Crew, Agent, Task, Process
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from typing import Dict, Any, List
import logging
import asyncio

from ..agents.resume_parser_agent import ResumeParserAgent
from ..agents.resume_analyzer_agent import ResumeAnalyzerAgent
from ..tools.web_search_tool import WebSearchTool

logger = logging.getLogger(__name__)

class ResumeAnalysisWorkflow:
    """Orchestrates the complete resume analysis process using multiple AI agents"""

    def __init__(self, openai_api_key: str):
        self.openai_api_key = openai_api_key
        self.llm = ChatOpenAI(
            model="gpt-4-turbo-preview",
            temperature=0.1,
            openai_api_key=openai_api_key
        )

        # Initialize agents
        self.parser_agent = ResumeParserAgent(openai_api_key)
        self.analyzer_agent = ResumeAnalyzerAgent(openai_api_key)
        self.search_tool = WebSearchTool()

        # Initialize CrewAI agents
        self._setup_crew_agents()

    def _setup_crew_agents(self):
        """Set up CrewAI agents with specific roles"""

        # Resume Parser Agent
        self.resume_parser = Agent(
            role="Senior Resume Analyst & Parser",
            goal="Expertly parse and structure resume information from raw text",
            backstory="""You are a senior HR professional with 15+ years of experience in talent acquisition
            and resume analysis. You excel at extracting structured information from resumes and identifying
            key qualifications, experiences, and skills. You understand both technical and soft skills
            requirements across various industries.""",
            llm=self.llm,
            verbose=True,
            allow_delegation=False
        )

        # Job Market Research Agent
        self.market_researcher = Agent(
            role="Job Market Intelligence Specialist",
            goal="Research current job market trends, salary data, and skill requirements",
            backstory="""You are a market research specialist focused on employment trends, compensation
            data, and skill demand analysis. You have access to various sources including job boards,
            salary databases, and industry reports to provide accurate market intelligence.""",
            llm=self.llm,
            verbose=True,
            allow_delegation=True
        )

        # Resume Enhancement Coach
        self.enhancement_coach = Agent(
            role="Career Development Coach",
            goal="Provide actionable advice for resume improvement and career advancement",
            backstory="""You are an experienced career coach who helps professionals optimize their resumes
            and advance their careers. You understand what employers look for and can provide specific,
            actionable recommendations for resume improvement, skill development, and career progression.""",
            llm=self.llm,
            verbose=True,
            allow_delegation=True
        )

        # Final Analysis Coordinator
        self.analysis_coordinator = Agent(
            role="Senior Talent Assessment Specialist",
            goal="Synthesize all analysis components into comprehensive recommendations",
            backstory="""You are a senior talent assessment specialist who combines multiple data sources
            to provide comprehensive candidate evaluations. You excel at synthesizing information from
            resume analysis, market research, and industry trends to provide actionable insights.""",
            llm=self.llm,
            verbose=True,
            allow_delegation=True
        )

    async def analyze_resume_comprehensive(
        self,
        resume_text: str,
        job_description: str,
        additional_context: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """
        Comprehensive resume analysis using agent orchestration

        Args:
            resume_text: Raw resume text
            job_description: Job description text
            additional_context: Optional additional context (company, location, etc.)

        Returns:
            Dict with comprehensive analysis results
        """
        try:
            logger.info("Starting comprehensive resume analysis workflow")

            # Step 1: Parse and structure the resume
            structured_resume = await self.parser_agent.parse_resume(resume_text)
            resume_dict = structured_resume.model_dump()

            # Step 2: Analyze resume against job description
            analysis_result = await self.analyzer_agent.analyze_resume_job_fit(
                resume_dict, job_description
            )

            # Step 3: Gather market intelligence (if company/location provided)
            market_intelligence = {}
            if additional_context:
                company = additional_context.get('company')
                location = additional_context.get('location')
                job_title = additional_context.get('job_title', 'Software Engineer')

                if company:
                    market_intelligence['company_info'] = await self.search_tool.search_company_info(company)

                market_intelligence['market_trends'] = await self.search_tool.search_job_market_trends(
                    job_title, location
                )

                market_intelligence['required_skills'] = await self.search_tool.search_skill_requirements(
                    job_title, additional_context.get('industry')
                )

            # Step 4: Generate comprehensive recommendations
            recommendations = await self._generate_enhanced_recommendations(
                analysis_result, market_intelligence, additional_context
            )

            # Compile final result
            result = {
                "success": True,
                "structured_resume": resume_dict,
                "analysis": analysis_result.model_dump(),
                "market_intelligence": market_intelligence,
                "recommendations": recommendations,
                "processing_metadata": {
                    "agents_used": ["ResumeParserAgent", "ResumeAnalyzerAgent", "WebSearchTool"],
                    "external_research_performed": bool(market_intelligence),
                    "processing_time": "completed"
                }
            }

            logger.info("Comprehensive analysis workflow completed successfully")
            return result

        except Exception as e:
            logger.error(f"Error in comprehensive analysis workflow: {e}")
            return {
                "success": False,
                "error": str(e),
                "structured_resume": {},
                "analysis": {},
                "market_intelligence": {},
                "recommendations": []
            }

    async def _generate_enhanced_recommendations(
        self,
        analysis_result,
        market_intelligence: Dict,
        additional_context: Dict = None
    ) -> List[Dict[str, Any]]:
        """
        Generate enhanced recommendations using market intelligence

        Args:
            analysis_result: Base analysis result
            market_intelligence: Market research data
            additional_context: Additional context

        Returns:
            List of enhanced recommendations
        """
        try:
            # Combine existing recommendations with market insights
            enhanced_recommendations = []

            # Add market-driven recommendations
            if market_intelligence.get('required_skills'):
                missing_market_skills = []
                current_skills = set(analysis_result.matched_keywords)

                for skill in market_intelligence['required_skills'][:5]:
                    if skill.lower() not in [s.lower() for s in current_skills]:
                        missing_market_skills.append(skill)

                if missing_market_skills:
                    enhanced_recommendations.append({
                        "category": "market_demand",
                        "priority": "high",
                        "title": "Add High-Demand Skills",
                        "description": f"Consider adding these in-demand skills: {', '.join(missing_market_skills[:3])}",
                        "action_items": [
                            f"Complete online courses for {skill}" for skill in missing_market_skills[:2]
                        ]
                    })

            # Add company-specific recommendations
            if market_intelligence.get('company_info'):
                company_tech = market_intelligence['company_info'].get('technology', [])
                if company_tech:
                    enhanced_recommendations.append({
                        "category": "company_fit",
                        "priority": "medium",
                        "title": "Align with Company Tech Stack",
                        "description": f"Highlight experience with: {', '.join(company_tech[:3])}",
                        "action_items": [
                            "Update resume to emphasize relevant technology experience",
                            "Prepare specific examples using these technologies"
                        ]
                    })

            # Add existing recommendations with enhanced context
            for rec in analysis_result.recommendations[:3]:
                enhanced_recommendations.append({
                    "category": "resume_improvement",
                    "priority": "medium",
                    "title": "Resume Enhancement",
                    "description": rec,
                    "action_items": [rec]
                })

            return enhanced_recommendations[:5]  # Limit to top 5

        except Exception as e:
            logger.error(f"Error generating enhanced recommendations: {e}")
            return analysis_result.recommendations

    async def quick_analysis(
        self,
        resume_text: str,
        job_description: str
    ) -> Dict[str, Any]:
        """
        Quick analysis for immediate feedback

        Args:
            resume_text: Raw resume text
            job_description: Job description text

        Returns:
            Dict with quick analysis results
        """
        try:
            # Quick parse
            structured_resume = await self.parser_agent.parse_resume(resume_text)

            # Quick analysis
            analysis_result = await self.analyzer_agent.analyze_resume_job_fit(
                structured_resume.model_dump(), job_description
            )

            return {
                "success": True,
                "overall_score": analysis_result.overall_score,
                "key_strengths": analysis_result.strengths[:3],
                "key_weaknesses": analysis_result.weaknesses[:3],
                "top_recommendations": analysis_result.recommendations[:3],
                "matched_keywords": analysis_result.matched_keywords[:5]
            }

        except Exception as e:
            logger.error(f"Error in quick analysis: {e}")
            return {
                "success": False,
                "error": str(e),
                "overall_score": 0,
                "key_strengths": [],
                "key_weaknesses": [],
                "top_recommendations": [],
                "matched_keywords": []
            }

    async def analyze_with_crewai(
        self,
        resume_text: str,
        job_description: str,
        company_name: str = None
    ) -> Dict[str, Any]:
        """
        Advanced analysis using CrewAI orchestration

        Args:
            resume_text: Raw resume text
            job_description: Job description text
            company_name: Optional company name for research

        Returns:
            Dict with CrewAI-orchestrated analysis
        """
        try:
            # Define tasks
            parse_resume_task = Task(
                description=f"Parse and structure this resume text: {resume_text[:500]}...",
                agent=self.resume_parser,
                expected_output="Structured resume data in JSON format"
            )

            analyze_fit_task = Task(
                description=f"Analyze resume-job fit for: {job_description[:300]}...",
                agent=self.resume_parser,  # Using parser agent for now, can extend
                expected_output="Detailed compatibility analysis"
            )

            if company_name:
                research_task = Task(
                    description=f"Research company information for {company_name}",
                    agent=self.market_researcher,
                    expected_output="Company overview, culture, and technology stack"
                )

                # Create crew with research
                crew = Crew(
                    agents=[self.resume_parser, self.market_researcher, self.analysis_coordinator],
                    tasks=[parse_resume_task, analyze_fit_task, research_task],
                    verbose=True,
                    process=Process.sequential
                )
            else:
                # Create crew without research
                crew = Crew(
                    agents=[self.resume_parser, self.analysis_coordinator],
                    tasks=[parse_resume_task, analyze_fit_task],
                    verbose=True,
                    process=Process.sequential
                )

            # Run the crew
            result = crew.kickoff()

            return {
                "success": True,
                "crewai_result": str(result),
                "method": "crewai_orchestration"
            }

        except Exception as e:
            logger.error(f"Error in CrewAI analysis: {e}")
            # Fallback to standard analysis
            return await self.analyze_resume_comprehensive(resume_text, job_description)

    async def analyze_resume_simple(
        self,
        resume_text: str,
        job_description: str
    ) -> Dict[str, Any]:
        """
        Simple analysis using individual agents without CrewAI orchestration

        Args:
            resume_text: Raw resume text
            job_description: Job description text

        Returns:
            Dict with analysis results
        """
        try:
            logger.info("Starting simple resume analysis workflow")

            # Step 1: Parse and structure the resume
            structured_resume = await self.parser_agent.parse_resume(resume_text)
            resume_dict = structured_resume.model_dump()

            # Step 2: Analyze resume against job description
            analysis_result = await self.analyzer_agent.analyze_resume_job_fit(
                resume_dict, job_description
            )

            # Compile final result
            result = {
                "success": True,
                "structured_resume": resume_dict,
                "analysis": analysis_result.model_dump(),
                "processing_metadata": {
                    "agents_used": ["ResumeParserAgent", "ResumeAnalyzerAgent"],
                    "processing_time": "completed"
                }
            }

            logger.info("Simple analysis workflow completed successfully")
            return result

        except Exception as e:
            logger.error(f"Error in simple analysis workflow: {e}")
            return {
                "success": False,
                "error": str(e),
                "structured_resume": {},
                "analysis": {},
            }
