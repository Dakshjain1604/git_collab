# Node Backend Tests

## Running Tests

### Install Test Dependencies
```bash
cd Backend
npm install
```

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

## Test Structure

- `tests/UserController.test.js` - Tests for user authentication and management
- `tests/AnalysisController.test.js` - Tests for analysis history and statistics
- `tests/JobSearchController.test.js` - Tests for job search functionality

## Test Coverage

The tests cover:
- User signup, login, update, and delete
- Analysis saving, retrieval, and deletion
- Statistics calculation
- Job search with multiple API providers
- Error handling and edge cases
- Authentication and authorization

## Environment Setup

Create a `.env.test` file for test environment variables:
```
NODE_ENV=test
JWT_SECRET=test_jwt_secret
MONGODB_URL=mongodb://localhost:27017/test_resume_analyzer
```

## Notes

- Tests use mocks for database and external API calls
- No actual database connection required for unit tests
- Integration tests would require a test database

