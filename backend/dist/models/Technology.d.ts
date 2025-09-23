import mongoose, { Document } from "mongoose";
export interface ITechnology extends Document {
    name: string;
    category: string;
    proficiency: number;
    icon?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Technology: mongoose.Model<ITechnology, {}, {}, {}, mongoose.Document<unknown, {}, ITechnology, {}, {}> & ITechnology & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Technology.d.ts.map