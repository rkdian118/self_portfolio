import { Request, Response } from "express";
import { Hero } from "../models/Hero";
import { asyncHandler } from "../middleware/errorMiddleware";
import {
  deleteLocalFile,
  extractFilePath,
} from "../middleware/uploadMiddleware";

/**
 * @desc    Get hero information
 * @route   GET /api/hero
 * @access  Public
 */
export const getHero = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const hero = await Hero.findOne({ isActive: true });

    if (!hero) {
      res.status(404).json({
        success: false,
        message: "Hero information not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { hero },
    });
  }
);

/**
 * @desc    Update hero information
 * @route   PUT /api/hero
 * @access  Private (Admin)
 */
export const updateHero = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { name, title, bio, yearsExperience, cvUrl, profileImage } = req.body;

    let hero = await Hero.findOne({ isActive: true });

    if (!hero) {
      // Create new hero if doesn't exist
      hero = await Hero.create({
        name,
        title,
        bio,
        yearsExperience,
        cvUrl,
        profileImage,
      });
    } else {
      // Update existing hero
      hero.name = name || hero.name;
      hero.title = title || hero.title;
      hero.bio = bio || hero.bio;
      hero.yearsExperience = yearsExperience || hero.yearsExperience;
      hero.cvUrl = cvUrl || hero.cvUrl;
      hero.profileImage = profileImage || hero.profileImage;

      await hero.save();
    }

    res.status(200).json({
      success: true,
      message: "Hero information updated successfully",
      data: { hero },
    });
  }
);

/**
 * @desc    Upload profile image
 * @route   POST /api/hero/upload-image
 * @access  Private (Admin)
 */
export const uploadProfileImage = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "No image file provided",
      });
      return;
    }

    const hero = await Hero.findOne({ isActive: true });

    if (!hero) {
      res.status(404).json({
        success: false,
        message: "Hero information not found",
      });
      return;
    }

    // Delete old image if exists
    if (hero.profileImage) {
      try {
        const filePath = extractFilePath(hero.profileImage);
        await deleteLocalFile(filePath);
      } catch (error) {
        console.error("Error deleting old profile image:", error);
      }
    }

    // Create local file URL
    const imageUrl = `/api/uploads/images/${req.file.filename}`;
    hero.profileImage = imageUrl;
    await hero.save();

    res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully",
      data: {
        profileImage: imageUrl,
        hero,
      },
    });
  }
);

/**
 * @desc    Upload CV document
 * @route   POST /api/hero/upload-cv
 * @access  Private (Admin)
 */
export const uploadCV = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "No CV file provided",
      });
      return;
    }

    const hero = await Hero.findOne({ isActive: true });

    if (!hero) {
      res.status(404).json({
        success: false,
        message: "Hero information not found",
      });
      return;
    }

    // Delete old CV if exists
    if (hero.cvUrl) {
      try {
        const filePath = extractFilePath(hero.cvUrl);
        await deleteLocalFile(filePath);
      } catch (error) {
        console.error("Error deleting old CV:", error);
      }
    }

    // Create local file URL
    const cvUrl = `/api/uploads/documents/${req.file.filename}`;
    hero.cvUrl = cvUrl;
    await hero.save();

    res.status(200).json({
      success: true,
      message: "CV uploaded successfully",
      data: {
        cvUrl: cvUrl,
        hero,
      },
    });
  }
);

/**
 * @desc    Delete profile image
 * @route   DELETE /api/hero/image
 * @access  Private (Admin)
 */
export const deleteProfileImage = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const hero = await Hero.findOne({ isActive: true });

    if (!hero || !hero.profileImage) {
      res.status(404).json({
        success: false,
        message: "Profile image not found",
      });
      return;
    }

    try {
      const filePath = extractFilePath(hero.profileImage);
      await deleteLocalFile(filePath);

      hero.profileImage = undefined;
      await hero.save();

      res.status(200).json({
        success: true,
        message: "Profile image deleted successfully",
        data: { hero },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error deleting profile image",
      });
    }
  }
);

/**
 * @desc    Delete CV
 * @route   DELETE /api/hero/cv
 * @access  Private (Admin)
 */
export const deleteCV = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const hero = await Hero.findOne({ isActive: true });

    if (!hero || !hero.cvUrl) {
      res.status(404).json({
        success: false,
        message: "CV not found",
      });
      return;
    }

    try {
      const filePath = extractFilePath(hero.cvUrl);
      await deleteLocalFile(filePath);

      hero.cvUrl = undefined;
      await hero.save();

      res.status(200).json({
        success: true,
        message: "CV deleted successfully",
        data: { hero },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error deleting CV",
      });
    }
  }
);

/**
 * @desc    Download CV
 * @route   GET /api/hero/download-cv
 * @access  Public
 */
export const downloadCV = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const hero = await Hero.findOne({ isActive: true });

    if (!hero || !hero.cvUrl) {
      res.status(404).json({
        success: false,
        message: "CV not found",
      });
      return;
    }

    // Set headers for PDF download with fixed filename
    res.setHeader('Content-Disposition', 'attachment; filename="Dhanraj-CV.pdf"');
    res.redirect(hero.cvUrl);
  }
);
