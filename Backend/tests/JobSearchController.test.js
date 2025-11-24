/**
 * Tests for JobSearchController
 */
const { searchJobs } = require('../controller/JobSearchController');
const axios = require('axios');
const jwt = require('jsonwebtoken');

// Mock dependencies
jest.mock('axios');
jest.mock('jsonwebtoken');

describe('JobSearchController', () => {
  const mockUserId = 'user123';
  const mockToken = 'mock_token';

  beforeEach(() => {
    jest.clearAllMocks();
    jwt.verify = jest.fn().mockReturnValue({ id: mockUserId });
    process.env.ADZUNA_APP_ID = undefined;
    process.env.ADZUNA_APP_KEY = undefined;
    process.env.SERP_API_KEY = undefined;
  });

  describe('searchJobs', () => {
    const mockReq = {
      headers: {
        authorization: `Bearer ${mockToken}`
      },
      body: {
        jobDescription: 'We are looking for a Software Engineer with Python and JavaScript experience',
        location: 'New York',
        limit: 10
      }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    it('should search jobs successfully with fallback', async () => {
      await searchJobs(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      const responseData = mockRes.json.mock.calls[0][0];
      expect(responseData).toHaveProperty('success', true);
      expect(responseData).toHaveProperty('jobs');
      expect(responseData).toHaveProperty('count');
      expect(Array.isArray(responseData.jobs)).toBe(true);
    });

    it('should return error if unauthorized', async () => {
      jwt.verify = jest.fn().mockReturnValue(null);
      const unauthorizedReq = {
        headers: {},
        body: mockReq.body
      };

      await searchJobs(unauthorizedReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Unauthorized. Please login.' });
    });

    it('should return error for missing job description', async () => {
      const invalidReq = {
        headers: mockReq.headers,
        body: {
          jobDescription: '',
          location: 'New York'
        }
      };

      await searchJobs(invalidReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Job description is required and must be at least 10 characters'
      });
    });

    it('should return error for short job description', async () => {
      const invalidReq = {
        headers: mockReq.headers,
        body: {
          jobDescription: 'Short',
          location: 'New York'
        }
      };

      await searchJobs(invalidReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('should use Adzuna API when credentials are available', async () => {
      process.env.ADZUNA_APP_ID = 'test_app_id';
      process.env.ADZUNA_APP_KEY = 'test_app_key';

      const mockAdzunaResponse = {
        data: {
          results: [
            {
              title: 'Software Engineer',
              company: { display_name: 'Tech Corp' },
              location: { display_name: 'New York' },
              description: 'Job description',
              redirect_url: 'https://example.com/job1',
              salary_min: 80000,
              salary_max: 120000,
              created: '2024-01-01'
            }
          ]
        }
      };

      axios.get = jest.fn().mockResolvedValue(mockAdzunaResponse);

      await searchJobs(mockReq, mockRes);

      expect(axios.get).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      const responseData = mockRes.json.mock.calls[0][0];
      expect(responseData.jobs.length).toBeGreaterThan(0);
    });

    it('should use SerpAPI when credentials are available', async () => {
      process.env.SERP_API_KEY = 'test_serp_key';

      const mockSerpResponse = {
        data: {
          jobs_results: [
            {
              title: 'Software Engineer',
              company_name: 'Tech Corp',
              location: 'New York',
              description: 'Job description',
              apply_options: [{ link: 'https://example.com/job1' }],
              detected_extensions: {
                salary: '$100,000',
                posted_at: '2 days ago'
              }
            }
          ]
        }
      };

      axios.get = jest.fn().mockResolvedValue(mockSerpResponse);

      await searchJobs(mockReq, mockRes);

      expect(axios.get).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should handle API errors gracefully', async () => {
      process.env.ADZUNA_APP_ID = 'test_app_id';
      process.env.ADZUNA_APP_KEY = 'test_app_key';

      axios.get = jest.fn().mockRejectedValue(new Error('API Error'));

      await searchJobs(mockReq, mockRes);

      // Should fall back to generated suggestions
      expect(mockRes.status).toHaveBeenCalledWith(200);
      const responseData = mockRes.json.mock.calls[0][0];
      expect(responseData.success).toBe(true);
    });

    it('should extract keywords from job description', async () => {
      await searchJobs(mockReq, mockRes);

      const responseData = mockRes.json.mock.calls[0][0];
      expect(responseData).toHaveProperty('keywords');
      expect(Array.isArray(responseData.keywords)).toBe(true);
    });

    it('should limit results to specified limit', async () => {
      const limitedReq = {
        ...mockReq,
        body: {
          ...mockReq.body,
          limit: 5
        }
      };

      await searchJobs(limitedReq, mockRes);

      const responseData = mockRes.json.mock.calls[0][0];
      expect(responseData.jobs.length).toBeLessThanOrEqual(5);
    });

    it('should handle server errors', async () => {
      // Mock a scenario that causes an error
      jwt.verify = jest.fn().mockImplementation(() => {
        throw new Error('JWT Error');
      });

      await searchJobs(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error searching for jobs. Please try again.'
      });
    });
  });
});

