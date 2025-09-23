import { Document } from "mongoose";
export interface IContact extends Document {
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    location: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Contact: import("mongoose").Model<IContact, {}, {}, {}, Document<unknown, {}, IContact, {}, {}> & IContact & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Contact.d.ts.map