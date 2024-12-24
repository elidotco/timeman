const express = require("express");
const {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
} = require("../controllers/authController");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", register); // Register new users
router.post("/login", login); // Login existing users
router.post("/refresh-token", refreshToken); // Refresh access token
router.post("/logout", logout); // Logout user
router.get("/profile", authenticate, getProfile); // Get user profile

module.exports = router;
