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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTUtils = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log(process.env.JWT_SECRET);
class JWTUtils {
    static ACCESS_TOKEN_SECRET = (() => {
        if (!process.env.JWT_SECRET) {
            throw new Error("Missing env variable: JWT_SECRET");
        }
        return process.env.JWT_SECRET;
    })();
    static REFRESH_TOKEN_SECRET = (() => {
        if (!process.env.JWT_REFRESH_SECRET) {
            throw new Error("Missing env variable: JWT_REFRESH_SECRET");
        }
        return process.env.JWT_REFRESH_SECRET;
    })();
    static ACCESS_TOKEN_EXPIRE = process.env.JWT_EXPIRE || "1h";
    static REFRESH_TOKEN_EXPIRE = process.env.JWT_REFRESH_EXPIRE || "7d";
    static generateAccessToken(payload) {
        return jsonwebtoken_1.default.sign(payload, JWTUtils.ACCESS_TOKEN_SECRET, {
            expiresIn: JWTUtils.ACCESS_TOKEN_EXPIRE,
            issuer: "portfolio-api",
            audience: "portfolio-frontend",
        });
    }
    static generateRefreshToken(payload) {
        return jsonwebtoken_1.default.sign(payload, JWTUtils.REFRESH_TOKEN_SECRET, {
            expiresIn: JWTUtils.REFRESH_TOKEN_EXPIRE,
            issuer: "portfolio-api",
            audience: "portfolio-frontend",
        });
    }
    static generateTokenPair(payload) {
        return {
            accessToken: JWTUtils.generateAccessToken(payload),
            refreshToken: JWTUtils.generateRefreshToken(payload),
        };
    }
    static verifyAccessToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, JWTUtils.ACCESS_TOKEN_SECRET);
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.TokenExpiredError) {
                throw new Error("Access token expired");
            }
            if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
                throw new Error("Invalid access token");
            }
            throw new Error("Access token verification failed");
        }
    }
    static verifyRefreshToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, JWTUtils.REFRESH_TOKEN_SECRET);
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.TokenExpiredError) {
                throw new Error("Refresh token expired");
            }
            if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
                throw new Error("Invalid refresh token");
            }
            throw new Error("Refresh token verification failed");
        }
    }
    static extractTokenFromHeader(authHeader) {
        if (!authHeader?.startsWith("Bearer "))
            return null;
        return authHeader.slice(7);
    }
    static getTokenExpiration(token) {
        const decoded = jsonwebtoken_1.default.decode(token);
        return decoded?.exp ? new Date(decoded.exp * 1000) : null;
    }
}
exports.JWTUtils = JWTUtils;
//# sourceMappingURL=jwtUtils.js.map