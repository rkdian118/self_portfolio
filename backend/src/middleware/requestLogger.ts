import { Request, Response, NextFunction } from "express";
import { CryptoUtils } from "../utils/cryptoUtils";

export interface LoggedRequest extends Request {
  requestId: string;
  startTime: number;
}

/**
 * Request logging middleware
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const loggedReq = req as LoggedRequest;
  loggedReq.requestId = CryptoUtils.generateToken(8);
  loggedReq.startTime = Date.now();

  // Log request
  console.log(`📨 [${loggedReq.requestId}] ${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    timestamp: new Date().toISOString(),
  });

  // Log response on finish
  res.on("finish", () => {
    const duration = Date.now() - loggedReq.startTime;
    const statusCode = res.statusCode;
    const statusEmoji =
      statusCode >= 400 ? "❌" : statusCode >= 300 ? "⚠️" : "✅";

    console.log(
      `📤 [${loggedReq.requestId}] ${statusEmoji} ${statusCode} - ${duration}ms`
    );
  });

  next();
};

/**
 * Security headers middleware
 */
export const securityHeaders = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Remove sensitive headers
  res.removeHeader("X-Powered-By");

  // Add security headers
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  next();
};

/**
 * Request validation middleware
 */
export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Check for required headers
  if (
    !req.headers["content-type"] &&
    ["POST", "PUT", "PATCH"].includes(req.method)
  ) {
    res.status(400).json({
      success: false,
      message: "Content-Type header is required",
    });
    return;
  }

  // Validate JSON payload size
  if (req.headers["content-length"]) {
    const contentLength = parseInt(req.headers["content-length"] as string);
    const maxSize = 10 * 1024 * 1024; // 10MB

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
