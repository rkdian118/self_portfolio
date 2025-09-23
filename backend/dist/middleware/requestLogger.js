"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = exports.securityHeaders = exports.requestLogger = void 0;
const cryptoUtils_1 = require("../utils/cryptoUtils");
const requestLogger = (req, res, next) => {
    const loggedReq = req;
    loggedReq.requestId = cryptoUtils_1.CryptoUtils.generateToken(8);
    loggedReq.startTime = Date.now();
    console.log(`📨 [${loggedReq.requestId}] ${req.method} ${req.originalUrl}`, {
        ip: req.ip,
        userAgent: req.get("User-Agent"),
        timestamp: new Date().toISOString(),
    });
    res.on("finish", () => {
        const duration = Date.now() - loggedReq.startTime;
        const statusCode = res.statusCode;
        const statusEmoji = statusCode >= 400 ? "❌" : statusCode >= 300 ? "⚠️" : "✅";
        console.log(`📤 [${loggedReq.requestId}] ${statusEmoji} ${statusCode} - ${duration}ms`);
    });
    next();
};
exports.requestLogger = requestLogger;
const securityHeaders = (req, res, next) => {
    res.removeHeader("X-Powered-By");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    next();
};
exports.securityHeaders = securityHeaders;
const validateRequest = (req, res, next) => {
    if (!req.headers["content-type"] &&
        ["POST", "PUT", "PATCH"].includes(req.method)) {
        res.status(400).json({
            success: false,
            message: "Content-Type header is required",
        });
        return;
    }
    if (req.headers["content-length"]) {
        const contentLength = parseInt(req.headers["content-length"]);
        const maxSize = 10 * 1024 * 1024;
        if (contentLength > maxSize) {
            res.status(413).json({
                success: false,
                message: "Payload too large",
            });
            return;
        }
    }
    next();
};
exports.validateRequest = validateRequest;
//# sourceMappingURL=requestLogger.js.map