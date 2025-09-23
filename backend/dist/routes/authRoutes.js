"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
router.post("/login", validationMiddleware_1.validateLogin, authController_1.login);
router.post("/refresh", [
    (0, express_validator_1.body)("refreshToken").notEmpty().withMessage("Refresh token is required"),
    validationMiddleware_1.handleValidationErrors,
], authController_1.refreshToken);
router.post("/logout", authMiddleware_1.authenticate, [
    (0, express_validator_1.body)("refreshToken").notEmpty().withMessage("Refresh token is required"),
    validationMiddleware_1.handleValidationErrors,
], authController_1.logout);
router.get("/verify", authMiddleware_1.authenticate, authController_1.verifyToken);
router.get("/profile", authMiddleware_1.authenticate, authController_1.getProfile);
router.put("/profile", authMiddleware_1.authenticate, [
    (0, express_validator_1.body)("name")
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Name must be between 2 and 100 characters"),
    (0, express_validator_1.body)("email")
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage("Please enter a valid email"),
    validationMiddleware_1.handleValidationErrors,
], authController_1.updateProfile);
router.put("/change-password", authMiddleware_1.authenticate, [
    (0, express_validator_1.body)("currentPassword")
        .notEmpty()
        .withMessage("Current password is required"),
    (0, express_validator_1.body)("newPassword")
        .isLength({ min: 8 })
        .withMessage("New password must be at least 8 characters long")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]/)
        .withMessage("New password must contain at least one uppercase letter, lowercase letter, number, and special character"),
    validationMiddleware_1.handleValidationErrors,
], authController_1.changePassword);
router.get("/dashboard-stats", authMiddleware_1.authenticate, authController_1.getDashboardStats);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map