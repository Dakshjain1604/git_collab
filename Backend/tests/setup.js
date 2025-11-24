/**
 * Test setup file
 * Configures test environment
 */
require('dotenv').config({ path: '.env.test' });

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret';
process.env.MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/test_resume_analyzer';

