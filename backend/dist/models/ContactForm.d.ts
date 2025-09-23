import { Document } from "mongoose";
export interface IContactForm extends Document {
    name: string;
    email: string;
    phone?: string;
    role: string;
    company: string;
    message: string;
    isRead: boolean;
    isArchived: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const ContactForm: import("mongoose").Model<IContactForm, {}, {}, {}, Document<unknown, {}, IContactForm, {}, {}> & IContactForm & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=ContactForm.d.ts.map