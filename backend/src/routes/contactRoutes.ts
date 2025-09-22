import { Router } from "express";
import {
  getContact,
  updateContact,
  submitContactForm,
  getContactForms,
  getContactForm,
  toggleContactFormRead,
  toggleContactFormArchive,
  deleteContactForm,
} from "../controllers/contactController";
import { authenticate, authorizeAdmin } from "../middleware/authMiddleware";
import {
  validateContact,
  validateContactForm,
  validateObjectId,
  validatePagination,
  handleValidationErrors,
} from "../middleware/validationMiddleware";
import { body } from "express-validator";

const router = Router();

// @route   GET /api/contact
// @desc    Get contact information
// @access  Public
router.get("/", getContact);

// @route   PUT /api/contact
// @desc    Update contact information
// @access  Private (Admin)
router.put("/", authenticate, authorizeAdmin(), validateContact, updateContact);

// @route   POST /api/contact/form
// @desc    Submit contact form
// @access  Public
router.post("/form", validateContactForm, submitContactForm);

// @route   GET /api/contact/forms
// @desc    Get all contact form submissions
// @access  Private (Admin)
router.get(
  "/forms",
  authenticate,
  authorizeAdmin(),
  validatePagination,
  getContactForms
);

// @route   GET /api/contact/forms/:id
// @desc    Get single contact form submission
// @access  Private (Admin)
router.get(
  "/forms/:id",
  authenticate,
  authorizeAdmin(),
  validateObjectId,
  getContactForm
);

// @route   PUT /api/contact/forms/:id/read
// @desc    Mark contact form as read/unread
// @access  Private (Admin)
router.put(
  "/forms/:id/read",
  authenticate,
  authorizeAdmin(),
  validateObjectId,
  [
    body("isRead")
      .optional()
      .isBoolean()
      .withMessage("isRead must be a boolean"),
    handleValidationErrors,
  ],
  toggleContactFormRead
);

// @route   PUT /api/contact/forms/:id/archive
// @desc    Archive/unarchive contact form
// @access  Private (Admin)
router.put(
  "/forms/:id/archive",
  authenticate,
  authorizeAdmin(),
  validateObjectId,
  [
    body("isArchived")
      .optional()
      .isBoolean()
      .withMessage("isArchived must be a boolean"),
    handleValidationErrors,
  ],
  toggleContactFormArchive
);

// @route   DELETE /api/contact/forms/:id
// @desc    Delete contact form
// @access  Private (Admin)
router.delete(
  "/forms/:id",
  authenticate,
  authorizeAdmin(),
  validateObjectId,
  deleteContactForm
);

export default router;
