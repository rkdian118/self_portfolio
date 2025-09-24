import multer from "multer";
import { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads");
const imagesDir = path.join(uploadsDir, "images");
const documentsDir = path.join(uploadsDir, "documents");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}
if (!fs.existsSync(documentsDir)) {
  fs.mkdirSync(documentsDir, { recursive: true });
}

// Local storage configuration
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isImage = file.mimetype.startsWith("image/");
    const dir = isImage ? "uploads/images" : "uploads/documents";
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    const isImage = file.mimetype.startsWith("image/");
    const prefix = isImage ? "image" : "cv";
    cb(null, `${prefix}-${uniqueSuffix}${extension}`);
  },
});

// Use local storage for all uploads
const imageStorage = localStorage;
const documentStorage = localStorage;

// File filter function
const fileFilter = (allowedTypes: string[]) => {
  return (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    const fileExtension = file.originalname.split(".").pop()?.toLowerCase();

    if (allowedTypes.includes(fileExtension || "")) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`
        )
      );
    }
  };
};

// Image upload configuration
export const uploadImage = multer({
  storage: imageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: fileFilter(["jpg", "jpeg", "png", "webp"]),
});

// Document upload configuration
export const uploadDocument = multer({
  storage: documentStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: fileFilter(["pdf"]),
});

// Memory storage for temporary processing
export const uploadMemory = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

/**
 * Upload error handler
 */
export const handleUploadError = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error instanceof multer.MulterError) {
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
    error:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Internal server error",
  });
};

/**
 * Delete file from local storage
 */
export const deleteLocalFile = async (filePath: string): Promise<void> => {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};

/**
 * Extract file path from URL
 */
export const extractFilePath = (url: string): string => {
  return url.replace(process.env.BACKEND_URL || "http://localhost:5000", "");
};
