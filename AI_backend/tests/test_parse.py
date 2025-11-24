"""
Tests for parse module
"""
import pytest
from unittest.mock import patch, MagicMock, mock_open
import tempfile
import os
from app.parse import (
    extract_text_from_file,
    extract_text_from_pdf,
    extract_text_from_docx,
    content_parse
)


class TestExtractTextFromFile:
    """Test file text extraction"""
    
    def test_extract_text_from_pdf_file(self):
        """Test extracting text from PDF file"""
        # Create a mock PDF file path
        file_path = "test.pdf"
        
        with patch('app.parse.extract_text_from_pdf') as mock_pdf:
            mock_pdf.return_value = "Extracted PDF text"
            result = extract_text_from_file(file_path)
            assert result == "Extracted PDF text"
            mock_pdf.assert_called_once_with(file_path)
    
    def test_extract_text_from_docx_file(self):
        """Test extracting text from DOCX file"""
        file_path = "test.docx"
        
        with patch('app.parse.extract_text_from_docx') as mock_docx:
            mock_docx.return_value = "Extracted DOCX text"
            result = extract_text_from_file(file_path)
            assert result == "Extracted DOCX text"
            mock_docx.assert_called_once_with(file_path)
    
    def test_extract_text_unsupported_format(self):
        """Test extracting text from unsupported format"""
        file_path = "test.txt"
        result = extract_text_from_file(file_path)
        assert result == ""
    
    def test_extract_text_exception_handling(self):
        """Test exception handling in text extraction"""
        file_path = "nonexistent.pdf"
        
        with patch('app.parse.extract_text_from_pdf') as mock_pdf:
            mock_pdf.side_effect = Exception("File error")
            result = extract_text_from_file(file_path)
            assert result == ""


class TestExtractTextFromPdf:
    """Test PDF text extraction"""
    
    @patch('app.parse.fitz')
    def test_extract_text_from_pdf_success(self, mock_fitz):
        """Test successful PDF text extraction"""
        # Mock PyMuPDF
        mock_doc = MagicMock()
        mock_page = MagicMock()
        mock_page.get_text.return_value = "PDF page text"
        mock_doc.__enter__ = MagicMock(return_value=mock_doc)
        mock_doc.__exit__ = MagicMock(return_value=None)
        mock_doc.__iter__ = MagicMock(return_value=iter([mock_page]))
        mock_fitz.open.return_value = mock_doc
        
        result = extract_text_from_pdf("test.pdf")
        assert "PDF page text" in result
    
    @patch('app.parse.fitz')
    @patch('app.parse.PdfReader')
    def test_extract_text_from_pdf_fallback(self, mock_pdfreader, mock_fitz):
        """Test PDF extraction falls back to PyPDF2"""
        # Mock PyMuPDF to raise exception
        mock_fitz.open.side_effect = Exception("PyMuPDF error")
        
        # Mock PyPDF2
        mock_reader = MagicMock()
        mock_page = MagicMock()
        mock_page.extract_text.return_value = "PyPDF2 text"
        mock_reader.pages = [mock_page]
        mock_pdfreader.return_value = mock_reader
        
        result = extract_text_from_pdf("test.pdf")
        assert "PyPDF2 text" in result


class TestExtractTextFromDocx:
    """Test DOCX text extraction"""
    
    @patch('app.parse.docx')
    def test_extract_text_from_docx_success(self, mock_docx_module):
        """Test successful DOCX text extraction"""
        # Mock python-docx
        mock_doc = MagicMock()
        mock_para1 = MagicMock()
        mock_para1.text = "First paragraph"
        mock_para2 = MagicMock()
        mock_para2.text = "Second paragraph"
        mock_doc.paragraphs = [mock_para1, mock_para2]
        mock_docx_module.return_value = mock_doc
        
        result = extract_text_from_docx("test.docx")
        assert "First paragraph" in result
        assert "Second paragraph" in result
    
    @patch('app.parse.docx', None)
    def test_extract_text_from_docx_not_installed(self):
        """Test DOCX extraction when python-docx not installed"""
        result = extract_text_from_docx("test.docx")
        assert result == ""
    
    @patch('app.parse.docx')
    def test_extract_text_from_docx_exception(self, mock_docx_module):
        """Test DOCX extraction exception handling"""
        mock_docx_module.side_effect = Exception("DOCX error")
        result = extract_text_from_docx("test.docx")
        assert result == ""


class TestContentParse:
    """Test content parsing"""
    
    @patch('app.parse.fitz')
    def test_content_parse_success(self, mock_fitz):
        """Test successful content parsing"""
        # Mock PyMuPDF document
        mock_doc = MagicMock()
        mock_page = MagicMock()
        mock_block = (0, 0, 100, 100, "SUMMARY\nExperienced engineer\nSKILLS\nPython JavaScript", 0, 0, 0, 0, 0)
        mock_page.get_text.return_value = "SUMMARY\nExperienced engineer\nSKILLS\nPython JavaScript"
        mock_page.get_text_blocks.return_value = [mock_block]
        mock_doc.__enter__ = MagicMock(return_value=mock_doc)
        mock_doc.__exit__ = MagicMock(return_value=None)
        mock_doc.__iter__ = MagicMock(return_value=iter([mock_page]))
        mock_fitz.open.return_value = mock_doc
        
        result = content_parse("test.pdf")
        
        assert "structured" in result
        assert "full_text" in result
        assert len(result["full_text"]) > 0
    
    @patch('app.parse.fitz')
    def test_content_parse_with_sections(self, mock_fitz):
        """Test content parsing extracts sections"""
        text_content = """
        SUMMARY
        Experienced software engineer
        
        SKILLS
        Python, JavaScript, React
        
        EXPERIENCE
        Software Engineer at Tech Corp
        - Developed applications
        """
        
        mock_doc = MagicMock()
        mock_page = MagicMock()
        mock_block = (0, 0, 100, 100, text_content, 0, 0, 0, 0, 0)
        mock_page.get_text.return_value = text_content
        mock_page.get_text_blocks.return_value = [mock_block]
        mock_doc.__enter__ = MagicMock(return_value=mock_doc)
        mock_doc.__exit__ = MagicMock(return_value=None)
        mock_doc.__iter__ = MagicMock(return_value=iter([mock_page]))
        mock_fitz.open.return_value = mock_doc
        
        result = content_parse("test.pdf")
        
        assert "structured" in result
        # Check that sections are extracted
        assert isinstance(result["structured"], dict)

