import { Document } from "mongoose";
export interface IProject extends Document {
    name: string;
    description: string;
    duration: string;
    skills: string;
    website: string;
    image?: string;
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Project: import("mongoose").Model<IProject, {}, {}, {}, Document<unknown, {}, IProject, {}, {}> & IProject & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Project.d.ts.map