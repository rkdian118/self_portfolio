"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPublicId = exports.deleteCloudinaryFile = exports.handleUploadError = exports.uploadMemory = exports.uploadDocument = exports.uploadImage = void 0;
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const isCloudinaryConfigured = () => {
    const configured = process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET;
    return configured;
};
if (isCloudinaryConfigured()) {
    cloudinary_1.v2.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
}
const uploadsDir = path_1.default.join(process.cwd(), "uploads");
const imagesDir = path_1.default.join(uploadsDir, "images");
const documentsDir = path_1.default.join(uploadsDir, "documents");
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs_1.default.existsSync(imagesDir)) {
    fs_1.default.mkdirSync(imagesDir, { recursive: true });
}
if (!fs_1.default.existsSync(documentsDir)) {
    fs_1.default.mkdirSync(documentsDir, { recursive: true });
}
const localStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const isImage = file.mimetype.startsWith("image/");
        const dir = isImage ? imagesDir : documentsDir;
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
let imageStorage;
let documentStorage;
if (isCloudinaryConfigured()) {
    imageStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
        cloudinary: cloudinary_1.v2,
        params: {
            folder: "uploads/images",
            allowed_formats: ["jpg", "jpeg", "png", "webp"],
            transformation: [
                {
                    width: 1200,
                    height: 800,
                    crop: "limit",
                    quality: "auto",
                    format: "auto",
                },
            ],
        },
    });
    documentStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
        cloudinary: cloudinary_1.v2,
        params: {
            folder: "uploads/documents",
            allowed_formats: ["pdf", "doc", "docx"],
            resource_type: "raw",
        },
    });
}
else {
    imageStorage = localStorage;
    documentStorage = localStorage;
}
const fileFilter = (allowedTypes) => {
    return (req, file, cb) => {
        const fileExtension = file.originalname.split(".").pop()?.toLowerCase();
        if (allowedTypes.includes(fileExtension || "")) {
            cb(null, true);
        }
        else {
            cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(", ")}`));
        }
    };
};
exports.uploadImage = (0, multer_1.default)({
    storage: imageStorage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: fileFilter(["jpg", "jpeg", "png", "webp"]),
});
exports.uploadDocument = (0, multer_1.default)({
    storage: documentStorage,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
    fileFilter: fileFilter(["pdf", "doc", "docx"]),
});
exports.uploadMemory = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
});
const handleUploadError = (error, req, res, next) => {
    if (error instanceof multer_1.default.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
            res.status(400).json({
                success: false,
                message: "File too large. Maximum size is 10MB.",
            });
            return;
        }
        if (error.code === "LIMIT_FILE_COUNT") {
            res.status(400).json({
                success: false,
                message: "Too many files. Maximum is 1 file per upload.",
            });
            return;
        }
    }
    if (error.message && error.message.includes("Invalid file type")) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
        return;
    }
    console.error("Upload error:", error);
    res.status(500).json({
        success: false,
        message: "File upload failed",
        error: process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
    });
};
exports.handleUploadError = handleUploadError;
const deleteCloudinaryFile = async (publicId) => {
    try {
        if (isCloudinaryConfigured()) {
            await cloudinary_1.v2.uploader.destroy(publicId);
        }
        else {
            const filePath = path_1.default.join(process.cwd(), publicId);
            if (fs_1.default.existsSync(filePath)) {
                fs_1.default.unlinkSync(filePath);
            }
        }
    }
    catch (error) {
        console.error("Error deleting file:", error);
    }
};
exports.deleteCloudinaryFile = deleteCloudinaryFile;
const extractPublicId = (url) => {
    if (isCloudinaryConfigured()) {
        const parts = url.split("/");
        const filename = parts[parts.length - 1];
        if (!filename) {
            return "";
        }
        return filename.split(".")[0];
    }
    else {
        return url.replace(process.env.BACKEND_URL || "http://localhost:5000", "");
    }
};
exports.extractPublicId = extractPublicId;
//# sourceMappingURL=uploadMiddleware.js.map