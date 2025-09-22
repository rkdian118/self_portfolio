import crypto from "crypto";

const ENCRYPTION_KEY =
  (process.env.ENCRYPTION_KEY &&
    Buffer.from(process.env.ENCRYPTION_KEY, "hex")) ||
  crypto.randomBytes(32); // must be 32 bytes for AES-256
const IV_LENGTH = 16; // AES block size

export interface EncryptedData {
  encryptedData: string;
  iv: string;
}

export class CryptoUtils {
  /**
   * Encrypt sensitive data using AES-256-CBC
   */
  static encrypt(text: string): EncryptedData {
    try {
      const iv = crypto.randomBytes(IV_LENGTH);
      const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);

      const encrypted = Buffer.concat([
        cipher.update(text, "utf8"),
        cipher.final(),
      ]);

      return {
        encryptedData: encrypted.toString("hex"),
        iv: iv.toString("hex"),
      };
    } catch (error) {
      throw new Error(
        `Encryption failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Decrypt sensitive data
   */
  static decrypt(encryptedData: string, ivHex: string): string {
    try {
      const iv = Buffer.from(ivHex, "hex");
      const decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        ENCRYPTION_KEY,
        iv
      );

      const decrypted = Buffer.concat([
        decipher.update(Buffer.from(encryptedData, "hex")),
        decipher.final(),
      ]);

      return decrypted.toString("utf8");
    } catch (error) {
      throw new Error(
        `Decryption failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Generate secure random token
   */
  static generateToken(length = 32): string {
    return crypto.randomBytes(length).toString("hex");
  }

  /**
   * Create hash of data
   */
  static createHash(data: string, algorithm = "sha256"): string {
    return crypto.createHash(algorithm).update(data).digest("hex");
  }

  /**
   * Generate secure password hash
   */
  static async hashPassword(password: string): Promise<string> {
    const bcrypt = require("bcryptjs");
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Verify password against hash
   */
  static async verifyPassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    const bcrypt = require("bcryptjs");
    return bcrypt.compare(password, hash);
  }

  /**
   * Encrypt sensitive fields in object
   */
  static encryptObjectFields<T extends Record<string, any>>(
    obj: T,
    fields: string[]
  ): T {
    const result = { ...obj };

    fields.forEach((field) => {
      if (result[field]) {
        const encrypted = this.encrypt(String(result[field]));
        (result as any)[field] = encrypted.encryptedData;
        (result as any)[`${field}_iv`] = encrypted.iv;
      }
    });

    return result;
  }

  /**
   * Decrypt sensitive fields in object
   */
  static decryptObjectFields<T extends Record<string, any>>(
    obj: T,
    fields: string[]
  ): T {
    const result = { ...obj };

    fields.forEach((field) => {
      if (result[field] && result[`${field}_iv`]) {
        (result as any)[field] = this.decrypt(
          result[field],
          result[`${field}_iv`]
        );
        delete result[`${field}_iv`];
      }
    });

    return result;
  }
}
