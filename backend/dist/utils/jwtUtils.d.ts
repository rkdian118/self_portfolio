import { Types } from "mongoose";
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
export declare class JWTUtils {
    private static readonly ACCESS_TOKEN_SECRET;
    private static readonly REFRESH_TOKEN_SECRET;
    private static readonly ACCESS_TOKEN_EXPIRE;
    private static readonly REFRESH_TOKEN_EXPIRE;
    static generateAccessToken(payload: Omit<JWTPayload, "iat" | "exp">): string;
    static generateRefreshToken(payload: Omit<JWTPayload, "iat" | "exp">): string;
    static generateTokenPair(payload: Omit<JWTPayload, "iat" | "exp">): TokenPair;
    static verifyAccessToken(token: string): JWTPayload;
    static verifyRefreshToken(token: string): JWTPayload;
    static extractTokenFromHeader(authHeader?: string): string | null;
    static getTokenExpiration(token: string): Date | null;
}
//# sourceMappingURL=jwtUtils.d.ts.map