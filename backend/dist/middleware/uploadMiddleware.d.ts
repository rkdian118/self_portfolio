import multer from "multer";
import { Request, Response, NextFunction } from "express";
export declare const uploadImage: multer.Multer;
export declare const uploadDocument: multer.Multer;
export declare const uploadMemory: multer.Multer;
export declare const handleUploadError: (error: any, req: Request, res: Response, next: NextFunction) => void;
export declare const deleteCloudinaryFile: (publicId: string) => Promise<void>;
export declare const extractPublicId: (url: string) => string;
//# sourceMappingURL=uploadMiddleware.d.ts.map