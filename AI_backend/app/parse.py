from PyPDF2 import PdfReader
from dotenv import load_dotenv
from llama_cloud_services import LlamaParse
import fitz
load_dotenv()
import re
import os

SECTION_HEADERS = [
    "summary", "profile", "objective",
    "skills", "technical skills", 
    "experience", "work experience", "professional experience", 
    "education", "technical_projects", "certifications", "achievements"
]



# api_key=os.getenv("LLAMA_CLOUD_API_KEY")
# parser=LlamaParse(
#     api_key=api_key,
#     num_workers=4,
#     verbose=True,
#     language="en",
# )

# async def llama_docu_parsing(file_location):
#         result = await parser.aparse(file_location)
#         docs = result.get_text_documents(split_by_page=False)
#         # if docs is a list, join text
#         if isinstance(docs, list):
#             text = "\n".join([d.text if hasattr(d, "text") else str(d) for d in docs])
#         else:
#             text = str(docs)
        
#         res=split_into_sections(text)
#         return res

def content_parse(file_path: str):
    """
    Parses a resume PDF into structured sections and clean text.
    Returns both structured dictionary and full text string.
    """

    # 1️⃣ Extract text from PDF properly
    text = ""
    with fitz.open(file_path) as doc:
        for page in doc:
            blocks = page.get_text("blocks")
            blocks.sort(key=lambda b: (b[1], b[0]))  # sort top-bottom, left-right
            for block in blocks:
                text += block[4].strip() + "\n"

    text = text.strip()

    # 2️⃣ Build regex pattern for section detection
    pattern = r'(?i)\b(' + '|'.join(SECTION_HEADERS) + r')\b'
    matches = list(re.finditer(pattern, text))

    sections = {}

    # 3️⃣ Split the text into sections based on the headers found
    for i, match in enumerate(matches):
        start = match.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        header = match.group(0).strip().lower()
        content = text[start:end].strip()

        # 4️⃣ Handle multi-item sections (like Projects or Experience)
        if header in ["projects", "experience", "education"]:
            items = re.split(r'\n(?:[-•\d.)\s]+|\s{2,})', content)
            items = [i.strip() for i in items if len(i.strip()) > 25]
            sections[header] = items if items else [content]
        else:
            sections[header] = content

    # 5️⃣ Return both structured data & full text for LLM use
    return {
        "structured": sections,
        "full_text": text
    }  

