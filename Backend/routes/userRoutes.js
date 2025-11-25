const express = require("express");
const { authenticate } = require("../middleware/authMiddleware");
const { getCurrentUser, updateProfile } = require("../controller/UserController");

const router = express.Router();

router.get("/me", authenticate, getCurrentUser);
router.put("/me", authenticate, updateProfile);

module.exports = router;