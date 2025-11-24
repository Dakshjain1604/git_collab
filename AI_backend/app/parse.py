"""
Resume Parser Module
Extracts and structures content from PDF and DOCX files
"""
from PyPDF2 import PdfReader
from dotenv import load_dotenv
import fitz  # PyMuPDF
import re
import os
import logging 
from typing import Optional, Dict, List

# Optional imports with proper error handling
try:
    from docx import Document as DocxDocument
except ImportError:
    DocxDocument = None
    logging.warning("python-docx not installed. DOCX support disabled.")

try:
    from unstructured.partition.pdf import partition_pdf
    from unstructured.staging.base import elements_to_json
    UNSTRUCTURED_AVAILABLE = True
except ImportError:
    UNSTRUCTURED_AVAILABLE = False
    logging.warning("unstructured library not installed. Advanced parsing disabled.")

try:
    from llama_cloud_services import LlamaParse
    LLAMA_PARSE_AVAILABLE = True
except ImportError:
    LLAMA_PARSE_AVAILABLE = False
    logging.warning("llama_cloud_services not installed. LlamaParse disabled.")

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


SECTION_HEADERS = [
    "summary", "profile", "objective",
    "skills", "technical skills", 
    "experience", "work experience", "professional experience", 
    "education", "projects", "technical projects",  # FIXED: Added "projects"
    "certifications", "achievements"
]

    
def content_parse(file_path: str) -> Dict[str, any]:
    """
    Parses a resume PDF into structured sections and clean text.
    Returns both structured dictionary and full text string.
    
    Args:
        file_path: Path to the PDF file
        
    Returns:
        Dictionary with 'structured' and 'full_text' keys
    """
    # FIXED: Validate file exists
    if not os.path.exists(file_path):
        logger.error(f"File not found: {file_path}")
        return {"structured": {}, "full_text": ""}
    
    # FIXED: Validate file is PDF
    if not file_path.lower().endswith('.pdf'):
        logger.error(f"File is not a PDF: {file_path}")
        return {"structured": {}, "full_text": ""}
    
    text = ""
    try:
        with fitz.open(file_path) as doc:
            for page in doc:
                blocks = page.get_text("blocks")
                blocks.sort(key=lambda b: (b[1], b[0]))  # sort top-bottom, left-right
                for block in blocks:
                    text += block[4].strip() + "\n"
        text = text.strip()
    except Exception as e:
        logger.error(f"Error reading PDF with PyMuPDF: {e}")
        return {"structured": {}, "full_text": ""}

    # FIXED: Handle case when no text extracted
    if not text:
        logger.warning(f"No text extracted from {file_path}")
        return {"structured": {}, "full_text": ""}

    # FIXED: Escape special regex characters in section headers
    escaped_headers = [re.escape(header) for header in SECTION_HEADERS]
    pattern = r'(?i)\b(' + '|'.join(escaped_headers) + r')\b'
    matches = list(re.finditer(pattern, text))

    sections = {}

    for i, match in enumerate(matches):
        start = match.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        header = match.group(0).strip().lower()
        content = text[start:end].strip()

        # FIXED: Check both "projects" and "technical projects"
        if header in ["projects", "technical projects", "experience", "work experience", 
                      "professional experience", "education"]:
            # Split into items
            items = re.split(r'\n(?:[-•\d.)\s]+|\s{2,})', content)
            items = [i.strip() for i in items if len(i.strip()) > 25]
            sections[header] = items if items else [content]
        else:
            sections[header] = content

    # FIXED: Use debug level for full text logging (it can be very long)
    logger.debug(f'Extracted text from {file_path}: {text[:200]}...')
    logger.info(f'Successfully parsed {file_path} - found {len(sections)} sections')
    
    return {
        "structured": sections,
        "full_text": text
    }  


def extract_text_from_file(file_path: str) -> str:
    """
    Extract text from PDF or DOCX file
    
    Args:
        file_path: Path to the file
        
    Returns:
        Extracted text as string
    """
    # FIXED: Validate file exists
    if not os.path.exists(file_path):
        logger.error(f"File not found: {file_path}")
        return ""
    
    try:
        if file_path.lower().endswith('.pdf'):
            return extract_text_from_pdf(file_path)
        elif file_path.lower().endswith(('.docx', '.doc')):
            return extract_text_from_docx(file_path)
        else:
            logger.error(f"Unsupported file format: {file_path}")
            return ""
    except Exception as e:
        logger.error(f"Error extracting text from {file_path}: {e}")
        return ""


def extract_text_from_pdf(file_path: str) -> str:
    """
    Extract text from PDF using PyMuPDF with PyPDF2 fallback
    
    Args:
        file_path: Path to PDF file
        
    Returns:
        Extracted text as string
    """
    text = ""
    
    # Try PyMuPDF first (faster and more accurate)
    try:
        with fitz.open(file_path) as doc:
            for page in doc:
                text += page.get_text() + "\n"
        
        if text.strip():  # FIXED: Check if text was actually extracted
            return text.strip()
        else:
            logger.warning(f"PyMuPDF extracted no text from {file_path}, trying PyPDF2")
    except Exception as e:
        logger.error(f"Error reading PDF with PyMuPDF {file_path}: {e}")
    
    # Fallback to PyPDF2
    try:
        reader = PdfReader(file_path)
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:  # FIXED: Check if page has text
                text += page_text + "\n"
    except Exception as e2:
        logger.error(f"Error with PyPDF2 fallback: {e2}")
    
    return text.strip()


def extract_text_from_docx(file_path: str) -> str:
    """
    Extract text from DOCX file
    
    Args:
        file_path: Path to DOCX file
        
    Returns:
        Extracted text as string
    """
    # FIXED: Better check for docx availability
    if DocxDocument is None:
        logger.error("python-docx not installed. Cannot read DOCX files. Install with: pip install python-docx")
        return ""
    
    try:
        doc = DocxDocument(file_path)  # FIXED: Use renamed import
        
        # FIXED: Also extract text from tables
        text_parts = []
        
        # Extract paragraphs
        for paragraph in doc.paragraphs:
            if paragraph.text.strip():
                text_parts.append(paragraph.text)
        
        # Extract tables
        for table in doc.tables:
            for row in table.rows:
                for cell in row.cells:
                    if cell.text.strip():
                        text_parts.append(cell.text)
        
        text = "\n".join(text_parts)
        return text.strip()
    except Exception as e:
        logger.error(f"Error reading DOCX {file_path}: {e}")
        return ""


def content_parse_unstructured(file_path: str, base_file_name: str) -> bool:
    """
    Parse PDF using unstructured library and save to JSON
    
    Args:
        file_path: Directory path containing the PDF
        base_file_name: Base name of the PDF file (without extension)
        
    Returns:
        True if successful, False otherwise
    """
    # FIXED: Check if library is available
    if not UNSTRUCTURED_AVAILABLE:
        logger.error("unstructured library not installed. Install with: pip install unstructured")
        return False
    
    # FIXED: Validate inputs
    if not file_path or not base_file_name:
        logger.error("file_path and base_file_name are required")
        return False
    
    # FIXED: Construct full file paths properly
    pdf_file = os.path.join(file_path, f"{base_file_name}.pdf")
    output_file = os.path.join(file_path, f"{base_file_name}-output.json")
    
    # FIXED: Check if input file exists
    if not os.path.exists(pdf_file):
        logger.error(f"PDF file not found: {pdf_file}")
        return False
    
    try:
        logger.info(f"Parsing {pdf_file} with unstructured library...")
        elements = partition_pdf(filename=pdf_file)
        
        # FIXED: Check if elements were extracted
        if not elements:
            logger.warning(f"No elements extracted from {pdf_file}")
            return False
        
        elements_to_json(elements=elements, filename=output_file)
        logger.info(f"Successfully saved parsed content to {output_file}")
        return True
        
    except Exception as e:
        logger.error(f"Error parsing PDF with unstructured: {e}")
        return False


def get_supported_formats() -> List[str]:
    """
    Get list of supported file formats based on installed libraries
    
    Returns:
        List of supported file extensions
    """
    formats = ['.pdf']  # PDF always supported
    
    if DocxDocument is not None:
        formats.extend(['.docx', '.doc'])
    
    return formats


def validate_file(file_path: str) -> tuple[bool, str]:
    """
    Validate if file exists and is supported
    
    Args:
        file_path: Path to file
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    if not file_path:
        return False, "No file path provided"
    
    if not os.path.exists(file_path):
        return False, f"File not found: {file_path}"
    
    if not os.path.isfile(file_path):
        return False, f"Path is not a file: {file_path}"
    
    supported = get_supported_formats()
    file_ext = os.path.splitext(file_path)[1].lower()
    
    if file_ext not in supported:
        return False, f"Unsupported format: {file_ext}. Supported: {', '.join(supported)}"
    
    return True, ""