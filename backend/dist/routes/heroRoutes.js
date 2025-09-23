"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const heroController_1 = require("../controllers/heroController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
const router = (0, express_1.Router)();
router.get("/", heroController_1.getHero);
router.put("/", authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeAdmin)(), validationMiddleware_1.validateHero, heroController_1.updateHero);
router.post("/upload-image", authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeAdmin)(), uploadMiddleware_1.uploadImage.single("profileImage"), uploadMiddleware_1.handleUploadError, heroController_1.uploadProfileImage);
router.post("/upload-cv", authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeAdmin)(), uploadMiddleware_1.uploadDocument.single("cv"), uploadMiddleware_1.handleUploadError, heroController_1.uploadCV);
router.delete("/image", authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeAdmin)(), heroController_1.deleteProfileImage);
router.delete("/cv", authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeAdmin)(), heroController_1.deleteCV);
exports.default = router;
//# sourceMappingURL=heroRoutes.js.map