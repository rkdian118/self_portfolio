import { Router } from "express";
import {
  getEducation,
  getSingleEducation,
  createEducation,
  updateEducation,
  deleteEducation,
  reorderEducation,
} from "../controllers/educationController";
import { authenticate, authorizeAdmin } from "../middleware/authMiddleware";
import {
  validateEducation,
  validateObjectId,
  validatePagination,
  handleValidationErrors,
} from "../middleware/validationMiddleware";
import { body } from "express-validator";

const router = Router();

// @route   GET /api/education
// @desc    Get all education
// @access  Public
router.get("/", validatePagination, getEducation);

// @route   PUT /api/education/reorder
// @desc    Reorder education records
// @access  Private (Admin)
router.put(
  "/reorder",
  authenticate,
  authorizeAdmin(),
  [
    body("education")
      .isArray()
      .withMessage("Education must be an array")
      .custom((education) => {
        if (
          !education.every(
            (edu: any) => edu.id && typeof edu.order === "number"
          )
        ) {
          throw new Error(
            "Each education record must have id and order fields"
          );
        }
        return true;
      }),
    handleValidationErrors,
  ],
  reorderEducation
);

// @route   GET /api/education/:id
// @desc    Get single education
// @access  Public
router.get("/:id", validateObjectId, getSingleEducation);

// @route   POST /api/education
// @desc    Create education
// @access  Private (Admin)
router.post(
  "/",
  authenticate,
  authorizeAdmin(),
  validateEducation,
  createEducation
);

// @route   PUT /api/education/:id
// @desc    Update education
// @access  Private (Admin)
router.put(
  "/:id",
  authenticate,
  authorizeAdmin(),
  validateObjectId,
  validateEducation,
  updateEducation
);

// @route   DELETE /api/education/:id
// @desc    Delete education
// @access  Private (Admin)
router.delete(
  "/:id",
  authenticate,
  authorizeAdmin(),
  validateObjectId,
  deleteEducation
);

export default router;
