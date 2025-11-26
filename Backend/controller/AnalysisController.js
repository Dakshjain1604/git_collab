const { AnalysisHistory } = require("../model/db");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const multer = require("multer");
const FormData = require("form-data");
const fs = require("fs");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const AI_BACKEND_URL = process.env.AI_BACKEND_URL || "http://localhost:8000";

if (JWT_SECRET === "your-secret-key-change-in-production") {
  console.warn("⚠️  WARNING: Using default JWT_SECRET. Set JWT_SECRET environment variable in production!");
}

const upload = multer({ dest: 'temp_uploads/' });

const getUserFromToken = (req) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.substring(7)
      : authHeader;

    if (!token || token.trim() === "") return null;

    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || !decoded.id) return null;

    return decoded.id;
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      console.warn("Invalid JWT token provided.");
    } else if (err.name === "TokenExpiredError") {
      console.warn("JWT token expired.");
    } else {
      console.error("JWT verification error:", err.message);
    }
    return null;
  }
};

/**
 * Endpoint to handle file upload, forward to AI backend, and save results.
 */
exports.uploadAndAnalyze = [
  upload.single('resume'),

  async (req, res) => {
    const userId = getUserFromToken(req);
    if (!userId) {
      if (req.file && fs.existsSync(req.file.path)) {
        try { fs.unlinkSync(req.file.path); } catch (e) { console.warn('Failed to cleanup temp file after auth fail:', e.message); }
      }
      return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No resume file uploaded." });
    }

    const { jdText, jdTitle } = req.body;
    const tempFilePath = req.file.path;
    const originalFilename = req.file.originalname;

    try {
      // 1. Prepare data for forwarding to the AI Backend
      const formData = new FormData();
      formData.append('resume', fs.createReadStream(tempFilePath), {
        filename: originalFilename,
        contentType: req.file.mimetype,
      });
      formData.append('jdText', jdText || 'General analysis requested.');

      // 2. Call the Python AI Backend
      const pythonResponse = await axios.post(
        `${AI_BACKEND_URL}/analyze-resume`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
        }
      );

      const analysisResult = pythonResponse.data;
      console.log('AI Backend Response:', JSON.stringify(analysisResult, null, 2));

      if (!analysisResult.success) {
        return res.status(400).json({
          success: false,
          message: analysisResult.message || "AI Analysis failed."
        });
      }

      // 3. FIXED: Normalize the data structure to match BOTH database schema AND frontend expectations
      // Keep nested structure for frontend compatibility
      const normalized = {
        userId,
        resume_filename: originalFilename,
        jd_text_used: jdText || '',
        jd_title_used: jdTitle || analysisResult.jd_title_used || 'General Position',
        analysis_date: new Date(),
        
        // Store scores as nested object (for frontend compatibility)
        scores: {
          overall_score: analysisResult.scores?.overall_score || 0,
          skills_score: analysisResult.scores?.skills_score || 0,
          experience_score: analysisResult.scores?.experience_score || 0,
          education_score: analysisResult.scores?.education_score || 0,
          keyword_score: analysisResult.scores?.keyword_score || 0,
        },
        
        // Also store flattened for database queries (if your schema needs it)
        overall_score: analysisResult.scores?.overall_score || 0,
        skills_score: analysisResult.scores?.skills_score || 0,
        experience_score: analysisResult.scores?.experience_score || 0,
        education_score: analysisResult.scores?.education_score || 0,
        
        // Store keywords as nested object
        keywords: {
          matched_keywords: analysisResult.keywords?.matched_keywords || [],
          missing_keywords: analysisResult.keywords?.missing_keywords || [],
        },
        
        // Also store flattened for database queries
        matched_keywords: analysisResult.keywords?.matched_keywords || [],
        missing_keywords: analysisResult.keywords?.missing_keywords || [],
        
        // Analysis content
        summary_critique: analysisResult.summary_critique || '',
        strengths: analysisResult.strengths || [],
        weaknesses: analysisResult.weaknesses || [],
        recommendations: analysisResult.recommendations || [],
        structured_resume: analysisResult.structured_resume || {},
        
        // Metadata
        file_id: analysisResult.file_id || undefined,
      };

      const newAnalysis = new AnalysisHistory(normalized);
      const savedAnalysis = await newAnalysis.save();

      // 4. Return data in the format frontend expects
      const responseData = {
        success: true,
        message: "Analysis complete and saved.",
        data: {
          _id: savedAnalysis._id,
          resume_filename: savedAnalysis.resume_filename,
          jd_title_used: savedAnalysis.jd_title_used,
          jd_text_used: savedAnalysis.jd_text_used,
          analysis_date: savedAnalysis.analysis_date,
          
          // Return nested structure for frontend
          scores: normalized.scores,
          keywords: normalized.keywords,
          
          summary_critique: savedAnalysis.summary_critique,
          strengths: savedAnalysis.strengths,
          weaknesses: savedAnalysis.weaknesses,
          recommendations: savedAnalysis.recommendations,
          structured_resume: savedAnalysis.structured_resume,
          
          // Also include flattened for backward compatibility
          overall_score: normalized.scores.overall_score,
          skills_score: normalized.scores.skills_score,
          experience_score: normalized.scores.experience_score,
          education_score: normalized.scores.education_score,
        }
      };

      res.status(200).json(responseData);

    } catch (error) {
      console.error("Error during analysis or file transfer:", error.stack || error.message || error);
      if (error.response) {
        console.error('AI backend responded with:', {
          status: error.response.status,
          data: error.response.data,
        });
      }

      if (error.response) {
        const statusCode = error.response.status || 500;
        const respData = error.response.data || { message: error.response.statusText || 'AI backend error' };
        const forwardedMessage = respData.detail || respData.message || JSON.stringify(respData);
        return res.status(statusCode).json({ success: false, message: forwardedMessage, backend: respData });
      }

      if (error.code === 'ECONNREFUSED') {
        const msg = `Could not connect to AI Backend at ${AI_BACKEND_URL}. Ensure it is running.`;
        return res.status(502).json({ success: false, message: msg });
      }

      const fallbackMsg = error.message || 'An unknown error occurred during analysis.';
      return res.status(500).json({ success: false, message: fallbackMsg });
    } finally {
      try {
        if (tempFilePath && fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
        }
      } catch (cleanupErr) {
        console.warn('Failed to clean up temp file in finally:', cleanupErr.message);
      }
    }
  }
];

/**
 * Saves a new analysis result
 */
exports.saveAnalysis = async (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized. Please login." });
    }

    const analysisData = req.body;

    if (!analysisData.scores || analysisData.scores.overall_score === undefined) {
      console.warn("Missing scores in analysis data:", analysisData);
      return res.status(400).json({ success: false, message: "Missing required analysis data." });
    }

    const newAnalysis = new AnalysisHistory({
      userId,
      resume_filename: analysisData.resume_filename || "untitled_resume",
      jd_title_used: analysisData.jd_title_used || "General Position",
      jd_text_used: analysisData.jd_text_used || "",
      analysis_date: new Date(),
      
      // Nested structure
      scores: analysisData.scores,
      keywords: analysisData.keywords || { matched_keywords: [], missing_keywords: [] },
      
      // Flattened for queries
      overall_score: analysisData.scores.overall_score,
      skills_score: analysisData.scores.skills_score || 0,
      experience_score: analysisData.scores.experience_score || 0,
      education_score: analysisData.scores.education_score || 0,
      matched_keywords: analysisData.keywords?.matched_keywords || [],
      missing_keywords: analysisData.keywords?.missing_keywords || [],
      
      summary_critique: analysisData.summary_critique || "",
      strengths: analysisData.strengths || [],
      weaknesses: analysisData.weaknesses || [],
      recommendations: analysisData.recommendations || [],
      structured_resume: analysisData.structured_resume || {}
    });

    const savedAnalysis = await newAnalysis.save();
    return res.status(201).json({ success: true, message: "Analysis saved.", data: savedAnalysis });

  } catch (err) {
    console.error("Save analysis error:", err.message);
    return res.status(500).json({ success: false, message: "Server error while saving analysis." });
  }
};

/**
 * Retrieves analysis history
 */
exports.getAnalysisHistory = async (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized. Please login." });
    }

    const history = await AnalysisHistory.find({ userId })
      .sort({ analysis_date: -1 })
      .select('-structured_resume');

    // FIXED: Return data with nested structure for frontend
    const formattedHistory = history.map(item => ({
      _id: item._id,
      resume_filename: item.resume_filename,
      jd_title_used: item.jd_title_used,
      jd_text_used: item.jd_text_used,
      analysis_date: item.analysis_date,
      
      // Return nested structure
      scores: {
        overall_score: item.overall_score || 0,
        skills_score: item.skills_score || 0,
        experience_score: item.experience_score || 0,
        education_score: item.education_score || 0,
      },
      keywords: {
        matched_keywords: item.matched_keywords || [],
        missing_keywords: item.missing_keywords || [],
      },
      
      // Also include flattened for backward compatibility
      overall_score: item.overall_score || 0,
      skills_score: item.skills_score || 0,
      experience_score: item.experience_score || 0,
      education_score: item.education_score || 0,
      
      summary_critique: item.summary_critique,
      strengths: item.strengths,
      weaknesses: item.weaknesses,
      recommendations: item.recommendations,
    }));

    res.status(200).json({ success: true, data: formattedHistory });
  } catch (err) {
    console.error("Get history error:", err.message);
    res.status(500).json({ success: false, message: "Server error retrieving analysis history." });
  }
};

/**
 * Retrieves a single analysis by ID
 */
exports.getAnalysisById = async (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized. Please login." });
    }

    const analysisId = req.params.analysisId;
    const analysis = await AnalysisHistory.findOne({ _id: analysisId, userId });

    if (!analysis) {
      return res.status(404).json({ success: false, message: "Analysis not found or access denied." });
    }

    // FIXED: Return nested structure
    const formattedAnalysis = {
      _id: analysis._id,
      resume_filename: analysis.resume_filename,
      jd_title_used: analysis.jd_title_used,
      jd_text_used: analysis.jd_text_used,
      analysis_date: analysis.analysis_date,
      
      scores: {
        overall_score: analysis.overall_score || 0,
        skills_score: analysis.skills_score || 0,
        experience_score: analysis.experience_score || 0,
        education_score: analysis.education_score || 0,
      },
      keywords: {
        matched_keywords: analysis.matched_keywords || [],
        missing_keywords: analysis.missing_keywords || [],
      },
      
      overall_score: analysis.overall_score || 0,
      
      summary_critique: analysis.summary_critique,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      recommendations: analysis.recommendations,
      structured_resume: analysis.structured_resume,
    };

    res.status(200).json({ success: true, data: formattedAnalysis });
  } catch (err) {
    console.error("Get analysis by ID error:", err.message);
    res.status(500).json({ success: false, message: "Server error retrieving analysis." });
  }
};

/**
 * FIXED: Dashboard statistics with proper calculations
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized. Please login." });
    }

    const analyses = await AnalysisHistory.find({ userId })
      .select('overall_score skills_score experience_score education_score analysis_date');
    
    const totalAnalyses = analyses.length;

    if (totalAnalyses === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalAnalyses: 0,
          averageScore: 0,
          highestScore: 0,
          lowestScore: 0,
          averageSkillsScore: 0,
          averageExperienceScore: 0,
          averageEducationScore: 0,
          analysesThisMonth: 0,
          analysesThisWeek: 0,
          scoreDistribution: { excellent: 0, good: 0, average: 0, poor: 0 }
        }
      });
    }

    const scores = analyses.map(a => a.overall_score || 0);
    const skillsScores = analyses.map(a => a.skills_score || 0).filter(s => s > 0);
    const expScores = analyses.map(a => a.experience_score || 0).filter(s => s > 0);
    const eduScores = analyses.map(a => a.education_score || 0).filter(s => s > 0);

    const average = (arr) => arr.length > 0 ? Math.round(arr.reduce((sum, n) => sum + n, 0) / arr.length) : 0;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1));

    const analysesThisMonth = analyses.filter(a => a.analysis_date >= startOfMonth).length;
    const analysesThisWeek = analyses.filter(a => a.analysis_date >= startOfWeek).length;

    res.status(200).json({
      success: true,
      data: {
        totalAnalyses,
        averageScore: average(scores),
        highestScore: Math.max(...scores, 0),
        lowestScore: Math.min(...scores.filter(s => s > 0), 0) || 0,
        averageSkillsScore: average(skillsScores),
        averageExperienceScore: average(expScores),
        averageEducationScore: average(eduScores),
        analysesThisMonth,
        analysesThisWeek,
        scoreDistribution: {
          excellent: scores.filter(s => s >= 80).length,
          good: scores.filter(s => s >= 60 && s < 80).length,
          average: scores.filter(s => s >= 40 && s < 60).length,
          poor: scores.filter(s => s < 40).length,
        }
      }
    });
  } catch (err) {
    console.error("Get dashboard stats error:", err.message);
    res.status(500).json({ success: false, message: "Server error retrieving dashboard statistics." });
  }
};

/**
 * Deletes an analysis by ID
 */
exports.deleteAnalysis = async (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized. Please login." });
    }

    const analysisId = req.params.analysisId;
    const result = await AnalysisHistory.findOneAndDelete({ _id: analysisId, userId });

    if (!result) {
      return res.status(404).json({ success: false, message: "Analysis not found or access denied." });
    }

    res.status(200).json({ success: true, message: "Analysis deleted successfully." });
  } catch (err) {
    console.error("Delete analysis error:", err.message);
    res.status(500).json({ success: false, message: "Server error deleting analysis." });
  }
};