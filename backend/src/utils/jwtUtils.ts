import jwt, {
  SignOptions,
  JsonWebTokenError,
  TokenExpiredError,
} from "jsonwebtoken";
import { Types } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export interface JWTPayload {
  userId: Types.ObjectId;
  email: string;
  role: "admin" | "user";
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
console.log(process.env.JWT_SECRET);

export class JWTUtils {
  // Load secrets from environment and validate at startup
  private static readonly ACCESS_TOKEN_SECRET: string = (() => {
    if (!process.env.JWT_SECRET) {
      throw new Error("Missing env variable: JWT_SECRET");
    }
    return process.env.JWT_SECRET;
  })();

  private static readonly REFRESH_TOKEN_SECRET: string = (() => {
    if (!process.env.JWT_REFRESH_SECRET) {
      throw new Error("Missing env variable: JWT_REFRESH_SECRET");
    }
    return process.env.JWT_REFRESH_SECRET;
  })();

  private static readonly ACCESS_TOKEN_EXPIRE: string =
    process.env.JWT_EXPIRE || "1h";

  private static readonly REFRESH_TOKEN_EXPIRE: string =
    process.env.JWT_REFRESH_EXPIRE || "7d";

  /**
   * Generate an access token
   */
  static generateAccessToken(payload: Omit<JWTPayload, "iat" | "exp">): string {
    return jwt.sign(payload, JWTUtils.ACCESS_TOKEN_SECRET, {
      expiresIn: JWTUtils.ACCESS_TOKEN_EXPIRE,
      issuer: "portfolio-api",
      audience: "portfolio-frontend",
    } as SignOptions);
  }

  /**
   * Generate a refresh token
   */
  static generateRefreshToken(
    payload: Omit<JWTPayload, "iat" | "exp">
  ): string {
    return jwt.sign(payload, JWTUtils.REFRESH_TOKEN_SECRET, {
      expiresIn: JWTUtils.REFRESH_TOKEN_EXPIRE,
      issuer: "portfolio-api",
      audience: "portfolio-frontend",
    } as SignOptions);
  }

  /**
   * Generate both access and refresh tokens
   */
  static generateTokenPair(
    payload: Omit<JWTPayload, "iat" | "exp">
  ): TokenPair {
    return {
      accessToken: JWTUtils.generateAccessToken(payload),
      refreshToken: JWTUtils.generateRefreshToken(payload),
    };
  }

  /**
   * Verify an access token
   */
  static verifyAccessToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, JWTUtils.ACCESS_TOKEN_SECRET) as JWTPayload;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new Error("Access token expired");
      }
      if (error instanceof JsonWebTokenError) {
        throw new Error("Invalid access token");
      }
      throw new Error("Access token verification failed");
    }
  }

  /**
   * Verify a refresh token
   */
  static verifyRefreshToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, JWTUtils.REFRESH_TOKEN_SECRET) as JWTPayload;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new Error("Refresh token expired");
      }
      if (error instanceof JsonWebTokenError) {
        throw new Error("Invalid refresh token");
      }
      throw new Error("Refresh token verification failed");
    }
  }

  /**
   * Extract token from Authorization header ("Bearer <token>")
   */
  static extractTokenFromHeader(authHeader?: string): string | null {
    if (!authHeader?.startsWith("Bearer ")) return null;
    return authHeader.slice(7);
  }

  /**
   * Decode token and get expiration date
   */
  static getTokenExpiration(token: string): Date | null {
    const decoded = jwt.decode(token) as { exp?: number } | null;
    return decoded?.exp ? new Date(decoded.exp * 1000) : null;
  }
}
