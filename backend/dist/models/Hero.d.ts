import { Document } from "mongoose";
export interface IHero extends Document {
    name: string;
    title: string;
    bio: string;
    yearsExperience: number;
    cvUrl?: string;
    profileImage?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Hero: import("mongoose").Model<IHero, {}, {}, {}, Document<unknown, {}, IHero, {}, {}> & IHero & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Hero.d.ts.map