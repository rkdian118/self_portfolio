"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const mongoose_1 = require("mongoose");
const cryptoUtils_1 = require("../utils/cryptoUtils");
const AdminSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters long"],
        select: false,
    },
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        maxlength: [100, "Name cannot exceed 100 characters"],
    },
    role: {
        type: String,
        enum: ["admin", "super-admin"],
        default: "admin",
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    lastLoginAt: {
        type: Date,
    },
    refreshTokens: [
        {
            type: String,
        },
    ],
}, {
    timestamps: true,
    collection: "admins",
});
AdminSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    try {
        this.password = await cryptoUtils_1.CryptoUtils.hashPassword(this.password);
        next();
    }
    catch (error) {
        next(error);
    }
});
AdminSchema.methods.comparePassword = async function (candidatePassword) {
    return await cryptoUtils_1.CryptoUtils.verifyPassword(candidatePassword, this.password);
};
AdminSchema.index({ email: 1 });
AdminSchema.index({ isActive: 1 });
exports.Admin = (0, mongoose_1.model)("Admin", AdminSchema);
//# sourceMappingURL=Admin.js.map