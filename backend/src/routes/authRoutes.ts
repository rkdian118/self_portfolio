import { Router } from "express";
import {
  login,
  refreshToken,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  verifyToken,
  getDashboardStats,
} from "../controllers/authController";
import { authenticate } from "../middleware/authMiddleware";
import {
  validateLogin,
  handleValidationErrors,
} from "../middleware/validationMiddleware";
import { body } from "express-validator";

const router = Router();

// @route   POST /api/auth/login
// @desc    Admin login
// @access  Public
router.post("/login", validateLogin, login);

// @route   POST /api/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post(
  "/refresh",
  [
    body("refreshToken").notEmpty().withMessage("Refresh token is required"),
    handleValidationErrors,
  ],
  refreshToken
);

// @route   POST /api/auth/logout
// @desc    Logout admin
// @access  Private
router.post(
  "/logout",
  authenticate,
  [
    body("refreshToken").notEmpty().withMessage("Refresh token is required"),
    handleValidationErrors,
  ],
  logout
);

// @route   GET /api/auth/verify
// @desc    Verify token
// @access  Private
router.get("/verify", authenticate, verifyToken);

// @route   GET /api/auth/profile
// @desc    Get admin profile
// @access  Private
router.get("/profile", authenticate, getProfile);

// @route   PUT /api/auth/profile
// @desc    Update admin profile
// @access  Private
router.put(
  "/profile",
  authenticate,
  [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage("Name must be between 2 and 100 characters"),
    body("email")
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage("Please enter a valid email"),
    handleValidationErrors,
  ],
  updateProfile
);

// @route   PUT /api/auth/change-password
// @desc    Change admin password
// @access  Private
router.put(
  "/change-password",
  authenticate,
  [
    body("currentPassword")
      .notEmpty()
      .withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 8 })
      .withMessage("New password must be at least 8 characters long")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]/
      )
      .withMessage(
        "New password must contain at least one uppercase letter, lowercase letter, number, and special character"
      ),
    handleValidationErrors,
  ],
  changePassword
);

// @route   GET /api/auth/dashboard-stats
// @desc    Get dashboard statistics
// @access  Private
router.get("/dashboard-stats", authenticate, getDashboardStats);

export default router;
