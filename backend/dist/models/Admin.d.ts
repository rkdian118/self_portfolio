import { Document } from "mongoose";
export interface IAdmin extends Document {
    email: string;
    password: string;
    name: string;
    role: "admin" | "super-admin";
    isActive: boolean;
    lastLoginAt?: Date;
    refreshTokens: string[];
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
export declare const Admin: import("mongoose").Model<IAdmin, {}, {}, {}, Document<unknown, {}, IAdmin, {}, {}> & IAdmin & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Admin.d.ts.map