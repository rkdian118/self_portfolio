import express, { Request, Response, NextFunction } from "express";
import { JWTUtils, JWTPayload } from "../utils/jwtUtils";
import { Admin } from "../models/Admin";

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
      admin?: any;
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user: JWTPayload;
  admin: any;
}

/**
 * Middleware to authenticate requests using JWT token
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.header("Authorization");
    const token = JWTUtils.extractTokenFromHeader(authHeader);

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
      return;
    }

    const decoded = JWTUtils.verifyAccessToken(token);

    // Verify admin still exists and is active
    const admin = await Admin.findById(decoded.userId);
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
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : "Invalid token.",
    });
  }
};

/**
 * Middleware to authorize admin roles
 */
export const authorizeAdmin = (roles: string[] = ["admin", "super-admin"]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
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

/**
 * Optional authentication - doesn't fail if no token
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.header("Authorization");
    const token = JWTUtils.extractTokenFromHeader(authHeader);

    if (token) {
      const decoded = JWTUtils.verifyAccessToken(token);
      const admin = await Admin.findById(decoded.userId);

      if (admin && admin.isActive) {
        req.user = decoded;
        req.admin = admin;
      }
    }

    next();
  } catch (error) {
    // Continue without authentication for optional auth
    next();
  }
};
