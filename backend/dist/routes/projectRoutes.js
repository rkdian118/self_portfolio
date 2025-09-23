"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const projectController_1 = require("../controllers/projectController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
router.get("/", validationMiddleware_1.validatePagination, projectController_1.getProjects);
router.put("/reorder", authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeAdmin)(), [
    (0, express_validator_1.body)("projects")
        .isArray()
        .withMessage("Projects must be an array")
        .custom((projects) => {
        if (!projects.every((project) => project.id && typeof project.order === "number")) {
            throw new Error("Each project must have id and order fields");
        }
        return true;
    }),
    validationMiddleware_1.handleValidationErrors,
], projectController_1.reorderProjects);
router.get("/:id", validationMiddleware_1.validateObjectId, projectController_1.getProject);
router.post("/", authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeAdmin)(), validationMiddleware_1.validateProject, projectController_1.createProject);
router.put("/:id", authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeAdmin)(), validationMiddleware_1.validateObjectId, validationMiddleware_1.validateProject, projectController_1.updateProject);
router.delete("/:id", authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeAdmin)(), validationMiddleware_1.validateObjectId, projectController_1.deleteProject);
router.post("/:id/upload-image", authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeAdmin)(), validationMiddleware_1.validateObjectId, uploadMiddleware_1.uploadImage.single("projectImage"), uploadMiddleware_1.handleUploadError, projectController_1.uploadProjectImage);
router.delete("/:id/image", authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeAdmin)(), validationMiddleware_1.validateObjectId, projectController_1.deleteProjectImage);
exports.default = router;
//# sourceMappingURL=projectRoutes.js.map