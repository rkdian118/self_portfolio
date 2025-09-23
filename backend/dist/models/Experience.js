"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Experience = void 0;
const mongoose_1 = require("mongoose");
const ExperienceSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Job title is required"],
        trim: true,
        maxlength: [100, "Title cannot exceed 100 characters"],
    },
    company: {
        type: String,
        required: [true, "Company name is required"],
        trim: true,
        maxlength: [100, "Company name cannot exceed 100 characters"],
    },
    website: {
        type: String,
        required: [true, "Company website is required"],
        trim: true,
    },
    duration: {
        type: String,
        required: [true, "Duration is required"],
        trim: true,
        maxlength: [50, "Duration cannot exceed 50 characters"],
    },
    location: {
        type: String,
        required: [true, "Location is required"],
        trim: true,
        maxlength: [100, "Location cannot exceed 100 characters"],
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true,
        maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    order: {
        type: Number,
        default: 0,
        min: [0, "Order cannot be negative"],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
    collection: "experiences",
});
ExperienceSchema.index({ order: 1 });
ExperienceSchema.index({ isActive: 1 });
ExperienceSchema.index({ company: "text", title: "text", description: "text" });
exports.Experience = (0, mongoose_1.model)("Experience", ExperienceSchema);
//# sourceMappingURL=Experience.js.map