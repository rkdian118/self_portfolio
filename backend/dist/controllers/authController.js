"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = exports.verifyToken = exports.changePassword = exports.updateProfile = exports.getProfile = exports.logout = exports.refreshToken = exports.login = void 0;
const Admin_1 = require("../models/Admin");
const jwtUtils_1 = require("../utils/jwtUtils");
const errorMiddleware_1 = require("../middleware/errorMiddleware");
exports.login = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    const admin = await Admin_1.Admin.findOne({ email, isActive: true }).select("+password");
    if (!admin || !(await admin.comparePassword(password))) {
        res.status(401).json({
            success: false,
            message: "Invalid email or password",
        });
        return;
    }
    const tokenPair = jwtUtils_1.JWTUtils.generateTokenPair({
        userId: admin._id,
        email: admin.email,
        role: admin.role === "super-admin" ? "admin" : admin.role,
    });
    admin.refreshTokens.push(tokenPair.refreshToken);
    admin.lastLoginAt = new Date();
    await admin.save();
    res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                lastLoginAt: admin.lastLoginAt,
            },
            tokens: tokenPair,
        },
    });
});
exports.refreshToken = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        res.status(401).json({
            success: false,
            message: "Refresh token is required",
        });
        return;
    }
    try {
        const decoded = jwtUtils_1.JWTUtils.verifyRefreshToken(refreshToken);
        const admin = await Admin_1.Admin.findById(decoded.userId);
        if (!admin ||
            !admin.isActive ||
            !admin.refreshTokens.includes(refreshToken)) {
            res.status(401).json({
                success: false,
                message: "Invalid refresh token",
            });
            return;
        }
        const newTokenPair = jwtUtils_1.JWTUtils.generateTokenPair({
            userId: admin._id,
            email: admin.email,
            role: admin.role === "super-admin" ? "admin" : admin.role,
        });
        admin.refreshTokens = admin.refreshTokens.filter((token) => token !== refreshToken);
        admin.refreshTokens.push(newTokenPair.refreshToken);
        await admin.save();
        res.status(200).json({
            success: true,
            message: "Tokens refreshed successfully",
            data: {
                tokens: newTokenPair,
            },
        });
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: error instanceof Error ? error.message : "Invalid refresh token",
        });
    }
});
exports.logout = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { refreshToken } = req.body;
    const adminId = req.user?.userId;
    if (adminId) {
        const admin = await Admin_1.Admin.findById(adminId);
        if (admin && refreshToken) {
            admin.refreshTokens = admin.refreshTokens.filter((token) => token !== refreshToken);
            await admin.save();
        }
    }
    res.status(200).json({
        success: true,
        message: "Logout successful",
    });
});
exports.getProfile = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const admin = await Admin_1.Admin.findById(req.user?.userId);
    if (!admin) {
        res.status(404).json({
            success: false,
            message: "Admin not found",
        });
        return;
    }
    res.status(200).json({
        success: true,
        data: {
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                lastLoginAt: admin.lastLoginAt,
                createdAt: admin.createdAt,
            },
        },
    });
});
exports.updateProfile = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { name, email } = req.body;
    const admin = await Admin_1.Admin.findById(req.user?.userId);
    if (!admin) {
        res.status(404).json({
            success: false,
            message: "Admin not found",
        });
        return;
    }
    admin.name = name || admin.name;
    admin.email = email || admin.email;
    await admin.save();
    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: {
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
        },
    });
});
exports.changePassword = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin_1.Admin.findById(req.user?.userId).select("+password");
    if (!admin) {
        res.status(404).json({
            success: false,
            message: "Admin not found",
        });
        return;
    }
    const isCurrentPasswordValid = await admin.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
        res.status(400).json({
            success: false,
            message: "Current password is incorrect",
        });
        return;
    }
    admin.password = newPassword;
    admin.refreshTokens = [];
    await admin.save();
    res.status(200).json({
        success: true,
        message: "Password changed successfully",
    });
});
exports.verifyToken = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const admin = await Admin_1.Admin.findById(req.user?.userId);
    if (!admin || !admin.isActive) {
        res.status(401).json({
            success: false,
            message: "Invalid token",
        });
        return;
    }
    res.status(200).json({
        success: true,
        message: "Token is valid",
        data: {
            user: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                isActive: admin.isActive,
                createdAt: admin.createdAt,
                updatedAt: admin.lastLoginAt,
            },
        },
    });
});
exports.getDashboardStats = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const [Hero, Project, Experience, Education, Contact, ContactForm] = await Promise.all([
        Promise.resolve().then(() => __importStar(require("../models/Hero"))).then((m) => m.Hero),
        Promise.resolve().then(() => __importStar(require("../models/Project"))).then((m) => m.Project),
        Promise.resolve().then(() => __importStar(require("../models/Experience"))).then((m) => m.Experience),
        Promise.resolve().then(() => __importStar(require("../models/Education"))).then((m) => m.Education),
        Promise.resolve().then(() => __importStar(require("../models/Contact"))).then((m) => m.Contact),
        Promise.resolve().then(() => __importStar(require("../models/ContactForm"))).then((m) => m.ContactForm),
    ]);
    const [totalProjects, totalExperiences, totalEducation, totalContactForms, unreadContactForms, activeProjects, featuredProjects,] = await Promise.all([
        Project.countDocuments({ isActive: true }),
        Experience.countDocuments({ isActive: true }),
        Education.countDocuments({ isActive: true }),
        ContactForm.countDocuments(),
        ContactForm.countDocuments({ isRead: false }),
        Project.countDocuments({ isActive: true, status: "completed" }),
        Project.countDocuments({ isActive: true, isFeatured: true }),
    ]);
    res.status(200).json({
        success: true,
        data: {
            totalProjects,
            totalExperiences,
            totalEducation,
            totalContactForms,
            unreadContactForms,
            activeProjects,
            featuredProjects,
        },
    });
});
//# sourceMappingURL=authController.js.map