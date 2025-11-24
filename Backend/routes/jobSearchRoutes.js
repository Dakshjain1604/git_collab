const express = require("express");
const router = express.Router();
const { searchJobs } = require("../controller/JobSearchController");

router.post("/search", searchJobs);

module.exports = router;

