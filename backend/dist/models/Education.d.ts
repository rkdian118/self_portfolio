import { Document } from "mongoose";
export interface IEducation extends Document {
    degree: string;
    institution: string;
    duration: string;
    location: string;
    description?: string;
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Education: import("mongoose").Model<IEducation, {}, {}, {}, Document<unknown, {}, IEducation, {}, {}> & IEducation & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Education.d.ts.map