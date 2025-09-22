import { Router } from "express";
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  uploadProjectImage,
  deleteProjectImage,
  reorderProjects,
} from "../controllers/projectController";
import { authenticate, authorizeAdmin } from "../middleware/authMiddleware";
import {
  validateProject,
  validateObjectId,
  validatePagination,
  handleValidationErrors,
} from "../middleware/validationMiddleware";
import { uploadImage, handleUploadError } from "../middleware/uploadMiddleware";
import { body } from "express-validator";

const router = Router();

// @route   GET /api/projects
// @desc    Get all projects
// @access  Public
router.get("/", validatePagination, getProjects);

// @route   PUT /api/projects/reorder
// @desc    Reorder projects
// @access  Private (Admin)
router.put(
  "/reorder",
  authenticate,
  authorizeAdmin(),
  [
    body("projects")
      .isArray()
      .withMessage("Projects must be an array")
      .custom((projects) => {
        if (
          !projects.every(
            (project: any) => project.id && typeof project.order === "number"
          )
        ) {
          throw new Error("Each project must have id and order fields");
        }
        return true;
      }),
    handleValidationErrors,
  ],
  reorderProjects
);

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Public
router.get("/:id", validateObjectId, getProject);

// @route   POST /api/projects
// @desc    Create project
// @access  Private (Admin)
router.post(
  "/",
  authenticate,
  authorizeAdmin(),
  validateProject,
  createProject
);

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private (Admin)
router.put(
  "/:id",
  authenticate,
  authorizeAdmin(),
  validateObjectId,
  validateProject,
  updateProject
);

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private (Admin)
router.delete(
  "/:id",
  authenticate,
  authorizeAdmin(),
  validateObjectId,
  deleteProject
);

// @route   POST /api/projects/:id/upload-image
// @desc    Upload project image
// @access  Private (Admin)
router.post(
  "/:id/upload-image",
  authenticate,
  authorizeAdmin(),
  validateObjectId,
  uploadImage.single("projectImage"),
  handleUploadError,
  uploadProjectImage
);

// @route   DELETE /api/projects/:id/image
// @desc    Delete project image
// @access  Private (Admin)
router.delete(
  "/:id/image",
  authenticate,
  authorizeAdmin(),
  validateObjectId,
  deleteProjectImage
);

export default router;
