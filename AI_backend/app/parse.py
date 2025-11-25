from collections import Counter
from io import BytesIO
from typing import List

from PyPDF2 import PdfReader
from docx import Document

SKILL_LIBRARY = {
    "python",
    "javascript",
    "typescript",
    "react",
    "node",
    "express",
    "fastapi",
    "mongodb",
    "sql",
    "aws",
    "gcp",
    "docker",
    "kubernetes",
    "ml",
    "ai",
    "nlp",
    "data analysis",
    "leadership",
    "communication",
}


def _read_pdf(file_bytes: bytes) -> str:
    reader = PdfReader(BytesIO(file_bytes))
    text = []
    for page in reader.pages:
        extracted = page.extract_text() or ""
        text.append(extracted)
    return "\n".join(text)


def _read_docx(file_bytes: bytes) -> str:
    document = Document(BytesIO(file_bytes))
    return "\n".join([para.text for para in document.paragraphs])


def extract_text(file_bytes: bytes, filename: str) -> str:
    lowered = filename.lower()
    if lowered.endswith(".pdf"):
        return _read_pdf(file_bytes)
    if lowered.endswith(".docx"):
        return _read_docx(file_bytes)
    return file_bytes.decode("utf-8", errors="ignore")


def _summarize(text: str, max_sentences: int = 3) -> str:
    sentences = [s.strip() for s in text.split(".") if s.strip()]
    return ". ".join(sentences[:max_sentences])


def _extract_keywords(text: str) -> List[str]:
    words = [word.strip(".,:;()").lower() for word in text.split()]
    return [word for word in words if word in SKILL_LIBRARY]


def _score(resume_keywords: List[str], jd_keywords: List[str]) -> int:
    if not jd_keywords:
        return 50
    resume_set = set(resume_keywords)
    jd_set = set(jd_keywords)
    overlap = resume_set.intersection(jd_set)
    return int((len(overlap) / len(jd_set)) * 100)


def content_Parse(file_bytes: bytes, filename: str, jd_text: str):
    if not jd_text.strip():
        raise ValueError("Job description is required.")

    resume_text = extract_text(file_bytes, filename)
    if not resume_text.strip():
        raise ValueError("Resume could not be parsed. Please upload a PDF or DOCX file.")
    jd_summary = _summarize(jd_text)
    resume_summary = _summarize(resume_text)

    resume_keywords = _extract_keywords(resume_text)
    jd_keywords = _extract_keywords(jd_text)

    keyword_counts = Counter(resume_keywords)
    missing_keywords = [kw for kw in jd_keywords if kw not in keyword_counts]

    score = _score(resume_keywords, jd_keywords)
    action_items = [
        f"Add measurable impact for {kw}" for kw in missing_keywords[:3]
    ]

    insights = (
        f"Resume covers {len(resume_keywords)} core skills. "
        f"Focus on highlighting {', '.join(missing_keywords[:2]) or 'key wins'} "
        "to better match the job description."
    )

    return {
        "resume_summary": resume_summary,
        "jd_summary": jd_summary,
        "score": score,
        "missing_keywords": missing_keywords,
        "recommended_skills": list(keyword_counts.keys())[:5],
        "action_items": action_items,
        "insights": insights,
    }