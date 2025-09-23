import { Document } from "mongoose";
export interface IExperience extends Document {
    title: string;
    company: string;
    website: string;
    duration: string;
    location: string;
    description: string;
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Experience: import("mongoose").Model<IExperience, {}, {}, {}, Document<unknown, {}, IExperience, {}, {}> & IExperience & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Experience.d.ts.map