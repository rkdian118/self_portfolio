"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const technologyController_1 = require("../controllers/technologyController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get("/", technologyController_1.getTechnologies);
router.post("/", authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeAdmin)(), technologyController_1.createTechnology);
router.put("/:id", authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeAdmin)(), technologyController_1.updateTechnology);
router.delete("/:id", authMiddleware_1.authenticate, (0, authMiddleware_1.authorizeAdmin)(), technologyController_1.deleteTechnology);
exports.default = router;
//# sourceMappingURL=technologyRoutes.js.map