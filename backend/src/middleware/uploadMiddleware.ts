import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { Request, Response, NextFunction } from "express";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();
// Check if Cloudinary is configured
const isCloudinaryConfigured = () => {
  const configured =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;

  return configured;
};

// Configure Cloudinary only if credentials are provided
if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

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
    const dir = isImage ? imagesDir : documentsDir;
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Storage configuration based on Cloudinary availability
let imageStorage: any;
let documentStorage: any;

if (isCloudinaryConfigured()) {
  // Cloudinary storage for images
  imageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
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
    } as any,
  });

  // Cloudinary storage for documents
  documentStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "uploads/documents",
      allowed_formats: ["pdf"],
      resource_type: "raw",
      format: "pdf",
    } as any,
  });
} else {
  imageStorage = localStorage;
  documentStorage = localStorage;
}

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
  fileFilter: fileFilter(["pdf", "doc", "docx"]),
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
 * Delete file from Cloudinary or local storage
 */
export const deleteCloudinaryFile = async (publicId: string): Promise<void> => {
  try {
    if (isCloudinaryConfigured()) {
      await cloudinary.uploader.destroy(publicId);
    } else {
      // For local storage, publicId is the file path
      const filePath = path.join(process.cwd(), publicId);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};

/**
 * Extract public ID from Cloudinary URL or local file path
 */
export const extractPublicId = (url: string): string => {
  if (isCloudinaryConfigured()) {
    const parts = url.split("/");
    const filename: any = parts[parts.length - 1];
    if (!filename) {
      return "";
    }
    return filename.split(".")[0];
  } else {
    // For local storage, return the relative path
    return url.replace(process.env.BACKEND_URL || "http://localhost:5000", "");
  }
};
