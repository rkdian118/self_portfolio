"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            throw new Error("MONGODB_URI is not defined");
        }
        const options = {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4,
        };
        const conn = await mongoose_1.default.connect(mongoURI, options);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        mongoose_1.default.connection.on("connected", () => {
            console.log("Mongoose connected to MongoDB");
        });
        mongoose_1.default.connection.on("error", (err) => {
            console.error("Mongoose connection error:", err);
        });
        mongoose_1.default.connection.on("disconnected", () => {
            console.log("Mongoose disconnected");
        });
        process.on("SIGINT", async () => {
            await mongoose_1.default.connection.close();
            console.log("MongoDB connection closed through app termination");
            process.exit(0);
        });
    }
    catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
const disconnectDB = async () => {
    await mongoose_1.default.connection.close();
};
exports.disconnectDB = disconnectDB;
//# sourceMappingURL=database.js.map