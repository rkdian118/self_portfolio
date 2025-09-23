export interface EncryptedData {
    encryptedData: string;
    iv: string;
}
export declare class CryptoUtils {
    static encrypt(text: string): EncryptedData;
    static decrypt(encryptedData: string, ivHex: string): string;
    static generateToken(length?: number): string;
    static createHash(data: string, algorithm?: string): string;
    static hashPassword(password: string): Promise<string>;
    static verifyPassword(password: string, hash: string): Promise<boolean>;
    static encryptObjectFields<T extends Record<string, any>>(obj: T, fields: string[]): T;
    static decryptObjectFields<T extends Record<string, any>>(obj: T, fields: string[]): T;
}
//# sourceMappingURL=cryptoUtils.d.ts.map