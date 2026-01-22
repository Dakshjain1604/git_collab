const express = require("express");
const multer = require("multer");
const { authenticate } = require("../middleware/authMiddleware");
const { analyzeResume, getHistory, getStats, deleteHistory } = require("../controller/analysisController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", authenticate, upload.single("resume"), analyzeResume);
router.get("/history", authenticate, getHistory);
router.get("/stats", authenticate, getStats);
router.post("/history/delete", authenticate, deleteHistory);

module.exports = router;
