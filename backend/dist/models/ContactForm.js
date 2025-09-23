"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactForm = void 0;
const mongoose_1 = require("mongoose");
const ContactFormSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    role: {
        type: String,
        required: [true, "Role/Position is required"],
        trim: true,
        maxlength: [100, "Role cannot exceed 100 characters"],
    },
    company: {
        type: String,
        required: [true, "Company is required"],
        trim: true,
        maxlength: [100, "Company cannot exceed 100 characters"],
    },
    message: {
        type: String,
        required: [true, "Message is required"],
        trim: true,
        maxlength: [2000, "Message cannot exceed 2000 characters"],
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    isArchived: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    collection: "contact_forms",
});
ContactFormSchema.index({ isRead: 1 });
ContactFormSchema.index({ isArchived: 1 });
ContactFormSchema.index({ createdAt: -1 });
ContactFormSchema.index({ email: 1 });
exports.ContactForm = (0, mongoose_1.model)("ContactForm", ContactFormSchema);
//# sourceMappingURL=ContactForm.js.map