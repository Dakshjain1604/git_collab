"""
Web Search Tool - External research capabilities for agents
Provides web search functionality to gather additional context and information.
"""

from duckduckgo_search import DDGS
from typing import List, Dict, Any, Optional
import asyncio
import logging
from urllib.parse import urlparse
import re

logger = logging.getLogger(__name__)

class WebSearchTool:
    """Tool for performing web searches to gather context"""

    def __init__(self, max_results: int = 5):
        self.max_results = max_results
        self.ddgs = DDGS()

    async def search_company_info(self, company_name: str) -> Dict[str, Any]:
        """
        Search for company information and culture

        Args:
            company_name: Name of the company to research

        Returns:
            Dict with company information
        """
        try:
            logger.info(f"Searching for company info: {company_name}")

            queries = [
                f"{company_name} company overview site:linkedin.com OR site:crunchbase.com OR site:company website",
                f"{company_name} company culture reviews site:glassdoor.com OR site:indeed.com",
                f"{company_name} technology stack site:stackshare.io OR site:tech stack"
            ]

            all_results = []
            for query in queries:
                try:
                    results = list(self.ddgs.text(query, max_results=self.max_results // len(queries)))
                    all_results.extend(results)
                except Exception as e:
                    logger.warning(f"Search failed for query '{query}': {e}")
                    continue

            # Process and summarize results
            company_info = {
                "company_name": company_name,
                "overview": self._extract_overview(all_results),
                "culture": self._extract_culture_info(all_results),
                "technology": self._extract_tech_stack(all_results),
                "sources": [r.get('href', '') for r in all_results[:3]]
            }

            return company_info

        except Exception as e:
            logger.error(f"Error searching company info: {e}")
            return {
                "company_name": company_name,
                "overview": "Company information unavailable",
                "culture": "Culture information unavailable",
                "technology": "Technology information unavailable",
                "sources": []
            }

    async def search_job_market_trends(self, job_title: str, location: str = None) -> Dict[str, Any]:
        """
        Search for job market trends and salary information

        Args:
            job_title: Job title to research
            location: Optional location for localized data

        Returns:
            Dict with market trends information
        """
        try:
            logger.info(f"Searching job market trends for: {job_title}")

            location_query = f" in {location}" if location else ""
            queries = [
                f"{job_title} salary range{location_query} 2024 site:levels.fyi OR site:glassdoor.com",
                f"{job_title} skills in demand{location_query} site:linkedin.com OR site:indeed.com",
                f"{job_title} job market trends{location_query} 2024"
            ]

            all_results = []
            for query in queries:
                try:
                    results = list(self.ddgs.text(query, max_results=self.max_results // len(queries)))
                    all_results.extend(results)
                except Exception as e:
                    logger.warning(f"Search failed for query '{query}': {e}")
                    continue

            # Process results
            market_data = {
                "job_title": job_title,
                "location": location,
                "salary_ranges": self._extract_salary_info(all_results),
                "in_demand_skills": self._extract_skills_demand(all_results),
                "market_trends": self._extract_trends(all_results),
                "sources": [r.get('href', '') for r in all_results[:3]]
            }

            return market_data

        except Exception as e:
            logger.error(f"Error searching job market trends: {e}")
            return {
                "job_title": job_title,
                "location": location,
                "salary_ranges": "Information unavailable",
                "in_demand_skills": [],
                "market_trends": "Market trend information unavailable",
                "sources": []
            }

    async def search_skill_requirements(self, job_title: str, industry: str = None) -> List[str]:
        """
        Search for required skills for a specific job role

        Args:
            job_title: Job title to research
            industry: Optional industry context

        Returns:
            List of required skills
        """
        try:
            logger.info(f"Searching skill requirements for: {job_title}")

            industry_query = f" {industry}" if industry else ""
            query = f"{job_title}{industry_query} required skills site:linkedin.com OR site:indeed.com OR site:job descriptions"

            results = list(self.ddgs.text(query, max_results=self.max_results))

            skills = self._extract_skills_from_results(results)

            # Add some common skills based on job title keywords
            base_skills = self._infer_base_skills(job_title)
            skills.extend(base_skills)

            # Remove duplicates and return unique skills
            return list(set(skills))

        except Exception as e:
            logger.error(f"Error searching skill requirements: {e}")
            return self._infer_base_skills(job_title)

    def _extract_overview(self, results: List[Dict]) -> str:
        """Extract company overview from search results"""
        overviews = []
        for result in results:
            body = result.get('body', '').lower()
            if any(keyword in body for keyword in ['company', 'overview', 'about', 'founded']):
                overviews.append(result.get('body', '')[:200])

        return overviews[0] if overviews else "Company overview information not found."

    def _extract_culture_info(self, results: List[Dict]) -> str:
        """Extract company culture information"""
        culture_info = []
        for result in results:
            body = result.get('body', '').lower()
            if any(keyword in body for keyword in ['culture', 'work environment', 'values', 'review']):
                culture_info.append(result.get('body', '')[:150])

        return culture_info[0] if culture_info else "Culture information not available."

    def _extract_tech_stack(self, results: List[Dict]) -> List[str]:
        """Extract technology stack information"""
        tech_stack = []
        tech_keywords = [
            'python', 'java', 'javascript', 'react', 'node.js', 'aws', 'azure', 'gcp',
            'docker', 'kubernetes', 'sql', 'mongodb', 'postgresql', 'redis', 'graphql',
            'typescript', 'vue', 'angular', 'html', 'css', 'sass', 'webpack', 'jenkins'
        ]

        for result in results:
            body = result.get('body', '').lower()
            for tech in tech_keywords:
                if tech in body and tech not in tech_stack:
                    tech_stack.append(tech.title())

        return tech_stack[:10]  # Limit to top 10

    def _extract_salary_info(self, results: List[Dict]) -> str:
        """Extract salary information from results"""
        salaries = []
        for result in results:
            body = result.get('body', '')
            # Look for salary patterns like $50,000, $50k-70k, etc.
            salary_matches = re.findall(r'\$[\d,]+(?:k?)(?:\s*-\s*\$[\d,]+(?:k?))?', body)
            if salary_matches:
                salaries.extend(salary_matches[:2])  # Take first 2 matches

        return ", ".join(salaries[:3]) if salaries else "Salary information not available."

    def _extract_skills_demand(self, results: List[Dict]) -> List[str]:
        """Extract in-demand skills"""
        skills = []
        skill_keywords = [
            'python', 'java', 'javascript', 'react', 'node', 'aws', 'docker', 'kubernetes',
            'sql', 'mongodb', 'machine learning', 'ai', 'cloud', 'devops', 'agile', 'scrum'
        ]

        for result in results:
            body = result.get('body', '').lower()
            for skill in skill_keywords:
                if skill in body and skill not in skills:
                    skills.append(skill.title())

        return skills[:8]

    def _extract_trends(self, results: List[Dict]) -> str:
        """Extract market trend information"""
        trends = []
        for result in results:
            body = result.get('body', '').lower()
            if any(keyword in body for keyword in ['trend', 'growing', 'demand', 'future']):
                trends.append(result.get('body', '')[:100])

        return trends[0] if trends else "Market trend information not available."

    def _extract_skills_from_results(self, results: List[Dict]) -> List[str]:
        """Extract skills from search results"""
        skills = []
        common_skills = [
            'Python', 'Java', 'JavaScript', 'React', 'Node.js', 'AWS', 'Azure', 'Docker',
            'Kubernetes', 'SQL', 'MongoDB', 'PostgreSQL', 'Git', 'Linux', 'REST APIs',
            'GraphQL', 'TypeScript', 'Vue.js', 'Angular', 'HTML', 'CSS', 'Sass',
            'Machine Learning', 'AI', 'Data Science', 'Cloud Computing', 'DevOps'
        ]

        for result in results:
            body = result.get('body', '')
            for skill in common_skills:
                if skill.lower() in body.lower() and skill not in skills:
                    skills.append(skill)

        return skills

    def _infer_base_skills(self, job_title: str) -> List[str]:
        """Infer basic skills based on job title"""
        title_lower = job_title.lower()

        base_skills = []

        # Development roles
        if any(keyword in title_lower for keyword in ['developer', 'engineer', 'programmer']):
            base_skills.extend(['Problem Solving', 'Code Quality', 'Version Control'])

        # Data roles
        if any(keyword in title_lower for keyword in ['data', 'analyst', 'scientist']):
            base_skills.extend(['Data Analysis', 'Statistics', 'SQL'])

        # Management roles
        if any(keyword in title_lower for keyword in ['manager', 'lead', 'director']):
            base_skills.extend(['Leadership', 'Communication', 'Project Management'])

        # Design roles
        if any(keyword in title_lower for keyword in ['design', 'ux', 'ui']):
            base_skills.extend(['User Research', 'Prototyping', 'Design Tools'])

        return base_skills
