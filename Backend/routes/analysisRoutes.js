const express = require("express");
const router = express.Router();
const {
  saveAnalysis,
  getAnalysisHistory,
  getAnalysisById,
  deleteAnalysis,
  getStatistics,
} = require("../controller/AnalysisController");

router.post("/save", saveAnalysis);
router.get("/history", getAnalysisHistory);
router.get("/statistics", getStatistics);
router.get("/:id", getAnalysisById);
router.delete("/:id", deleteAnalysis);

module.exports = router;

