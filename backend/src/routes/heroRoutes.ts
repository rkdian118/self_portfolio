import { Router } from "express";
import {
  getHero,
  updateHero,
  uploadProfileImage,
  uploadCV,
  deleteProfileImage,
  deleteCV,
} from "../controllers/heroController";
import { Hero } from "../models/Hero";
import { authenticate, authorizeAdmin } from "../middleware/authMiddleware";
import {
  validateHero,
  validateObjectId,
} from "../middleware/validationMiddleware";
import {
  uploadImage,
  uploadDocument,
  handleUploadError,
} from "../middleware/uploadMiddleware";

const router = Router();

// @route   GET /api/hero
// @desc    Get hero information
// @access  Public
router.get("/", getHero);

// @route   PUT /api/hero
// @desc    Update hero information
// @access  Private (Admin)
router.put("/", authenticate, authorizeAdmin(), validateHero, updateHero);

// @route   POST /api/hero/upload-image
// @desc    Upload profile image
// @access  Private (Admin)
router.post(
  "/upload-image",
  authenticate,
  authorizeAdmin(),
  uploadImage.single("profileImage"),
  handleUploadError,
  uploadProfileImage
);

// @route   POST /api/hero/upload-cv
// @desc    Upload CV document
// @access  Private (Admin)
router.post(
  "/upload-cv",
  authenticate,
  authorizeAdmin(),
  uploadDocument.single("cv"),
  handleUploadError,
  uploadCV
);

// @route   DELETE /api/hero/image
// @desc    Delete profile image
// @access  Private (Admin)
router.delete("/image", authenticate, authorizeAdmin(), deleteProfileImage);

// @route   DELETE /api/hero/cv
// @desc    Delete CV
// @access  Private (Admin)
router.delete("/cv", authenticate, authorizeAdmin(), deleteCV);

// @route   GET /api/hero/download-cv
// @desc    Download CV
// @access  Public
router.get("/download-cv", async (req, res) => {
  try {
    const hero = await Hero.findOne({ isActive: true });
    if (!hero || !hero.cvUrl) {
      return res.status(404).json({ success: false, message: "CV not found" });
    }
    res.redirect(hero.cvUrl);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error downloading CV" });
  }
});

export default router;
