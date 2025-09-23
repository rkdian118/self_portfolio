import { Router } from "express";
import {
  getTechnologies,
  createTechnology,
  updateTechnology,
  deleteTechnology,
} from "../controllers/technologyController";
import { authenticate, authorizeAdmin } from "../middleware/authMiddleware";

const router = Router();

// @route   GET /api/technologies
// @desc    Get all technologies
// @access  Public
router.get("/", getTechnologies);

// @route   POST /api/technologies
// @desc    Create new technology
// @access  Private (Admin)
router.post("/", authenticate, authorizeAdmin(), createTechnology);

// @route   PUT /api/technologies/:id
// @desc    Update technology
// @access  Private (Admin)
router.put("/:id", authenticate, authorizeAdmin(), updateTechnology);

// @route   DELETE /api/technologies/:id
// @desc    Delete technology
// @access  Private (Admin)
router.delete("/:id", authenticate, authorizeAdmin(), deleteTechnology);

export default router;