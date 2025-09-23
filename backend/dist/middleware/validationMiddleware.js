"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePagination = exports.validateObjectId = exports.validateLogin = exports.validateContactForm = exports.validateContact = exports.validateEducation = exports.validateExperience = exports.validateProject = exports.validateHero = exports.handleValidationErrors = void 0;
const express_validator_1 = require("express-validator");
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
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
exports.handleValidationErrors = handleValidationErrors;
exports.validateHero = [
    (0, express_validator_1.body)("name")
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Name must be between 2 and 100 characters"),
    (0, express_validator_1.body)("title")
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage("Title must be between 5 and 200 characters"),
    (0, express_validator_1.body)("bio")
        .trim()
        .isLength({ min: 10, max: 1000 })
        .withMessage("Bio must be between 10 and 1000 characters"),
    (0, express_validator_1.body)("yearsExperience")
        .isNumeric()
        .isFloat({ min: 0, max: 50 })
        .withMessage("Years of experience must be between 0 and 50"),
    (0, express_validator_1.body)("cvUrl").optional().isURL().withMessage("CV URL must be a valid URL"),
    (0, express_validator_1.body)("profileImage")
        .optional()
        .isURL()
        .withMessage("Profile image must be a valid URL"),
    exports.handleValidationErrors,
];
exports.validateProject = [
    (0, express_validator_1.body)("name")
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Name must be between 2 and 100 characters"),
    (0, express_validator_1.body)("description")
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage("Description must be between 10 and 2000 characters"),
    (0, express_validator_1.body)("duration")
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage("Duration must be between 3 and 50 characters"),
    (0, express_validator_1.body)("skills")
        .trim()
        .isLength({ min: 5, max: 500 })
        .withMessage("Skills must be between 5 and 500 characters"),
    (0, express_validator_1.body)("website").isURL().withMessage("Website must be a valid URL"),
    (0, express_validator_1.body)("image").optional().isURL().withMessage("Image must be a valid URL"),
    (0, express_validator_1.body)("order")
        .optional()
        .isNumeric()
        .isFloat({ min: 0 })
        .withMessage("Order must be a non-negative number"),
    exports.handleValidationErrors,
];
exports.validateExperience = [
    (0, express_validator_1.body)("title")
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Title must be between 2 and 100 characters"),
    (0, express_validator_1.body)("company")
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Company must be between 2 and 100 characters"),
    (0, express_validator_1.body)("website").isURL().withMessage("Website must be a valid URL"),
    (0, express_validator_1.body)("duration")
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage("Duration must be between 3 and 50 characters"),
    (0, express_validator_1.body)("location")
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Location must be between 2 and 100 characters"),
    (0, express_validator_1.body)("description")
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage("Description must be between 10 and 2000 characters"),
    exports.handleValidationErrors,
];
exports.validateEducation = [
    (0, express_validator_1.body)("degree")
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Degree must be between 2 and 100 characters"),
    (0, express_validator_1.body)("institution")
        .trim()
        .isLength({ min: 2, max: 200 })
        .withMessage("Institution must be between 2 and 200 characters"),
    (0, express_validator_1.body)("duration")
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage("Duration must be between 3 and 50 characters"),
    (0, express_validator_1.body)("location")
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Location must be between 2 and 100 characters"),
    (0, express_validator_1.body)("description")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Description cannot exceed 1000 characters"),
    exports.handleValidationErrors,
];
exports.validateContact = [
    (0, express_validator_1.body)("email")
        .isEmail()
        .normalizeEmail()
        .withMessage("Please enter a valid email"),
    (0, express_validator_1.body)("linkedin")
        .isURL()
        .contains("linkedin.com")
        .withMessage("Please enter a valid LinkedIn URL"),
    (0, express_validator_1.body)("github")
        .isURL()
        .contains("github.com")
        .withMessage("Please enter a valid GitHub URL"),
    (0, express_validator_1.body)("location")
        .trim()
        .isLength({ min: 2, max: 200 })
        .withMessage("Location must be between 2 and 200 characters"),
    exports.handleValidationErrors,
];
exports.validateContactForm = [
    (0, express_validator_1.body)("name")
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Name must be between 2 and 100 characters"),
    (0, express_validator_1.body)("email")
        .isEmail()
        .normalizeEmail()
        .withMessage("Please enter a valid email"),
    (0, express_validator_1.body)("role")
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Role must be between 2 and 100 characters"),
    (0, express_validator_1.body)("company")
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Company must be between 2 and 100 characters"),
    (0, express_validator_1.body)("message")
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage("Message must be between 10 and 2000 characters"),
    exports.handleValidationErrors,
];
exports.validateLogin = [
    (0, express_validator_1.body)("email")
        .isEmail()
        .normalizeEmail()
        .withMessage("Please enter a valid email"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long"),
    exports.handleValidationErrors,
];
exports.validateObjectId = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("Invalid ID format"),
    exports.handleValidationErrors,
];
exports.validatePagination = [
    (0, express_validator_1.query)("page")
        .optional()
        .isNumeric()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer"),
    (0, express_validator_1.query)("limit")
        .optional()
        .isNumeric()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be between 1 and 100"),
    (0, express_validator_1.query)("search")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Search term cannot exceed 100 characters"),
    exports.handleValidationErrors,
];
//# sourceMappingURL=validationMiddleware.js.map