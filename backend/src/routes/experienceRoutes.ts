import { Router } from "express";
import {
  getExperiences,
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
  reorderExperiences,
} from "../controllers/experienceController";
import { authenticate, authorizeAdmin } from "../middleware/authMiddleware";
import {
  validateExperience,
  validateObjectId,
  validatePagination,
  handleValidationErrors,
} from "../middleware/validationMiddleware";
import { body } from "express-validator";

const router = Router();

// @route   GET /api/experience
// @desc    Get all experiences
// @access  Public
router.get("/", validatePagination, getExperiences);

// @route   PUT /api/experience/reorder
// @desc    Reorder experiences
// @access  Private (Admin)
router.put(
  "/reorder",
  authenticate,
  authorizeAdmin(),
  [
    body("experiences")
      .isArray()
      .withMessage("Experiences must be an array")
      .custom((experiences) => {
        if (
          !experiences.every(
            (exp: any) => exp.id && typeof exp.order === "number"
          )
        ) {
          throw new Error("Each experience must have id and order fields");
        }
        return true;
      }),
    handleValidationErrors,
  ],
  reorderExperiences
);

// @route   GET /api/experience/:id
// @desc    Get single experience
// @access  Public
router.get("/:id", validateObjectId, getExperience);

// @route   POST /api/experience
// @desc    Create experience
// @access  Private (Admin)
router.post(
  "/",
  authenticate,
  authorizeAdmin(),
  validateExperience,
  createExperience
);

// @route   PUT /api/experience/:id
// @desc    Update experience
// @access  Private (Admin)
router.put(
  "/:id",
  authenticate,
  authorizeAdmin(),
  validateObjectId,
  validateExperience,
  updateExperience
);

// @route   DELETE /api/experience/:id
// @desc    Delete experience
// @access  Private (Admin)
router.delete(
  "/:id",
  authenticate,
  authorizeAdmin(),
  validateObjectId,
  deleteExperience
);

export default router;
