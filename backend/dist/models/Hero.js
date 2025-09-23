"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hero = void 0;
const mongoose_1 = require("mongoose");
const HeroSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        maxlength: [100, "Name cannot exceed 100 characters"],
    },
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        maxlength: [200, "Title cannot exceed 200 characters"],
    },
    bio: {
        type: String,
        required: [true, "Bio is required"],
        trim: true,
        maxlength: [1000, "Bio cannot exceed 1000 characters"],
    },
    yearsExperience: {
        type: Number,
        required: [true, "Years of experience is required"],
        min: [0, "Years of experience cannot be negative"],
        max: [50, "Years of experience cannot exceed 50"],
    },
    cvUrl: {
        type: String,
        trim: true,
    },
    profileImage: {
        type: String,
        trim: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
    collection: "hero",
});
HeroSchema.index({ isActive: 1 });
exports.Hero = (0, mongoose_1.model)("Hero", HeroSchema);
//# sourceMappingURL=Hero.js.map