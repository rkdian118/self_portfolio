"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Education = void 0;
const mongoose_1 = require("mongoose");
const EducationSchema = new mongoose_1.Schema({
    degree: {
        type: String,
        required: [true, "Degree is required"],
        trim: true,
        maxlength: [100, "Degree cannot exceed 100 characters"],
    },
    institution: {
        type: String,
        required: [true, "Institution is required"],
        trim: true,
        maxlength: [200, "Institution cannot exceed 200 characters"],
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
        trim: true,
        maxlength: [1000, "Description cannot exceed 1000 characters"],
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
    collection: "education",
});
EducationSchema.index({ order: 1 });
EducationSchema.index({ isActive: 1 });
exports.Education = (0, mongoose_1.model)("Education", EducationSchema);
//# sourceMappingURL=Education.js.map