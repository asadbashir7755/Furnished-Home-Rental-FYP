const express = require("express");
const { register, login, refreshToken, logout, profile, verifyEmail, sendVerificationEmail, getAuthenticatedUser, sendForgotPasswordEmail, resetPassword } = require("../controllers/authcontroller");
const { verifyToken } = require("../middleware/authmiddleware");
const API_ENDPOINTS = require("../config/apiconfig");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/refresh", refreshToken);
router.post("/logout", logout);
router.get("/profile", verifyToken, profile); // Use verifyToken middleware
router.post("/send-verification-email", sendVerificationEmail); // Add send verification email route
router.post("/verify-email", verifyEmail); // Add verify email route
router.get("/me", verifyToken, getAuthenticatedUser); // Add get authenticated user route
router.post("/forgot-password", sendForgotPasswordEmail); // Add forgot password route
router.post("/reset-password", resetPassword); // Add reset password route

module.exports = router;