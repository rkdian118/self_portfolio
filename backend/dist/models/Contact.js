"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contact = void 0;
const mongoose_1 = require("mongoose");
const ContactSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        required: [true, "Phone is required"],
        trim: true,
    },
    linkedin: {
        type: String,
        required: [true, "LinkedIn is required"],
        trim: true,
    },
    github: {
        type: String,
        required: [true, "GitHub is required"],
        trim: true,
    },
    location: {
        type: String,
        required: [true, "Location is required"],
        trim: true,
        maxlength: [200, "Location cannot exceed 200 characters"],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
    collection: "contact",
});
exports.Contact = (0, mongoose_1.model)("Contact", ContactSchema);
//# sourceMappingURL=Contact.js.map