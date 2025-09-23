"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authorizeAdmin = exports.authenticate = void 0;
const jwtUtils_1 = require("../utils/jwtUtils");
const Admin_1 = require("../models/Admin");
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        const token = jwtUtils_1.JWTUtils.extractTokenFromHeader(authHeader);
        if (!token) {
            res.status(401).json({
                success: false,
                message: "Access denied. No token provided.",
            });
            return;
        }
        const decoded = jwtUtils_1.JWTUtils.verifyAccessToken(token);
        const admin = await Admin_1.Admin.findById(decoded.userId);
        if (!admin || !admin.isActive) {
            res.status(401).json({
                success: false,
                message: "Access denied. Invalid token.",
            });
            return;
        }
        req.user = decoded;
        req.admin = admin;
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: error instanceof Error ? error.message : "Invalid token.",
        });
    }
};
exports.authenticate = authenticate;
const authorizeAdmin = (roles = ["admin", "super-admin"]) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
            return;
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: "Access denied. Insufficient permissions.",
            });
            return;
        }
        next();
    };
};
exports.authorizeAdmin = authorizeAdmin;
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        const token = jwtUtils_1.JWTUtils.extractTokenFromHeader(authHeader);
        if (token) {
            const decoded = jwtUtils_1.JWTUtils.verifyAccessToken(token);
            const admin = await Admin_1.Admin.findById(decoded.userId);
            if (admin && admin.isActive) {
                req.user = decoded;
                req.admin = admin;
            }
        }
        next();
    }
    catch (error) {
        next();
    }
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=authMiddleware.js.map