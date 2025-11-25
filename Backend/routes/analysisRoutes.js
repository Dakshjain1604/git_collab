const express = require("express");
const multer = require("multer");
const { authenticate } = require("../middleware/authMiddleware");
const { analyzeResume, getHistory } = require("../controller/analysisController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", authenticate, upload.single("resume"), analyzeResume);
router.get("/history", authenticate, getHistory);

module.exports = router;

