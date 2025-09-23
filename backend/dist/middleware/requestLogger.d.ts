import { Request, Response, NextFunction } from "express";
export interface LoggedRequest extends Request {
    requestId: string;
    startTime: number;
}
export declare const requestLogger: (req: Request, res: Response, next: NextFunction) => void;
export declare const securityHeaders: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateRequest: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=requestLogger.d.ts.map