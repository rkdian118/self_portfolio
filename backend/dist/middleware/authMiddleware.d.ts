import { Request, Response, NextFunction } from "express";
import { JWTPayload } from "../utils/jwtUtils";
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
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const authorizeAdmin: (roles?: string[]) => (req: Request, res: Response, next: NextFunction) => void;
export declare const optionalAuth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=authMiddleware.d.ts.map