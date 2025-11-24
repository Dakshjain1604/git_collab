/**
 * Tests for AnalysisController
 */
const {
  saveAnalysis,
  getAnalysisHistory,
  getAnalysisById,
  deleteAnalysis,
  getStatistics
} = require('../controller/AnalysisController');
const { AnalysisHistory } = require('../model/db');
const jwt = require('jsonwebtoken');

// Mock dependencies
jest.mock('../model/db');
jest.mock('jsonwebtoken');

describe('AnalysisController', () => {
  const mockUserId = 'user123';
  const mockToken = 'mock_token';

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock jwt.verify to return user ID
    jwt.verify = jest.fn().mockReturnValue({ id: mockUserId });
  });

  describe('saveAnalysis', () => {
    const mockReq = {
      headers: {
        authorization: `Bearer ${mockToken}`
      },
      body: {
        resume_filename: 'resume.pdf',
        job_description: 'Job description text',
        overall_score: 85.5,
        skills_score: 90.0,
        experience_score: 80.0,
        education_score: 85.0,
        similarity_score: 82.5,
        keyword_match_percentage: 75.0,
        matched_keywords: ['Python', 'JavaScript'],
        missing_keywords: ['Docker'],
        strengths: ['Strong technical skills'],
        weaknesses: ['Missing Docker'],
        recommendations: ['Add Docker'],
        detailed_analysis: 'Detailed analysis text',
        file_id: 'file123'
      }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    it('should save analysis successfully', async () => {
      const mockAnalysis = {
        _id: 'analysis123',
        user_id: mockUserId
      };
      AnalysisHistory.create = jest.fn().mockResolvedValue(mockAnalysis);

      await saveAnalysis(mockReq, mockRes);

      expect(AnalysisHistory.create).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Analysis saved successfully',
        analysis_id: 'analysis123'
      });
    });

    it('should return error if unauthorized', async () => {
      jwt.verify = jest.fn().mockReturnValue(null);
      const unauthorizedReq = {
        headers: {}
      };

      await saveAnalysis(unauthorizedReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Unauthorized. Please login.' });
    });

    it('should return error for missing required fields', async () => {
      const invalidReq = {
        headers: {
          authorization: `Bearer ${mockToken}`
        },
        body: {
          resume_filename: 'resume.pdf'
          // Missing job_description and overall_score
        }
      };

      await saveAnalysis(invalidReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Missing required fields' });
    });

    it('should truncate long job descriptions', async () => {
      const longJobDesc = 'a'.repeat(2000);
      const reqWithLongDesc = {
        ...mockReq,
        body: {
          ...mockReq.body,
          job_description: longJobDesc
        }
      };
      AnalysisHistory.create = jest.fn().mockResolvedValue({ _id: 'analysis123' });

      await saveAnalysis(reqWithLongDesc, mockRes);

      expect(AnalysisHistory.create).toHaveBeenCalled();
      const createCall = AnalysisHistory.create.mock.calls[0][0];
      expect(createCall.job_description.length).toBeLessThanOrEqual(1000);
    });

    it('should handle server errors', async () => {
      AnalysisHistory.create = jest.fn().mockRejectedValue(new Error('Database error'));

      await saveAnalysis(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });

  describe('getAnalysisHistory', () => {
    const mockReq = {
      headers: {
        authorization: `Bearer ${mockToken}`
      }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    it('should return analysis history successfully', async () => {
      const mockAnalyses = [
        {
          _id: 'analysis1',
          resume_filename: 'resume1.pdf',
          job_description: 'Job desc 1',
          overall_score: 85,
          analysis_date: new Date('2024-01-01')
        },
        {
          _id: 'analysis2',
          resume_filename: 'resume2.pdf',
          job_description: 'Job desc 2',
          overall_score: 90,
          analysis_date: new Date('2024-01-02')
        }
      ];

      AnalysisHistory.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            select: jest.fn().mockResolvedValue(mockAnalyses)
          })
        })
      });

      await getAnalysisHistory(mockReq, mockRes);

      expect(AnalysisHistory.find).toHaveBeenCalledWith({ user_id: mockUserId });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalled();
      const responseData = mockRes.json.mock.calls[0][0];
      expect(responseData).toHaveLength(2);
      expect(responseData[0]).toHaveProperty('id', 'analysis1');
      expect(responseData[0]).toHaveProperty('score', 85);
    });

    it('should return error if unauthorized', async () => {
      jwt.verify = jest.fn().mockReturnValue(null);
      const unauthorizedReq = {
        headers: {}
      };

      await getAnalysisHistory(unauthorizedReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Unauthorized. Please login.' });
    });

    it('should handle server errors', async () => {
      AnalysisHistory.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            select: jest.fn().mockRejectedValue(new Error('Database error'))
          })
        })
      });

      await getAnalysisHistory(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });

  describe('getAnalysisById', () => {
    const mockReq = {
      headers: {
        authorization: `Bearer ${mockToken}`
      },
      params: {
        id: 'analysis123'
      }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    it('should return analysis by id successfully', async () => {
      const mockAnalysis = {
        _id: 'analysis123',
        user_id: mockUserId,
        overall_score: 85,
        resume_filename: 'resume.pdf'
      };
      AnalysisHistory.findOne = jest.fn().mockResolvedValue(mockAnalysis);

      await getAnalysisById(mockReq, mockRes);

      expect(AnalysisHistory.findOne).toHaveBeenCalledWith({
        _id: 'analysis123',
        user_id: mockUserId
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockAnalysis);
    });

    it('should return error if analysis not found', async () => {
      AnalysisHistory.findOne = jest.fn().mockResolvedValue(null);

      await getAnalysisById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Analysis not found' });
    });

    it('should return error if unauthorized', async () => {
      jwt.verify = jest.fn().mockReturnValue(null);
      const unauthorizedReq = {
        headers: {},
        params: { id: 'analysis123' }
      };

      await getAnalysisById(unauthorizedReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Unauthorized. Please login.' });
    });
  });

  describe('deleteAnalysis', () => {
    const mockReq = {
      headers: {
        authorization: `Bearer ${mockToken}`
      },
      params: {
        id: 'analysis123'
      }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    it('should delete analysis successfully', async () => {
      AnalysisHistory.deleteOne = jest.fn().mockResolvedValue({ deletedCount: 1 });

      await deleteAnalysis(mockReq, mockRes);

      expect(AnalysisHistory.deleteOne).toHaveBeenCalledWith({
        _id: 'analysis123',
        user_id: mockUserId
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Analysis deleted successfully' });
    });

    it('should return error if analysis not found', async () => {
      AnalysisHistory.deleteOne = jest.fn().mockResolvedValue({ deletedCount: 0 });

      await deleteAnalysis(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Analysis not found' });
    });
  });

  describe('getStatistics', () => {
    const mockReq = {
      headers: {
        authorization: `Bearer ${mockToken}`
      }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    it('should return statistics successfully', async () => {
      const mockAnalyses = [
        { overall_score: 85, skills_score: 90, experience_score: 80, education_score: 85, analysis_date: new Date() },
        { overall_score: 90, skills_score: 95, experience_score: 85, education_score: 90, analysis_date: new Date() },
        { overall_score: 75, skills_score: 80, experience_score: 70, education_score: 75, analysis_date: new Date('2023-12-01') }
      ];

      AnalysisHistory.countDocuments = jest.fn().mockResolvedValue(3);
      AnalysisHistory.find = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockAnalyses)
      });

      await getStatistics(mockReq, mockRes);

      expect(AnalysisHistory.countDocuments).toHaveBeenCalledWith({ user_id: mockUserId });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      const responseData = mockRes.json.mock.calls[0][0];
      expect(responseData).toHaveProperty('totalAnalyses', 3);
      expect(responseData).toHaveProperty('averageScore');
      expect(responseData).toHaveProperty('highestScore', 90);
      expect(responseData).toHaveProperty('lowestScore', 75);
    });

    it('should return zero statistics for no analyses', async () => {
      AnalysisHistory.countDocuments = jest.fn().mockResolvedValue(0);
      AnalysisHistory.find = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue([])
      });

      await getStatistics(mockReq, mockRes);

      const responseData = mockRes.json.mock.calls[0][0];
      expect(responseData.totalAnalyses).toBe(0);
      expect(responseData.averageScore).toBe(0);
    });
  });
});

