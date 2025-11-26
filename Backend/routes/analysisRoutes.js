const express = require("express");
const router = express.Router();
const {
  uploadAndAnalyze,
  saveAnalysis,
  getAnalysisHistory,
  getAnalysisById,
  deleteAnalysis,
  getDashboardStats,
} = require("../controller/AnalysisController");

// Main route for uploading resume and getting analysis
router.post("/upload", uploadAndAnalyze);

// Alternative save route (for backward compatibility)
router.post("/save", saveAnalysis);

// Get user's analysis history
router.get("/history", getAnalysisHistory);

// Get dashboard statistics
router.get("/statistics", getDashboardStats);

// Get specific analysis by ID
router.get("/:analysisId", getAnalysisById);

// Delete analysis
router.delete("/:analysisId", deleteAnalysis);

module.exports = router;


