# AI Backend Tests

## Running Tests

### Install Test Dependencies
```bash
cd AI_backend
pip install -e ".[test]"
# or
uv pip install pytest pytest-asyncio pytest-cov httpx
```

### Run All Tests
```bash
pytest
```

### Run Tests with Coverage
```bash
pytest --cov=app --cov-report=html
```

### Run Specific Test File
```bash
pytest tests/test_main.py
pytest tests/test_analyzer.py
pytest tests/test_parse.py
```

### Run Specific Test
```bash
pytest tests/test_main.py::TestHealthCheck::test_health_check
```

## Test Structure

- `tests/test_main.py` - Tests for FastAPI endpoints
- `tests/test_analyzer.py` - Tests for resume analysis functions
- `tests/test_parse.py` - Tests for file parsing functions

## Coverage

The tests aim for high coverage of:
- API endpoints (health, analyze, upload)
- Resume analysis logic (rule-based and AI)
- Text extraction and parsing
- Error handling

