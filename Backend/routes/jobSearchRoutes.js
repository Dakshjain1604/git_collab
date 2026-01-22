const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authMiddleware");
const { searchJobs } = require("../controller/JobSearchController");

router.post("/search", authenticate, searchJobs);

module.exports = router;

