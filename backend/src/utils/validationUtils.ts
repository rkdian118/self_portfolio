/**
 * Common validation patterns and utilities
 */

export const ValidationPatterns = {
  // Email validation pattern
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  // Phone number validation pattern (international format, E.164)
  phone: /^\+?[1-9]\d{1,14}$/,

  // URL validation pattern
  url: /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&=]*)$/,

  // Password pattern (≥8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
  password:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,

  // Hex color pattern
  hexColor: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,

  // MongoDB ObjectId pattern
  objectId: /^[0-9a-fA-F]{24}$/,

  // LinkedIn URL pattern
  linkedinUrl: /^https?:\/\/(www\.)?linkedin\.com\//,

  // GitHub URL pattern
  githubUrl: /^https?:\/\/github\.com\//,
};

export const ValidationMessages = {
  email: "Please enter a valid email address",
  phone: "Please enter a valid phone number",
  url: "Please enter a valid URL",
  password:
    "Password must be at least 8 characters with uppercase, lowercase, number and special character",
  required: (field: string) => `${field} is required`,
  minLength: (field: string, min: number) =>
    `${field} must be at least ${min} characters`,
  maxLength: (field: string, max: number) =>
    `${field} cannot exceed ${max} characters`,
  betweenLength: (field: string, min: number, max: number) =>
    `${field} must be between ${min} and ${max} characters`,
  numeric: (field: string) => `${field} must be a number`,
  boolean: (field: string) => `${field} must be a boolean`,
  array: (field: string) => `${field} must be an array`,
  objectId: "Invalid ID format",
  duplicate: (field: string) => `${field} already exists`,
  notFound: (field: string) => `${field} not found`,
};

/**
 * Sanitize input string
 */
export const sanitizeInput = (input: string): string =>
  input.trim().replace(/[<>]/g, "").substring(0, 1000);

/**
 * Validate file type
 */
export const isValidFileType = (
  filename: string,
  allowedTypes: string[]
): boolean => {
  const extension = filename.split(".").pop()?.toLowerCase();
  return extension ? allowedTypes.includes(extension) : false;
};

/**
 * Generate slug from string
 */
export const generateSlug = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

/**
 * Validate pagination parameters
 */
export const validatePagination = (page?: string, limit?: string) => {
  const pageNum = parseInt(page || "1", 10);
  const limitNum = parseInt(limit || "10", 10);

  return {
    page: Math.max(1, isNaN(pageNum) ? 1 : pageNum),
    limit: Math.min(100, Math.max(1, isNaN(limitNum) ? 10 : limitNum)),
  };
};
