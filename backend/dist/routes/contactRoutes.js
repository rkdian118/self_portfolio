"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contactController_1 = require("../controllers/contactController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
router.get("/", contactController_1.getContact);
router.put("/", authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeAdmin)(), validationMiddleware_1.validateContact, contactController_1.updateContact);
router.post("/form", validationMiddleware_1.validateContactForm, contactController_1.submitContactForm);
router.get("/forms", authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeAdmin)(), validationMiddleware_1.validatePagination, contactController_1.getContactForms);
router.get("/forms/:id", authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeAdmin)(), validationMiddleware_1.validateObjectId, contactController_1.getContactForm);
router.put("/forms/:id/read", authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeAdmin)(), validationMiddleware_1.validateObjectId, [
    (0, express_validator_1.body)("isRead")
        .optional()
        .isBoolean()
        .withMessage("isRead must be a boolean"),
    validationMiddleware_1.handleValidationErrors,
], contactController_1.toggleContactFormRead);
router.put("/forms/:id/archive", authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeAdmin)(), validationMiddleware_1.validateObjectId, [
    (0, express_validator_1.body)("isArchived")
        .optional()
        .isBoolean()
        .withMessage("isArchived must be a boolean"),
    validationMiddleware_1.handleValidationErrors,
], contactController_1.toggleContactFormArchive);
router.delete("/forms/:id", authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeAdmin)(), validationMiddleware_1.validateObjectId, contactController_1.deleteContactForm);
exports.default = router;
//# sourceMappingURL=contactRoutes.js.map