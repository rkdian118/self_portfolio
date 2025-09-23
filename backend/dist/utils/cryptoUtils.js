"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoUtils = void 0;
const crypto_1 = __importDefault(require("crypto"));
const ENCRYPTION_KEY = (process.env.ENCRYPTION_KEY &&
    Buffer.from(process.env.ENCRYPTION_KEY, "hex")) ||
    crypto_1.default.randomBytes(32);
const IV_LENGTH = 16;
class CryptoUtils {
    static encrypt(text) {
        try {
            const iv = crypto_1.default.randomBytes(IV_LENGTH);
            const cipher = crypto_1.default.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
            const encrypted = Buffer.concat([
                cipher.update(text, "utf8"),
                cipher.final(),
            ]);
            return {
                encryptedData: encrypted.toString("hex"),
                iv: iv.toString("hex"),
            };
        }
        catch (error) {
            throw new Error(`Encryption failed: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    static decrypt(encryptedData, ivHex) {
        try {
            const iv = Buffer.from(ivHex, "hex");
            const decipher = crypto_1.default.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
            const decrypted = Buffer.concat([
                decipher.update(Buffer.from(encryptedData, "hex")),
                decipher.final(),
            ]);
            return decrypted.toString("utf8");
        }
        catch (error) {
            throw new Error(`Decryption failed: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    static generateToken(length = 32) {
        return crypto_1.default.randomBytes(length).toString("hex");
    }
    static createHash(data, algorithm = "sha256") {
        return crypto_1.default.createHash(algorithm).update(data).digest("hex");
    }
    static async hashPassword(password) {
        const bcrypt = require("bcryptjs");
        const saltRounds = 12;
        return bcrypt.hash(password, saltRounds);
    }
    static async verifyPassword(password, hash) {
        const bcrypt = require("bcryptjs");
        return bcrypt.compare(password, hash);
    }
    static encryptObjectFields(obj, fields) {
        const result = { ...obj };
        fields.forEach((field) => {
            if (result[field]) {
                const encrypted = this.encrypt(String(result[field]));
                result[field] = encrypted.encryptedData;
                result[`${field}_iv`] = encrypted.iv;
            }
        });
        return result;
    }
    static decryptObjectFields(obj, fields) {
        const result = { ...obj };
        fields.forEach((field) => {
            if (result[field] && result[`${field}_iv`]) {
                result[field] = this.decrypt(result[field], result[`${field}_iv`]);
                delete result[`${field}_iv`];
            }
        });
        return result;
    }
}
exports.CryptoUtils = CryptoUtils;
//# sourceMappingURL=cryptoUtils.js.map