const { AnalysisHistory } = require("../model/db");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const multer = require("multer");
const FormData = require("form-data");
const fs = require("fs");

// Use environment variable for JWT_SECRET for security
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const AI_BACKEND_URL = process.env.AI_BACKEND_URL || "http://localhost:8000";

if (JWT_SECRET === "your-secret-key-change-in-production") {
  console.warn("⚠️  WARNING: Using default JWT_SECRET. Set JWT_SECRET environment variable in production!");
}

// Setup Multer for file upload temporary storage
const upload = multer({ dest: 'temp_uploads/' });

// Helper to extract user ID from the Authorization header
const getUserFromToken = (req) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;

    const token = authHeader.startsWith("Bearer ") 
      ? authHeader.substring(7) 
      : authHeader;
    
    if (!token || token.trim() === "") return null;

    // IMPORTANT: In a real app, you would need to implement JWT signing/verification
    // For this example, we assume JWT is valid and contains an 'id'
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
  // 1. Use Multer middleware to handle file upload
  upload.single('resume'), 

  // 2. Main controller logic
  async (req, res) => {
    const userId = getUserFromToken(req);
    if (!userId) {
      // Clean up the temp file if auth fails
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No resume file uploaded." });
    }

    const { jdText } = req.body;
    const tempFilePath = req.file.path;
    const originalFilename = req.file.originalname;

    try {
      // 1. Prepare data for forwarding to the AI Backend
      const formData = new FormData();
      // Append the resume file stream
      formData.append('resume', fs.createReadStream(tempFilePath), {
        filename: originalFilename,
        contentType: req.file.mimetype,
      });
      // Append the Job Description text
      formData.append('jdText', jdText || 'General analysis requested.');

      // 2. Call the Python AI Backend
      const pythonResponse = await axios.post(
        `${AI_BACKEND_URL}/analyze-resume`, 
        formData, 
        {
          headers: {
            // Must include the form-data boundary header
            ...formData.getHeaders(),
          },
          maxBodyLength: Infinity, // Important for file uploads
          maxContentLength: Infinity,
        }
      );

      const analysisResult = pythonResponse.data;

      if (!analysisResult.success) {
        return res.status(400).json({ 
          success: false, 
          message: analysisResult.message || "AI Analysis failed." 
        });
      }

      // 3. Save the successful analysis to MongoDB
      const newAnalysis = new AnalysisHistory({
        userId,
        resume_filename: originalFilename,
        ...analysisResult, // Unpack all fields including scores, structured_resume, etc.
      });

      const savedAnalysis = await newAnalysis.save();

      // 4. Return the result to the frontend
      res.status(200).json({
        success: true,
        message: "Analysis complete and saved.",
        data: savedAnalysis,
      });

    } catch (error) {
      console.error("Error during analysis or file transfer:", error.message);
      let errorMessage = "An unknown error occurred during analysis.";
      if (error.response) {
        // Error response from Python backend (e.g., 400 or 500)
        errorMessage = error.response.data.detail || `AI Backend Error: ${error.response.statusText}`;
      } else if (error.code === 'ECONNREFUSED') {
        errorMessage = `Could not connect to AI Backend at ${AI_BACKEND_URL}. Ensure it is running.`;
      }
      
      res.status(500).json({ success: false, message: errorMessage });
    } finally {
      // 5. Clean up the temporary file
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    }
  }
];

/**
 * Saves a new analysis result, including structured resume data, to the history. (Original Function - kept for structure)
 */
exports.saveAnalysis = async (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized. Please login." });
    }

    // This function is now mostly superseded by uploadAndAnalyze, but we keep it
    // for compatibility if other routes use it for non-file analysis saves.
    const analysisData = req.body; 

    // Basic validation
    if (!analysisData.scores || !analysisData.scores.overall_score) {
      return res.status(400).json({ success: false, message: "Missing required analysis data (scores.overall_score)." });
    }

    const newAnalysis = new AnalysisHistory({
      userId,
      ...analysisData
    });

    const savedAnalysis = await newAnalysis.save();
    return res.status(201).json({ success: true, message: "Analysis saved.", data: savedAnalysis });

  } catch (err) {
    console.error("Save analysis error:", err.message);
    return res.status(500).json({ success: false, message: "Server error while saving analysis." });
  }
};


/**
 * Retrieves a list of all analysis history for the logged-in user.
 */
exports.getAnalysisHistory = async (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized. Please login." });
    }

    const history = await AnalysisHistory.find({ userId })
      .sort({ analysis_date: -1 })
      .select('-structured_resume'); // Exclude large structured data for the list view

    res.status(200).json({ success: true, data: history });
  } catch (err) {
    console.error("Get history error:", err.message);
    res.status(500).json({ success: false, message: "Server error retrieving analysis history." });
  }
};

/**
 * Retrieves a single analysis result by ID.
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

        res.status(200).json({ success: true, data: analysis });
    } catch (err) {
        console.error("Get analysis by ID error:", err.message);
        res.status(500).json({ success: false, message: "Server error retrieving analysis." });
    }
};


/**
 * Calculates and returns dashboard statistics for the logged-in user.
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized. Please login." });
    }

    const analyses = await AnalysisHistory.find({ userId }).select('scores analysis_date');
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

    const scores = analyses.map(a => a.scores.overall_score || 0);

    const filterAndAverage = (key) => {
      const validScores = analyses
        .map(a => a.scores[key] || 0)
        .filter(s => typeof s === 'number' && s > 0);
      
      return validScores.length > 0 ? (validScores.reduce((sum, s) => sum + s, 0) / validScores.length).toFixed(1) : 0;
    };

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(now);
    // Adjust to Monday (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
    startOfWeek.setDate(now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1)); // Start of week (Monday)
    startOfWeek.setHours(0, 0, 0, 0);

    const analysesThisMonth = analyses.filter(
      a => a.analysis_date && new Date(a.analysis_date) >= startOfMonth
    ).length;

    const analysesThisWeek = analyses.filter(
      a => a.analysis_date && new Date(a.analysis_date) >= startOfWeek
    ).length;

    const averageScore = filterAndAverage('overall_score');
    const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
    const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;

    res.status(200).json({
      success: true,
      data: {
        totalAnalyses,
        averageScore,
        highestScore,
        lowestScore,
        averageSkillsScore: filterAndAverage('skills_score'),
        averageExperienceScore: filterAndAverage('experience_score'),
        averageEducationScore: filterAndAverage('education_score'),
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