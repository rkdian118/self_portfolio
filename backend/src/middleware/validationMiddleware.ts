import { body, param, query, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

/**
 * Handle validation result
 */
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((error) => ({
        field: error.type === "field" ? error.path : undefined,
        message: error.msg,
        value: error.type === "field" ? error.value : undefined,
      })),
    });
    return;
  }
  next();
};

// Hero validations
export const validateHero = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("title")
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage("Title must be between 5 and 200 characters"),
  body("bio")
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Bio must be between 10 and 1000 characters"),
  body("yearsExperience")
    .isNumeric()
    .isFloat({ min: 0, max: 50 })
    .withMessage("Years of experience must be between 0 and 50"),
  body("cvUrl").optional().isURL().withMessage("CV URL must be a valid URL"),
  body("profileImage")
    .optional()
    .isURL()
    .withMessage("Profile image must be a valid URL"),
  handleValidationErrors,
];

// Project validations
export const validateProject = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("description")
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Description must be between 10 and 2000 characters"),
  body("duration")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Duration must be between 3 and 50 characters"),
  body("skills")
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage("Skills must be between 5 and 500 characters"),
  body("website").isURL().withMessage("Website must be a valid URL"),
  body("image").optional().isURL().withMessage("Image must be a valid URL"),
  body("order")
    .optional()
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage("Order must be a non-negative number"),
  handleValidationErrors,
];

// Experience validations
export const validateExperience = [
  body("title")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Title must be between 2 and 100 characters"),
  body("company")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Company must be between 2 and 100 characters"),
  body("website").isURL().withMessage("Website must be a valid URL"),
  body("duration")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Duration must be between 3 and 50 characters"),
  body("location")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Location must be between 2 and 100 characters"),
  body("description")
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Description must be between 10 and 2000 characters"),
  handleValidationErrors,
];

// Education validations
export const validateEducation = [
  body("degree")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Degree must be between 2 and 100 characters"),
  body("institution")
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage("Institution must be between 2 and 200 characters"),
  body("duration")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Duration must be between 3 and 50 characters"),
  body("location")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Location must be between 2 and 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),
  handleValidationErrors,
];

// Contact validations
export const validateContact = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please enter a valid email"),
  body("linkedin")
    .isURL()
    .contains("linkedin.com")
    .withMessage("Please enter a valid LinkedIn URL"),
  body("github")
    .isURL()
    .contains("github.com")
    .withMessage("Please enter a valid GitHub URL"),
  body("location")
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage("Location must be between 2 and 200 characters"),
  handleValidationErrors,
];

// Contact form validations
export const validateContactForm = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please enter a valid email"),
  // body("phone")
  //   .optional()
  //   .trim()
  //   .matches(/^\\+?[1-9]\\d{1,14}$/)
  //   .withMessage("Please enter a valid phone number"),
  body("role")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Role must be between 2 and 100 characters"),
  body("company")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Company must be between 2 and 100 characters"),
  body("message")
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Message must be between 10 and 2000 characters"),
  handleValidationErrors,
];

// Admin validations
export const validateLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please enter a valid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  handleValidationErrors,
];

// Parameter validations
export const validateObjectId = [
  param("id").isMongoId().withMessage("Invalid ID format"),
  handleValidationErrors,
];

// Query validations
export const validatePagination = [
  query("page")
    .optional()
    .isNumeric()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isNumeric()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("search")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Search term cannot exceed 100 characters"),
  handleValidationErrors,
];
