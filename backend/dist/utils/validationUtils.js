"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePagination = exports.generateSlug = exports.isValidFileType = exports.sanitizeInput = exports.ValidationMessages = exports.ValidationPatterns = void 0;
exports.ValidationPatterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^\+?[1-9]\d{1,14}$/,
    url: /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&=]*)$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    hexColor: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    objectId: /^[0-9a-fA-F]{24}$/,
    linkedinUrl: /^https?:\/\/(www\.)?linkedin\.com\//,
    githubUrl: /^https?:\/\/github\.com\//,
};
exports.ValidationMessages = {
    email: "Please enter a valid email address",
    phone: "Please enter a valid phone number",
    url: "Please enter a valid URL",
    password: "Password must be at least 8 characters with uppercase, lowercase, number and special character",
    required: (field) => `${field} is required`,
    minLength: (field, min) => `${field} must be at least ${min} characters`,
    maxLength: (field, max) => `${field} cannot exceed ${max} characters`,
    betweenLength: (field, min, max) => `${field} must be between ${min} and ${max} characters`,
    numeric: (field) => `${field} must be a number`,
    boolean: (field) => `${field} must be a boolean`,
    array: (field) => `${field} must be an array`,
    objectId: "Invalid ID format",
    duplicate: (field) => `${field} already exists`,
    notFound: (field) => `${field} not found`,
};
const sanitizeInput = (input) => input.trim().replace(/[<>]/g, "").substring(0, 1000);
exports.sanitizeInput = sanitizeInput;
const isValidFileType = (filename, allowedTypes) => {
    const extension = filename.split(".").pop()?.toLowerCase();
    return extension ? allowedTypes.includes(extension) : false;
};
exports.isValidFileType = isValidFileType;
const generateSlug = (text) => text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
exports.generateSlug = generateSlug;
const validatePagination = (page, limit) => {
    const pageNum = parseInt(page || "1", 10);
    const limitNum = parseInt(limit || "10", 10);
    return {
        page: Math.max(1, isNaN(pageNum) ? 1 : pageNum),
        limit: Math.min(100, Math.max(1, isNaN(limitNum) ? 10 : limitNum)),
    };
};
exports.validatePagination = validatePagination;
//# sourceMappingURL=validationUtils.js.map