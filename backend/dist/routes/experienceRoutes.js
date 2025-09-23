"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const experienceController_1 = require("../controllers/experienceController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
router.get("/", validationMiddleware_1.validatePagination, experienceController_1.getExperiences);
router.put("/reorder", authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeAdmin)(), [
    (0, express_validator_1.body)("experiences")
        .isArray()
        .withMessage("Experiences must be an array")
        .custom((experiences) => {
        if (!experiences.every((exp) => exp.id && typeof exp.order === "number")) {
            throw new Error("Each experience must have id and order fields");
        }
        return true;
    }),
    validationMiddleware_1.handleValidationErrors,
], experienceController_1.reorderExperiences);
router.get("/:id", validationMiddleware_1.validateObjectId, experienceController_1.getExperience);
router.post("/", authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeAdmin)(), validationMiddleware_1.validateExperience, experienceController_1.createExperience);
router.put("/:id", authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeAdmin)(), validationMiddleware_1.validateObjectId, validationMiddleware_1.validateExperience, experienceController_1.updateExperience);
router.delete("/:id", authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeAdmin)(), validationMiddleware_1.validateObjectId, experienceController_1.deleteExperience);
exports.default = router;
//# sourceMappingURL=experienceRoutes.js.map