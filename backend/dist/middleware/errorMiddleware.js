"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.notFound = exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    console.error("Error:", err);
    if (err.name === "CastError") {
        const message = "Resource not found";
        error = { name: "CastError", message, statusCode: 404 };
    }
    if (err.code === 11000) {
        const message = "Duplicate field value entered";
        error = { name: "DuplicateKey", message, statusCode: 400 };
    }
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors || {})
            .map((val) => val.message)
            .join(", ");
        error = {
            name: "ValidationError",
            message,
            statusCode: 400,
        };
    }
    if (err.name === "JsonWebTokenError") {
        const message = "Invalid token";
        error = {
            name: "JsonWebTokenError",
            message,
            statusCode: 401,
        };
    }
    if (err.name === "TokenExpiredError") {
        const message = "Token expired";
        error = {
            name: "TokenExpiredError",
            message,
            statusCode: 401,
        };
    }
    if (err.message && err.message.includes("File too large")) {
        const message = "File size too large";
        error = { name: "FileTooLarge", message, statusCode: 400 };
    }
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Server Error",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};
exports.errorHandler = errorHandler;
const notFound = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
};
exports.notFound = notFound;
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
        console.log(`[AsyncHandler] Error in ${req.method} ${req.originalUrl}:`, err);
        next(err);
    });
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=errorMiddleware.js.map