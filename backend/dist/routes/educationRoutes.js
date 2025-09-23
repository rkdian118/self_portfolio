"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const educationController_1 = require("../controllers/educationController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
router.get("/", validationMiddleware_1.validatePagination, educationController_1.getEducation);
router.put("/reorder", authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeAdmin)(), [
    (0, express_validator_1.body)("education")
        .isArray()
        .withMessage("Education must be an array")
        .custom((education) => {
        if (!education.every((edu) => edu.id && typeof edu.order === "number")) {
            throw new Error("Each education record must have id and order fields");
        }
        return true;
    }),
    validationMiddleware_1.handleValidationErrors,
], educationController_1.reorderEducation);
router.get("/:id", validationMiddleware_1.validateObjectId, educationController_1.getSingleEducation);
router.post("/", authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeAdmin)(), validationMiddleware_1.validateEducation, educationController_1.createEducation);
router.put("/:id", authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeAdmin)(), validationMiddleware_1.validateObjectId, validationMiddleware_1.validateEducation, educationController_1.updateEducation);
router.delete("/:id", authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeAdmin)(), validationMiddleware_1.validateObjectId, educationController_1.deleteEducation);
exports.default = router;
//# sourceMappingURL=educationRoutes.js.map