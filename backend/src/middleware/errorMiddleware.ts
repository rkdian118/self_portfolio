import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export interface CustomError extends Error {
  statusCode?: number;
  code?: number;
  keyPattern?: any;
  errors?: any;
}

/**
 * Global error handling middleware
 */
export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;

  console.error("Error:", err);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Resource not found";
    error = { name: "CastError", message, statusCode: 404 } as CustomError;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = { name: "DuplicateKey", message, statusCode: 400 } as CustomError;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors || {})
      .map((val: any) => val.message)
      .join(", ");
    error = {
      name: "ValidationError",
      message,
      statusCode: 400,
    } as CustomError;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token";
    error = {
      name: "JsonWebTokenError",
      message,
      statusCode: 401,
    } as CustomError;
  }

  if (err.name === "TokenExpiredError") {
    const message = "Token expired";
    error = {
      name: "TokenExpiredError",
      message,
      statusCode: 401,
    } as CustomError;
  }

  // File upload errors
  if (err.message && err.message.includes("File too large")) {
    const message = "File size too large";
    error = { name: "FileTooLarge", message, statusCode: 400 } as CustomError;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

/**
 * Handle 404 errors
 */
export const notFound = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};

/**
 * Async error handler wrapper
 * Logs errors and passes them to Express error handler
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      console.log(
        `[AsyncHandler] Error in ${req.method} ${req.originalUrl}:`,
        err
      );
      next(err); // Pass to default Express error handler
    });
  };
