"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const heroRoutes_1 = __importDefault(require("./routes/heroRoutes"));
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
const experienceRoutes_1 = __importDefault(require("./routes/experienceRoutes"));
const educationRoutes_1 = __importDefault(require("./routes/educationRoutes"));
const contactRoutes_1 = __importDefault(require("./routes/contactRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const technologyRoutes_1 = __importDefault(require("./routes/technologyRoutes"));
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const errorMiddleware_2 = require("./middleware/errorMiddleware");
const requestLogger_1 = require("./middleware/requestLogger");
dotenv_1.default.config({ path: "../../.env" });
const app = (0, express_1.default)();
const PORT = process.env.NODE_PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const limiter = (0, express_rate_limit_1.default)({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000"),
    max: parseInt(process.env.RATE_LIMIT_MAX || "1000"),
    message: {
        error: "Too many requests from this IP, please try again later.",
    },
});
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)("combined"));
app.use(limiter);
app.use((0, cors_1.default)({
    origin: "*",
    credentials: true,
}));
app.use("/uploads", express_1.default.static("uploads"));
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
app.use(requestLogger_1.requestLogger);
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});
app.use("/api/hero", heroRoutes_1.default);
app.use("/api/projects", projectRoutes_1.default);
app.use("/api/experience", experienceRoutes_1.default);
app.use("/api/education", educationRoutes_1.default);
app.use("/api/contact", contactRoutes_1.default);
app.use("/api/auth", authRoutes_1.default);
app.use("/api/technologies", technologyRoutes_1.default);
app.use(errorMiddleware_2.notFound);
app.use(errorMiddleware_1.errorHandler);
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }
        const conn = await mongoose_1.default.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error("❌ Error connecting to MongoDB:", error);
        process.exit(1);
    }
};
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
            console.log(`📊 Health check: http://localhost:${PORT}/health`);
        });
    }
    catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};
process.on("unhandledRejection", (err) => {
    console.error("❌ Unhandled Rejection:", err.message);
    process.exit(1);
});
process.on("uncaughtException", (err) => {
    console.error("❌ Uncaught Exception:", err.message);
    process.exit(1);
});
startServer();
exports.default = app;
//# sourceMappingURL=server.js.map